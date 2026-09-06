"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DISSOLVENZA, motoRidotto } from "@/lib/movimento";
import { useIndice } from "./contesto";
import styles from "./page.module.css";

// La banda sotto la striscia: la scheda dell'opera in hover, i tag,
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
// quella è una posizione, non un'indicazione.
//
// ── Il passaggio fra un'opera e l'altra non sfarfalla più ───────────────────
// Due accorgimenti, perché spazzando il mouse lungo la striscia si passa
// sopra molte opere al secondo:
//
//   · Il RITARDO vive nel motore (`RITARDO_BANDA`, motore.tsx): `hover` arriva
//     già settato, la banda non vede le opere di passaggio.
//   · Il CROSSFADE è qui: la nuova scheda sale da zero SOVRAPPOSTA alla
//     vecchia che scende (`scia`), così la banda non tocca mai il vuoto fra
//     un'opera e l'altra. Prima ogni cambio era un `fromTo(0 → 1)` che,
//     ripartendo più in fretta di quanto durasse, teneva la scheda
//     perennemente semitrasparente.
//
// §3.2: il cambio di opera è variazione interna a uno stato già stabilito —
// una dissolvenza, non un taglio. Uscire dalla banda lo stesso.

export type Scheda = {
  coordinata: string;
  titolo: string;
  descrizione: string;
};

/** Un solo posto in cui è scritto il markup della scheda: ne vivono due copie
 *  sovrapposte durante il crossfade. */
function Testo({ scheda }: { scheda: Scheda }) {
  return (
    <>
      <p className={styles.coordinata}>{scheda.coordinata}</p>
      <h2 className={styles.titolo}>{scheda.titolo}</h2>
      <p className={styles.descrizione}>{scheda.descrizione}</p>
    </>
  );
}

export function Banda({ schede, tags }: { schede: Scheda[]; tags: string[] }) {
  const { hover, categoria, scegliCategoria } = useIndice();
  // La categoria vive nel motore (contesto.ts): serve lì per attenuare le
  // celle e scorrere. Qui la banda la mostra e la commuta.
  //
  // MOCK: `tags` sono tre valori di `medium`, uguali per ogni opera finché
  // `lib/opere.ts` non ha un tag curato per opera — vedi il commento in
  // `page.tsx`. Ri-cliccare la categoria attiva la spegne.

  // `vivo` è la scheda in scena, `scia` quella che sta uscendo. Si aggiornano
  // in coppia, durante il render, quando `hover` è cambiato davvero: è il
  // pattern React per adeguare uno stato al variare di una prop senza un
  // effetto di mezzo.
  const bersaglio = hover !== null ? schede[hover] : null;
  const [scena, setScena] = useState<{ vivo: Scheda | null; scia: Scheda | null }>(() => ({
    vivo: bersaglio,
    scia: null,
  }));
  if (bersaglio?.titolo !== scena.vivo?.titolo) {
    setScena({ vivo: bersaglio, scia: scena.vivo });
  }

  const vivoRef = useRef<HTMLDivElement>(null);
  const sciaRef = useRef<HTMLDivElement>(null);

  // La nuova scheda entra: sale da zero. Riparte solo quando cambia davvero
  // l'opera in scena, non quando la scia si spegne.
  useGSAP(
    () => {
      const v = vivoRef.current;
      if (!v || !scena.vivo) return;
      const tw = gsap.fromTo(
        v,
        { opacity: 0 },
        {
          opacity: 1,
          duration: motoRidotto() ? 0 : DISSOLVENZA.durata,
          ease: DISSOLVENZA.ease,
        },
      );
      return () => {
        tw.kill();
      };
    },
    { dependencies: [scena.vivo?.titolo] },
  );

  // La scia esce: scende a zero e poi si smonta. `onComplete` è una callback
  // asincrona, non il corpo dell'effetto: lì lo `setScena` è lecito.
  useGSAP(
    () => {
      const sc = sciaRef.current;
      if (!sc || !scena.scia) return;
      gsap.set(sc, { opacity: 1 });
      const tw = gsap.to(sc, {
        opacity: 0,
        duration: motoRidotto() ? 0 : DISSOLVENZA.durata,
        ease: DISSOLVENZA.ease,
        onComplete: () => setScena((p) => (p.scia ? { ...p, scia: null } : p)),
      });
      return () => {
        tw.kill();
      };
    },
    { dependencies: [scena.scia?.titolo] },
  );

  return (
    <div className={styles.banda}>
      <div className={styles.scheda}>
        {scena.scia && (
          <div ref={sciaRef} className={styles.schedaStrato} aria-hidden>
            <Testo scheda={scena.scia} />
          </div>
        )}
        {scena.vivo && (
          <div ref={vivoRef} className={styles.schedaStrato}>
            <Testo scheda={scena.vivo} />
          </div>
        )}
      </div>

      <div
        className={styles.tag}
        data-selezione={categoria !== null ? "" : undefined}
        role="group"
        aria-label="categoria"
      >
        {tags.map((etichetta) => {
          const attiva = etichetta === categoria;
          return (
            <button
              key={etichetta}
              type="button"
              aria-pressed={attiva}
              data-selezionato={attiva ? "" : undefined}
              onClick={() => scegliCategoria(attiva ? null : etichetta)}
            >
              {etichetta}
            </button>
          );
        })}
      </div>

      <p className={styles.indicatore}>
        {hover !== null &&
          `(${String(hover + 1).padStart(2, "0")}—${String(schede.length).padStart(2, "0")})`}
      </p>
    </div>
  );
}
