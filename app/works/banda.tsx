"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DISSOLVENZA, motoRidotto } from "@/lib/movimento";
import { useIndice } from "./contesto";
import styles from "./page.module.css";

// La banda sotto la griglia: la scheda dell'opera selezionata, i tag,
// l'indicatore.
//
// È la parte che il CSS non poteva fare, e il foglio lo diceva da sé: «in CSS
// si può spostare una cornice, non riscrivere del testo altrove».
//
// I testi arrivano tutti dal Server Component, che i dati ce li ha già: così
// `lib/opere.ts` non finisce nel bundle client per essere riletto lì. La banda
// mostra quello dell'indice corrente, e basta.
//
// Il cambio è una DISSOLVENZA e non un taglio: la banda esiste già, cambia
// solo cosa dice — variazione interna a uno stato stabilito, §3.2. È la stessa
// scelta del pannello della timeline quando cambia voce.

export type Scheda = {
  coordinata: string;
  titolo: string;
  descrizione: string;
};

export function Banda({ schede, tag }: { schede: Scheda[]; tag: string }) {
  const { selezionata } = useIndice();
  const schedaRef = useRef<HTMLDivElement>(null);
  /** Al primo giro non c'è niente da dissolvere: la banda arriva col suo
   *  ingresso, e una dissolvenza in più la farebbe comparire due volte. */
  const primaRef = useRef(true);

  useEffect(() => {
    primaRef.current = false;
  }, []);

  useGSAP(
    () => {
      const scheda = schedaRef.current;
      if (!scheda || primaRef.current || motoRidotto()) return;
      const dissolvenza = gsap.fromTo(
        scheda,
        { opacity: 0 },
        { opacity: 1, duration: DISSOLVENZA.durata, ease: DISSOLVENZA.ease },
      );
      return () => {
        dissolvenza.kill();
      };
    },
    { dependencies: [selezionata] },
  );

  const s = schede[selezionata] ?? schede[0];

  return (
    <div className={styles.banda}>
      <div ref={schedaRef} className={styles.scheda}>
        <p className={styles.coordinata}>{s.coordinata}</p>
        <h2 className={styles.titolo}>{s.titolo}</h2>
        <p className={styles.descrizione}>{s.descrizione}</p>
      </div>

      <p className={styles.tag}>{tag}</p>

      {/* Non più il segnaposto «(1–3)» dell'artboard: la posizione vera nella
          sequenza, che è l'unica cosa che quell'angolo può dire di utile. */}
      <p className={styles.indicatore}>
        ({String(selezionata + 1).padStart(2, "0")}—{String(schede.length).padStart(2, "0")})
      </p>
    </div>
  );
}
