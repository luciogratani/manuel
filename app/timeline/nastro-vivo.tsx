"use client";

import type { CSSProperties } from "react";
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
export function VoceInteractiva({
  voce,
  indice,
  stile,
}: {
  voce: VoceTimeline;
  indice: number;
  stile: CSSProperties;
}) {
  const { mostraVoce, nascondiVoce } = useTimeline();

  const contenuto = (
    <>
      <span className={styles.coordinata}>
        {String(indice + 1).padStart(2, "0")} — {voce.anno}
        {voce.fine ? `–${voce.fine}` : ""}
      </span>
      <span className={styles.titolo}>{voce.titolo}</span>
    </>
  );

  const eventi = {
    onMouseEnter: () => mostraVoce(voce),
    onMouseLeave: () => nascondiVoce(),
    onFocus: () => mostraVoce(voce),
    onBlur: () => nascondiVoce(),
  };

  return voce.href ? (
    <Link className={styles.voce} href={voce.href} data-route="" style={stile} {...eventi}>
      {contenuto}
    </Link>
  ) : (
    <span className={styles.voce} style={stile} tabIndex={0} {...eventi}>
      {contenuto}
    </span>
  );
}
