import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Bozza 03 — archivio. L'indice: la griglia numerata dell'artboard originale.
//
// Niente animazioni e niente JavaScript, ma NON è tutto fermo: la selezione al
// passaggio del mouse è CSS puro (`:has`), quindi il comportamento che hai
// chiesto — l'evidenziata cambia facendo hover — funziona già.
//
// Manca la parte che richiede JS, ed è segnata qui perché non si perda:
//   · la selezione che avanza SCORRENDO, non solo al passaggio del mouse
//   · l'header e il paragrafo che seguono la selezione col mouse (in CSS si può
//     spostare una cornice, non si può riscrivere del testo altrove)
//   · lo scorrimento con la rotella (ora solo trackpad)

/** I formati chiusi dell'archivio: ogni foto ne dichiara uno. */
type Formato = "2:3" | "3:4" | "1:1" | "4:3" | "3:2";

const RAPPORTO: Record<Formato, number> = {
  "2:3": 2 / 3,
  "3:4": 3 / 4,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
};

/** Le 26 opere. I formati sono provvisori: li darà la curatela (§6.1). */
const CICLO: Formato[] = ["3:4", "1:1", "2:3", "4:3", "3:2", "1:1", "3:4"];
const OPERE = Array.from({ length: 26 }, (_, i) => ({
  numero: i + 1,
  formato: CICLO[i % CICLO.length],
}));

/** Tre righe, e la sequenza scende prima di andare a destra: così scorrendo si
 *  avanza nella numerazione invece di dover tornare indietro a capo riga. */
const RIGHE = 3;

/** La selezione di partenza. Diventerà stato quando la striscia si muoverà. */
const SELEZIONATA = 1;

export default function Page() {
  return (
    <div className={styles.pagina}>
      <div className={styles.binario}>
        <div className={styles.griglia} style={{ "--righe": RIGHE } as CSSProperties}>
          {OPERE.map((opera) => (
            <Link
              key={opera.numero}
              className={styles.cella}
              href="/bozze/01-single-project"
              data-selezionata={opera.numero === SELEZIONATA ? "" : undefined}
            >
              <span className={styles.numero}>
                {String(opera.numero).padStart(3, "0")}
              </span>
              <span
                className={styles.lastra}
                style={{ "--ar": RAPPORTO[opera.formato] } as CSSProperties}
              />
            </Link>
          ))}
        </div>
      </div>

      <header className={styles.testa}>
        <Link href="/bozze/02-home">manuel</Link>
        <p className={styles.percorso}>progetti / archivio</p>
      </header>

      {/* La banda sotto la griglia, in tre colonne: la scheda della selezione,
          i tag, l'indicatore. La scheda cambierà con la selezione — qui è ferma
          sulla prima. I tag sono segnaposto, non contenuto. */}
      <div className={styles.banda}>
        <div className={styles.scheda}>
          <p className={styles.coordinata}>
            {String(SELEZIONATA).padStart(3, "0")} — 2023
          </p>
          <h2 className={styles.titolo}>funeral rave</h2>
          <p className={styles.descrizione}>
            descrizione del progetto — due o tre righe che dicono cos&apos;è
            l&apos;opera, quando, dove, e perché sta in questa sequenza.
          </p>
        </div>

        <p className={styles.tag}>tags / tags / tags</p>

        <p className={styles.indicatore}>(1–3)</p>
      </div>

      <footer className={styles.piede}>
        <Link href="/bozze/02-home">home</Link>
        <p>meta-voice</p>
        <ul className={styles.categorie}>
          <li>work-category-x</li>
          <li>work-category-y</li>
          <li>work-category-y</li>
        </ul>
        <ul className={styles.categorie}>
          <li>some stuff</li>
          <li>other thing</li>
          <li>other stuff</li>
        </ul>
      </footer>
    </div>
  );
}
