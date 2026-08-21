"use client";

import { createContext, useContext } from "react";

export type StatoIndice = {
  /** L'indice dell'opera selezionata, 0-based. La cornice la marca in griglia
   *  e la banda ne racconta i testi: una sorgente sola per due letture, che
   *  prima erano due — `data-selezionata` nel foglio e `:has(:hover)` accanto,
   *  senza che nessuna delle due sapesse dell'altra. */
  selezionata: number;
};

export const ContestoIndice = createContext<StatoIndice | null>(null);

/** Da usare solo dentro `<MotoreIndice>`: è lì che vive il Provider. */
export function useIndice(): StatoIndice {
  const contesto = useContext(ContestoIndice);
  if (!contesto) throw new Error("useIndice va chiamato dentro <MotoreIndice>");
  return contesto;
}
