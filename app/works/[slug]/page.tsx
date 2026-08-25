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
// Lo scorrimento è guidato da `mensola.tsx`: un anello continuo che avvolge le
// posizioni, con la corrente che si sposta sotto la linea di lettura. `.fila`
// deve restare un unico elemento con le lastre come figli diretti, tutte nel
// flusso: è da lì che il motore prende le misure, una volta sola.
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
      // Quanto è lunga l'onda: metà sequenza, perché si apre dai due lati.
      // Derivato e non scritto, così resta vero quando gli scatti cambiano.
      style={{ "--onda-max": Math.floor(opera.scatti.length / 2) } as CSSProperties}
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
                // Non la posizione nella sequenza ma la distanza NELL'ANELLO
                // dalla prima lastra: `min(i, n - i)`. A riposo l'anello mette
                // le ultime lastre subito a sinistra della prima, quindi con
                // la distanza lineare arriverebbero per ultime pur essendo le
                // più vicine a schermo — e si leggerebbe come un ritardo, non
                // come un'onda. Con quella circolare l'onda si apre dalla
                // corrente verso i due lati, che è dove le lastre stanno
                // davvero.
                "--i": Math.min(i, opera.scatti.length - i),
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

      {/* ── Sotto la soglia compatta ─────────────────────────────────────────
          `.scheda`/`.crediti`/`.nota` sono posizioni assolute misurate
          sull'artboard: sotto la soglia cadono fuori dal viewport per
          ENTRAMBE le densità — non solo `--corrente-h`, anche `--colonna`
          nella variante minima. La mensola (o l'unica foto) resta nascosta
          con lei: niente anello, solo la sequenza in pila, verticale come
          già fa la vista ravvicinata. Vedi app/globals.css. */}
      <div className={styles.compatta}>
        <p className={styles.compattaNumero}>({numerato(opera.numero)})</p>
        <h1 className={styles.compattaTitolo}>{opera.titolo}</h1>
        <p className={styles.compattaDescrizione}>
          descrizione dell&apos;opera — cosa succede, quando, dove, e perché sta
          in questa sequenza. Testo da scrivere con la curatela.
        </p>

        <div className={styles.compattaFoto}>
          {opera.scatti.map((scatto, i) => (
            <div
              key={scatto.src}
              className={styles.compattaLastra}
              style={{ "--ar": RAPPORTO[formato(scatto.w, scatto.h)] } as CSSProperties}
            >
              <Image
                src={scatto.src}
                alt={i === 0 ? opera.titolo : ""}
                fill
                sizes="100vw"
                priority={i === 0}
                className={styles.foto}
              />
            </div>
          ))}
        </div>

        <dl className={styles.compattaCrediti}>
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

        <p className={styles.compattaNota}>
          note sull&apos;opera, il making of e i materiali collegati
        </p>
      </div>
    </div>
  );
}
