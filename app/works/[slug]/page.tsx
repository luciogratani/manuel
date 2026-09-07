import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Muto } from "@/components/filmato";
import { OPERE, durataLeggibile, materiali, numerato, perSlug, rapporto } from "@/lib/opere";
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
  // La mensola scorre i MATERIALI e non gli scatti: i filmati sono lastre
  // come le altre, in coda alle fotografie (vedi `materiali()`).
  const M = materiali(opera);
  const lastre = M.map((m, i) => ({
    m,
    n: m.n,
    i,
    // Il primo non ha registro: è la corrente a riposo, e il registro glielo
    // toglie `data-corrente`. Gli altri prendono il ritmo dell'artboard.
    registro: i === 0 ? REGISTRI[0] : REGISTRI[(i - 1) % REGISTRI.length],
  }));

  // Un filmato solo si dice per nome («filmato: 1:35»); più di uno si conta,
  // perché sei durate in fila («0:13 · 0:07 · 0:24 · …») smettono di essere un
  // dato e diventano un elenco. Coucher avec moi ne ha sei.
  // Il segnaposto resta dov'è finché la curatela non scrive: un'opera senza
  // testo si deve VEDERE che non ce l'ha.
  const descrizione =
    opera.descrizione ??
    "descrizione dell'opera — cosa succede, quando, dove, e perché sta in questa sequenza. Testo da scrivere con la curatela.";

  // Il conteggio degli scatti non comprende i fermi immagine: dire «scatti: 1»
  // per un'opera che in mensola non ha nessuna fotografia sarebbe una bugia
  // dell'apparato, ed è esattamente ciò che il §3.3 non vuole. Dove il numero
  // è zero la riga sparisce, come già fa quella del filmato.
  const quantiScatti = opera.scatti.filter((x) => !x.fermoImmagine).length;

  const filmati = opera.filmati ?? [];
  const durata = durataLeggibile(filmati.reduce((t, f) => t + f.durata, 0));
  const rigaFilmato =
    filmati.length === 0
      ? null
      : filmati.length === 1
        ? { dt: "filmato:", dd: durata }
        : { dt: "filmati:", dd: `${filmati.length} — ${durata} in tutto` };

  return (
    <div
      className={styles.pagina}
      data-densita={opera.densita}
      // Quanto è lunga l'onda: metà sequenza, perché si apre dai due lati.
      // Derivato e non scritto, così resta vero quando gli scatti cambiano.
      style={{ "--onda-max": Math.floor(M.length / 2) } as CSSProperties}
    >
      <Mensola>
        {lastre.map(({ m, n, i, registro }) => (
          <Link
            key={m.tipo === "foto" ? m.scatto.src : m.filmato.src}
            className={styles.lastra}
            data-registro={registro}
            data-corrente={n === 1 ? "" : undefined}
            data-filmato={m.tipo === "filmato" ? "" : undefined}
            href={`/works/${opera.slug}/${n}`}
            style={
              {
                "--ar": rapporto(m),
                // Non la posizione nella sequenza ma la distanza NELL'ANELLO
                // dalla prima lastra: `min(i, n - i)`. A riposo l'anello mette
                // le ultime lastre subito a sinistra della prima, quindi con
                // la distanza lineare arriverebbero per ultime pur essendo le
                // più vicine a schermo — e si leggerebbe come un ritardo, non
                // come un'onda. Con quella circolare l'onda si apre dalla
                // corrente verso i due lati, che è dove le lastre stanno
                // davvero.
                "--i": Math.min(i, M.length - i),
              } as CSSProperties
            }
          >
            {m.tipo === "foto" ? (
              <Image
                src={m.scatto.src}
                alt={n === 1 ? opera.titolo : ""}
                fill
                sizes="45vw"
                priority={n === 1}
                className={styles.foto}
              />
            ) : (
              <Muto filmato={m.filmato} alt={`${opera.titolo} — filmato`} />
            )}
          </Link>
        ))}
      </Mensola>

      <div className={styles.scheda}>
        <p className={styles.numero}>({numerato(opera.numero)})</p>
        <h1 className={styles.titolo}>{opera.titolo}</h1>
        <p className={styles.descrizione}>{descrizione}</p>
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
        {quantiScatti > 0 ? (
          <div className={styles.credito}>
            <dt>scatti:</dt>
            <dd>{quantiScatti}</dd>
          </div>
        ) : null}
        {/* Il filmato è una riga a sé e non entra nel conteggio degli scatti:
            l'apparato dice quante fotografie ci sono e quanto dura il video,
            due dati distinti. La riga manca del tutto dove manca il materiale
            — l'archivio conta, non dichiara zeri (§3.3). */}
        {rigaFilmato ? (
          <div className={styles.credito}>
            <dt>{rigaFilmato.dt}</dt>
            <dd>{rigaFilmato.dd}</dd>
          </div>
        ) : null}

      </dl>

      {/* La terza colonna. Le persone stanno qui e non nella `dl` dei dati:
          in Glamour Confusion la seconda colonna arrivava a toccare la linea
          delle fotografie, perché i dati d'archivio sono cinque righe corte e
          i crediti possono esserne altre sei lunghe. Due colonne, due
          mestieri: là cosa c'è, qui chi l'ha fatto.

          Nota e persone sono in FLUSSO dentro un contenitore assoluto, non
          due assoluti a quote diverse: così la nota scende da sé quando i
          crediti sono tanti, invece di richiedere un `top` calcolato a mano
          che sarebbe sbagliato per la prima opera con una riga in più. */}
      <div className={styles.terza}>
        {opera.crediti?.length ? (
          <dl className={styles.persone}>
            {opera.crediti.map(([ruolo, nome]) => (
              <div key={ruolo} className={styles.credito} data-persone="">
                <dt>{ruolo}:</dt>
                <dd>{nome}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Il segnaposto della nota si toglie di mezzo dove ci sono i crediti:
            è una riga finta, e non vale i quaranta pixel che toglie a
            un'informazione vera in una colonna che ne ha 169 in tutto. */}
        {opera.crediti?.length ? null : (
          <p className={styles.nota}>
            note sull&apos;opera, il making of e i materiali collegati
          </p>
        )}
      </div>

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
        <p className={styles.compattaDescrizione}>{descrizione}</p>

        <div className={styles.compattaFoto}>
          {M.map((m, i) => (
            <div
              key={m.tipo === "foto" ? m.scatto.src : m.filmato.src}
              className={styles.compattaLastra}
              style={{ "--ar": rapporto(m) } as CSSProperties}
            >
              {m.tipo === "foto" ? (
                <Image
                  src={m.scatto.src}
                  alt={i === 0 ? opera.titolo : ""}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className={styles.foto}
                />
              ) : (
                <Muto filmato={m.filmato} alt={`${opera.titolo} — filmato`} />
              )}
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
          {quantiScatti > 0 ? (
            <div className={styles.credito}>
              <dt>scatti:</dt>
              <dd>{quantiScatti}</dd>
            </div>
          ) : null}
          {rigaFilmato ? (
            <div className={styles.credito}>
              <dt>{rigaFilmato.dt}</dt>
              <dd>{rigaFilmato.dd}</dd>
            </div>
          ) : null}

          {opera.crediti?.map(([ruolo, nome]) => (
            <div key={ruolo} className={styles.credito} data-persone="">
              <dt>{ruolo}:</dt>
              <dd>{nome}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.compattaNota}>
          note sull&apos;opera, il making of e i materiali collegati
        </p>
      </div>
    </div>
  );
}
