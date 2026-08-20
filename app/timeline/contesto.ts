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
  /** Cresce di uno ogni volta che il nastro si ferma dopo essersi mosso.
   *  Serve a un bug che il solo hover non può vedere: durante un fling il
   *  nastro scorre sotto un puntatore immobile, la voce che stava lì sotto se
   *  ne va (e `mouseleave` chiude il pannello), ma quando l'inerzia finisce
   *  la voce che è arrivata al suo posto non riceve nessun `mouseenter` —
   *  il puntatore non si è mosso. Il pannello resta vuoto con il cursore
   *  visibilmente sopra un titolo. Ad ogni scatto di questo contatore le voci
   *  ricontrollano se il puntatore è dentro di loro.
   *
   *  È un contatore e non un booleano perché due arresti consecutivi devono
   *  essere due eventi distinti. */
  riaggancio: number;
  /** L'ultima posizione nota del puntatore, o `null` se non c'è mai stato un
   *  mouse o se è uscito dalla finestra. Solo mouse: il tocco non ha un
   *  hover, e riagganciare sull'ultimo punto toccato aprirebbe il pannello su
   *  una voce che nessuno sta indicando. Una funzione e non uno stato — viene
   *  letta solo al momento del riaggancio, e farne stato significherebbe un
   *  render ad ogni movimento del mouse. */
  puntatore: () => { x: number; y: number } | null;
  /** Porta il nonio su un anno passando per la fisica del motore, non con un
   *  salto scritto a mano. Serve al focus da tastiera — una voce messa a
   *  fuoco fuori schermo era irraggiungibile — e sarà l'aggancio di
   *  qualunque navigazione futura verso un punto della cronologia. */
  vaiA: (anno: number) => void;
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
