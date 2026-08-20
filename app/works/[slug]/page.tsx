import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPERE, RAPPORTO, formato, numerato, perSlug } from "@/lib/opere";
import { Mensola } from "./mensola";
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

  // La mensola mostra TUTTE le fotografie dell'opera, e ognuna è un rimando
  // alla propria vista ravvicinata. Prima lo era solo la corrente: adesso che
  // la corrente si sposta scorrendo, legare il rimando a lei significherebbe
  // un bersaglio che si muove sotto il puntatore. Ogni lastra porta alla
  // propria foto, e `data-corrente` resta solo un segno di lettura.
  //
  // Sparita anche la coda di cloni in testa. Servivano a suggerire l'anello
  // nella versione ferma, ma l'anello vero avvolge le POSIZIONI e non duplica
  // gli elementi: dei cloni verrebbero contati come lastre e la sequenza
  // avrebbe dei doppioni.
  const lastre = opera.scatti.map((scatto, i) => ({
    scatto,
    n: i + 1,
    i,
    // Il primo non ha registro: è la corrente a riposo, e il registro glielo
    // toglie `data-corrente`. Gli altri prendono il ritmo dell'artboard.
    registro: i === 0 ? REGISTRI[0] : REGISTRI[(i - 1) % REGISTRI.length],
  }));

  return (
    <div
      className={styles.pagina}
      data-densita={opera.densita}
      // Quante lastre: serve al foglio per sapere quando l'onda ha finito,
      // senza che il numero sia scritto due volte.
      style={{ "--scatti": opera.scatti.length } as CSSProperties}
    >
      <Mensola>
        {lastre.map(({ scatto, n, i, registro }) => (
          <Link
            key={scatto.src}
            className={styles.lastra}
            data-registro={registro}
            data-corrente={n === 1 ? "" : undefined}
            href={`/works/${opera.slug}/${n}`}
            style={
              {
                "--ar": RAPPORTO[formato(scatto.w, scatto.h)],
                // La posizione nella sequenza: al foglio serve per l'onda
                // d'ingresso, come in /works.
                "--i": i,
              } as CSSProperties
            }
          >
            <Image
              src={scatto.src}
              alt={n === 1 ? opera.titolo : ""}
              fill
              sizes="45vw"
              priority={n === 1}
              className={styles.foto}
            />
          </Link>
        ))}
      </Mensola>

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
        <p>
          {numerato(opera.numero)} / {opera.titolo.toLowerCase()} / archivio
        </p>
      </footer>
    </div>
  );
}
