"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { RAPPORTO, formato } from "@/lib/opere";
import { DISSOLVENZA, TENDA, motoRidotto } from "@/lib/movimento";
import { Tenda } from "@/components/tenda";
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
//   · pannello chiuso → aperto  =  TENDA. Prima non c'era niente: è un nuovo
//     stato che si apre, ed è il caso per cui la tenda è stata disegnata —
//     introdurre la preview di un titolo.
//   · pannello aperto, cambia voce  =  DISSOLVENZA. Lo stato è già stabilito,
//     cambia il suo contenuto.
//
// Non è solo ortodossia: col taglio su ogni cambio, passare fra due titoli
// vicini lo faceva ripartire da capo ogni 100 ms e i 900 ms del §3.1 non
// arrivavano mai in fondo — il taglio non si vedeva mai per intero proprio
// perché era ovunque. Con la tenda, che è un rettangolo rosso e non un filetto
// invisibile, la stessa distinzione è la differenza fra un accento e un
// lampeggio.
//
// La tenda gira a `scalaRisposta`: qui risponde a un puntatore, non apre una
// pagina, e il tempo cerimoniale della soglia sarebbe lentezza.
//
// ── Come le due animazioni non si pestano i piedi ───────────────────────────
// Sono due livelli distinti, e devono restarlo. La tenda scopre il proprio
// figlio (`.corpo`, fondo inchiostro compreso) quando il pannello si apre. La
// dissolvenza del cambio voce agisce su `.contenuto`, che sta DENTRO `.corpo`:
// così il fondo resta pieno mentre l'immagine si scambia, altrimenti a metà
// transizione si vedrebbe attraverso.
//
// `aperture` è il contatore che dice alla tenda di ripassare: cresce solo
// quando si passa da chiuso ad aperto, mai su un cambio di voce. È la stessa
// distinzione di `precedenteRef`, resa un dato che la tenda può leggere.
//
// A riposo (nessuna voce in evidenza) il pannello è invisibile: uscirne è una
// dissolvenza, non un taglio — non è un nuovo stato che si apre, è
// l'interazione che finisce.

export function PannelloMateriale() {
  const { voceInEvidenza } = useTimeline();
  const contenitoreRef = useRef<HTMLDivElement>(null);
  const contenutoRef = useRef<HTMLDivElement>(null);
  /** Il titolo mostrato al giro precedente: distingue "si apre" da "cambia".
   *  `null` anche dopo la chiusura, così tornare sul nastro è di nuovo una
   *  tenda e non una dissolvenza. */
  const precedenteRef = useRef<string | null>(null);
  const [aperture, setAperture] = useState(0);

  const titolo = voceInEvidenza?.titolo ?? null;

  // Il conteggio sta in un effect e non dentro `useGSAP` perché scrivere uno
  // stato durante un effetto di layout costringerebbe React a un secondo
  // passaggio prima del paint ad ogni hover. Qui la tenda parte un frame dopo
  // l'apertura, che su un puntatore non si vede.
  useEffect(() => {
    const precedente = precedenteRef.current;
    precedenteRef.current = titolo;
    if (titolo !== null && precedente === null) setAperture((n) => n + 1);
  }, [titolo]);

  useGSAP(
    () => {
      const contenitore = contenitoreRef.current;
      const contenuto = contenutoRef.current;
      if (!contenitore || !contenuto) return;

      const ridotto = motoRidotto();

      // Uscita.
      if (titolo === null) {
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

      // Apertura: non c'è niente da fare qui: scoprire è mestiere della tenda,
      // che riparte da sé quando `aperture` cresce. Toccare `.contenuto`
      // adesso vorrebbe dire animare due volte la stessa opacità.
      if (precedenteRef.current === null) {
        return;
      }

      // Variazione interna: il pannello c'è già, cambia solo cosa mostra.
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
    },
    { dependencies: [titolo] },
  );

  return (
    <div ref={contenitoreRef} className={styles.materiale}>
      <Tenda chiave={aperture} scala={TENDA.scalaRisposta}>
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
      </Tenda>
    </div>
  );
}
