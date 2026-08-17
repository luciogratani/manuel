import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { FUNERAL_RAVE, RAPPORTO, formato } from "@/lib/bozze-media";
import styles from "./page.module.css";

// Bozza 01 — single project. Ricostruzione statica dell'artboard Illustrator.
//
// Route di bozza di proposito: le route definitive (§4.3 della guida) non sono
// chiuse, e questa pagina non deve fingere di essere l'architettura.
//
// Niente animazioni, niente JavaScript. Lo scroll orizzontale qui è quello
// nativo del contenitore: è un ponteggio, non la soluzione. Quando entra GSAP
// la striscia smette di scorrere e comincia a essere trascinata da una timeline
// circolare — per questo `.fila` deve restare un unico elemento con le lastre
// come figli diretti, tutte nel flusso: è l'unica forma che l'helper del loop
// sa misurare.

/** Tre altezze, e basta: la mensola ha registri fissi, non misure per lastra. */
type Registro = "alta" | "media" | "bassa";

// Il ritmo dei registri è quello dell'artboard. Le LARGHEZZE però non sono più
// disegnate: vengono dal formato della foto vera. Nell'artboard c'erano 1:2 e
// 2:1, rapporti che nell'archivio non esistono — 2.850 foto e nemmeno una.
// Questo è il primo posto dove la mensola incontra il materiale.
const REGISTRI: Registro[] = [
  "alta",
  "alta",
  "alta",
  "media",
  "bassa",
  "media",
  "media",
  "bassa",
  "alta",
];

const MENSOLA = REGISTRI.map((registro, i) => {
  const scatto = FUNERAL_RAVE[i % FUNERAL_RAVE.length];
  return { registro, scatto, ar: RAPPORTO[formato(scatto.w, scatto.h)] };
});

// La lastra corrente: quella raccontata dal testo, l'unica fuori registro.
// Statica sulla prima, perché il sito apre da lì. Diventerà stato quando la
// striscia si muoverà.
const CORRENTE = 0;

// Il loop è infinito, quindi prima della prima ci sono le ultime. Nella bozza
// sono cloni in testa: non è un rattoppo provvisorio, è la stessa struttura che
// serve al loop vero.
const CODA_IN_TESTA = 2;

const CREDITI = [
  ["stylist", "name"],
  ["photographer", "name"],
  ["role", "name"],
  ["role", "name"],
];

const NOTA = "some things about the work, the making of and related stuff";

export default function Page() {
  const coda = MENSOLA.slice(MENSOLA.length - CODA_IN_TESTA);
  const striscia = [...coda, ...MENSOLA];

  return (
    <div className={styles.pagina}>
      <div className={styles.striscia}>
        <div className={styles.fila}>
          {striscia.map((lastra, i) => {
            const clone = i < CODA_IN_TESTA;
            const corrente = !clone && i - CODA_IN_TESTA === CORRENTE;
            return (
              <div
                key={i}
                className={styles.lastra}
                data-registro={lastra.registro}
                data-corrente={corrente ? "" : undefined}
                aria-hidden={clone || undefined}
                style={{ "--ar": lastra.ar } as CSSProperties}
              >
                <Image
                  src={lastra.scatto.src}
                  alt={lastra.scatto.opera}
                  fill
                  sizes="(max-width: 1440px) 40vw, 600px"
                  className={styles.foto}
                />
              </div>
            );
          })}
        </div>
      </div>

      <header className={styles.testa}>
        <Link href="/">manuel</Link>
        <p className={styles.percorso}>001 / funeral rave / archive</p>
      </header>

      <div className={styles.scheda}>
        <p className={styles.numero}>(001)</p>
        <h1 className={styles.titolo}>funeral rave / pic name</h1>
        <p className={styles.descrizione}>
          pic description or infos – pic description or infos – pic description
          or infos – pic description or infos – pic description or infos – pic
          description
        </p>
      </div>

      <dl className={styles.crediti}>
        {CREDITI.map(([ruolo, nome], i) => (
          <div key={i} className={styles.credito}>
            <dt>{ruolo}:</dt>
            <dd>{nome}</dd>
          </div>
        ))}
      </dl>

      <p className={styles.nota}>{NOTA}</p>

      <footer className={styles.piede}>
        <Link href="/">
          <span className={styles.freccia} aria-hidden="true">
            ←
          </span>
          back
        </Link>
      </footer>
    </div>
  );
}
