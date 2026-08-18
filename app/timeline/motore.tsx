"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Observer } from "@/lib/gsap";
import {
  ELASTICO_ANNI,
  SFORZO_SALTO,
  SMORZAMENTO,
  RILASSAMENTO_BORDO,
  SENSIBILITA_GENERALE,
  SENSIBILITA_BORDO,
  MOMENTO_DECADIMENTO,
  MOMENTO_SOGLIA,
  PASSO_TASTIERA,
  TRASCINAMENTO_ATTIVO,
  TICK_DETUNE_CENTI,
  TICK_DETUNE_VELOCITA_RIFERIMENTO,
  FOCUS_RAGGIO_MESI,
  FOCUS_MIN,
  FOCUS_PICCO,
  BORDO_RAGGIO_ANNI,
  BORDO_MIN,
  BORDO_ENFASI_PICCO,
  type VoceTimeline,
} from "@/lib/timeline";
import { useSuonoBreve } from "@/lib/suono";
import { ContestoTimeline } from "./contesto";
import { PannelloMateriale } from "./pannello-materiale";
import styles from "./page.module.css";

// Il motore: sostituisce lo scroll nativo di `.binario` con uno guidato via
// GSAP Observer (rotella, trackpad, drag in un unico modello), applica la
// frizione crescente agli estremi e il momento residuo al rilascio, e deriva
// `corrente` dalla posizione invece di tenerlo fisso. È l'unico confine
// client della pagina: tutto il markup pesante (denti, anni, voci) resta
// server-renderizzato e arriva come `children`/`nastro` — Next.js non lo
// include nel bundle client solo perché è annidato qui dentro (vedi nota in
// `page.tsx`).
//
// Cleanup completo allo smontaggio (Observer, ticker, AudioContext): è il
// requisito per una futura transizione fra pagine via `template.tsx`, che
// remonterà questo componente ad ogni navigazione.
//
// ── La posizione si MISURA, non si assume ───────────────────────────────────
// Prima versione: la pista veniva spostata solo della differenza rispetto al
// riposo, assumendo che l'anno di riposo cadesse già esattamente dove sta il
// nonio. Falso anche alla viewport di riferimento (uno scarto di 54px), e
// il resize lo rendeva visibile: il nonio è un `left:50%` relativo al
// viewport reale, la pista è in rem sulla scala del sito — appena il freno
// dell'altezza o il pavimento smettono di essere proporzionali alla
// larghezza, le due cose si separano. Ora si misura dove sta davvero il
// nonio e dove cade `inizio`, in pixel reali, e si ricalcola al resize —
// stessa disciplina di `--tetto`/`--rif-altezza` in questo progetto: leggere
// dal foglio, non tenerne una copia.

// Persistenza del muto in localStorage, letta con `useSyncExternalStore`
// invece che con un `useEffect` + `setState` al mount: quest'ultimo pattern
// va bene concettualmente ma causa un render a cascata subito dopo l'idratazione
// (react-hooks/set-state-in-effect). `useSyncExternalStore` è pensato apposta
// per una sorgente esterna che può differire fra server e client — restituisce
// `true` finché non ha potuto leggere il valore vero, senza mismatch.
const CHIAVE_AUDIO = "timeline-audio";
const ascoltatoriAudio = new Set<() => void>();

function leggiMuto() {
  return window.localStorage.getItem(CHIAVE_AUDIO) !== "attivo";
}

function scriviMuto(v: boolean) {
  window.localStorage.setItem(CHIAVE_AUDIO, v ? "muto" : "attivo");
  ascoltatoriAudio.forEach((f) => f());
}

function sottoscriviMuto(callback: () => void) {
  ascoltatoriAudio.add(callback);
  return () => {
    ascoltatoriAudio.delete(callback);
  };
}

const mutoDiDefault = () => true;

/** Quanto aspettare dopo un `mouseleave`/`blur` prima di nascondere davvero
 *  il pannello: abbastanza perché passare da un titolo al successivo non
 *  faccia lampeggiare lo stato vuoto in mezzo (il bug dell'hover veloce). */
const RITARDO_NASCONDI_MS = 100;

/** Smorzamento/rilassamento/decadimento indipendenti dal refresh rate: un
 *  fattore fisso applicato una volta a 60fps si applicherebbe il doppio
 *  delle volte al secondo su uno schermo a 120Hz. */
function smorza(fattore: number, dt: number) {
  return 1 - Math.pow(1 - fattore, dt * 60);
}

/** Scala diretta (§2 del feedback): tutti i dentini bassi, quello sotto il
 *  nonio al picco. Campana di Lorentz, non coseno: sale ripida vicino al
 *  centro e ha una coda lunga e morbida invece di un taglio netto al raggio
 *  — "centro più chiuso, bordi lunghi e morbidi". */
function fattoreFocus(t: number, visibile: number) {
  const distanzaMesi = Math.abs(t - visibile) * 12;
  const normalizzata = distanzaMesi / FOCUS_RAGGIO_MESI;
  const campana = 1 / (1 + normalizzata * normalizzata);
  return FOCUS_MIN + (FOCUS_PICCO - FOCUS_MIN) * campana;
}

/** I dentini si assottigliano avvicinandosi a un capo (§4 del feedback) — ma
 *  se quel capo è proprio quello contro cui si sta spingendo (frizione
 *  attiva), l'assottigliamento si capovolge in enfasi, proporzionale a
 *  quanto la molla è tesa: riusa `eccessoNormalizzato`/`latoForzato` del
 *  motore invece di un secondo calcolo di frizione. */
function fattoreBordo(
  t: number,
  inizio: number,
  fine: number,
  eccessoNormalizzato: number,
  latoForzato: -1 | 0 | 1,
) {
  const distanzaInizio = t - inizio;
  const distanzaFine = fine - t;
  const alConfineInizio = distanzaInizio <= BORDO_RAGGIO_ANNI;
  const alConfineFine = distanzaFine <= BORDO_RAGGIO_ANNI;
  if (!alConfineInizio && !alConfineFine) return 1;

  const distanzaBordo = alConfineInizio ? distanzaInizio : distanzaFine;
  const normalizzata = Math.max(0, distanzaBordo) / BORDO_RAGGIO_ANNI; // 0 al capo, 1 al raggio
  const assottigliamento = BORDO_MIN + (1 - BORDO_MIN) * normalizzata;

  const forzatoQui = (alConfineInizio && latoForzato === -1) || (alConfineFine && latoForzato === 1);
  if (!forzatoQui || eccessoNormalizzato <= 0) return assottigliamento;

  return 1 + (BORDO_ENFASI_PICCO - 1) * eccessoNormalizzato * (1 - normalizzata);
}

type Props = {
  inizio: number;
  fine: number;
  correnteIniziale: number;
  larghezzaPista: string;
  /** Il nastro: asse, denti, anni, voci — server-renderizzato. */
  nastro: ReactNode;
  /** Testa e piede della pagina — server-renderizzati, tranne le foglie
   *  client minuscole che leggono il Context (es. `<AnnoCorrente/>`). */
  children: ReactNode;
};

export function MotoreTimeline({
  inizio,
  fine,
  correnteIniziale,
  larghezzaPista,
  nastro,
  children,
}: Props) {
  const binarioRef = useRef<HTMLDivElement>(null);
  const pistaRef = useRef<HTMLDivElement>(null);
  const testinaRef = useRef<HTMLSpanElement>(null);

  const obiettivoRef = useRef(correnteIniziale);
  const visibileRef = useRef(correnteIniziale);
  const sforzoRef = useRef(0);
  const velocitaRef = useRef(0); // anni/secondo, per il momento dopo il rilascio
  const denteRef = useRef(Math.floor((correnteIniziale - inizio) * 12));
  const ultimoVisibileRef = useRef(correnteIniziale); // per il verso/intensità del tick

  // Misure reali, ricalcolate al resize (vedi commento in testa al file).
  const scorrimentoPxRef = useRef(0);
  const puntoLetturaRef = useRef(0);
  const origineAnnoRef = useRef(0);
  const pxPerAnnoRef = useRef(1);
  const dentiRef = useRef<{ el: HTMLElement; t: number }[]>([]);

  const [corrente, setCorrente] = useState(correnteIniziale);
  const [voceInEvidenza, setVoceInEvidenza] = useState<VoceTimeline | null>(null);
  const nascondiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostraVoce = useCallback((voce: VoceTimeline) => {
    if (nascondiTimeoutRef.current) {
      clearTimeout(nascondiTimeoutRef.current);
      nascondiTimeoutRef.current = null;
    }
    setVoceInEvidenza(voce);
  }, []);

  const nascondiVoce = useCallback(() => {
    if (nascondiTimeoutRef.current) clearTimeout(nascondiTimeoutRef.current);
    nascondiTimeoutRef.current = setTimeout(() => {
      setVoceInEvidenza(null);
      nascondiTimeoutRef.current = null;
    }, RITARDO_NASCONDI_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (nascondiTimeoutRef.current) clearTimeout(nascondiTimeoutRef.current);
    };
  }, []);

  const muto = useSyncExternalStore(sottoscriviMuto, leggiMuto, mutoDiDefault);
  const setMuto = useCallback((v: boolean) => scriviMuto(v), []);

  // Il ticker (montato una volta sola più sotto) legge questo ref invece di
  // `muto` direttamente: la sua closure è fissata al mount, quindi solo un
  // ref aggiornato ad ogni render gli garantisce il valore corrente. La
  // scrittura vive in un effect (mai durante il render, react-hooks/refs).
  const mutoRef = useRef(muto);
  useEffect(() => {
    mutoRef.current = muto;
  }, [muto]);

  // Sempre la stessa sorgente: `suona` resta un riferimento stabile per tutta
  // la vita del componente, e il ticker può catturarlo senza rischiare una
  // closure legata a uno stato muto di partenza.
  const { suona } = useSuonoBreve("/tick.mp3");

  useGSAP(() => {
    const binario = binarioRef.current;
    const pista = pistaRef.current;
    const testina = testinaRef.current;
    if (!binario || !pista || !testina) return;

    const denti: { el: HTMLElement; t: number }[] = [];
    pista.querySelectorAll<HTMLElement>("[data-t]").forEach((el) => {
      const t = parseFloat(el.dataset.t ?? "");
      if (!Number.isNaN(t)) denti.push({ el, t });
    });
    dentiRef.current = denti;

    /** Misura dove sta davvero il nonio e dove cade `inizio`, in pixel
     *  reali, invece di assumerlo. `rA`/`testina` includono il transform già
     *  applicato in questo momento: lo riporto a zero sottraendo l'ultimo
     *  `--scorrimento` scritto, così il risultato resta valido a qualunque
     *  `visibile` futuro, non solo a quello di adesso. */
    const misura = () => {
      const rBinario = binario.getBoundingClientRect();
      const annoA = pista.querySelector<HTMLElement>(`[data-anno="${inizio}"]`);
      const annoB = pista.querySelector<HTMLElement>(`[data-anno="${inizio + 1}"]`);
      if (!annoA || !annoB) return;

      const rA = annoA.getBoundingClientRect();
      const rB = annoB.getBoundingClientRect();

      pxPerAnnoRef.current = rB.left - rA.left || 1;
      puntoLetturaRef.current = testina.getBoundingClientRect().left - rBinario.left;
      origineAnnoRef.current = rA.left - rBinario.left - scorrimentoPxRef.current;
    };

    misura();
    window.addEventListener("resize", misura);

    /** Il nucleo della fisica: un delta in anni (già in quella unità, non in
     *  pixel) che spinge `obiettivo`, con sensibilità generale, frizione
     *  elastica ai capi e accumulo per il salto. Usato sia dall'input diretto
     *  (`spingi`) sia dal momento residuo dopo il rilascio (nel ticker) —
     *  stessa fisica, non due sistemi paralleli. */
    const spingi = (deltaAnniGrezzi: number) => {
      const deltaAnni = deltaAnniGrezzi * SENSIBILITA_GENERALE;
      let obiettivo = obiettivoRef.current - deltaAnni;

      const oltreFine = obiettivo > fine;
      const oltreInizio = obiettivo < inizio;
      const eccesso = oltreFine ? obiettivo - fine : oltreInizio ? inizio - obiettivo : 0;

      if (eccesso > 0) {
        const capo = oltreFine ? fine : inizio;
        // SENSIBILITA_BORDO si applica IN PIÙ, solo qui: le due sensibilità
        // si moltiplicano, quindi ai bordi la resistenza totale supera la
        // somma delle due percentuali richieste.
        const fattore = Math.max(0.05, 1 - eccesso / ELASTICO_ANNI) * SENSIBILITA_BORDO;
        const spostamento = Math.min(eccesso * fattore, ELASTICO_ANNI);
        obiettivo = capo + (oltreFine ? spostamento : -spostamento);
        sforzoRef.current += Math.abs(deltaAnni);
      } else {
        sforzoRef.current = 0;
      }

      if (sforzoRef.current > SFORZO_SALTO) {
        const capoOpposto = oltreFine ? inizio : fine;
        obiettivoRef.current = capoOpposto;
        visibileRef.current = capoOpposto;
        sforzoRef.current = 0;
        velocitaRef.current = 0;
      } else {
        obiettivoRef.current = obiettivo;
      }
    };

    /** Frecce sinistra/destra: stesso passo fisico dello scroll, non un
     *  bypass — riusa `spingi()`, quindi elastico e salto valgono anche da
     *  tastiera. Ascoltato sulla pagina intera: qui non c'è altro widget con
     *  cui le frecce potrebbero entrare in conflitto. */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        spingi(-PASSO_TASTIERA);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        spingi(PASSO_TASTIERA);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    const observer = Observer.create({
      target: binario,
      // Il trascinamento è spento (TRASCINAMENTO_ATTIVO): non ascoltare
      // affatto touch/pointer, invece di ascoltarli e ignorarli — così non
      // interferisce con lo scroll/tap nativo altrove sulla pagina.
      type: TRASCINAMENTO_ATTIVO ? "wheel,touch,pointer" : "wheel",
      ignore: "a, button",
      dragMinimum: 6,
      preventDefault: true,
      onWheel: (self) => {
        const asseX = Math.abs(self.deltaX) > Math.abs(self.deltaY);
        const deltaPx = asseX ? self.deltaX : self.deltaY;
        const velocitaPx = asseX ? self.velocityX : self.velocityY;
        spingi(deltaPx / pxPerAnnoRef.current);
        velocitaRef.current = velocitaPx / pxPerAnnoRef.current;
      },
      onDrag: (self) => {
        spingi(-self.deltaX / pxPerAnnoRef.current);
        velocitaRef.current = -self.velocityX / pxPerAnnoRef.current;
      },
    });

    const tick = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60;

      // Il momento residuo: se non arriva altro input, `obiettivo` continua
      // a scivolare per un po' invece di fermarsi di scatto al rilascio —
      // stessa `spingi()` dell'input diretto, quindi rispetta l'elastico e
      // il salto allo stesso modo.
      if (Math.abs(velocitaRef.current) > MOMENTO_SOGLIA) {
        spingi(velocitaRef.current * dt);
        velocitaRef.current *= Math.pow(MOMENTO_DECADIMENTO, dt);
      } else {
        velocitaRef.current = 0;
      }

      // Rilassamento continuo verso il capo: se `obiettivo` è oltre i
      // confini e non arriva altro input in questo frame, la molla torna da
      // sola invece di restare tesa in attesa di un altro evento.
      if (obiettivoRef.current > fine) {
        obiettivoRef.current -= (obiettivoRef.current - fine) * smorza(RILASSAMENTO_BORDO, dt);
      } else if (obiettivoRef.current < inizio) {
        obiettivoRef.current += (inizio - obiettivoRef.current) * smorza(RILASSAMENTO_BORDO, dt);
      }

      visibileRef.current += (obiettivoRef.current - visibileRef.current) * smorza(SMORZAMENTO, dt);

      const posizioneAnnoPx = origineAnnoRef.current + (visibileRef.current - inizio) * pxPerAnnoRef.current;
      const dx = puntoLetturaRef.current - posizioneAnnoPx;
      scorrimentoPxRef.current = dx;
      pista.style.setProperty("--scorrimento", `${dx}px`);

      const nuovoCorrente = Math.min(fine, Math.max(inizio, Math.round(visibileRef.current)));
      setCorrente((precedente) => (precedente === nuovoCorrente ? precedente : nuovoCorrente));

      const nuovoDente = Math.floor((visibileRef.current - inizio) * 12);
      if (nuovoDente !== denteRef.current) {
        denteRef.current = nuovoDente;
        // Nessuna soglia di velocità: sospendere il tick durante un fling
        // sembrava un bug, non un effetto. Il throttle in useSuonoBreve
        // resta l'unico limite alla frequenza (vedi lib/suono.ts). Il verso
        // del movimento intona il tick invece: più acuto avanti, più grave
        // indietro, con un margine di ±TICK_DETUNE_CENTI raggiunto alla
        // velocità di riferimento.
        if (!mutoRef.current) {
          const velocitaIstantanea = (visibileRef.current - ultimoVisibileRef.current) / dt;
          const intensita = Math.min(1, Math.abs(velocitaIstantanea) / TICK_DETUNE_VELOCITA_RIFERIMENTO);
          const detune = Math.sign(velocitaIstantanea) * intensita * TICK_DETUNE_CENTI;
          suona(detune);
        }
      }
      ultimoVisibileRef.current = visibileRef.current;

      // Scala diretta dei dentini + enfasi ai bordi (§2/§4 del feedback).
      const eccessoVisibile =
        visibileRef.current > fine
          ? visibileRef.current - fine
          : visibileRef.current < inizio
            ? inizio - visibileRef.current
            : 0;
      const eccessoNormalizzato = Math.min(1, eccessoVisibile / ELASTICO_ANNI);
      const latoForzato: -1 | 0 | 1 =
        visibileRef.current > fine ? 1 : visibileRef.current < inizio ? -1 : 0;

      for (const { el, t } of dentiRef.current) {
        const scala =
          fattoreFocus(t, visibileRef.current) *
          fattoreBordo(t, inizio, fine, eccessoNormalizzato, latoForzato);
        el.style.setProperty("--focus", scala.toFixed(3));
      }
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("resize", misura);
      window.removeEventListener("keydown", onKeyDown);
      observer.kill();
      gsap.ticker.remove(tick);
    };
  }, { scope: binarioRef });

  return (
    <ContestoTimeline.Provider value={{ corrente, voceInEvidenza, mostraVoce, nascondiVoce, muto, setMuto }}>
      <div ref={binarioRef} className={styles.binario}>
        <div
          ref={pistaRef}
          className={styles.pista}
          style={{ "--pista": larghezzaPista } as CSSProperties}
        >
          {nastro}
        </div>
      </div>

      <span ref={testinaRef} className={styles.testina} aria-hidden="true" />
      <PannelloMateriale />

      {children}
    </ContestoTimeline.Provider>
  );
}
