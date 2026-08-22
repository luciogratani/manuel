"use client";

import { createContext, useContext } from "react";

export type StatoIndice = {
  /** L'indice dell'opera in hover, o `null`. L'attenuazione delle altre è
   *  pura CSS (`:has(:hover)` su `.griglia`, in page.module.css): questo
   *  stato serve solo alla banda, che deve sapere QUALE testo mostrare — e,
   *  quando non c'è hover, che non ne deve mostrare nessuno. */
  hover: number | null;
};

export const ContestoIndice = createContext<StatoIndice | null>(null);

/** Da usare solo dentro `<MotoreIndice>`: è lì che vive il Provider. */
export function useIndice(): StatoIndice {
  const contesto = useContext(ContestoIndice);
  if (!contesto) throw new Error("useIndice va chiamato dentro <MotoreIndice>");
  return contesto;
}
