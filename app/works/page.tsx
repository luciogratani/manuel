import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { OPERE, RAPPORTO, formato, numerato } from "@/lib/opere";
import { Banda, type Scheda } from "./banda";
import { IndiceCompatta } from "./indice-compatta";
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
// Scorrimento e hover non hanno più bisogno di conoscersi (`motore.tsx`): il
// primo sposta la griglia, il secondo — puro `:has(:hover)` nel foglio —
// attenua le opere non in hover e dice alla banda cosa raccontare.
//
// La griglia non scorre quasi — ventuno opere fanno 1.413px contro i 1.404
// disponibili, e anche con le ventisei definitive sarebbero 258 — quindi il
// motore non muove una striscia che scorre: sposta un cursore lungo la
// sequenza, e la griglia si sposta di quel poco che può per tenerlo visibile.

// Il numero di righe NON sta qui: vive in `--righe` nel CSS, insieme a tutta
// l'aritmetica che ne discende — altezza della riga, altezza della lastra,
// larghezza della colonna, quota della banda. Averlo anche qui significava due
// sorgenti per lo stesso numero, e appena hanno smesso di essere d'accordo la
// griglia ha disegnato tre righe con le misure calcolate per due.

/** Il cursore di scorrimento parte da qui. Da qui in poi è stato, e vive nel
 *  motore. */
const INIZIALE = 0;

/** MOCK: tre voci reali del vocabolario di `lib/opere.ts` (il campo
 *  `medium`), uguali per tutte le opere. Diventeranno un campo dedicato
 *  quando la curatela lo scriverà, con un tag per opera invece che gli stessi
 *  tre ovunque — l'interazione (selezione singola, un radio button ciascuna)
 *  è pronta da ora, il filtro vero no: vedi il commento in `banda.tsx`. */
const TAG = ["performance", "fotografia", "editoriale"];

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
      <div className={styles.motoreDesktop}>
        <MotoreIndice
          quante={OPERE.length}
          iniziale={INIZIALE}
          banda={<Banda schede={schede} tags={TAG} />}
        >
          {OPERE.map((opera, i) => {
            const copertina = opera.scatti[0];
            const f = formato(copertina.w, copertina.h);
            return (
              <Link
                key={opera.slug}
                className={styles.cella}
                href={`/works/${opera.slug}`}
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
      </div>

      <IndiceCompatta opere={OPERE} />
    </div>
  );
}
