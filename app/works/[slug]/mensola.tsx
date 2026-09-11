"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Observer } from "@/lib/gsap";
import {
  CORRENTE_H,
  DURATA_STEP,
  EASE_STEP,
  LETTURA,
  SENSIBILITA_TOCCO,
  SOGLIA_STEP,
} from "@/lib/mensola";
import { compattoAttivo, motoRidotto } from "@/lib/movimento";
import styles from "./page.module.css";

// Il motore della mensola. Sostituisce lo scorrimento nativo della striscia —
// che era un ponteggio dichiarato — con un anello continuo, e sposta la lastra
// corrente sotto la linea di lettura A PASSI, uno alla volta.
//
// Il markup pesante resta server-renderizzato e arriva come `children`: dodici
// `<Image>` non hanno ragione di finire nel bundle client. Stessa scelta del
// nastro della timeline.
//
// ── Perché a passi, e non più a scorrimento continuo ────────────────────────
// Tre problemi della versione continua erano lo stesso problema: senza un
// bersaglio esatto per ogni fotografia, non c'era un istante in cui la
// corrente fosse ESATTAMENTE allineata al testo — solo "abbastanza vicina".
// A passi, ogni arrivo è un calcolo, non il punto in cui un trascinamento si è
// fermato: si scorre una fotografia alla volta, e ognuna, arrivata, ha il
// proprio bordo sinistro esattamente sotto `LETTURA` — la stessa quota di
// `left` in `.scheda` (page.module.css), che è dove comincia il testo.
//
// ── Il wheel bloccato sopra le foto ──────────────────────────────────────────
// Ogni fotografia è un `<Link>`, e GSAP Observer con `ignore: "a, button"`
// scartava OGNI evento — rotella inclusa — il cui target fosse dentro un
// `<a>`: scrollare con il cursore sopra una foto non muoveva niente. La
// rotella non attiva mai una navigazione, quindi non c'è ragione di
// ignorarla lì; il trascinamento sì, o un tap-per-navigare rischierebbe di
// partire come drag-per-scorrere. Due Observer sullo stesso target invece di
// uno: uno per la rotella, senza `ignore`; uno per il tocco, con `ignore`
// mantenuto (stesso principio in app/timeline/motore.tsx).
//
// ── L'anello non usa cloni ──────────────────────────────────────────────────
// Ogni lastra viene resa a `wrap(-larghezza, W - larghezza, naturale -
// scorrimento)`, dove W è la lunghezza dell'intera sequenza più una fuga: esce
// tutta a sinistra e rientra tutta a destra, senza salti. A scorrimento zero
// la formula restituisce la posizione naturale, quindi senza JS la striscia è
// esattamente quella impaginata dal foglio.
//
// ── La corrente cambia anche larghezza, adesso ───────────────────────────────
// Prima restava quella del registro apposta, per non dover rimisurare
// l'anello a ogni cambio: con lo scorrimento continuo, ricalcolare la
// geometria ad ogni frame sarebbe stato un lavoro rifatto in continuazione.
// A passi discreti il problema cambia natura — un bersaglio si calcola una
// volta per passo, non ad ogni frame — quindi la larghezza può finalmente
// seguire l'altezza (page.module.css) senza quel costo. La geometria "vera"
// (quella che il browser ha già ricalcolato riflowando la fila) si legge in
// diretta con `offsetWidth`, che ignora i `transform` che questo motore
// scrive: non serve un secondo sistema di misura, il layout la sa già.
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

/** Il ramo di `bersaglio (mod periodo)` più vicino a `riferimento`: un passo
 *  deve spostare la striscia di una fotografia, non farle fare un giro
 *  intero perché il bersaglio "vero" cade nel ramo sbagliato del modulo. */
function piuVicino(bersaglio: number, riferimento: number, periodo: number) {
  if (periodo <= 0) return bersaglio;
  let b = bersaglio;
  while (b - riferimento > periodo / 2) b -= periodo;
  while (riferimento - b > periodo / 2) b += periodo;
  return b;
}

type Lastra = {
  el: HTMLElement;
  /** Posizione e larghezza NATURALI — cioè senza `data-corrente` — misurate
   *  una volta. La geometria vera, quando una lastra è corrente o l'ha appena
   *  smesso di essere, si legge in diretta da `offsetWidth`: vedi `tick()`. */
  xNaturale: number;
  wNaturale: number;
  /** Il rapporto d'aspetto, letto dalla `--ar` che il Server Component scrive
   *  già inline per il CSS. Serve al bersaglio del passo (vedi `passo()`) per
   *  sapere quanto la corrente sarà larga a transizione finita, SENZA
   *  doverlo leggere dal DOM mentre sta ancora crescendo — cosa che
   *  restituirebbe la larghezza di partenza, non quella d'arrivo. */
  ar: number;
  /** L'ultimo spostamento scritto, per non riscrivere ciò che non cambia. */
  dx: number;
};

export function Mensola({ children }: { children: ReactNode }) {
  const strisciaRef = useRef<HTMLDivElement>(null);
  const filaRef = useRef<HTMLDivElement>(null);

  const lastreRef = useRef<Lastra[]>([]);
  const lunghezzaNaturaleRef = useRef(0);
  const letturaRef = useRef(0);
  const correnteHPxRef = useRef(0);

  /** La corrente e quella appena lasciata: la seconda serve solo finché la
   *  sua transizione CSS non si è posata, ma non fa male tenerla oltre —
   *  finita la transizione il suo `offsetWidth` torna a coincidere con
   *  `wNaturale` e il suo contributo diventa zero da solo. */
  const correnteRef = useRef(0);
  const precedenteRef = useRef(-1);

  /** Il bersaglio del passo corrente si scrive qui, e GSAP lo anima:
   *  un oggetto e non una primitiva, perché è quello che GSAP sa animare. */
  const scorrimentoRef = useRef({ current: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const accumuloRef = useRef(0);

  useGSAP(
    () => {
      const striscia = strisciaRef.current;
      const fila = filaRef.current;
      if (!striscia || !fila) return;
      // Sotto la soglia compatta la pagina mostra una pila verticale delle
      // foto (vedi il blocco `.compatta` in page.tsx): l'Observer sotto
      // resterebbe comunque agganciato a `.pagina` — vedi SOGLIA_COMPATTA in
      // lib/movimento.ts.
      if (compattoAttivo()) return;

      const ridotto = motoRidotto();

      const lastre: Lastra[] = gsap.utils
        .toArray<HTMLElement>(`.${styles.lastra}`, fila)
        .map((el) => ({
          el,
          xNaturale: 0,
          wNaturale: 0,
          ar: parseFloat(el.style.getPropertyValue("--ar")) || 1,
          dx: 0,
        }));
      lastreRef.current = lastre;
      if (lastre.length === 0) return;

      correnteRef.current = lastre.findIndex((l) => l.el.dataset.corrente !== undefined);
      if (correnteRef.current < 0) correnteRef.current = 0;
      precedenteRef.current = -1;

      /** Le misure si prendono a trasformazioni azzerate e senza
       *  `data-corrente`, o la seconda lettura vedrebbe la prima e la
       *  corrente misurerebbe se stessa già allargata. La transizione CSS
       *  si spegne per l'istante della misura, altrimenti togliere
       *  `data-corrente` la animerebbe invece di restituire subito la
       *  taglia naturale. */
      const misura = () => {
        gsap.set(
          lastre.map((l) => l.el),
          { x: 0 },
        );

        const correnteEl = lastre[correnteRef.current]?.el;
        if (correnteEl) {
          correnteEl.style.transition = "none";
          delete correnteEl.dataset.corrente;
          void correnteEl.offsetWidth;
        }

        const rFila = fila.getBoundingClientRect();
        for (const l of lastre) {
          const r = l.el.getBoundingClientRect();
          l.xNaturale = r.left - rFila.left;
          l.wNaturale = r.width;
          l.dx = 0;
        }

        if (correnteEl) {
          correnteEl.dataset.corrente = "";
          void correnteEl.offsetWidth;
          correnteEl.style.transition = "";
        }

        const fuga = parseFloat(getComputedStyle(fila).columnGap) || 0;
        const ultima = lastre[lastre.length - 1];
        // La lunghezza dell'anello è la sequenza più UNA fuga, quella che
        // richiude il cerchio fra l'ultima lastra e la prima.
        lunghezzaNaturaleRef.current = ultima.xNaturale + ultima.wNaturale + fuga;

        // La linea di lettura, in coordinate della fila e alla scala vera del
        // sito — la stessa disciplina con cui la timeline misura il nonio
        // invece di assumerlo.
        const scala = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
        letturaRef.current = LETTURA * scala - rFila.left;
        correnteHPxRef.current = CORRENTE_H * scala;
      };

      misura();

      /** Un anello ha senso solo se la sequenza è più lunga di ciò che si
       *  vede: sotto, girerebbe mostrando la stessa fotografia due volte nella
       *  stessa schermata. Venti opere su ventuno hanno uno scatto solo — la
       *  densità minima del §4.1 — e per loro il motore non si accende.
       *
       *  Resta un paio di opere tutte verticali (Le Rêve Lever, Don Giovanni) la
       *  cui striscia non arriva a riempire il binario: la fila resta ferma, ma
       *  la corrente va comunque portata sotto la linea di lettura. `.fila` ha
       *  `padding-left: 0` proprio perché di norma ce la porta il motore, e
       *  senza motore resterebbe incollata al bordo, staccata dal testo che la
       *  racconta. Una traslazione statica gliela porta, rifatta a ogni resize
       *  come farebbe il motore vero. */
      if (lastre.length < 2 || lunghezzaNaturaleRef.current <= striscia.clientWidth) {
        if (lastre.length < 2) return;
        const allineaFerma = () => {
          const c = lastreRef.current[correnteRef.current];
          gsap.set(fila, { x: letturaRef.current - c.xNaturale });
        };
        allineaFerma();
        const suResize = () => {
          gsap.set(fila, { x: 0 });
          misura();
          allineaFerma();
        };
        window.addEventListener("resize", suResize);
        return () => window.removeEventListener("resize", suResize);
      }

      window.addEventListener("resize", misura);

      /** Un passo: la corrente avanza o retrocede di una posizione, e lo
       *  scorrimento anima verso il bersaglio esatto che la allinea a
       *  `LETTURA`. Bloccato mentre un passo è già in corso — un gesto alla
       *  volta, mai due sovrapposti. */
      const passo = (verso: 1 | -1) => {
        if (ridotto || tweenRef.current?.isActive()) return;
        const n = lastreRef.current.length;
        const vecchia = correnteRef.current;
        const nuova = modulo(vecchia + verso, n);

        delete lastreRef.current[vecchia].el.dataset.corrente;
        lastreRef.current[nuova].el.dataset.corrente = "";
        precedenteRef.current = vecchia;
        correnteRef.current = nuova;

        // Il periodo per scegliere il ramo giusto del modulo NON è la
        // lunghezza naturale: a transizione finita `nuova` sarà più larga (o
        // più stretta) della sua taglia naturale, e `tick()` userà quella
        // lunghezza vera per il proprio modulo. Usarne una diversa qui
        // sposterebbe il bersaglio di quel delta ogni volta che il passo
        // richiude l'anello — impercettibile quando non si richiude,
        // vistoso quando si richiude (l'errore è il delta di un'intera
        // fotografia allargata).
        const l = lastreRef.current[nuova];
        const wFinale = correnteHPxRef.current * l.ar;
        const periodo = lunghezzaNaturaleRef.current + (wFinale - l.wNaturale);

        const bersaglioGrezzo = l.xNaturale - letturaRef.current;
        const bersaglio = piuVicino(bersaglioGrezzo, scorrimentoRef.current.current, periodo);

        tweenRef.current?.kill();
        tweenRef.current = gsap.to(scorrimentoRef.current, {
          current: bersaglio,
          duration: DURATA_STEP,
          ease: EASE_STEP,
        });
      };

      /** Il grezzo si accumula finché non supera la soglia di un passo: un
       *  gesto piccolo — un trackpad che manda molti eventi minuscoli — non
       *  deve far scattare niente. */
      const prova = () => {
        if (Math.abs(accumuloRef.current) < SOGLIA_STEP) return;
        const verso = accumuloRef.current > 0 ? 1 : -1;
        accumuloRef.current = 0;
        passo(verso);
      };

      const osservatoreRotella = ridotto
        ? null
        : Observer.create({
            target: striscia.closest<HTMLElement>(`.${styles.pagina}`) ?? striscia,
            type: "wheel",
            wheelSpeed: 1,
            onWheel: (self) => {
              accumuloRef.current += -(self.deltaX || self.deltaY);
              prova();
            },
          });

      const osservatoreTocco = ridotto
        ? null
        : Observer.create({
            target: striscia.closest<HTMLElement>(`.${styles.pagina}`) ?? striscia,
            type: "touch",
            ignore: "a, button",
            onChange: (self) => {
              accumuloRef.current += -self.deltaX * SENSIBILITA_TOCCO;
              prova();
            },
          });

      /** Ogni frame: legge in diretta l'ingombro di corrente (e dell'ultima
       *  precedente, finché la sua transizione non si è posata da sola) e
       *  scrive la posizione di ogni lastra di conseguenza. Nessun momento
       *  residuo, nessuno smorzamento per frame: la sola cosa che si muove
       *  nel tempo è il tween di `scorrimentoRef`, che GSAP anima da solo. */
      const tick = () => {
        const corrente = correnteRef.current;
        const precedente = precedenteRef.current;

        const elCorrente = lastreRef.current[corrente]?.el;
        const wCorrenteNaturale = lastreRef.current[corrente]?.wNaturale ?? 0;
        const deltaC = elCorrente ? elCorrente.offsetWidth - wCorrenteNaturale : 0;

        const elPrecedente = precedente >= 0 ? lastreRef.current[precedente]?.el : undefined;
        const wPrecedenteNaturale = precedente >= 0 ? lastreRef.current[precedente]?.wNaturale ?? 0 : 0;
        const deltaP = elPrecedente ? elPrecedente.offsetWidth - wPrecedenteNaturale : 0;

        const W = lunghezzaNaturaleRef.current + deltaC + deltaP;
        if (W <= 0) return;

        const s = scorrimentoRef.current.current;

        for (let i = 0; i < lastreRef.current.length; i++) {
          const l = lastreRef.current[i];
          let x = l.xNaturale;
          if (i > corrente) x += deltaC;
          if (precedente >= 0 && i > precedente) x += deltaP;
          let w = l.wNaturale;
          if (i === corrente && elCorrente) w = elCorrente.offsetWidth;
          if (i === precedente && elPrecedente) w = elPrecedente.offsetWidth;

          // L'anello: la posizione "vera" (naturale più le compensazioni
          // dell'ingombro in corso) meno lo scorrimento, riportata
          // nell'intervallo in cui la lastra esce tutta a sinistra e rientra
          // tutta a destra.
          const reso = -w + modulo(x - s + w, W);
          const dx = reso - x;
          if (Math.abs(dx - l.dx) > 0.5) {
            l.dx = dx;
            l.el.style.transform = `translateX(${dx.toFixed(1)}px)`;
          }
        }
      };

      // Calcolato e non sperato, la stessa disciplina di `--dx-iniziale` sulla
      // timeline. `useGSAP` gira prima del primo disegno, quindi la striscia
      // non si vede mai nella posizione grezza per poi saltare.
      scorrimentoRef.current.current = lastre[correnteRef.current].xNaturale - letturaRef.current;
      tick();
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("resize", misura);
        tweenRef.current?.kill();
        osservatoreRotella?.kill();
        osservatoreTocco?.kill();
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
