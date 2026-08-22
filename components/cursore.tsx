"use client";

import { useEffect, useRef } from "react";
import styles from "./cursore.module.css";

// Il cursore custom: un cerchio rosso che sostituisce il puntatore di sistema
// — spento in app/globals.css, che spiega perché lì e non qui — e si apre in
// anello sopra un cliccabile.
//
// Nessuno stato React: la posizione si scrive direttamente sul nodo a ogni
// `pointermove`, stesso principio del riquadro che segue il cursore in
// components/copia.tsx. Farne uno stato significherebbe un render per
// movimento del mouse.
//
// Il selettore dei cliccabili è generico apposta: copre anche i tag-radio di
// /works senza dover tornare qui ogni volta che arriva un nuovo elemento
// interattivo.
const CLICCABILE = "a, button, [role='button'], [role='radio'], input, select, textarea, summary";

export function Cursore() {
  const nodoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = nodoRef.current;
    if (!nodo) return;

    const muovi = (e: PointerEvent) => {
      // Solo mouse: su touch non c'è un hover da seguire, e un cerchio fermo
      // nell'ultimo punto toccato sarebbe un segno senza significato.
      if (e.pointerType !== "mouse") return;
      nodo.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      nodo.dataset.visibile = "";
      const sopra = (e.target as Element | null)?.closest(CLICCABILE);
      if (sopra) nodo.dataset.espanso = "";
      else delete nodo.dataset.espanso;
    };

    const esce = () => {
      delete nodo.dataset.visibile;
    };

    window.addEventListener("pointermove", muovi, { passive: true });
    document.addEventListener("pointerleave", esce);
    return () => {
      window.removeEventListener("pointermove", muovi);
      document.removeEventListener("pointerleave", esce);
    };
  }, []);

  return (
    <div ref={nodoRef} className={styles.cursore} aria-hidden="true">
      <div className={styles.cerchio} />
    </div>
  );
}
