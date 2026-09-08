import type { CSSProperties } from "react";
import Link from "next/link";
import { perSlug } from "@/lib/opere";
import {
  ANNI,
  MESI_PISTA,
  FINE,
  INIZIO,
  PASSO,
  PISTA_PADDING_MESI,
  VOCE,
  VOCI,
  CORRENTE_INIZIALE,
  disponi,
  rem,
  type VoceTimeline,
} from "@/lib/timeline";
import { MotoreTimeline } from "./motore";
import { AnnoCorrente, AnnoTick, VoceInterattiva } from "./nastro-vivo";
import { InterruttoreSuono } from "./interruttore-suono";
import styles from "./page.module.css";

// Il titolo si completa da sé col `template` della radice, quindi qui sta
// solo la parola che distingue questa pagina dalle altre.
export const metadata = {
  alternates: { canonical: "/timeline" },
  title: "Cronologia",
  description:
    "Le opere di Manuel Casati sull'asse del tempo, dal 2013 a oggi, comprese quelle di cui l'archivio non ha ancora il materiale.",
};

// Timeline — la biografia storica di Manuel, e insieme una mappa del sito. NON
// è l'indice dell'archivio: qui entra anche ciò che opera non è (formazione,
// appunti, lavori esterni), materiale che nella numerazione 01→26 non può
// stare senza romperla.
//
// Resta un Server Component: il markup pesante (denti, anni, voci) è
// autorato e mappato qui, una sola volta, e passato come children/nastro a
// `<MotoreTimeline>` — Next non lo include nel bundle client solo perché è
// annidato dentro un Client Component (vedi la nota in `motore.tsx`).
//
// Il livello dinamico (motore, taglio del pannello, tick sonoro) è descritto
// nei file sotto `app/timeline/`. Resta fuori da questo giro, per decisione
// esplicita: un'animazione d'ingresso al primo caricamento — è un incremento
// successivo, separato.

// Le voci con `slug` sono anche opere vere del sito: risolvo qui numero,
// `href` e copertina da `lib/opere.ts` invece di duplicarli in
// `lib/timeline.ts`.
function arricchisci(voci: ReturnType<typeof disponi>): VoceTimeline[] {
  return voci.map((voce) => {
    const opera = voce.slug ? perSlug(voce.slug) : undefined;
    const copertina = opera?.scatti[0];
    return {
      ...voce,
      numero: opera?.numero,
      href: opera ? `/works/${opera.slug}` : undefined,
      copertina: copertina ? { src: copertina.src, w: copertina.w, h: copertina.h } : undefined,
    };
  });
}

export default function Page() {
  const voci = arricchisci(disponi(VOCI));
  const conOpera = new Set(voci.map((v) => v.anno));

  return (
    <div className={styles.pagina}>
      <MotoreTimeline
        inizio={INIZIO}
        fine={FINE}
        correnteIniziale={CORRENTE_INIZIALE}
        stilePista={
          {
            "--pista": rem((FINE - INIZIO) * PASSO + (PISTA_PADDING_MESI * 2 * PASSO) / 12 + VOCE),
            "--voce": rem(VOCE),
            // Dove cade CORRENTE_INIZIALE sulla pista: serve al foglio per
            // mettere quell'anno sotto il nonio già a riposo, senza JS e
            // senza lo scatto al primo frame dopo l'idratazione.
            "--dx-iniziale": rem((CORRENTE_INIZIALE - INIZIO) * PASSO),
          } as CSSProperties
        }
        nastro={
          <>
            <div className={styles.asse} />

            {/* La scala grossa: un dentino al mese, più lungo a gennaio. Dove
                c'è una voce il dentino dell'anno è marcato — è l'unico legame
                fra la voce e la sua ascissa. Estesa oltre INIZIO/FINE di
                `PISTA_PADDING_MESI`: è pista vera sotto l'elastico, non un
                vuoto — ma niente marcatura di gennaio né etichetta d'anno lì
                dentro (`dentroRange`), perché non è cronologia, solo spazio
                fisico in più. */}
            {MESI_PISTA.map((m) => {
              const dentroRange = m >= 0 && m < (FINE - INIZIO + 1) * 12;
              return (
                <span
                  key={m}
                  className={styles.dente}
                  data-t={INIZIO + m / 12}
                  data-gennaio={dentroRange && m % 12 === 0 ? "" : undefined}
                  data-opera={dentroRange && m % 12 === 0 && conOpera.has(INIZIO + m / 12) ? "" : undefined}
                  style={{ "--dx": rem((m / 12) * PASSO) } as CSSProperties}
                />
              );
            })}

            {ANNI.map((anno) => (
              <AnnoTick key={anno} anno={anno} dx={rem((anno - INIZIO) * PASSO)} />
            ))}

            {voci.map((voce) => (
              <VoceInterattiva
                key={voce.titolo}
                voce={voce}
                stile={{ "--dx": rem(voce.x), "--n": voce.riga } as CSSProperties}
              />
            ))}
          </>
        }
      >
        {/* Il percorso scende nel piede. In testa c'era anche `manuel`, che
            ora è dell'header condiviso; e il percorso non poteva salirci
            perché `AnnoCorrente` legge il contesto del motore, che vive solo
            dentro questa pagina. Il piede è il posto dove la posizione può
            restare locale. */}
        <footer className={styles.piede}>
          <p>
            <AnnoCorrente /> / timeline
          </p>
          <p className={styles.legenda}>
            <span aria-hidden="true">scroll  ·  ← →</span>
            <span className={styles.soloLettori}>
              usa lo scroll o le frecce sinistra e destra per navigare
            </span>
          </p>
          <InterruttoreSuono />
        </footer>
      </MotoreTimeline>

      {/* ── Sotto la soglia compatta ──────────────────────────────────────────
          Il nastro è un canvas fisso letto scorrendo in orizzontale: sotto la
          soglia niente lo sposta più (l'Observer si spegne da sé, vedi
          `compattoAttivo()` in motore.tsx) e la sua geometria — un asse largo
          quanto tutta la cronologia — non ha un modo onesto di stare in un
          layout che si impila. La stessa sequenza, in un elenco verticale:
          niente fuoco né zona di lettura, ma ogni voce resta leggibile e
          raggiungibile. Vedi app/globals.css. */}
      <div className={styles.compatta}>
        <p className={styles.compattaEtichetta}>timeline</p>
        <ol className={styles.compattaLista}>
          {voci.map((voce) => (
            <li key={voce.titolo} className={styles.compattaVoce}>
              <span className={styles.compattaAnno}>{voce.anno}</span>
              {voce.href ? (
                <Link href={voce.href} className={styles.compattaTitoloLink}>
                  {voce.titolo}
                </Link>
              ) : (
                <span className={styles.compattaTitoloVoce}>{voce.titolo}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
