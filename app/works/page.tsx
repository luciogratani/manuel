import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { OPERE, RAPPORTO, formato, numerato } from "@/lib/opere";
import styles from "./page.module.css";

// L'indice: la griglia numerata. È la spina dorsale del sito, la pagina che
// decide se quindici anni si leggono come una ricerca o come una raccolta.
//
// Il ritaglio non è su disco: è la CORNICE ad avere il formato dichiarato e
// l'immagine la riempie con `object-fit: cover`. Così il taglio resta una
// decisione di presentazione, reversibile, e il punto focale per foto si
// aggiungerà ai dati senza rigenerare niente.
//
// La selezione al passaggio del mouse è CSS puro (`:has`), quindi è già il
// comportamento definitivo. Manca la parte che richiede JavaScript:
//   · la selezione che avanza SCORRENDO, non solo col mouse
//   · header e scheda che seguono la selezione (in CSS si sposta una cornice,
//     non si riscrive del testo altrove)
//   · lo scorrimento con la rotella (ora solo trackpad)

// Il numero di righe NON sta qui: vive in `--righe` nel CSS, insieme a tutta
// l'aritmetica che ne discende — altezza della riga, altezza della lastra,
// larghezza della colonna, quota della banda. Averlo anche qui significava due
// sorgenti per lo stesso numero, e appena hanno smesso di essere d'accordo la
// griglia ha disegnato tre righe con le misure calcolate per due.

/** La selezione di partenza. Diventerà stato quando la striscia si muoverà. */
const SELEZIONATA = 0;

export default function Page() {
  const selezionata = OPERE[SELEZIONATA];

  return (
    <div className={styles.pagina}>
      <div className={styles.binario}>
        <div className={styles.griglia}>
          {OPERE.map((opera, i) => {
            const copertina = opera.scatti[0];
            const f = formato(copertina.w, copertina.h);
            return (
              <Link
                key={opera.slug}
                className={styles.cella}
                href={`/works/${opera.slug}`}
                data-selezionata={i === SELEZIONATA ? "" : undefined}
              >
                <span className={styles.numero}>{numerato(opera.numero)}</span>
                <span
                  className={styles.lastra}
                  style={{ "--ar": RAPPORTO[f] } as CSSProperties}
                >
                  <Image
                    src={copertina.src}
                    alt={opera.titolo}
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
        <Link href="/">manuel</Link>
        <p className={styles.percorso}>progetti / archivio</p>
      </header>

      {/* Tre colonne: la scheda della selezione, i tag, l'indicatore. */}
      <div className={styles.banda}>
        <div className={styles.scheda}>
          <p className={styles.coordinata}>
            {numerato(selezionata.numero)} — {selezionata.anno}
          </p>
          <h2 className={styles.titolo}>{selezionata.titolo}</h2>
          <p className={styles.descrizione}>
            descrizione del progetto — due o tre righe che dicono cos&apos;è
            l&apos;opera, quando, dove, e perché sta in questa sequenza.
          </p>
        </div>

        <p className={styles.tag}>tags / tags / tags</p>

        {/* Segnaposto dell'artboard, decorativo: non deriva dal layout. */}
        <p className={styles.indicatore}>(1–3)</p>
      </div>

      <footer className={styles.piede}>
        <Link href="/">home</Link>
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
