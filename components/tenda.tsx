"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { TENDA, motoRidotto } from "@/lib/movimento";
import styles from "./tenda.module.css";

// La tenda rossa: la grammatica sta in `lib/movimento.ts`, qui c'è il
// montaggio. Due tempi, un solo verso di marcia, nessuna opacità sul rosso.
//
// La meccanica è tutta in `transform-origin`. Alla copertura l'origine è il
// bordo d'ingresso e la scala va 0 → 1; al ritiro l'origine passa al bordo
// opposto e la scala torna 1 → 0, così è il bordo d'ingresso a muoversi e il
// rosso si stringe nel senso in cui era arrivato. Il cambio d'origine avviene
// mentre la scala è esattamente 1, cioè quando il transform è l'identità: non
// si vede, perché non c'è niente da vedere.
//
// Il contenuto viene scoperto — non acceso: `opacity` passa a 1 alla copertura
// piena, sotto il rosso, dove nessuno la vede. È il ritiro a rivelarlo.

const ASSI = {
  orizzontale: { scala: "scaleX", entrata: "left center", uscita: "right center" },
  verticale: { scala: "scaleY", entrata: "center top", uscita: "center bottom" },
} as const;

type Props = {
  children: ReactNode;
  /** Cambiando, la tenda ripassa: è così che un pannello che cambia contenuto
   *  riusa lo stesso primitivo del primo ingresso. Fermo, la tenda passa una
   *  volta sola al montaggio. */
  chiave?: string | number;
  asse?: keyof typeof ASSI;
  /** Moltiplicatore dei tre tempi. La tenda ha un disegno solo e due tempi
   *  d'uso: cerimoniale (1) e di risposta (`TENDA.scalaRisposta`). */
  scala?: number;
  /** Ritardo prima della copertura, in secondi. Durante l'attesa il contenuto
   *  è già nascosto: non si vede niente finché la sua tenda non arriva. */
  ritardo?: number;
  /** La classe del contenitore: la taglia è di chi la usa, non della tenda. */
  className?: string;
};

export function Tenda({
  children,
  chiave,
  asse = "orizzontale",
  ritardo = 0,
  scala = 1,
  className,
}: Props) {
  const contenitoreRef = useRef<HTMLDivElement>(null);
  const contenutoRef = useRef<HTMLDivElement>(null);
  const tendaRef = useRef<HTMLDivElement>(null);
  /** PROVVISORIO, solo per la messa a punto: un clic la fa ripassare, così
   *  non serve ricaricare la pagina ad ogni taratura. Via quando i tempi
   *  sono decisi. */
  const [replay, riparti] = useState(0);

  useGSAP(
    () => {
      const contenuto = contenutoRef.current;
      const tenda = tendaRef.current;
      if (!contenuto || !tenda) return;

      const { scala: asseScala, entrata, uscita } = ASSI[asse];

      // §9.4: stesso stato finale, nessun percorso per arrivarci.
      if (motoRidotto()) {
        gsap.set(contenuto, { opacity: 1 });
        gsap.set(tenda, { [asseScala]: 0 });
        return;
      }

      gsap.set(contenuto, { opacity: 0 });
      gsap.set(tenda, { transformOrigin: entrata, [asseScala]: 0 });

      const tl = gsap.timeline({ delay: ritardo });
      tl.to(tenda, {
        [asseScala]: 1,
        duration: TENDA.copertura * scala,
        ease: TENDA.easeCopertura,
      })
        // Copertura piena: il contenuto compare sotto il rosso.
        .set(contenuto, { opacity: 1 })
        .set(tenda, { transformOrigin: uscita })
        .to(
          tenda,
          { [asseScala]: 0, duration: TENDA.ritiro * scala, ease: TENDA.easeRitiro },
          `+=${TENDA.attesa * scala}`,
        );

      return () => {
        tl.kill();
      };
    },
    { dependencies: [chiave, asse, ritardo, scala, replay], scope: contenitoreRef },
  );

  return (
    <div
      ref={contenitoreRef}
      className={`${styles.contenitore}${className ? ` ${className}` : ""}`}
      style={{ "--tenda-rosso": TENDA.rosso } as CSSProperties}
      onClick={() => riparti((n) => n + 1)}
    >
      <div ref={contenutoRef} className={styles.contenuto}>
        {children}
      </div>
      <div ref={tendaRef} className={styles.tenda} data-asse={asse} />
    </div>
  );
}
