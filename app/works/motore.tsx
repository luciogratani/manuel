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
import { compattoAttivo, motoRidotto } from "@/lib/movimento";
import { ContestoIndice } from "./contesto";
import styles from "./page.module.css";

// Il motore dell'indice. Scorre la striscia orizzontale delle opere e tiene un
// cursore lungo la sequenza: un centinaio di pixel di rotella avanzano di
// un'opera per volta (`PASSO`), con l'elastico ai due capi.
//
// Il markup pesante resta server-renderizzato e arriva come `children`: le
// ventuno celle con le loro `<Image>` non hanno ragione di finire nel bundle
// client. Stessa scelta del nastro della timeline e della mensola.
//
// ── Scorrimento e hover non si conoscono più ────────────────────────────────
// Prima una sola "selezione" doveva rispondere sia allo scorrimento sia
// all'hover, ed era complicato: chi vince quando arrivano insieme, cosa
// succede uscendo dalla griglia. Adesso sono due cose separate, perché
// rispondono a due domande diverse:
//
//   · Dove si sposta la griglia? Lo decide solo lo scorrimento — fisica
//     continua, invariata qui sotto.
//   · Quale opera è "in evidenza"? Lo decide solo l'hover, ed è tutto qui:
//     l'attenuazione delle altre è pura CSS (`:has(:hover)`, niente scritto a
//     mano), e la banda mostra il testo dell'opera in hover o niente affatto.
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

  const [hover, setHover] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);

  /** Il cursore, in opere e con la virgola: `posizione` insegue `obiettivo`,
   *  e la posizione della griglia è il suo arrotondamento. */
  const posizioneRef = useRef(iniziale);
  const obiettivoRef = useRef(iniziale);
  const velocitaRef = useRef(0);

  useGSAP(
    () => {
      const binario = binarioRef.current;
      const griglia = grigliaRef.current;
      if (!binario || !griglia) return;
      // Sotto la soglia compatta l'indice è una lista in flusso verticale
      // (vedi indice-compatta.tsx): niente da spostare, e l'Observer sotto
      // resterebbe comunque agganciato a `.pagina` — vedi il commento
      // accanto a SOGLIA_COMPATTA in lib/movimento.ts.
      if (compattoAttivo()) return;

      const ridotto = motoRidotto();
      const celle = gsap.utils.toArray<HTMLElement>(`.${styles.cella}`, griglia);
      if (celle.length === 0) return;

      const pagina = binario.closest<HTMLElement>(`.${styles.pagina}`) ?? binario;

      /** L'ascissa di ogni opera dentro la striscia: è lì che il cursore la
       *  porta a filo del bordo sinistro. Misurate a trasformazione azzerata,
       *  o la seconda lettura vedrebbe la prima. */
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
              // Rotella e dito, stesso verso del nastro della timeline: scorrere
              // GIÙ (o trascinare il dito a SINISTRA su una striscia orizzontale)
              // avanza nell'archivio — dalla più recente verso le più vecchie.
              const tocco = self.event.type.startsWith("touch");
              const grezzo = tocco ? -self.deltaX : self.deltaY;
              const delta = (grezzo / PASSO) * (tocco ? SENSIBILITA_TOCCO : 1);
              spingi(delta);
              velocitaRef.current = delta * 60;
            },
            onStop: () => {
              velocitaRef.current = 0;
            },
          });

      /** L'hover: si ascolta sul contenitore perché le celle sono
       *  server-renderizzate. `hoverRef` evita un render ad ogni movimento
       *  del mouse — solo un vero cambio di cella (o l'uscita) tocca lo
       *  stato React, che è quello che la banda legge. */
      const alPuntatore = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const cella = (e.target as Element | null)?.closest<HTMLElement>(`.${styles.cella}`);
        const i = cella ? celle.indexOf(cella) : null;
        if (i !== hoverRef.current) {
          hoverRef.current = i;
          setHover(i);
        }
      };
      const fuoriDallaGriglia = () => {
        if (hoverRef.current !== null) {
          hoverRef.current = null;
          setHover(null);
        }
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

        const daScorrimento = Math.min(limite, Math.max(0, Math.round(posizioneRef.current)));

        // La striscia si porta all'ascissa dell'opera raggiunta, a filo del
        // bordo sinistro, senza mai scoprire il vuoto oltre l'ultima: il
        // `clamp` a `scorrimentoMax` è ciò che rende la regola vera a ogni
        // taglia e a ogni lunghezza dell'archivio.
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
    <ContestoIndice.Provider value={{ hover }}>
      <div ref={binarioRef} className={styles.binario}>
        <div ref={grigliaRef} className={styles.griglia}>
          {children}
        </div>
      </div>
      {banda}
    </ContestoIndice.Provider>
  );
}
