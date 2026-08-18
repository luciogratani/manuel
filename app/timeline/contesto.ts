"use client";

import { createContext, useContext } from "react";
import type { VoceTimeline } from "@/lib/timeline";

export type StatoTimeline = {
  /** L'anno al centro della viewport, aggiornato dal motore mentre si scorre. */
  corrente: number;
  /** La voce sotto hover/focus — quella che il pannello mostra. Non è legata
   *  allo scroll: il pannello attivo di continuo mentre si scorre in fretta
   *  era fastidioso, ora si attiva solo su un'interazione deliberata. */
  voceInEvidenza: VoceTimeline | null;
  /** Non un `setVoceInEvidenza` grezzo: `nascondiVoce` ha un piccolo ritardo
   *  cancellabile da `mostraVoce`, così passare velocemente da un titolo
   *  all'altro non fa lampeggiare il pannello sullo stato vuoto in mezzo —
   *  era il bug segnalato con l'hover rapido. */
  mostraVoce: (voce: VoceTimeline) => void;
  nascondiVoce: () => void;
  muto: boolean;
  setMuto: (muto: boolean) => void;
};

export const ContestoTimeline = createContext<StatoTimeline | null>(null);

/** Da usare solo dentro `<MotoreTimeline>`: è lì che vive il Provider. */
export function useTimeline(): StatoTimeline {
  const contesto = useContext(ContestoTimeline);
  if (!contesto) {
    throw new Error("useTimeline va chiamato dentro <MotoreTimeline>");
  }
  return contesto;
}
