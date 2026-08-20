"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Observer } from "@/lib/gsap";
import {
  LETTURA,
  MOMENTO_DECADIMENTO,
  MOMENTO_SOGLIA,
  SENSIBILITA,
  SENSIBILITA_TOCCO,
  SMORZAMENTO,
} from "@/lib/mensola";
import { motoRidotto } from "@/lib/movimento";
import styles from "./page.module.css";

// Il motore della mensola. Sostituisce lo scorrimento nativo della striscia —
// che era un ponteggio dichiarato — con un anello continuo, e sposta la lastra
// corrente sotto la linea di lettura mentre si scorre.
//
// Il markup pesante resta server-renderizzato e arriva come `children`: dodici
// `<Image>` non hanno ragione di finire nel bundle client. Stessa scelta del
// nastro della timeline.
//
// ── L'anello non usa cloni ──────────────────────────────────────────────────
// Il commento che stava qui prima diceva che i due cloni in testa erano «la
// stessa struttura che serve al loop vero». Non lo sono: un anello si fa
// avvolgendo le POSIZIONI, non duplicando gli elementi, e dei cloni verrebbero
// contati come lastre vere producendo doppioni nella sequenza. Sono spariti.
//
// Ogni lastra viene resa a `wrap(-larghezza, W - larghezza, naturale -
// scorrimento)`, dove W è la lunghezza dell'intera sequenza più una fuga: esce
// tutta a sinistra e rientra tutta a destra, senza salti. A scorrimento zero
// la formula restituisce la posizione naturale, quindi senza JS la striscia è
// esattamente quella impaginata dal foglio.
//
// ── Perché la corrente cambia altezza e non larghezza ───────────────────────
// Nell'artboard la corrente era anche più larga, perché la larghezza discende
// dall'altezza per il formato. Ma una lastra che si allarga spinge le vicine, e
// con la striscia che scorre le posizioni cambierebbero sotto i piedi
// dell'anello ad ogni cambio di corrente: l'aritmetica andrebbe rifatta ogni
// volta, e la riga si vedrebbe sussultare.
//
// Così invece la larghezza resta quella del registro e cresce solo l'altezza.
// Il ritmo orizzontale non si sposta mai, l'anello si misura una volta sola, e
// la corrente rompe comunque il registro — verso l'alto e, con la sporgenza,
// verso il basso. Il taglio della foto cambia, ed è una decisione di
// presentazione che questa pagina già rivendica: «il ritaglio vive nella
// cornice, non su disco».
//
// ── Osservatore e non trascinamento ─────────────────────────────────────────
// `Observer` con "wheel,touch", come la timeline. La rotella comincia a
// funzionare (prima muoveva solo il trackpad) e il dito resta l'unico ingresso
// che esiste su un telefono. Il trascinamento col mouse resta fuori: sulla
// timeline era stato spento perché non tarato a sé, e aprirlo qui
// significherebbe due modelli d'ingresso diversi nello stesso sito.

/** Sempre positivo, che `%` in JavaScript non è. */
function modulo(v: number, m: number) {
  return ((v % m) + m) % m;
}

/** Il fattore di smorzamento indipendente dal frame rate. */
function smorza(fattore: number, dt: number) {
  return 1 - Math.pow(1 - fattore, dt * 60);
}

type Lastra = {
  el: HTMLElement;
  /** Posizione naturale e larghezza, misurate una volta. */
  x: number;
  w: number;
  /** L'ultimo spostamento scritto, per non riscrivere ciò che non cambia. */
  dx: number;
};

export function Mensola({ children }: { children: ReactNode }) {
  const strisciaRef = useRef<HTMLDivElement>(null);
  const filaRef = useRef<HTMLDivElement>(null);

  const lastreRef = useRef<Lastra[]>([]);
  const lunghezzaRef = useRef(0);
  const letturaRef = useRef(0);
  const correnteRef = useRef(-1);

  const riposoRef = useRef(0);
  const scorrimentoRef = useRef(0);
  const obiettivoRef = useRef(0);
  const velocitaRef = useRef(0);
  const sensibilitaMomentoRef = useRef(SENSIBILITA);

  useGSAP(
    () => {
      const striscia = strisciaRef.current;
      const fila = filaRef.current;
      if (!striscia || !fila) return;

      const ridotto = motoRidotto();

      const lastre: Lastra[] = gsap.utils
        .toArray<HTMLElement>(`.${styles.lastra}`, fila)
        .map((el) => ({ el, x: 0, w: 0, dx: 0 }));
      lastreRef.current = lastre;
      if (lastre.length === 0) return;

      /** Le misure si prendono a trasformazioni azzerate, o la seconda lettura
       *  vedrebbe la prima. La fuga si legge dal foglio invece di ricopiarla:
       *  chiude l'anello, cioè lo spazio fra l'ultima lastra e la prima quando
       *  la sequenza si richiude. */
      const misura = () => {
        gsap.set(
          lastre.map((l) => l.el),
          { x: 0 },
        );
        const rFila = fila.getBoundingClientRect();
        for (const l of lastre) {
          const r = l.el.getBoundingClientRect();
          l.x = r.left - rFila.left;
          l.w = r.width;
          l.dx = 0;
        }
        const fuga = parseFloat(getComputedStyle(fila).columnGap) || 0;
        const ultima = lastre[lastre.length - 1];
        // La lunghezza dell'anello è la sequenza più UNA fuga, quella che
        // richiude il cerchio fra l'ultima lastra e la prima. Misurata dalla
        // prima lastra, che sta a zero: il rientro iniziale non è più nel
        // foglio ma nello scorrimento, o farebbe parte dell'anello e
        // girerebbe con lui come un vuoto di 264px.
        lunghezzaRef.current = ultima.x + ultima.w + fuga;

        // La linea di lettura, in coordinate della fila. `LETTURA` è in px
        // sulla viewport di riferimento, quindi va riportata alla scala vera
        // del sito prima di sottrarre dove la fila comincia — la stessa
        // disciplina con cui la timeline misura il nonio invece di assumerlo.
        const scala = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
        letturaRef.current = LETTURA * scala - rFila.left;

        // La posizione a riposo: la prima lastra sotto la linea di lettura.
        // Uno scorrimento negativo, perché la sequenza comincia a zero e deve
        // spostarsi a destra. Scritto qui e non nel foglio: il `padding-left`
        // che lo faceva prima apparteneva all'anello e ci girava dentro.
        riposoRef.current = -letturaRef.current;
      };

      misura();

      /** Un anello ha senso solo se la sequenza è più lunga di ciò che si
       *  vede: sotto, girerebbe mostrando la stessa fotografia due volte nella
       *  stessa schermata. Venti opere su ventuno hanno uno scatto solo — la
       *  densità minima del §4.1 — e per loro questo motore non deve nemmeno
       *  accendersi. */
      if (lastre.length < 2 || lunghezzaRef.current <= striscia.clientWidth) return;

      window.addEventListener("resize", misura);

      /** Sposta l'obiettivo. L'anello non ha capi, quindi niente elastico e
       *  niente resistenza: qui si gira in tondo, e la ragione per cui la
       *  timeline NON lo fa è che una cronologia ha un inizio e una fine,
       *  mentre le fotografie di un'opera no. */
      const spingi = (delta: number) => {
        obiettivoRef.current += delta;
      };

      const observer = ridotto
        ? null
        : Observer.create({
            target: striscia.closest<HTMLElement>(`.${styles.pagina}`) ?? striscia,
            type: "wheel,touch",
            ignore: "a, button",
            wheelSpeed: 1,
            onChange: (self) => {
              const tocco = self.event.type.startsWith("touch");
              const sensibilita = tocco ? SENSIBILITA_TOCCO : SENSIBILITA;
              const delta = -(self.deltaX || self.deltaY) * sensibilita;
              spingi(delta);
              velocitaRef.current = delta * 60;
              sensibilitaMomentoRef.current = sensibilita;
            },
            onStop: () => {
              velocitaRef.current = 0;
            },
          });

      const tick = () => {
        const dt = gsap.ticker.deltaRatio(60) / 60;

        if (Math.abs(velocitaRef.current) > MOMENTO_SOGLIA) {
          spingi(velocitaRef.current * dt);
          velocitaRef.current *= Math.pow(MOMENTO_DECADIMENTO, dt);
        } else {
          velocitaRef.current = 0;
        }

        scorrimentoRef.current +=
          (obiettivoRef.current - scorrimentoRef.current) * (ridotto ? 1 : smorza(SMORZAMENTO, dt));

        const W = lunghezzaRef.current;
        if (W <= 0) return;

        const s = scorrimentoRef.current;
        const lettura = letturaRef.current;
        let vicina = -1;
        let distanza = Infinity;

        for (let i = 0; i < lastreRef.current.length; i++) {
          const l = lastreRef.current[i];
          // L'anello: la posizione naturale meno lo scorrimento, riportata
          // nell'intervallo in cui la lastra esce tutta a sinistra e rientra
          // tutta a destra.
          const reso = -l.w + modulo(l.x - s + l.w, W);
          const dx = reso - l.x;
          if (Math.abs(dx - l.dx) > 0.5) {
            l.dx = dx;
            l.el.style.transform = `translateX(${dx.toFixed(1)}px)`;
          }

          // La corrente è la lastra CHE CONTIENE la linea di lettura, non
          // quella col centro più vicino. È la semantica dell'artboard, dove
          // la corrente comincia esattamente a `LETTURA`: col centro, a riposo
          // la linea cadrebbe sul bordo di una lastra e a metà scorrimento nel
          // mezzo di un'altra, cioè due regole diverse per la stessa cosa. La
          // distanza serve solo come ripiego, per le fughe fra una e l'altra.
          const dentro = lettura >= reso && lettura < reso + l.w;
          const d = dentro ? 0 : Math.min(Math.abs(lettura - reso), Math.abs(lettura - reso - l.w));
          if (d < distanza) {
            distanza = d;
            vicina = i;
          }
        }

        if (vicina !== correnteRef.current && vicina >= 0) {
          const prima = lastreRef.current[correnteRef.current];
          if (prima) delete prima.el.dataset.corrente;
          lastreRef.current[vicina].el.dataset.corrente = "";
          correnteRef.current = vicina;
        }
      };

      // Calcolato e non sperato, la stessa disciplina di `--dx-iniziale` sulla
      // timeline. `useGSAP` gira prima del primo disegno, quindi la striscia
      // non si vede mai nella posizione grezza per poi saltare.
      obiettivoRef.current = riposoRef.current;
      scorrimentoRef.current = riposoRef.current;
      tick();
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("resize", misura);
        observer?.kill();
        gsap.ticker.remove(tick);
      };
    },
    { scope: strisciaRef },
  );

  return (
    <div ref={strisciaRef} className={styles.striscia}>
      <div ref={filaRef} className={styles.fila}>
        {children}
      </div>
    </div>
  );
}
