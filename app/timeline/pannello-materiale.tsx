"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { RAPPORTO, formato } from "@/lib/opere";
import { TAGLIO } from "@/lib/movimento";
import { useTimeline } from "./contesto";
import styles from "./page.module.css";

// Il pannello: mostra la voce in evidenza (hover/focus su un titolo del
// nastro, non più lo scroll — vedi contesto.ts) e si ricompone COL TAGLIO
// quando cambia (guida §3.1/§3.2 — è un cambio di stato strutturale, non una
// variazione interna, quindi non usa la dissolvenza). Primo taglio mai
// implementato nel progetto.
//
// A riposo (nessuna voce in evidenza) il pannello è invisibile: uscirne è
// una piccola dissolvenza, non un taglio — non è un nuovo stato che si apre,
// è l'interazione che finisce.
//
// Meccanica: `.maschera` copre a riposo (retratta fuori vista) e viene
// scattata a copertura piena un istante prima che il contenuto cambi sotto
// di lei (nello stesso `useGSAP`, quindi prima del paint — nessun lampo del
// contenuto nuovo scoperto), poi si ritira rivelandolo. `.lama`, figlia della
// maschera, sta sul suo bordo che rivela: si muove con lei gratis, deve solo
// sparire dopo `TAGLIO.anticipoRosso`.

export function PannelloMateriale() {
  const { voceInEvidenza } = useTimeline();
  const contenitoreRef = useRef<HTMLDivElement>(null);
  const maschraRef = useRef<HTMLDivElement>(null);
  const lamaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!contenitoreRef.current || !maschraRef.current || !lamaRef.current) return;

      if (!voceInEvidenza) {
        const dissolvenza = gsap.to(contenitoreRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: "power1.out",
        });
        return () => {
          dissolvenza.kill();
        };
      }

      gsap.set(contenitoreRef.current, { opacity: 1 });
      gsap.set(maschraRef.current, { xPercent: 0 });
      gsap.set(lamaRef.current, { opacity: 1 });

      const tl = gsap.timeline();
      tl.to(lamaRef.current, { opacity: 0, duration: TAGLIO.anticipoRosso, ease: "none" })
        .to(maschraRef.current, { xPercent: -100, duration: TAGLIO.durata, ease: TAGLIO.ease }, 0);

      return () => {
        tl.kill();
      };
    },
    [voceInEvidenza?.titolo],
  );

  return (
    <div ref={contenitoreRef} className={styles.materiale}>
      <div className={styles.corpo}>
        {voceInEvidenza?.copertina ? (
          <div
            className={styles.immagine}
            style={
              { "--ar": RAPPORTO[formato(voceInEvidenza.copertina.w, voceInEvidenza.copertina.h)] } as CSSProperties
            }
          >
            <Image
              src={voceInEvidenza.copertina.src}
              alt={voceInEvidenza.titolo}
              fill
              sizes="200px"
              className={styles.foto}
            />
          </div>
        ) : voceInEvidenza ? (
          <div className={styles.testoMateriale}>
            <p className={styles.coordinata}>
              {voceInEvidenza.anno}
              {voceInEvidenza.fine ? `–${voceInEvidenza.fine}` : ""}
            </p>
            <p className={styles.titolo}>{voceInEvidenza.titolo}</p>
          </div>
        ) : null}
      </div>

      <div ref={maschraRef} className={styles.maschera}>
        <div ref={lamaRef} className={styles.lama} />
      </div>
    </div>
  );
}
