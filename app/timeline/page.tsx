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
import { AnnoCorrente, AnnoTick, VoceInteractiva } from "./nastro-vivo";
import { InterruttoreSuono } from "./interruttore-suono";
import styles from "./page.module.css";

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

// Le voci con `slug` sono anche opere vere del sito: risolvo qui `href` e
// copertina da `lib/opere.ts` invece di duplicarli in `lib/timeline.ts`.
function arricchisci(voci: ReturnType<typeof disponi>): VoceTimeline[] {
  return voci.map((voce) => {
    const opera = voce.slug ? perSlug(voce.slug) : undefined;
    const copertina = opera?.scatti[0];
    return {
      ...voce,
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
        larghezzaPista={rem((FINE - INIZIO) * PASSO + (PISTA_PADDING_MESI * 2 * PASSO) / 12 + VOCE)}
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
                  data-anno={dentroRange && m % 12 === 0 ? "" : undefined}
                  data-opera={dentroRange && m % 12 === 0 && conOpera.has(INIZIO + m / 12) ? "" : undefined}
                  style={{ "--dx": rem((m / 12) * PASSO) } as CSSProperties}
                />
              );
            })}

            {ANNI.map((anno) => (
              <AnnoTick key={anno} anno={anno} dx={rem((anno - INIZIO) * PASSO)} />
            ))}

            {voci.map((voce, i) => (
              <VoceInteractiva
                key={voce.titolo}
                voce={voce}
                indice={i}
                stile={{ "--dx": rem(voce.x), "--n": voce.riga } as CSSProperties}
              />
            ))}
          </>
        }
      >
        <header className={styles.testa}>
          <Link href="/">manuel</Link>
          <p className={styles.percorso}>
            <AnnoCorrente /> / timeline
          </p>
        </header>

        <footer className={styles.piede}>
          <Link href="/">
            <span className={styles.freccia} aria-hidden="true">
              ←
            </span>
            home
          </Link>
          <InterruttoreSuono />
          <p>
            {INIZIO} — {FINE} · {voci.length} voci · contenuto provvisorio
          </p>
        </footer>
      </MotoreTimeline>
    </div>
  );
}
