"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { RAPPORTO, formato } from "@/lib/opere";
import { DISSOLVENZA, TAGLIO, motoRidotto } from "@/lib/movimento";
import { useTimeline } from "./contesto";
import styles from "./page.module.css";

// Il pannello: mostra la voce in evidenza (hover/focus su un titolo del
// nastro, non lo scroll — vedi contesto.ts).
//
// ── Taglio o dissolvenza, secondo il §3.2 alla lettera ──────────────────────
// La guida assegna il taglio al passaggio di stato strutturale e la
// dissolvenza alla variazione interna a uno stato già stabilito (e fra gli
// esempi di quest'ultima nomina proprio l'hover). Qui dentro succedono
// entrambe le cose, e prima ricevevano lo stesso trattamento:
//
//   · pannello chiuso → aperto  =  TAGLIO. Prima non c'era niente: è un
//     nuovo stato che si apre, ed è il primo taglio del progetto.
//   · pannello aperto, cambia voce  =  DISSOLVENZA. Lo stato è già stabilito,
//     cambia il suo contenuto.
//
// Non è solo ortodossia: col taglio su ogni cambio, passare fra due titoli
// vicini lo faceva ripartire da capo ogni 100 ms e i 900 ms del §3.1 non
// arrivavano mai in fondo — il taglio non si vedeva mai per intero proprio
// perché era ovunque.
//
// Meccanica del taglio: `.maschera` copre a riposo (retratta fuori vista) e
// viene scattata a copertura piena un istante prima che il contenuto cambi
// sotto di lei (nello stesso `useGSAP`, quindi prima del paint — nessun lampo
// del contenuto nuovo scoperto), poi si ritira rivelandolo. `.lama`, figlia
// della maschera, sta sul suo bordo che rivela: si muove con lei gratis, deve
// solo sparire — a corsa avviata, dove la fessura si vede (`TAGLIO.rossoInizio`).
//
// A riposo (nessuna voce in evidenza) il pannello è invisibile: uscirne è una
// dissolvenza, non un taglio — non è un nuovo stato che si apre, è
// l'interazione che finisce.

export function PannelloMateriale() {
  const { voceInEvidenza } = useTimeline();
  const contenitoreRef = useRef<HTMLDivElement>(null);
  const contenutoRef = useRef<HTMLDivElement>(null);
  const mascheraRef = useRef<HTMLDivElement>(null);
  const lamaRef = useRef<HTMLDivElement>(null);
  /** Il titolo mostrato al giro precedente: distingue "si apre" da "cambia".
   *  `null` anche dopo la chiusura, così tornare sul nastro è di nuovo un
   *  taglio e non una dissolvenza. */
  const precedenteRef = useRef<string | null>(null);

  useGSAP(
    () => {
      const contenitore = contenitoreRef.current;
      const contenuto = contenutoRef.current;
      const maschera = mascheraRef.current;
      const lama = lamaRef.current;
      if (!contenitore || !contenuto || !maschera || !lama) return;

      const ridotto = motoRidotto();
      const precedente = precedenteRef.current;
      precedenteRef.current = voceInEvidenza?.titolo ?? null;

      // Uscita.
      if (!voceInEvidenza) {
        if (ridotto) {
          gsap.set(contenitore, { opacity: 0 });
          return;
        }
        const dissolvenza = gsap.to(contenitore, {
          opacity: 0,
          duration: DISSOLVENZA.durata,
          ease: DISSOLVENZA.ease,
        });
        return () => {
          dissolvenza.kill();
        };
      }

      gsap.set(contenitore, { opacity: 1 });

      // Variazione interna: il pannello c'è già, cambia solo cosa mostra.
      if (precedente !== null) {
        gsap.set(maschera, { xPercent: -100 });
        gsap.set(lama, { opacity: 0 });
        if (ridotto) {
          gsap.set(contenuto, { opacity: 1 });
          return;
        }
        const dissolvenza = gsap.fromTo(
          contenuto,
          { opacity: 0 },
          { opacity: 1, duration: DISSOLVENZA.durata, ease: DISSOLVENZA.ease },
        );
        return () => {
          dissolvenza.kill();
        };
      }

      // Passaggio di stato: il pannello si apre.
      gsap.set(contenuto, { opacity: 1 });
      if (ridotto) {
        gsap.set(maschera, { xPercent: -100 });
        gsap.set(lama, { opacity: 0 });
        return;
      }
      gsap.set(maschera, { xPercent: 0 });
      gsap.set(lama, { opacity: 1 });

      // La maschera detta il tempo; la lama ci si appende. Il rosso non parte
      // da 0 ma da `rossoInizio`, dove la corsa è entrata nel suo tratto
      // veloce: agganciato all'inizio si spegneva mentre la lama era ancora
      // ferma sul bordo, e il taglio si vedeva senza il suo rosso.
      const tl = gsap.timeline();
      tl.to(maschera, { xPercent: -100, duration: TAGLIO.durata, ease: TAGLIO.ease }, 0).to(
        lama,
        { opacity: 0, duration: TAGLIO.durata * TAGLIO.rossoDurata, ease: "none" },
        TAGLIO.durata * TAGLIO.rossoInizio,
      );

      return () => {
        tl.kill();
      };
    },
    [voceInEvidenza?.titolo],
  );

  return (
    <div
      ref={contenitoreRef}
      className={styles.materiale}
      // Il rosso del taglio ha una sorgente sola (`lib/movimento.ts`): il
      // foglio lo riceve, non ne tiene una copia.
      style={{ "--taglio-rosso": TAGLIO.rosso } as CSSProperties}
    >
      <div className={styles.corpo}>
        <div ref={contenutoRef} className={styles.contenuto}>
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
      </div>

      <div ref={mascheraRef} className={styles.maschera}>
        <div ref={lamaRef} className={styles.lama} />
      </div>
    </div>
  );
}
