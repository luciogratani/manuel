"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DISSOLVENZA, motoRidotto } from "@/lib/movimento";
import { useIndice } from "./contesto";
import styles from "./page.module.css";

// La banda sotto la griglia: la scheda dell'opera in hover, i tag,
// l'indicatore.
//
// È la parte che il CSS non poteva fare, e il foglio lo diceva da sé: «in CSS
// si può spostare una cornice, non riscrivere del testo altrove».
//
// I testi arrivano tutti dal Server Component, che i dati ce li ha già: così
// `lib/opere.ts` non finisce nel bundle client per essere riletto lì.
//
// Senza hover non mostra niente — né titolo né descrizione né indicatore —
// non un'opera di scorta: prima ricadeva sulla posizione di scorrimento, ma
// quella è una posizione, non un'indicazione, e mostrarla come se lo fosse
// era proprio ciò che rendeva la banda poco comprensibile.
//
// Il cambio fra un'opera e l'altra è una DISSOLVENZA e non un taglio: variazione
// interna a uno stato stabilito, §3.2 — stessa scelta del pannello della
// timeline quando cambia voce. Sparire non ha bisogno di una dissolvenza sua:
// è la fine di un'indicazione, non un nuovo stato da annunciare.

export type Scheda = {
  coordinata: string;
  titolo: string;
  descrizione: string;
};

export function Banda({ schede, tags }: { schede: Scheda[]; tags: string[] }) {
  const { hover } = useIndice();
  /** Interazione pronta, filtro assente: `lib/opere.ts` non ha ancora un
   *  campo `tags` reale — quando la curatela lo scriverà, questo stato
   *  locale si collega al contesto della griglia per filtrare `OPERE`. Nessun
   *  tag selezionato di base: tutti e tre pesano uguale finché non se ne
   *  sceglie uno. */
  const [tagSelezionato, setTagSelezionato] = useState<number | null>(null);
  const schedaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scheda = schedaRef.current;
      if (!scheda || hover === null || motoRidotto()) return;
      const dissolvenza = gsap.fromTo(
        scheda,
        { opacity: 0 },
        { opacity: 1, duration: DISSOLVENZA.durata, ease: DISSOLVENZA.ease },
      );
      return () => {
        dissolvenza.kill();
      };
    },
    { dependencies: [hover] },
  );

  const s = hover !== null ? schede[hover] : null;

  return (
    <div className={styles.banda}>
      <div ref={schedaRef} className={styles.scheda}>
        {s && (
          <>
            <p className={styles.coordinata}>{s.coordinata}</p>
            <h2 className={styles.titolo}>{s.titolo}</h2>
            <p className={styles.descrizione}>{s.descrizione}</p>
          </>
        )}
      </div>

      <div
        className={styles.tag}
        data-selezione={tagSelezionato !== null ? "" : undefined}
        role="radiogroup"
        aria-label="tag"
      >
        {tags.map((etichetta, i) => (
          <button
            key={etichetta}
            type="button"
            role="radio"
            aria-checked={i === tagSelezionato}
            data-selezionato={i === tagSelezionato ? "" : undefined}
            onClick={() => setTagSelezionato(i)}
          >
            {etichetta}
          </button>
        ))}
      </div>

      <p className={styles.indicatore}>
        {s && `(${String(hover! + 1).padStart(2, "0")}—${String(schede.length).padStart(2, "0")})`}
      </p>
    </div>
  );
}
