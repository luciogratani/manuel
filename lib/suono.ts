"use client";

import { useCallback, useEffect, useRef } from "react";

// Hook generico, non specifico alla timeline: riproduce un suono breve con
// throttle. Web Audio API e non `<audio>`, perché un `<audio>` riusato si
// azzittisce da solo se ritriggerato prima che il precedente sia finito — qui
// due tick ravvicinati devono poter sovrapporsi.
//
// `src: null` disattiva silenziosamente: è lo stato di un suono non ancora
// collegato, non un errore da segnalare.

export function useSuonoBreve(src: string | null, sogliaMs = 90) {
  const contestoRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const srcCaricatoRef = useRef<string | null>(null);
  const ultimoRef = useRef(0);

  useEffect(() => {
    return () => {
      contestoRef.current?.close();
      contestoRef.current = null;
      bufferRef.current = null;
      srcCaricatoRef.current = null;
    };
  }, []);

  /** `detuneCents`: scostamento in cent (1/100 di semitono) applicato a
   *  questo singolo tick — positivo più acuto, negativo più grave. */
  const suona = useCallback((detuneCents = 0) => {
    if (!src) return;

    const ora = performance.now();
    if (ora - ultimoRef.current < sogliaMs) return;
    ultimoRef.current = ora;

    // Creato pigramente: le policy di autoplay richiedono un gesto utente, e
    // un evento dell'Observer (rotella, drag) va benissimo come tale.
    if (!contestoRef.current) {
      contestoRef.current = new AudioContext();
    }
    const contesto = contestoRef.current;

    if (srcCaricatoRef.current !== src) {
      srcCaricatoRef.current = src;
      bufferRef.current = null;
      fetch(src)
        .then((r) => r.arrayBuffer())
        .then((dati) => contesto.decodeAudioData(dati))
        .then((buffer) => {
          bufferRef.current = buffer;
        });
      return;
    }

    if (!bufferRef.current) return;
    const nodo = contesto.createBufferSource();
    nodo.buffer = bufferRef.current;
    nodo.detune.value = detuneCents;
    nodo.connect(contesto.destination);
    nodo.start();
  }, [src, sogliaMs]);

  return { suona };
}
