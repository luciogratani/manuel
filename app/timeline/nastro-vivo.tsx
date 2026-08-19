"use client";

import type { CSSProperties, FocusEvent } from "react";
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
  const { mostraVoce, nascondiVoce, vaiA } = useTimeline();

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
    <span className={styles.voce} data-t={voce.anno} style={stile} tabIndex={0} {...eventi}>
      {contenuto}
    </span>
  );
}
