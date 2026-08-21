import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { OPERE, RAPPORTO, formato, numerato } from "@/lib/opere";
import { Banda, type Scheda } from "./banda";
import { MotoreIndice } from "./motore";
import styles from "./page.module.css";

// L'indice: la griglia numerata. È la spina dorsale del sito, la pagina che
// decide se quindici anni si leggono come una ricerca o come una raccolta.
//
// Il ritaglio non è su disco: è la CORNICE ad avere il formato dichiarato e
// l'immagine la riempie con `object-fit: cover`. Così il taglio resta una
// decisione di presentazione, reversibile, e il punto focale per foto si
// aggiungerà ai dati senza rigenerare niente.
//
// La selezione ha adesso una sorgente sola, `motore.tsx`, che ascolta sia lo
// scorrimento sia l'hover. Prima erano due e non si conoscevano: il
// `data-selezionata` del server e un gioco di `:has(:hover)` nel foglio.
//
// La griglia non scorre quasi — ventuno opere fanno 1.413px contro i 1.404
// disponibili, e anche con le ventisei definitive sarebbero 258 — quindi «la
// selezione che avanza scorrendo» non vuol dire una striscia che scorre: è lo
// scorrimento a muovere un cursore lungo la sequenza, e la griglia si sposta di
// quel poco che può per tenere visibile ciò che è selezionato.

// Il numero di righe NON sta qui: vive in `--righe` nel CSS, insieme a tutta
// l'aritmetica che ne discende — altezza della riga, altezza della lastra,
// larghezza della colonna, quota della banda. Averlo anche qui significava due
// sorgenti per lo stesso numero, e appena hanno smesso di essere d'accordo la
// griglia ha disegnato tre righe con le misure calcolate per due.

/** La selezione di partenza. Da qui in poi è stato, e vive nel motore. */
const SELEZIONATA = 0;

/** MOCK: i tag sono ancora quelli dell'artboard, uguali per tutte le opere.
 *  Diventeranno un campo di `lib/opere.ts` quando la curatela li scriverà. */
const TAG = "tags / tags / tags";

export default function Page() {
  // I testi di TUTTE le opere: la banda ne mostra uno per volta, ma può
  // mostrarli tutti, e passarglieli dal server evita che `lib/opere.ts` finisca
  // nel bundle client per essere riletto lì.
  const schede: Scheda[] = OPERE.map((opera) => ({
    coordinata: `${numerato(opera.numero)} — ${opera.anno}`,
    titolo: opera.titolo,
    // MOCK: da scrivere con la curatela, come nelle altre viste.
    descrizione:
      "descrizione del progetto — due o tre righe che dicono cos'è l'opera, quando, dove, e perché sta in questa sequenza.",
  }));

  return (
    // `--opere` serve all'ingresso per sapere quanto dura la propria onda
    // senza che il numero sia scritto due volte: il conteggio è di `OPERE`,
    // e le righe restano un fatto del foglio (vedi `--righe`).
    <div className={styles.pagina} style={{ "--opere": OPERE.length } as CSSProperties}>
      <MotoreIndice
        quante={OPERE.length}
        iniziale={SELEZIONATA}
        banda={<Banda schede={schede} tag={TAG} />}
      >
        {OPERE.map((opera, i) => {
          const copertina = opera.scatti[0];
          const f = formato(copertina.w, copertina.h);
          return (
            <Link
              key={opera.slug}
              className={styles.cella}
              href={`/works/${opera.slug}`}
              data-selezionata={i === SELEZIONATA ? "" : undefined}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.numero}>{numerato(opera.numero)}</span>
              <span className={styles.lastra} style={{ "--ar": RAPPORTO[f] } as CSSProperties}>
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
      </MotoreIndice>

      <footer className={styles.piede}>
        <p>progetti / archivio</p>
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
