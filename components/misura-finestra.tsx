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

/** La taglia d'autore: 1rem quando la scala è 1. Non è una manopola. */
const AUTORE = 16;

const CHIAVE = "misura-finestra";

type Foglio = {
  tetto: number;
  rifAltezza: number;
  rifLarghezza: number;
  pavimento: number;
};

/** Valori di scorta, usati solo se il foglio non è ancora applicato. */
const SCORTA: Foglio = {
  tetto: 16,
  rifAltezza: 980,
  rifLarghezza: 1440,
  pavimento: 11,
};

/** I valori VERI, letti da `globals.css`.
 *
 *  Non sono scritti qui dentro di proposito: tenerne una copia significava due
 *  sorgenti per lo stesso numero, e appena il foglio è passato da 780 a 980 il
 *  righello ha continuato a calcolare la scala sul vecchio. Uno strumento di
 *  misura che ha una sua idea di quanto misura è peggio di niente.
 *
 *  Va letto PRIMA di scrivere qualunque stile inline sulla radice, altrimenti
 *  rileggerebbe la manopola invece del foglio. */
function daFoglio(): Foglio {
  if (typeof window === "undefined") return SCORTA;
  const s = getComputedStyle(document.documentElement);
  const n = (nome: string, scorta: number) => {
    const v = parseFloat(s.getPropertyValue(nome));
    return Number.isFinite(v) && v > 0 ? v : scorta;
  };
  return {
    tetto: n("--tetto", SCORTA.tetto),
    rifAltezza: n("--rif-altezza", SCORTA.rifAltezza),
    rifLarghezza: n("--rif-larghezza", SCORTA.rifLarghezza),
    pavimento: n("--pavimento", SCORTA.pavimento),
  };
}

function salvato(base: Foglio) {
  if (typeof window === "undefined") return base;
  try {
    const v = JSON.parse(localStorage.getItem(CHIAVE) ?? "null");
    return {
      tetto: typeof v?.tetto === "number" ? v.tetto : base.tetto,
      rifAltezza:
        typeof v?.rifAltezza === "number" ? v.rifAltezza : base.rifAltezza,
    };
  } catch {
    return base;
  }
}

export function MisuraFinestra() {
  const [misura, setMisura] = useState<{ w: number; h: number } | null>(null);
  const [copiato, setCopiato] = useState<string | null>(null);

  // Le manopole sopravvivono al ricarico: si prova, si ricarica, si riprova.
  // Lette all'inizializzazione e non dentro un effetto — e non c'è rischio di
  // disallineamento con il server, perché finché `misura` è nulla il componente
  // non rende niente, quindi il primo giro è vuoto da entrambe le parti.
  const [base] = useState(daFoglio);
  const [tetto, setTetto] = useState(() => salvato(daFoglio()).tetto);
  const [rifAltezza, setRifAltezza] = useState(
    () => salvato(daFoglio()).rifAltezza,
  );

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
    if (tetto === base.tetto) r.style.removeProperty("--tetto");
    else r.style.setProperty("--tetto", `${tetto}px`);

    if (rifAltezza === base.rifAltezza) r.style.removeProperty("--rif-altezza");
    else r.style.setProperty("--rif-altezza", String(rifAltezza));

    localStorage.setItem(CHIAVE, JSON.stringify({ tetto, rifAltezza }));
  }, [tetto, rifAltezza, base]);

  if (!misura) return null;

  // La scala effettiva: la stessa formula del CSS, riletta qui per mostrarla.
  const frenoL = (misura.w / base.rifLarghezza) * AUTORE;
  const frenoA = (misura.h / rifAltezza) * AUTORE;
  const rem = Math.max(base.pavimento, Math.min(tetto, frenoL, frenoA));
  const scala = rem / AUTORE;

  /** Chi dei tre sta comandando adesso. È il dato che spiega le sorprese. */
  const freno =
    rem <= base.pavimento + 0.001
      ? "pavimento"
      : Math.abs(rem - tetto) < 0.01
        ? "tetto"
        : frenoL < frenoA
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
  const modificato =
    tetto !== base.tetto || rifAltezza !== base.rifAltezza;

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
          setTetto(base.tetto);
          setRifAltezza(base.rifAltezza);
        }}
        title="torna ai valori del foglio"
      >
        ⟲
      </button>
    </div>
  );
}
