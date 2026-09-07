import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { OPERE, RAPPORTO, descrizioneDi, formato, numerato } from "@/lib/opere";
import { Banda, type Scheda } from "./banda";
import { IndiceCompatta } from "./indice-compatta";
import { MotoreIndice } from "./motore";
import styles from "./page.module.css";

// L'indice: la striscia numerata. È la spina dorsale del sito, la pagina che
// decide se quindici anni si leggono come una ricerca o come una raccolta.
//
// Una riga sola che scorre in orizzontale, letta dalla più recente (a
// sinistra) alla più vecchia: `lib/opere.ts` tiene la sequenza in ordine
// cronologico 01→26, qui la si rovescia per la lettura. Il numero di ogni
// opera non cambia — cambia solo da che capo si comincia.
//
// Il ritaglio non è su disco: è la CORNICE ad avere il formato dichiarato e
// l'immagine la riempie con `object-fit: cover`. Così il taglio resta una
// decisione di presentazione, reversibile, e il punto focale per foto si
// aggiungerà ai dati senza rigenerare niente.
//
// Scorrimento e hover non hanno più bisogno di conoscersi (`motore.tsx`): il
// primo sposta la striscia, il secondo — puro `:has(:hover)` nel foglio —
// attenua le opere non in hover e dice alla banda cosa raccontare.

// Il numero di righe NON sta qui: vive in `--righe` nel CSS, insieme a tutta
// l'aritmetica che ne discende — altezza della riga, altezza della lastra,
// larghezza della colonna, quota della banda. Averlo anche qui significava due
// sorgenti per lo stesso numero, e appena hanno smesso di essere d'accordo la
// griglia ha disegnato tre righe con le misure calcolate per due.

/** L'archivio letto dalla più recente. `lib/opere.ts` resta la fonte in ordine
 *  cronologico; il verso di lettura è una decisione di questa pagina. */
const INDICE = [...OPERE].reverse();

/** Lo scorrimento parte da qui: zero pixel, la striscia al suo posto naturale
 *  con la più recente a sinistra. Da qui in poi è stato, e vive nel motore. */
const INIZIALE = 0;

/** MOCK: tre voci reali del vocabolario di `lib/opere.ts` (il campo `medium`).
 *  Il meccanismo È collegato — sceglierne una nella banda attenua le opere
 *  con un `medium` diverso e scorre alla prima che combacia (`motore.tsx`) —
 *  ma il criterio è provvisorio: `medium` è «in che forma si è concretizzata
 *  l'opera», non «di che tipo è», e quasi tutte le opere hanno `medium: "—"`.
 *  Quando la curatela scrive un tag per opera, si cambia `data-medium` con
 *  quello e questa lista con le categorie vere. */
const TAG = ["performance", "fotografia", "editoriale"];

export default function Page() {
  // I testi di TUTTE le opere: la banda ne mostra uno per volta, ma può
  // mostrarli tutti, e passarglieli dal server evita che `lib/opere.ts` finisca
  // nel bundle client per essere riletto lì.
  const schede: Scheda[] = INDICE.map((opera) => ({
    coordinata: `${numerato(opera.numero)} — ${opera.anno}`,
    titolo: opera.titolo,
    // Lo STESSO testo della work page, dalla stessa funzione: erano due
    // stringhe scritte a mano in due file, e questa era rimasta un mock uguale
    // per tutte e ventitré le opere anche dopo che la curatela le aveva
    // raccontate. Vedi `descrizioneDi` in lib/opere.ts.
    descrizione: descrizioneDi(opera),
  }));

  return (
    // `--opere` serve all'ingresso per sapere quanto dura la propria onda
    // senza che il numero sia scritto due volte: il conteggio è di `OPERE`,
    // e le righe restano un fatto del foglio (vedi `--righe`).
    <div className={styles.pagina} style={{ "--opere": OPERE.length } as CSSProperties}>
      <div className={styles.motoreDesktop}>
        <MotoreIndice iniziale={INIZIALE} banda={<Banda schede={schede} tags={TAG} />}>
          {INDICE.map((opera, i) => {
            const copertina = opera.scatti[0];
            const f = formato(copertina.w, copertina.h);
            return (
              <Link
                key={opera.slug}
                className={styles.cella}
                href={`/works/${opera.slug}`}
                data-medium={opera.medium}
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

      <IndiceCompatta opere={INDICE} />
    </div>
  );
}
