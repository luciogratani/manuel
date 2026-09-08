import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIE, OPERE, RAPPORTO, descrizioneDi, formato, numerato } from "@/lib/opere";
import { Banda, type Scheda } from "./banda";
import { IndiceCompatta } from "./indice-compatta";
import { MotoreIndice } from "./motore";
import styles from "./page.module.css";

// Il titolo si completa da sé col `template` della radice, quindi qui sta
// solo la parola che distingue questa pagina dalle altre.
export const metadata = {
  alternates: { canonical: "/works" },
  title: "Archivio",
  description:
    "Ventitré opere in una sequenza cronologica unica: moda, sartoria, performance, editoriale. L'indice si legge dalla più recente.",
};

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

/* La lente non è più un mock. Le tre voci vengono da `CATEGORIE` in
   `lib/opere.ts`, e ogni opera dichiara la sua: il criterio è un campo curato,
   non il `medium` — che diceva «corsa itinerante» e «capsule collection e
   performance», e teneva fuori dalla lente «performance» otto opere che lo
   sono. Vedi il tipo `Categoria` per il perché sono tre e perché sette opere
   restano senza. */

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
        <MotoreIndice iniziale={INIZIALE} banda={<Banda schede={schede} tags={CATEGORIE} />}>
          {INDICE.map((opera, i) => {
            const copertina = opera.scatti[0];
            const f = formato(copertina.w, copertina.h);
            return (
              <Link
                key={opera.slug}
                className={styles.cella}
                href={`/works/${opera.slug}`}
                data-genere={opera.categoria}
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
