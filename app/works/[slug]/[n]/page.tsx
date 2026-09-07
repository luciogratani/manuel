import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Intero } from "@/components/filmato";
import { OPERE, descrizioneDi, materiali, numerato, perSlug, rapporto } from "@/lib/opere";
import styles from "./page.module.css";

// La vista ravvicinata: la stessa opera da vicino. La striscia diventa
// verticale, perde il loop, e le foto passano da campione a piena colonna.
//
// È una route e non uno stato, e la ragione è precisa: l'indice della foto sta
// nell'URL, quindi lo stato vive SOPRA le due viste. Tornando indietro si torna
// sulla foto raggiunta scorrendo, non su quella da cui si era entrati — che è
// il comportamento chiesto, ed è gratis se l'URL lo porta.
//
// L'asterisco nel percorso marca il modo ingrandito: stessa opera, altra
// distanza.

export function generateStaticParams() {
  return OPERE.flatMap((opera) =>
    materiali(opera).map((m) => ({ slug: opera.slug, n: String(m.n) })),
  );
}

/** Queste pagine non stanno nella mappa del sito — sono trecentotrentaquattro
 *  e portano una fotografia ciascuna dentro la stessa cornice — ma un motore
 *  ci arriva lo stesso seguendo i rimandi della mensola. Quindi il `noindex`
 *  delle opere con nudo va ripetuto QUI: è dove la fotografia si vede grande,
 *  ed è la pagina che si vorrebbe tenere fuori più della copertina.
 *
 *  Il titolo porta il numero del materiale perché due viste della stessa opera
 *  non si chiamino allo stesso modo. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}): Promise<Metadata> {
  const { slug, n } = await params;
  const opera = perSlug(slug);
  if (!opera) return {};

  return {
    title: `${opera.titolo} — ${numerato(Number(n))}`,
    robots: opera.nudo ? { index: false, follow: true, noimageindex: true } : undefined,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}) {
  const { slug, n } = await params;
  const opera = perSlug(slug);
  const indice = Number(n);
  const M = opera ? materiali(opera) : [];
  if (!opera || !Number.isInteger(indice) || indice < 1 || indice > M.length) {
    notFound();
  }

  // Si entra sul materiale scelto, non sul primo: la colonna comincia da lì.
  const colonna = M.slice(indice - 1);

  return (
    <div className={styles.pagina}>
      <div className={styles.colonna}>
        <div className={styles.pila}>
          {colonna.map((m, i) => (
            <div
              key={m.tipo === "foto" ? m.scatto.src : m.filmato.src}
              className={styles.piastra}
              data-filmato={m.tipo === "filmato" ? "" : undefined}
              style={
                {
                  "--ar": rapporto(m),
                  // La posizione nella colonna: al foglio serve per sfalsare
                  // l'ingresso, come `--i` nelle altre due viste
                  // dell'archivio.
                  "--i": i,
                } as CSSProperties
              }
            >
              {m.tipo === "foto" ? (
                <Image
                  src={m.scatto.src}
                  alt={opera.titolo}
                  fill
                  sizes="60vw"
                  className={styles.foto}
                />
              ) : (
                /* L'unico posto del sito dove un filmato ha il suono. */
                <Intero filmato={m.filmato} titolo={opera.titolo} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.apparato}>
        <header className={styles.testa}>
          <Link className={styles.indietro} href={`/works/${opera.slug}`}>
            <span className={styles.freccia} aria-hidden="true">
              ←
            </span>
            back
          </Link>
          <p className={styles.percorso}>
            * {numerato(indice)} / {opera.titolo.toLowerCase()} / archivio
          </p>
        </header>

        {/* I tre gruppi sono separati da vuoti che crescono fino alle quote
            dell'artboard e si stringono se la finestra è più bassa. */}
        <div className={styles.corpo}>
          <div className={styles.scheda}>
            <p className={styles.numero}>({numerato(indice)})</p>
            <h1 className={styles.titolo}>{opera.titolo}</h1>
            {/* IL TESTO È QUELLO DELL'OPERA, non uno per fotografia.
                Qui c'era un segnaposto — «didascalia dello scatto — cosa si
                vede, chi c'è…» — su tutte e trecentosessanta le viste
                ravvicinate: il segnaposto più esposto del sito, e per toglierlo
                sarebbero servite trecentosessanta didascalie che nessuno
                scriverà.

                Decisione di Lucio, 8 settembre 2026: la funzione si toglie e il
                testo si eredita. Il campo `Scatto.didascalia` è sparito da
                `lib/opere.ts` — era dichiarato, mai valorizzato e mai letto.
                Se un giorno una singola fotografia meriterà un testo suo, si
                riaggiunge sapendo che è un'eccezione e non una casella da
                riempire trecento volte. */}
            <p className={styles.descrizione}>{descrizioneDi(opera)}</p>
          </div>

          {/* Qui c'era «note sull'opera, il making of e i materiali
              collegati», su tutte e trecentosessanta le viste. Non era il
              segnaposto di un campo vuoto: era la descrizione di una funzione
              che non esiste in nessun punto del progetto — nessun campo,
              nessun dato, nessuno che la stesse costruendo. Tolta l'8 settembre
              2026 su decisione di Lucio, con la stessa logica delle
              didascalie.

              Il vuoto qui sopra vale 351 e non più 278: assorbe la riga (34) e
              il vuoto che la separava dalla nota vera (39). Così la nota e i
              crediti restano alla quota dell'artboard — è stato tolto un
              elemento, non ricomposta la pagina. */}
          <div className={styles.vuoto} data-vuoto="1" />

          <p className={styles.nota}>
            {indice} di {M.length} — {opera.anno} · {opera.medium}
          </p>

          <div className={styles.vuoto} data-vuoto="3" />

          <dl className={styles.crediti}>
            <div className={styles.credito}>
              <dt>anno:</dt>
              <dd>{opera.anno}</dd>
            </div>
            <div className={styles.credito}>
              <dt>medium:</dt>
              <dd>{opera.medium}</dd>
            </div>
            <div className={styles.credito}>
              <dt>luogo:</dt>
              <dd>{opera.luogo}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
