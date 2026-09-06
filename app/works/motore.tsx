"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Observer } from "@/lib/gsap";
import {
  ELASTICO_PX,
  FATTORE_ROTELLA,
  RILASSAMENTO_BORDO,
  SENSIBILITA_TOCCO,
  SMORZAMENTO,
} from "@/lib/indice";
import { compattoAttivo, motoRidotto } from "@/lib/movimento";
import { ContestoIndice } from "./contesto";
import styles from "./page.module.css";

// Il motore dell'indice. Trascina la striscia orizzontale delle opere in
// CONTINUO: la rotella muove un obiettivo in pixel, la posizione lo insegue
// smorzata, e ai due capi c'è un elastico. Nessun cursore che salta di opera
// in opera — quella era la mensola, dove il passo serve ad allineare ogni
// foto alla lettura; qui non c'è niente da allineare.
//
// Il markup pesante resta server-renderizzato e arriva come `children`: le
// celle con le loro `<Image>` non hanno ragione di finire nel bundle client.
// Stessa scelta del nastro della timeline e della mensola.
//
// ── Due Observer, non uno ───────────────────────────────────────────────────
// Ogni cella è un `<Link>`, e GSAP Observer con `ignore: "a, button"` scarta
// OGNI evento — rotella inclusa — il cui target sia dentro un `<a>`: scorrere
// col cursore sopra un'opera non muoveva niente (stesso bug già visto sulla
// timeline e sulla mensola). La rotella non attiva mai una navigazione,
// quindi non c'è ragione di ignorarla lì; il tocco sì, o un tap-per-navigare
// rischierebbe di partire come trascinamento. Due istanze sullo stesso
// target: una per la rotella senza `ignore`, una per il tocco con `ignore`.
//
// ── Scorrimento e hover non si conoscono ────────────────────────────────────
//   · Dove si sposta la striscia? Lo decide solo lo scorrimento.
//   · Quale opera è "in evidenza"? Lo decide solo l'hover: l'attenuazione
//     delle altre è pura CSS (`:has(:hover)`), e la banda mostra il testo
//     dell'opera in hover o niente. L'hover si ascolta sul contenitore
//     perché le celle sono server-renderizzate.

/** Il fattore di smorzamento indipendente dal frame rate. */
function smorza(fattore: number, dt: number) {
  return 1 - Math.pow(1 - fattore, dt * 60);
}

/** La resistenza oltre i capi: cresce con lo sconfinamento, così il primo e
 *  l'ultimo si sentono senza essere un muro. */
function frena(oltre: number) {
  return 1 / (1 + oltre / ELASTICO_PX);
}

export function MotoreIndice({
  children,
  banda,
  iniziale,
}: {
  children: ReactNode;
  banda: ReactNode;
  /** Posizione di partenza in pixel — zero, la striscia al suo posto naturale. */
  iniziale: number;
}) {
  const binarioRef = useRef<HTMLDivElement>(null);
  const grigliaRef = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);

  /** Lo scorrimento in pixel: `posizione` insegue `obiettivo`, e la striscia
   *  è traslata di `-posizione`. */
  const posizioneRef = useRef(iniziale);
  const obiettivoRef = useRef(iniziale);

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

      /** Quanto la striscia può scorrere: la sua larghezza vera meno la
       *  finestra visibile. Misurata a trasformazione azzerata. */
      let scorrimentoMax = 0;
      const misura = () => {
        gsap.set(griglia, { x: 0 });
        scorrimentoMax = Math.max(0, griglia.scrollWidth - binario.clientWidth);
      };
      misura();
      window.addEventListener("resize", misura);

      /** Sposta l'obiettivo di `dpx`, con l'elastico se è già oltre un capo. */
      const spingi = (dpx: number) => {
        const o = obiettivoRef.current;
        const oltre = o < 0 ? -o : o > scorrimentoMax ? o - scorrimentoMax : 0;
        obiettivoRef.current += dpx * (oltre > 0 ? frena(oltre) : 1);
      };

      const osservatoreRotella = ridotto
        ? null
        : Observer.create({
            target: pagina,
            type: "wheel",
            onWheel: (self) => {
              // Scorrere GIÙ (o due dita verso sinistra) avanza nell'archivio,
              // dalla più recente verso le più vecchie: stesso verso del
              // nastro della timeline.
              const asseX = Math.abs(self.deltaX) > Math.abs(self.deltaY);
              const grezzo = asseX ? self.deltaX : self.deltaY;
              spingi(grezzo * FATTORE_ROTELLA);
            },
          });

      const osservatoreTocco = ridotto
        ? null
        : Observer.create({
            target: pagina,
            type: "touch",
            ignore: "a, button",
            onChange: (self) => {
              spingi(-self.deltaX * SENSIBILITA_TOCCO);
            },
          });

      /** L'hover: `hoverRef` evita un render ad ogni movimento del mouse —
       *  solo un vero cambio di cella (o l'uscita) tocca lo stato React, che
       *  è quello che la banda legge. */
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

        // Rilassamento continuo verso il capo: se l'obiettivo è oltre i confini
        // e non arriva altro input, la molla torna da sola invece di restare
        // tesa in attesa. A moto ridotto il capo è un muro.
        if (ridotto) {
          obiettivoRef.current = Math.min(scorrimentoMax, Math.max(0, obiettivoRef.current));
        } else if (obiettivoRef.current > scorrimentoMax) {
          obiettivoRef.current -=
            (obiettivoRef.current - scorrimentoMax) * smorza(RILASSAMENTO_BORDO, dt);
        } else if (obiettivoRef.current < 0) {
          obiettivoRef.current -= obiettivoRef.current * smorza(RILASSAMENTO_BORDO, dt);
        }

        posizioneRef.current +=
          (obiettivoRef.current - posizioneRef.current) * (ridotto ? 1 : smorza(SMORZAMENTO, dt));

        griglia.style.transform = `translateX(${(-posizioneRef.current).toFixed(1)}px)`;
      };

      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("resize", misura);
        griglia.removeEventListener("pointermove", alPuntatore);
        griglia.removeEventListener("pointerleave", fuoriDallaGriglia);
        osservatoreRotella?.kill();
        osservatoreTocco?.kill();
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
