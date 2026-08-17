"use client";

import { useEffect, useState } from "react";
import styles from "./misura-finestra.module.css";

// Strumento di sviluppo, non fa parte del sito: il layout lo monta solo in
// `development`.
//
// Mostra la viewport e — più utile — il FATTORE DI SCALA: tutto il sito è
// disegnato su una viewport di riferimento e sotto quella soglia rimpicciolisce
// di un unico fattore (vedi la regola in `app/globals.css`). Sapere di stare a
// 1,00 o a 0,82 spiega da solo perché una composizione respira su un monitor e
// si schiaccia su un laptop.
//
// Un clic copia la riga, così è incollabile in chat senza trascriverla.

/** La viewport di riferimento del sito. Se cambia in globals.css, cambia qui. */
const RIF = { w: 1440, h: 780 };

/** Sotto questo fattore la scala si ferma e la composizione viene tagliata. */
const PAVIMENTO = 11 / 16;

export function MisuraFinestra() {
  const [misura, setMisura] = useState<{ w: number; h: number } | null>(null);
  const [copiato, setCopiato] = useState(false);

  useEffect(() => {
    const leggi = () =>
      setMisura({ w: window.innerWidth, h: window.innerHeight });
    leggi();
    window.addEventListener("resize", leggi);
    return () => window.removeEventListener("resize", leggi);
  }, []);

  // Niente render sul server: le misure non esistono finché non c'è una
  // finestra, e inventarle produrrebbe un mismatch di idratazione.
  if (!misura) return null;

  const scala = Math.max(
    PAVIMENTO,
    Math.min(1, misura.w / RIF.w, misura.h / RIF.h),
  );
  const riga = `${misura.w} × ${misura.h} · ${scala.toFixed(2)}×`;

  const copia = async () => {
    try {
      await navigator.clipboard.writeText(riga);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 900);
    } catch {
      // Se la clipboard è negata non c'è niente da fare e niente da dire.
    }
  };

  return (
    <button
      type="button"
      className={styles.misura}
      onClick={copia}
      data-sotto={scala < 1 ? "" : undefined}
      data-pavimento={scala <= PAVIMENTO ? "" : undefined}
      title={`riferimento ${RIF.w} × ${RIF.h} — clic per copiare`}
    >
      {copiato ? "copiato" : riga}
    </button>
  );
}
