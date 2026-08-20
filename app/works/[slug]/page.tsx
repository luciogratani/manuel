import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPERE, RAPPORTO, formato, numerato, perSlug } from "@/lib/opere";
import styles from "./page.module.css";

// La work page. La mensola: le lastre attraversano una linea di base condivisa,
// la corrente rompe il registro ed è quella raccontata dal testo.
//
// Lo scorrimento orizzontale è ancora quello nativo: è un ponteggio. Quando
// entra GSAP la striscia viene trascinata da una timeline circolare — per
// questo `.fila` deve restare un unico elemento con le lastre come figli
// diretti, tutte nel flusso, che è l'unica forma che l'helper del loop sa
// misurare.
//
// Il modo ravvicinato sta a /works/[slug]/[n]: mettere l'indice della foto
// nell'URL è ciò che tiene lo stato SOPRA le due viste, e quindi permette di
// tornare indietro sulla foto raggiunta invece che su quella di partenza.

/** Tre altezze, e basta: la mensola ha registri fissi, non misure per lastra. */
type Registro = "alta" | "media" | "bassa";

/** Il ritmo dell'artboard. Le larghezze invece vengono dal formato della foto:
 *  nell'artboard c'erano 1:2 e 2:1, rapporti che in archivio non esistono. */
const REGISTRI: Registro[] = ["alta", "alta", "media", "bassa", "media", "media", "bassa", "alta"];

/** Prima della prima ci sono le ultime: il loop è infinito. Nella versione
 *  ferma sono cloni in testa, ed è la stessa struttura che serve al loop vero. */
const CODA_IN_TESTA = 2;

export function generateStaticParams() {
  return OPERE.map((opera) => ({ slug: opera.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opera = perSlug(slug);
  if (!opera) notFound();

  const corrente = opera.scatti[0];

  // La striscia. Con una sola fotografia — la densità "minima" del §4.1 — non
  // c'è mensola: resta la corrente, e la pagina la regge l'apparato.
  const altre = opera.scatti.slice(1).map((scatto, i) => ({
    scatto,
    registro: REGISTRI[i % REGISTRI.length],
  }));
  const coda = altre.slice(Math.max(0, altre.length - CODA_IN_TESTA));

  return (
    <div className={styles.pagina} data-densita={opera.densita}>
      <div className={styles.striscia}>
        <div className={styles.fila}>
          {coda.map(({ scatto, registro }, i) => (
            <div
              key={`coda-${i}`}
              className={styles.lastra}
              data-registro={registro}
              aria-hidden="true"
              style={
                { "--ar": RAPPORTO[formato(scatto.w, scatto.h)] } as CSSProperties
              }
            >
              <Image src={scatto.src} alt="" fill sizes="30vw" className={styles.foto} />
            </div>
          ))}

          <Link
            className={styles.lastra}
            data-corrente=""
            href={`/works/${opera.slug}/1`}
            style={
              { "--ar": RAPPORTO[formato(corrente.w, corrente.h)] } as CSSProperties
            }
          >
            <Image
              src={corrente.src}
              alt={opera.titolo}
              fill
              sizes="45vw"
              priority
              className={styles.foto}
            />
          </Link>

          {altre.map(({ scatto, registro }) => (
            <div
              key={scatto.src}
              className={styles.lastra}
              data-registro={registro}
              style={
                { "--ar": RAPPORTO[formato(scatto.w, scatto.h)] } as CSSProperties
              }
            >
              <Image src={scatto.src} alt="" fill sizes="30vw" className={styles.foto} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scheda}>
        <p className={styles.numero}>({numerato(opera.numero)})</p>
        <h1 className={styles.titolo}>{opera.titolo}</h1>
        <p className={styles.descrizione}>
          descrizione dell&apos;opera — cosa succede, quando, dove, e perché sta
          in questa sequenza. Testo da scrivere con la curatela.
        </p>
      </div>

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
        <div className={styles.credito}>
          <dt>scatti:</dt>
          <dd>{opera.scatti.length}</dd>
        </div>
      </dl>

      <p className={styles.nota}>
        note sull&apos;opera, il making of e i materiali collegati
      </p>

      <footer className={styles.piede}>
        <p className={styles.percorso}>
          {numerato(opera.numero)} / {opera.titolo.toLowerCase()} / archivio
        </p>
      </footer>
    </div>
  );
}
