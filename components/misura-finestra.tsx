"use client";

import { useEffect, useState } from "react";
import styles from "./misura-finestra.module.css";

// Strumento di sviluppo, non fa parte del sito: il layout lo monta solo in
// `development`.
//
// Mostra la viewport e il FATTORE DI SCALA, e lascia girare a caldo le due
// manopole che lo governano — il tetto e l'altezza di riferimento — scrivendole
// come stile inline sull'elemento radice. Serve a decidere guardando invece che
// calcolando, che su queste due è l'unico modo.
//
// Quello che si imposta qui vive solo nella scheda: quando un valore convince,
// va scritto in `app/globals.css`. Il pulsante `css` copia le due righe pronte.

/** I valori di partenza, che devono restare uguali a quelli in globals.css. */
const BASE = { tetto: 16, rifAltezza: 780 };

/** La taglia d'autore: 1rem quando la scala è 1. Non è una manopola. */
const AUTORE = 16;

const CHIAVE = "misura-finestra";

function salvato(): typeof BASE {
  if (typeof window === "undefined") return BASE;
  try {
    const v = JSON.parse(localStorage.getItem(CHIAVE) ?? "null");
    return {
      tetto: typeof v?.tetto === "number" ? v.tetto : BASE.tetto,
      rifAltezza:
        typeof v?.rifAltezza === "number" ? v.rifAltezza : BASE.rifAltezza,
    };
  } catch {
    return BASE;
  }
}

export function MisuraFinestra() {
  const [misura, setMisura] = useState<{ w: number; h: number } | null>(null);
  const [copiato, setCopiato] = useState<string | null>(null);

  // Le manopole sopravvivono al ricarico: si prova, si ricarica, si riprova.
  // Lette all'inizializzazione e non dentro un effetto — e non c'è rischio di
  // disallineamento con il server, perché finché `misura` è nulla il componente
  // non rende niente, quindi il primo giro è vuoto da entrambe le parti.
  const [tetto, setTetto] = useState(() => salvato().tetto);
  const [rifAltezza, setRifAltezza] = useState(() => salvato().rifAltezza);

  useEffect(() => {
    const leggi = () =>
      setMisura({ w: window.innerWidth, h: window.innerHeight });
    leggi();
    window.addEventListener("resize", leggi);
    return () => window.removeEventListener("resize", leggi);
  }, []);

  // Scrive le manopole sulla radice. Lo stile inline batte `:root`, quindi
  // basta togliere la proprietà per tornare al valore del foglio.
  useEffect(() => {
    const r = document.documentElement;
    if (tetto === BASE.tetto) r.style.removeProperty("--tetto");
    else r.style.setProperty("--tetto", `${tetto}px`);

    if (rifAltezza === BASE.rifAltezza) r.style.removeProperty("--rif-altezza");
    else r.style.setProperty("--rif-altezza", String(rifAltezza));

    localStorage.setItem(CHIAVE, JSON.stringify({ tetto, rifAltezza }));
  }, [tetto, rifAltezza]);

  if (!misura) return null;

  // La scala effettiva: la stessa formula del CSS, riletta qui per mostrarla.
  const rem = Math.max(
    11,
    Math.min(
      tetto,
      (misura.w / 1440) * AUTORE,
      (misura.h / rifAltezza) * AUTORE,
    ),
  );
  const scala = rem / AUTORE;

  /** Chi dei tre sta comandando adesso. È il dato che spiega le sorprese. */
  const freno =
    rem <= 11 + 0.001
      ? "pavimento"
      : Math.abs(rem - tetto) < 0.01
        ? "tetto"
        : (misura.w / 1440) * AUTORE < (misura.h / rifAltezza) * AUTORE
          ? "larghezza"
          : "altezza";

  const riga = `${misura.w} × ${misura.h} · ${scala.toFixed(2)}×`;

  const copia = async (testo: string, etichetta: string) => {
    try {
      await navigator.clipboard.writeText(testo);
      setCopiato(etichetta);
      setTimeout(() => setCopiato(null), 900);
    } catch {
      // Clipboard negata: non c'è niente da fare e niente da dire.
    }
  };

  const css = `  --rif-altezza: ${rifAltezza};\n  --tetto: ${tetto}px; /* ${(tetto / AUTORE).toFixed(2)}× */`;
  const modificato = tetto !== BASE.tetto || rifAltezza !== BASE.rifAltezza;

  return (
    <div className={styles.barra} data-modificato={modificato ? "" : undefined}>
      <button
        type="button"
        className={styles.misura}
        onClick={() => copia(riga, "misura")}
        title="clic per copiare"
      >
        {copiato === "misura" ? "copiato" : riga}
      </button>

      <span className={styles.freno} data-freno={freno}>
        {freno}
      </span>

      <label className={styles.manopola}>
        tetto
        <input
          type="number"
          value={(tetto / AUTORE).toFixed(2)}
          step={0.01}
          min={0.5}
          max={1}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v) && v > 0) setTetto(v * AUTORE);
          }}
        />
        <span className={styles.unita}>×</span>
      </label>

      <label className={styles.manopola}>
        rif-h
        <input
          type="number"
          value={rifAltezza}
          step={1}
          min={400}
          max={2000}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v) && v > 0) setRifAltezza(Math.round(v));
          }}
        />
      </label>

      <button
        type="button"
        className={styles.azione}
        onClick={() => copia(css, "css")}
        title="copia le due righe per globals.css"
      >
        {copiato === "css" ? "✓" : "css"}
      </button>

      <button
        type="button"
        className={styles.azione}
        onClick={() => {
          setTetto(BASE.tetto);
          setRifAltezza(BASE.rifAltezza);
        }}
        title="torna ai valori del foglio"
      >
        ⟲
      </button>
    </div>
  );
}
