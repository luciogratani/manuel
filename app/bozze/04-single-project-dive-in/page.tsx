import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Bozza 04 — single project, dive in. Ricostruzione statica dell'artboard.
//
// È la stessa opera della bozza 01 vista da vicino: la striscia diventa
// verticale, perde il loop, e le foto passano da campione a piena colonna.
//
// Niente animazioni, niente JavaScript. Lo scroll verticale qui è quello nativo
// del contenitore. La colonna di testo resta ferma.

/** I formati chiusi dell'archivio. La larghezza la dà la colonna, l'altezza segue. */
type Formato = "2:3" | "3:4" | "1:1" | "4:3" | "3:2";

const RAPPORTO: Record<Formato, number> = {
  "2:3": 2 / 3,
  "3:4": 3 / 4,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
};

type Piastra = { formato: Formato; video?: boolean };

// La sequenza dell'opera. Nell'artboard la seconda è grigia: l'ho letta come
// video, perché è il grigio che nella home indica il player. Se invece era solo
// un secondo placeholder fotografico, si toglie il flag.
const COLONNA: Piastra[] = [
  { formato: "3:4" },
  { formato: "3:2", video: true },
  { formato: "2:3" },
  { formato: "4:3" },
];

const CREDITI = [
  ["stylist", "name"],
  ["photographer", "name"],
  ["role", "name"],
  ["role", "name"],
];

export default function Page() {
  return (
    <div className={styles.pagina}>
      <div className={styles.colonna}>
        <div className={styles.pila}>
          {COLONNA.map((piastra, i) => (
            <div
              key={i}
              className={styles.piastra}
              data-video={piastra.video ? "" : undefined}
              style={
                { "--ar": RAPPORTO[piastra.formato] } as CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.apparato}>
        <header className={styles.testa}>
          <Link className={styles.indietro} href="/bozze/01-single-project">
            <span className={styles.freccia} aria-hidden="true">
              ←
            </span>
            back
          </Link>
          {/* L'asterisco marca il modo ingrandito: stessa opera, altra distanza. */}
          <p className={styles.percorso}>* 003 / funeral rave / archive</p>
        </header>

        {/* I tre gruppi di testo sono separati da vuoti che crescono fino alle
            quote dell'artboard e si stringono se la finestra è più bassa. */}
        <div className={styles.corpo}>
          <div className={styles.scheda}>
            <p className={styles.numero}>(003)</p>
            <h1 className={styles.titolo}>funeral rave / pic name</h1>
            <p className={styles.descrizione}>
              pic description or infos – pic description or infos – pic
              description or infos – pic description or infos – pic description
            </p>
          </div>

          <div className={styles.vuoto} data-vuoto="1" />

          <p className={styles.nota}>
            some things about the work, the making of and related
          </p>

          <div className={styles.vuoto} data-vuoto="2" />

          <p className={styles.nota}>
            some things about the work, the making of and related –some things
            about the work, the making of and related
          </p>

          <div className={styles.vuoto} data-vuoto="3" />

          <dl className={styles.crediti}>
            {CREDITI.map(([ruolo, nome], i) => (
              <div key={i} className={styles.credito}>
                <dt>{ruolo}:</dt>
                <dd>{nome}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
