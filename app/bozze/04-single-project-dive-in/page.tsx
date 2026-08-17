import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { FUNERAL_RAVE, RAPPORTO, formato } from "@/lib/bozze-media";
import styles from "./page.module.css";

// Bozza 04 — single project, dive in. Ricostruzione statica dell'artboard.
//
// È la stessa opera della bozza 01 vista da vicino: la striscia diventa
// verticale, perde il loop, e le foto passano da campione a piena colonna.
//
// Niente animazioni, niente JavaScript. Lo scroll verticale qui è quello nativo
// del contenitore. La colonna di testo resta ferma.

// La sequenza dell'opera: le prime sei foto di FUNERAL RAVE, a piena colonna.
// La larghezza la dà la colonna, l'altezza segue dal formato dichiarato.
//
// Nell'artboard la seconda piastra era grigia e l'avevo letta come video. Con
// le foto vere il posto del video resta da decidere: due opere dell'archivio
// (L'AFFAIR e video BDSM) non hanno nemmeno una fotografia, solo filmati.
const COLONNA = FUNERAL_RAVE.slice(0, 6);

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
          {COLONNA.map((scatto) => (
            <div
              key={scatto.src}
              className={styles.piastra}
              style={
                {
                  "--ar": RAPPORTO[formato(scatto.w, scatto.h)],
                } as CSSProperties
              }
            >
              <Image
                src={scatto.src}
                alt={scatto.opera}
                fill
                sizes="60vw"
                className={styles.foto}
              />
            </div>
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
