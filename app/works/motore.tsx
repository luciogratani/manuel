"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Observer } from "@/lib/gsap";
import {
  ELASTICO_OPERE,
  MOMENTO_DECADIMENTO,
  MOMENTO_SOGLIA,
  PASSO,
  RILASSAMENTO_BORDO,
  SENSIBILITA_TOCCO,
  SMORZAMENTO,
} from "@/lib/indice";
import { motoRidotto } from "@/lib/movimento";
import { ContestoIndice } from "./contesto";
import styles from "./page.module.css";

// Il motore dell'indice. Fa avanzare la selezione lungo la sequenza mentre si
// scorre, e sposta la griglia di quel poco che può per tenerla visibile.
//
// Il markup pesante resta server-renderizzato e arriva come `children`: le
// ventuno celle con le loro `<Image>` non hanno ragione di finire nel bundle
// client. Stessa scelta del nastro della timeline e della mensola.
//
// ── Una sorgente sola per la selezione ──────────────────────────────────────
// Prima erano due, e non si conoscevano: `data-selezionata` scritto dal server
// e un gioco di `:has(:hover)` nel foglio che lo spegneva al passaggio del
// mouse. Con la banda che adesso segue la selezione, due padroni
// significherebbe una cornice che dice una cosa e un testo che ne dice
// un'altra. Qui decide il motore, che ascolta entrambi: l'hover vince finché
// il puntatore è sulla griglia, lo scorrimento quando non c'è.
//
// L'hover si ascolta sul contenitore e non sulle celle, che sono
// server-renderizzate e non possono chiamare niente.

/** Il fattore di smorzamento indipendente dal frame rate. */
function smorza(fattore: number, dt: number) {
  return 1 - Math.pow(1 - fattore, dt * 60);
}

/** La resistenza oltre i capi: cresce con lo sconfinamento, così il primo e
 *  l'ultimo si sentono senza essere un muro. */
function frena(eccesso: number) {
  return 1 / (1 + Math.abs(eccesso) / ELASTICO_OPERE);
}

export function MotoreIndice({
  children,
  banda,
  quante,
  iniziale,
}: {
  children: ReactNode;
  banda: ReactNode;
  quante: number;
  iniziale: number;
}) {
  const binarioRef = useRef<HTMLDivElement>(null);
  const grigliaRef = useRef<HTMLDivElement>(null);

  const [selezionata, setSelezionata] = useState(iniziale);

  /** Il cursore, in opere e con la virgola: `posizione` insegue `obiettivo`, e
   *  la selezione è il suo arrotondamento. Tenere il continuo sotto il discreto
   *  è ciò che permette a un gesto piccolo di non far scattare niente. */
  const posizioneRef = useRef(iniziale);
  const obiettivoRef = useRef(iniziale);
  const velocitaRef = useRef(0);
  /** L'opera sotto il puntatore, o -1. Vince sullo scorrimento finché c'è. */
  const sottoPuntatoreRef = useRef(-1);
  const selezionataRef = useRef(iniziale);

  useGSAP(
    () => {
      const binario = binarioRef.current;
      const griglia = grigliaRef.current;
      if (!binario || !griglia) return;

      const ridotto = motoRidotto();
      const celle = gsap.utils.toArray<HTMLElement>(`.${styles.cella}`, griglia);
      if (celle.length === 0) return;

      const pagina = binario.closest<HTMLElement>(`.${styles.pagina}`) ?? binario;

      /** Le colonne: la griglia scorre per colonna, quindi a spostarsi è la
       *  colonna dell'opera selezionata e non l'opera. Misurate a
       *  trasformazione azzerata, o la seconda lettura vedrebbe la prima. */
      let colonne: number[] = [];
      let scorrimentoMax = 0;
      const misura = () => {
        gsap.set(griglia, { x: 0 });
        const rGriglia = griglia.getBoundingClientRect();
        colonne = celle.map((c) => c.getBoundingClientRect().left - rGriglia.left);
        scorrimentoMax = Math.max(0, griglia.scrollWidth - binario.clientWidth);
      };
      misura();
      window.addEventListener("resize", misura);

      const spingi = (delta: number) => {
        const p = obiettivoRef.current;
        const eccesso = p < 0 ? -p : p > quante - 1 ? p - (quante - 1) : 0;
        obiettivoRef.current += delta * (eccesso > 0 ? frena(eccesso) : 1);
      };

      const observer = ridotto
        ? null
        : Observer.create({
            target: pagina,
            type: "wheel,touch",
            ignore: "a, button",
            onChange: (self) => {
              const tocco = self.event.type.startsWith("touch");
              const grezzo = -(self.deltaX || self.deltaY);
              const delta = (grezzo / PASSO) * (tocco ? SENSIBILITA_TOCCO : 1);
              spingi(delta);
              velocitaRef.current = delta * 60;
            },
            onStop: () => {
              velocitaRef.current = 0;
            },
          });

      /** L'hover: si ascolta sul contenitore perché le celle sono
       *  server-renderizzate. `pointerleave` sulla griglia restituisce la
       *  parola allo scorrimento. */
      const alPuntatore = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const cella = (e.target as Element | null)?.closest<HTMLElement>(`.${styles.cella}`);
        sottoPuntatoreRef.current = cella ? celle.indexOf(cella) : -1;
      };
      const fuoriDallaGriglia = () => {
        sottoPuntatoreRef.current = -1;
      };
      griglia.addEventListener("pointermove", alPuntatore, { passive: true });
      griglia.addEventListener("pointerleave", fuoriDallaGriglia);

      const tick = () => {
        const dt = gsap.ticker.deltaRatio(60) / 60;

        if (Math.abs(velocitaRef.current) > MOMENTO_SOGLIA / PASSO) {
          spingi(velocitaRef.current * dt);
          velocitaRef.current *= Math.pow(MOMENTO_DECADIMENTO, dt);
        } else {
          velocitaRef.current = 0;
        }

        // Rilassamento continuo verso il capo: se l'obiettivo è oltre i confini
        // e non arriva altro input, la molla torna da sola invece di restare
        // tesa in attesa. A moto ridotto il capo è un muro.
        const limite = quante - 1;
        if (ridotto) {
          obiettivoRef.current = Math.min(limite, Math.max(0, obiettivoRef.current));
        } else if (obiettivoRef.current > limite) {
          obiettivoRef.current -= (obiettivoRef.current - limite) * smorza(RILASSAMENTO_BORDO, dt);
        } else if (obiettivoRef.current < 0) {
          obiettivoRef.current -= obiettivoRef.current * smorza(RILASSAMENTO_BORDO, dt);
        }

        posizioneRef.current +=
          (obiettivoRef.current - posizioneRef.current) * (ridotto ? 1 : smorza(SMORZAMENTO, dt));

        // L'hover vince finché c'è: è un'indicazione deliberata, lo
        // scorrimento è una posizione.
        const daScorrimento = Math.min(limite, Math.max(0, Math.round(posizioneRef.current)));
        const scelta =
          sottoPuntatoreRef.current >= 0 ? sottoPuntatoreRef.current : daScorrimento;

        if (scelta !== selezionataRef.current) {
          const prima = celle[selezionataRef.current];
          if (prima) delete prima.dataset.selezionata;
          celle[scelta].dataset.selezionata = "";
          selezionataRef.current = scelta;
          setSelezionata(scelta);
        }

        // La griglia si sposta di quel poco che può per tenere visibile la
        // colonna selezionata: nove pixel oggi, duecento con l'archivio pieno.
        // Il `clamp` è ciò che rende la stessa regola vera a ogni taglia.
        const desiderato = colonne[daScorrimento] ?? 0;
        const x = -Math.min(scorrimentoMax, Math.max(0, desiderato));
        griglia.style.transform = `translateX(${x.toFixed(1)}px)`;
      };

      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("resize", misura);
        griglia.removeEventListener("pointermove", alPuntatore);
        griglia.removeEventListener("pointerleave", fuoriDallaGriglia);
        observer?.kill();
        gsap.ticker.remove(tick);
      };
    },
    { scope: binarioRef },
  );

  return (
    <ContestoIndice.Provider value={{ selezionata }}>
      <div ref={binarioRef} className={styles.binario}>
        <div ref={grigliaRef} className={styles.griglia}>
          {children}
        </div>
      </div>
      {banda}
    </ContestoIndice.Provider>
  );
}
