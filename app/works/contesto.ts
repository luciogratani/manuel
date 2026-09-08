"use client";

import { createContext, useContext } from "react";

export type StatoIndice = {
  /** L'indice dell'opera in hover, o `null`. L'attenuazione delle altre è
   *  pura CSS (`:has(:hover)` su `.griglia`, in page.module.css): questo
   *  stato serve solo alla banda, che deve sapere QUALE testo mostrare — e,
   *  quando non c'è hover, che non ne deve mostrare nessuno. */
  hover: number | null;
  /** La categoria scelta nella banda, o `null`. Il motore la usa per
   *  attenuare le opere fuori categoria (`data-fuoricategoria` sulle celle,
   *  CSS in page.module.css) e per portare in vista la prima che vi rientra.
   *  È una voce di `Categoria` (`lib/opere.ts`), curata per opera. */
  categoria: string | null;
  scegliCategoria: (categoria: string | null) => void;
};

export const ContestoIndice = createContext<StatoIndice | null>(null);

/** Da usare solo dentro `<MotoreIndice>`: è lì che vive il Provider. */
export function useIndice(): StatoIndice {
  const contesto = useContext(ContestoIndice);
  if (!contesto) throw new Error("useIndice va chiamato dentro <MotoreIndice>");
  return contesto;
}
