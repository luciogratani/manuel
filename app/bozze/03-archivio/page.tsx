import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { INDICE, RAPPORTO, formato } from "@/lib/bozze-media";
import styles from "./page.module.css";

// Bozza 03 — archivio. L'indice: la griglia numerata dell'artboard originale.
//
// Le foto sono vere: derivati web delle sorgenti in 01-assets/media, una per
// cartella-opera. Non sono ritagliate su disco — è la CORNICE ad avere il
// formato, e l'immagine la riempie con `object-fit: cover`. Così il ritaglio
// resta una decisione di presentazione e non una perdita irreversibile, e il
// giorno in cui servirà un punto focale per foto si aggiunge lì.
//
// Niente animazioni, ma NON è tutto fermo: la selezione al passaggio del mouse
// è CSS puro (`:has`), quindi il comportamento è già quello definitivo.
//
// Manca la parte che richiede JS:
//   · la selezione che avanza SCORRENDO, non solo al passaggio del mouse
//   · header e scheda che seguono la selezione col mouse (in CSS si può
//     spostare una cornice, non riscrivere del testo altrove)
//   · lo scorrimento con la rotella (ora solo trackpad)

/** Tre righe, e la sequenza scende prima di andare a destra: così scorrendo si
 *  avanza nella numerazione invece di dover tornare indietro a capo riga. */
const RIGHE = 3;

/** La selezione di partenza. Diventerà stato quando la striscia si muoverà. */
const SELEZIONATA = 1;

export default function Page() {
  const selezionata = INDICE[SELEZIONATA - 1];

  return (
    <div className={styles.pagina}>
      <div className={styles.binario}>
        <div className={styles.griglia} style={{ "--righe": RIGHE } as CSSProperties}>
          {INDICE.map((scatto, i) => {
            const f = formato(scatto.w, scatto.h);
            return (
              <Link
                key={scatto.src}
                className={styles.cella}
                href="/bozze/01-single-project"
                data-selezionata={i + 1 === SELEZIONATA ? "" : undefined}
              >
                <span className={styles.numero}>
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span
                  className={styles.lastra}
                  style={{ "--ar": RAPPORTO[f] } as CSSProperties}
                >
                  <Image
                    src={scatto.src}
                    alt={scatto.opera}
                    fill
                    sizes="200px"
                    className={styles.foto}
                  />
                </span>
              </Link>
            );
          })}
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
            {String(SELEZIONATA).padStart(3, "0")} — anno
          </p>
          <h2 className={styles.titolo}>{selezionata.opera}</h2>
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
