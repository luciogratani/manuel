import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Timeline — la biografia storica di Manuel, e insieme una mappa del sito. NON è l'indice dell'archivio: è la biografia storica di
// Manuel, e insieme una mappa del sito.
//
// La differenza è di contenuto, non di forma. L'indice porta le 26 opere, che
// sono una sequenza chiusa a pari dignità (§4.1). Qui entra anche ciò che opera
// non è: la formazione, gli appunti, i lavori esterni al portfolio, il
// materiale preparatorio — cose che nella numerazione 01→26 non possono stare
// senza romperla, e che finora non avevano posto da nessuna parte.
//
// L'asse orizzontale codifica l'anno, quindi lo scroll ha un motivo semantico:
// si scorre il tempo, e i vuoti diventano vuoti veri.
//
// ── Cosa manca perché sia viva ───────────────────────────────────────────────
// Questa è ancora la versione ferma. Il livello dinamico deve portare:
//   · scorrimento vero anche con la rotella (ora solo trackpad), via GSAP
//   · loop con FRIZIONE agli estremi: resistenza crescente oltre il 2026, e
//     salto al 2010 quando la resistenza viene vinta. Non è il meccanismo della
//     slide 01 — lì serve una timeline circolare senza cuciture, qui serve un
//     cursore normale con una molla ai bordi, ed è più semplice
//   · l'anno corrente, che qui è fisso al 2013 perché è l'anno che cade al
//     centro della viewport a scorrimento zero
//   · il nonio che scorre, e il tick sonoro quando il dentino alto ne incontra
//     uno basso — con interruttore visibile, e limitato in frequenza
//   · il pannello in basso che si ricompone al cambio di voce, COL TAGLIO e non
//     in dissolvenza: è un cambio di stato strutturale (§3.2)

const INIZIO = 2010;
const FINE = 2026;

/** Pixel per anno sulla viewport di riferimento. Governa la densità dell'asse. */
const PASSO = 240;

/** Larghezza di una voce. Serve anche a capire quando due voci si accavallano. */
const VOCE = 200;

/** L'anno letto dalla testina. Fisso finché non c'è lo scorrimento. */
const CORRENTE = 2013;

type Voce = {
  titolo: string;
  anno: number;
  /** Solo per le voci che occupano un arco di anni. */
  fine?: number;
  medium: string;
  luogo: string;
  /** La route dell'opera, quando l'opera esiste nel sito. */
  href?: string;
};

// ATTENZIONE — dati provvisori, e volutamente incompleti.
//
// Sono le sole voci il cui anno è leggibile dai nomi delle cartelle in
// 01-assets/media. Le altre non hanno una data che io possa ricavare senza
// inventarla. Meglio dodici voci vere che ventisei con quattordici anni finti.
//
// Qui dentro finiranno anche le voci che opere non sono — formazione, appunti,
// lavori esterni — che Manuel aggiungerà.
const VOCI: Voce[] = [
  { titolo: "Intervento per il Candide", anno: 2013, medium: "intervento", luogo: "Palazzo Guillot, Alghero", href: "/works" },
  { titolo: "Glamour Confusion", anno: 2014, medium: "—", luogo: "—" },
  { titolo: "Photo Editorial Design Scene", anno: 2015, medium: "editoriale", luogo: "—" },
  { titolo: "Ph Shoot Anto", anno: 2015, medium: "—", luogo: "—" },
  { titolo: "Corsa Futurista", anno: 2015, fine: 2024, medium: "—", luogo: "—" },
  { titolo: "A Boy's Closet", anno: 2020, medium: "—", luogo: "—" },
  { titolo: "L'Affair", anno: 2021, medium: "video performance", luogo: "—" },
  { titolo: "Le Rêve Lever", anno: 2022, medium: "—", luogo: "—" },
  { titolo: "Funeral Rave", anno: 2023, medium: "—", luogo: "—", href: "/works" },
  { titolo: "Don Giovanni", anno: 2025, medium: "—", luogo: "—" },
  { titolo: "BDSM", anno: 2025, medium: "video", luogo: "—" },
  { titolo: "Coucher avec moi", anno: 2026, medium: "—", luogo: "—" },
];

const ANNI = Array.from({ length: FINE - INIZIO + 1 }, (_, i) => INIZIO + i);

/** Un dentino per mese. Quello di gennaio è più lungo: è l'anno. */
const MESI = Array.from({ length: (FINE - INIZIO + 1) * 12 }, (_, i) => i);

const rem = (px: number) => `${px / 16}rem`;

/** L'ordinata non porta significato: serve solo a non far accavallare le voci. */
function disponi(voci: Voce[]) {
  const ultimaX: number[] = [];
  return voci.map((voce) => {
    const x = (voce.anno - INIZIO) * PASSO;
    let riga = 0;
    while (ultimaX[riga] !== undefined && x - ultimaX[riga] < VOCE) riga += 1;
    ultimaX[riga] = x;
    return { ...voce, x, riga };
  });
}

export default function Page() {
  const voci = disponi(VOCI);
  const conOpera = new Set(voci.map((v) => v.anno));

  return (
    <div className={styles.pagina}>
      <div className={styles.binario}>
        <div
          className={styles.pista}
          style={{ "--pista": rem((FINE - INIZIO) * PASSO + VOCE) } as CSSProperties}
        >
          <div className={styles.asse} />

          {/* La scala grossa: un dentino al mese, più lungo a gennaio. Dove c'è
              una voce il dentino dell'anno è marcato — è l'unico legame fra la
              voce e la sua ascissa, ora che i filetti verticali sono spariti. */}
          {MESI.map((m) => (
            <span
              key={m}
              className={styles.dente}
              data-anno={m % 12 === 0 ? "" : undefined}
              data-opera={m % 12 === 0 && conOpera.has(INIZIO + m / 12) ? "" : undefined}
              style={{ "--dx": rem((m / 12) * PASSO) } as CSSProperties}
            />
          ))}

          {ANNI.map((anno) => (
            <span
              key={anno}
              className={styles.anno}
              data-corrente={anno === CORRENTE ? "" : undefined}
              style={{ "--dx": rem((anno - INIZIO) * PASSO) } as CSSProperties}
            >
              {anno}
            </span>
          ))}

          {voci.map((voce, i) => {
            const contenuto = (
              <>
                <span className={styles.coordinata}>
                  {String(i + 1).padStart(2, "0")} — {voce.anno}
                  {voce.fine ? `–${voce.fine}` : ""}
                </span>
                <span className={styles.titolo}>{voce.titolo}</span>
              </>
            );
            const stile = {
              "--dx": rem(voce.x),
              "--n": voce.riga,
            } as CSSProperties;

            return voce.href ? (
              <Link
                key={voce.titolo}
                className={styles.voce}
                href={voce.href}
                data-route=""
                style={stile}
              >
                {contenuto}
              </Link>
            ) : (
              <span key={voce.titolo} className={styles.voce} style={stile}>
                {contenuto}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── La testina ────────────────────────────────────────────────────────
          Il nonio si è ridotto a un dentino solo, sopra l'asse: sottile come
          quelli dei mesi, appena più in vista. Sta FUORI dalla pista perché è
          la testina di lettura, non un pezzo del nastro — resta ferma sullo
          schermo mentre il tempo le scorre sotto.
          Il tick suona quando incontra un dentino di sotto. */}
      <span className={styles.testina} aria-hidden="true" />

      {/* Lo spazio in fondo: per ora solo il materiale della voce sotto la
          testina, un placeholder orizzontale. Niente filetti, niente testo. */}
      <span className={styles.materiale} aria-hidden="true" />

      <header className={styles.testa}>
        <Link href="/">manuel</Link>
        <p className={styles.percorso}>
          {CORRENTE} / timeline
        </p>
      </header>

      <footer className={styles.piede}>
        <Link href="/">
          <span className={styles.freccia} aria-hidden="true">
            ←
          </span>
          home
        </Link>
        <p>
          {INIZIO} — {FINE} · {voci.length} voci · contenuto provvisorio
        </p>
      </footer>
    </div>
  );
}
