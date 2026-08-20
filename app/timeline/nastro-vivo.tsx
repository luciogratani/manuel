"use client";

import type { CSSProperties, FocusEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { VoceTimeline } from "@/lib/timeline";
import { useTimeline } from "./contesto";
import styles from "./page.module.css";

// Foglie client minuscole: leggono lo stato dal Context invece di riceverlo
// come prop da una funzione passata dal Server Component (non serializzabile
// attraverso il confine server→client). I loop di posizionamento (`--dx`)
// restano scritti una sola volta in `page.tsx`.

export function AnnoTick({ anno, dx }: { anno: number; dx: string }) {
  const { corrente } = useTimeline();
  return (
    <span
      className={styles.anno}
      data-t={anno}
      data-anno={anno}
      data-corrente={anno === corrente ? "" : undefined}
      style={{ "--dx": dx } as CSSProperties}
    >
      {anno}
    </span>
  );
}

/** L'anno nel piede. Cambia scorrendo, e sembra il candidato naturale per un
 *  taglio: prima 2013, poi 2014, un valore sostituito da un altro.
 *
 *  Non lo prende, ed è una decisione, non una dimenticanza. È un valore
 *  CONTINUO travestito da discreto: conta, non commuta. Attraversando la
 *  cronologia si cambia anno sedici volte, e dare un taglio a ciascuna
 *  significa o sedici tende rosse, o sopprimerle sopra una soglia di velocità
 *  — cioè il silenzio che legge come rotto e non come effetto, già tolto al
 *  tick sonoro per la stessa ragione (vedi `useSuonoBreve` in lib/suono.ts).
 *
 *  Il taglio, in questa pagina, spetta all'unica cosa davvero discreta che
 *  succede: che la timeline si apra. Tutto il resto è continuo, ed è della
 *  zona di lettura e del fuoco. Un segnale, un canale. */
export function AnnoCorrente() {
  const { corrente } = useTimeline();
  return <>{corrente}</>;
}

/** Una voce del nastro. Hover/focus la mette in evidenza per il pannello
 *  (§3 del feedback: sempre attivo durante lo scroll era fastidioso — ora è
 *  un'interazione deliberata, non un effetto collaterale dello scorrere). */
export function VoceInterattiva({
  voce,
  stile,
}: {
  voce: VoceTimeline;
  stile: CSSProperties;
}) {
  const { mostraVoce, nascondiVoce, vaiA, riaggancio, puntatore } = useTimeline();

  // Il riaggancio dopo il fling. La prova la fa la voce e non il motore
  // perché è la voce ad avere il proprio dato: il motore conosce le ascisse
  // di tutto il nastro ma non saprebbe che oggetto passare a `mostraVoce`, e
  // farglielo sapere significherebbe duplicare le voci sul lato client.
  //
  // Dodici `getBoundingClientRect` una volta sola, a nastro fermo: non è il
  // giro per frame che il motore evita con cura, è un controllo che accade
  // quando tutto si è già posato.
  const elementoRef = useRef<HTMLElement | null>(null);
  const prendi = useCallback((el: HTMLElement | null) => {
    elementoRef.current = el;
  }, []);

  useEffect(() => {
    const el = elementoRef.current;
    const p = puntatore();
    if (!el || !p) return;
    const r = el.getBoundingClientRect();
    if (p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom) {
      mostraVoce(voce);
    }
  }, [riaggancio, puntatore, mostraVoce, voce]);

  // La coordinata è quella del §3.3 — numero e anno insieme — ma il numero è
  // quello vero dell'opera, risolto da `lib/opere.ts`, non la posizione nella
  // lista (prima "Funeral Rave", che è la 16, appariva come 09). Le voci che
  // opere non sono restano senza numero: dargliene uno le dichiarerebbe parte
  // della sequenza 01→26, che è l'archivio, non la biografia.
  const contenuto = (
    <>
      <span className={styles.coordinata}>
        {voce.numero ? `${String(voce.numero).padStart(2, "0")} — ` : ""}
        {voce.anno}
        {voce.fine ? `–${voce.fine}` : ""}
      </span>
      <span className={styles.titolo}>{voce.titolo}</span>
    </>
  );

  const eventi = {
    onMouseEnter: () => mostraVoce(voce),
    onMouseLeave: () => nascondiVoce(),
    onFocus: (e: FocusEvent<HTMLElement>) => {
      mostraVoce(voce);
      // Solo per il focus da tastiera (`:focus-visible`): il click col mouse
      // mette a fuoco anche lui, e lì muovere il nastro sotto il puntatore
      // sarebbe uno strappo appena prima di navigare. Con la tastiera invece
      // la voce messa a fuoco poteva restare fuori schermo.
      if (e.currentTarget.matches(":focus-visible")) vaiA(voce.anno);
    },
    onBlur: () => nascondiVoce(),
  };

  // `data-t`: l'ascissa temporale, la stessa che portano dentini ed etichette.
  // È tutto ciò che serve al motore per calcolare dove cade la voce a schermo
  // e quanto deve essere leggibile, senza misurarla ad ogni frame.
  return voce.href ? (
    <Link
      ref={prendi}
      className={styles.voce}
      href={voce.href}
      data-t={voce.anno}
      data-route=""
      style={stile}
      {...eventi}
    >
      {contenuto}
    </Link>
  ) : (
    <span
      ref={prendi}
      className={styles.voce}
      data-t={voce.anno}
      style={stile}
      tabIndex={0}
      {...eventi}
    >
      {contenuto}
    </span>
  );
}
