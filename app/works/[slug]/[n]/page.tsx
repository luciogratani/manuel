import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Intero } from "@/components/filmato";
import { OPERE, materiali, numerato, perSlug, rapporto } from "@/lib/opere";
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
  const corrente = colonna[0];

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
            {/* Il segnaposto cambia parola secondo cosa si sta guardando:
                «scatto» davanti a un filmato era una svista che si vedeva. */}
            <p className={styles.descrizione}>
              didascalia {corrente.tipo === "foto" ? "dello scatto" : "del filmato"} —
              cosa si vede, chi c&apos;è, in che momento dell&apos;opera. Testo da
              scrivere con la curatela.
            </p>
          </div>

          <div className={styles.vuoto} data-vuoto="1" />

          <p className={styles.nota}>
            note sull&apos;opera, il making of e i materiali collegati
          </p>

          <div className={styles.vuoto} data-vuoto="2" />

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
