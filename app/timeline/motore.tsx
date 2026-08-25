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
  SENSIBILITA_TOCCO,
  SALTO_ATTIVO,
  RITARDO_NASCONDI_MS,
  MOMENTO_DECADIMENTO,
  MOMENTO_SOGLIA,
  FERMO_SOGLIA,
  PASSO_TASTIERA,
  TRASCINAMENTO_ATTIVO,
  TICK_DETUNE_CENTI,
  TICK_DETUNE_VELOCITA_RIFERIMENTO,
  FOCUS_RAGGIO_MESI,
  FOCUS_AGGIUNTA,
  LETTURA_PIENA,
  LETTURA_MIN,
  SOGLIA_SCRITTURA,
  PASSO,
  INGRESSO,
  BORDO_RAGGIO_ANNI,
  BORDO_MIN,
  BORDO_ENFASI_PICCO,
  type VoceTimeline,
} from "@/lib/timeline";
import { compattoAttivo, motoRidotto } from "@/lib/movimento";
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

/** Smorzamento/rilassamento/decadimento indipendenti dal refresh rate: un
 *  fattore fisso applicato una volta a 60fps si applicherebbe il doppio
 *  delle volte al secondo su uno schermo a 120Hz. */
function smorza(fattore: number, dt: number) {
  return 1 - Math.pow(1 - fattore, dt * 60);
}

/** Il fuoco attorno al nonio, 0 lontano e 1 sotto la testina. Campana di
 *  Lorentz, non coseno: sale ripida vicino al centro e ha una coda lunga e
 *  morbida invece di un taglio netto al raggio — "centro più chiuso, bordi
 *  lunghi e morbidi". Chi chiama decide cosa farne: qui diventa un'AGGIUNTA
 *  di altezza uguale per tutti i dentini, non un fattore di scala (vedi
 *  FOCUS_AGGIUNTA). */
function campanaFocus(t: number, visibile: number) {
  const distanzaMesi = Math.abs(t - visibile) * 12;
  const normalizzata = distanzaMesi / FOCUS_RAGGIO_MESI;
  return 1 / (1 + normalizzata * normalizzata);
}

/** La zona di lettura: 1 nella fascia centrale, poi giù fino a LETTURA_MIN al
 *  bordo del binario. `distanza` è già normalizzata — 0 al nonio, 1 al bordo
 *  dal lato in cui si trova l'elemento, così la zona resta simmetrica anche
 *  se un giorno il nonio non fosse più al centro. */
function fattoreLettura(distanza: number) {
  if (distanza <= LETTURA_PIENA) return 1;
  const oltre = Math.min(1, (distanza - LETTURA_PIENA) / (1 - LETTURA_PIENA));
  // Quadratica: la dissolvenza comincia impercettibile e si consuma negli
  // ultimi pixel — "margini generosi, non un taglio stretto".
  return 1 - (1 - LETTURA_MIN) * oltre * oltre;
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
  if (!forzatoQui) return assottigliamento;

  // Interpolato fra i due regimi, non scelto con un `if`: a eccesso zero il
  // valore È l'assottigliamento, quindi non c'è scalino nell'istante in cui
  // `visibile` supera il capo. Prima il ramo enfasi partiva da `1 +` invece
  // che da dove finiva l'altro, e il fattore saltava da BORDO_MIN a 1 in un
  // frame — tutta la fascia del raggio insieme, proprio mentre la molla
  // inizia a cedere. Gli estremi restano quelli di prima.
  const enfasi = 1 + (BORDO_ENFASI_PICCO - 1) * (1 - normalizzata);
  return assottigliamento + (enfasi - assottigliamento) * eccessoNormalizzato;
}

/** Un elemento del nastro che il motore aggiorna ad ogni frame: dentini, anni
 *  e voci insieme, perché la zona di lettura li tratta allo stesso modo.
 *  `base` è l'altezza autorata nel foglio (0 per ciò che dentino non è): il
 *  fuoco è un'aggiunta in pixel, e per tradurla in `scaleY` serve sapere da
 *  cosa si parte — letta da lì, non ricopiata qui. `focus`/`lettura` sono
 *  l'ultimo valore scritto, per non riscrivere ciò che non è cambiato. */
type ElementoNastro = {
  el: HTMLElement;
  t: number;
  base: number;
  focus: number;
  lettura: number;
};

type Props = {
  inizio: number;
  fine: number;
  correnteIniziale: number;
  /** `--pista`, `--voce`, `--dx-iniziale`: le misure del tracciato, calcolate
   *  in `page.tsx` dalle costanti di `lib/timeline.ts` — il foglio non ne
   *  tiene una copia. */
  stilePista: CSSProperties;
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
  stilePista,
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
  // Con quale sensibilità è nato il momento: il rilascio di un dito (1:1) non
  // può decelerare con la sensibilità della rotella, sarebbe uno strappo.
  const sensibilitaMomentoRef = useRef(SENSIBILITA_GENERALE);
  const denteRef = useRef(Math.floor((correnteIniziale - inizio) * 12));
  const ultimoVisibileRef = useRef(correnteIniziale); // per il verso/intensità del tick

  // Misure reali, ricalcolate al resize (vedi commento in testa al file).
  const scorrimentoPxRef = useRef(0);
  const puntoLetturaRef = useRef(0);
  const origineAnnoRef = useRef(0);
  const pxPerAnnoRef = useRef(1);
  const larghezzaBinarioRef = useRef(0);
  const elementiRef = useRef<ElementoNastro[]>([]);

  // Il riaggancio dopo il fling (vedi `contesto.ts`). Il puntatore sta in un
  // ref e non in uno stato: si aggiorna ad ogni movimento del mouse, e farne
  // stato sarebbe un render per pixel.
  const puntatoreRef = useRef<{ x: number; y: number } | null>(null);
  const inMotoRef = useRef(false);
  const [riaggancio, setRiaggancio] = useState(0);
  const puntatore = useCallback(() => puntatoreRef.current, []);

  // L'obiettivo del motore è un ref, non uno stato: `vaiA` è il solo modo in
  // cui il resto della pagina può muoverlo (oggi il focus da tastiera, domani
  // un'ancora o un indice). Il ticker ci arriva smorzato come da qualunque
  // altro input — non è un salto scritto a mano.
  const obiettivoDaFuoriRef = useRef<number | null>(null);
  const vaiA = useCallback((anno: number) => {
    obiettivoDaFuoriRef.current = anno;
  }, []);

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
    // Sotto la soglia compatta il nastro è una lista in flusso verticale
    // (vedi il blocco `.compatta` in page.tsx): l'Observer sotto resterebbe
    // comunque agganciato a `.pagina` — vedi SOGLIA_COMPATTA in
    // lib/movimento.ts. `elementiRef` resta `[]`, quindi anche il secondo
    // `useGSAP` (l'ingresso) si ferma da sé sul suo stesso controllo.
    if (compattoAttivo()) return;

    // Letta una volta al montaggio (vedi `motoRidotto()`): niente momento
    // residuo, nessun inseguimento smorzato, elastico che non oltrepassa il
    // capo. Gli stati restano gli stessi, sparisce il percorso per arrivarci.
    const ridotto = motoRidotto();

    // Tutto ciò che sta sul nastro a un'ascissa temporale: dentini, etichette
    // degli anni, voci. `data-t` è l'unica cosa che li accomuna, ed è quanto
    // basta perché la posizione a schermo si ricavi dai numeri già misurati
    // — nessun getBoundingClientRect per elemento per frame.
    const elementi: ElementoNastro[] = [];
    pista.querySelectorAll<HTMLElement>("[data-t]").forEach((el) => {
      const t = parseFloat(el.dataset.t ?? "");
      if (!Number.isNaN(t)) elementi.push({ el, t, base: 0, focus: -1, lettura: -1 });
    });
    elementiRef.current = elementi;

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
      larghezzaBinarioRef.current = rBinario.width;
      puntoLetturaRef.current = testina.getBoundingClientRect().left - rBinario.left;
      origineAnnoRef.current = rA.left - rBinario.left - scorrimentoPxRef.current;

      // L'altezza autorata dei dentini si legge dal foglio invece di tenere
      // qui una copia dei 6/12/18px. `getComputedStyle().height` è l'altezza
      // usata, non toccata dal `transform` già applicato. Al resize cambia,
      // perché cambia la scala in rem del sito.
      for (const e of elementi) {
        if (!e.el.classList.contains(styles.dente)) continue;
        e.base = parseFloat(getComputedStyle(e.el).height) || 0;
      }
    };

    misura();
    window.addEventListener("resize", misura);

    /** Il nucleo della fisica: un delta in anni (già in quella unità, non in
     *  pixel) che spinge `obiettivo`, con sensibilità generale, frizione
     *  elastica ai capi e accumulo per il salto. Usato sia dall'input diretto
     *  (`spingi`) sia dal momento residuo dopo il rilascio (nel ticker) —
     *  stessa fisica, non due sistemi paralleli. */
    const spingi = (deltaAnniGrezzi: number, sensibilita = SENSIBILITA_GENERALE) => {
      const deltaAnni = deltaAnniGrezzi * sensibilita;
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

      if (SALTO_ATTIVO && sforzoRef.current > SFORZO_SALTO) {
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
      // Con un modificatore la freccia non è nostra: su macOS Cmd+← è
      // "indietro" nel browser, Alt+← altrove.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") {
        spingi(-PASSO_TASTIERA);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        spingi(PASSO_TASTIERA);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Ascolta sulla pagina, non sul solo `.binario`: testa e piede sono suoi
    // fratelli con `z-index`, e con il puntatore lì sopra la rotella non
    // arrivava a nessuno — la pagina sembrava bloccata proprio dove ci sono i
    // due link. `ignore` protegge comunque link e bottoni.
    const pagina = binario.closest<HTMLElement>(`.${styles.pagina}`) ?? binario;

    // Solo mouse, e solo la posizione: il tocco non ha un hover da
    // riagganciare. `pointerleave` sul documento azzera, altrimenti uscendo
    // dalla finestra resterebbe memorizzato un punto che non indica più
    // niente.
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      puntatoreRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerLeave = () => {
      puntatoreRef.current = null;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    // `pointer` è il trascinamento col mouse, spento perché non tarato
    // (TRASCINAMENTO_ATTIVO); `touch` è il dito, ed è l'unico ingresso che
    // esiste su un telefono — spegnerlo insieme al mouse rendeva la pagina
    // immobile lì, senza rotella né tastiera a fare da alternativa.
    const daTocco = (e: Event) =>
      e.type.startsWith("touch") || (e as PointerEvent).pointerType === "touch";

    // ── Due Observer, non uno ───────────────────────────────────────────────
    // `ignore: "a, button"` protegge il tap-per-navigare da un drag che parte
    // per sbaglio sopra un link: serve solo al trascinamento. La rotella non
    // attiva mai una navigazione, quindi ignorarla sui link era un bug — il
    // nastro restava fermo scorrendo col cursore sopra il titolo di una voce,
    // che è quasi tutta la superficie cliccabile della pista. GSAP Observer
    // non differenzia `ignore` per tipo di evento nella stessa istanza, quindi
    // sono due istanze sullo stesso target invece di una.
    const osservatoreRotella = Observer.create({
      target: pagina,
      type: "wheel",
      preventDefault: true,
      onWheel: (self) => {
        const asseX = Math.abs(self.deltaX) > Math.abs(self.deltaY);
        const deltaPx = asseX ? self.deltaX : self.deltaY;
        const velocitaPx = asseX ? self.velocityX : self.velocityY;
        spingi(deltaPx / pxPerAnnoRef.current);
        sensibilitaMomentoRef.current = SENSIBILITA_GENERALE;
        velocitaRef.current = ridotto ? 0 : velocitaPx / pxPerAnnoRef.current;
      },
    });

    const osservatoreTocco = Observer.create({
      target: pagina,
      type: TRASCINAMENTO_ATTIVO ? "touch,pointer" : "touch",
      ignore: "a, button",
      dragMinimum: 6,
      preventDefault: true,
      onDrag: (self) => {
        const sensibilita = daTocco(self.event) ? SENSIBILITA_TOCCO : SENSIBILITA_GENERALE;
        spingi(-self.deltaX / pxPerAnnoRef.current, sensibilita);
        sensibilitaMomentoRef.current = sensibilita;
        velocitaRef.current = ridotto ? 0 : -self.velocityX / pxPerAnnoRef.current;
      },
    });

    const tick = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60;

      // Un obiettivo arrivato da fuori (`vaiA`) vince sul resto e azzera il
      // momento: è una destinazione, non una spinta.
      if (obiettivoDaFuoriRef.current !== null) {
        obiettivoRef.current = obiettivoDaFuoriRef.current;
        obiettivoDaFuoriRef.current = null;
        velocitaRef.current = 0;
      }

      // Il momento residuo: se non arriva altro input, `obiettivo` continua
      // a scivolare per un po' invece di fermarsi di scatto al rilascio —
      // stessa `spingi()` dell'input diretto, e con la stessa sensibilità con
      // cui il gesto era nato, quindi rispetta l'elastico allo stesso modo.
      if (Math.abs(velocitaRef.current) > MOMENTO_SOGLIA) {
        spingi(velocitaRef.current * dt, sensibilitaMomentoRef.current);
        velocitaRef.current *= Math.pow(MOMENTO_DECADIMENTO, dt);
      } else {
        velocitaRef.current = 0;
      }

      // Rilassamento continuo verso il capo: se `obiettivo` è oltre i
      // confini e non arriva altro input in questo frame, la molla torna da
      // sola invece di restare tesa in attesa di un altro evento. A moto
      // ridotto la molla non esiste: il capo è un muro.
      if (ridotto) {
        obiettivoRef.current = Math.min(fine, Math.max(inizio, obiettivoRef.current));
      } else if (obiettivoRef.current > fine) {
        obiettivoRef.current -= (obiettivoRef.current - fine) * smorza(RILASSAMENTO_BORDO, dt);
      } else if (obiettivoRef.current < inizio) {
        obiettivoRef.current += (inizio - obiettivoRef.current) * smorza(RILASSAMENTO_BORDO, dt);
      }

      visibileRef.current +=
        (obiettivoRef.current - visibileRef.current) * (ridotto ? 1 : smorza(SMORZAMENTO, dt));

      // Il nastro è fermo quando non ha più momento E ha finito di inseguire
      // l'obiettivo. Sul fronte di salita moto→fermo le voci ricontrollano se
      // il puntatore è finito dentro di loro mentre scorrevano.
      const fermo =
        velocitaRef.current === 0 &&
        Math.abs(obiettivoRef.current - visibileRef.current) < FERMO_SOGLIA;
      if (inMotoRef.current && fermo) setRiaggancio((n) => n + 1);
      inMotoRef.current = !fermo;

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

      // Un giro solo su tutto il nastro. La posizione a schermo di ogni
      // elemento è analitica — origine misurata, passo misurato, scorrimento
      // di questo frame — quindi non costa un getBoundingClientRect a testa.
      // `pxPerAnno / PASSO` è la scala in rem del sito, misurata e non
      // assunta: serve a portare FOCUS_AGGIUNTA dai px di riferimento a
      // quelli veri.
      const aggiuntaPx = FOCUS_AGGIUNTA * (pxPerAnnoRef.current / PASSO);
      const puntoLettura = puntoLetturaRef.current;
      const mezzoSinistra = puntoLettura;
      const mezzoDestra = larghezzaBinarioRef.current - puntoLettura;

      for (const e of elementiRef.current) {
        const x =
          origineAnnoRef.current + (e.t - inizio) * pxPerAnnoRef.current + scorrimentoPxRef.current;
        const mezzo = x < puntoLettura ? mezzoSinistra : mezzoDestra;
        const distanza = mezzo > 0 ? Math.min(1, Math.abs(x - puntoLettura) / mezzo) : 1;

        const lettura = fattoreLettura(distanza);
        if (Math.abs(lettura - e.lettura) > SOGLIA_SCRITTURA) {
          e.lettura = lettura;
          e.el.style.setProperty("--lettura", lettura.toFixed(3));
        }

        // Il fuoco è solo dei dentini: le etichette e le voci non si scalano.
        if (e.base <= 0) continue;
        const focus =
          (1 + (aggiuntaPx * campanaFocus(e.t, visibileRef.current)) / e.base) *
          fattoreBordo(e.t, inizio, fine, eccessoNormalizzato, latoForzato);
        if (Math.abs(focus - e.focus) > SOGLIA_SCRITTURA) {
          e.focus = focus;
          e.el.style.setProperty("--focus", focus.toFixed(3));
        }
      }
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("resize", misura);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      osservatoreRotella.kill();
      osservatoreTocco.kill();
      gsap.ticker.remove(tick);
    };
  }, { scope: binarioRef });

  // ── L'ingresso: lo strumento si costruisce da sé ──────────────────────────
  // Sta in un `useGSAP` suo, dopo quello del motore, perché ha bisogno di ciò
  // che il motore ha appena misurato — dove cade il nonio, dove sta la pista,
  // quali elementi ci sono sopra e a che ascissa.
  //
  // Non contende NIENTE al motore: quello scrive `--focus` e `--lettura` ad
  // ogni frame, questo scrive `--ingresso`, e il foglio moltiplica. È lo
  // stesso idioma che la pagina usa già due volte (`--lettura` per
  // `--opacita-base`, il fuoco additivo per l'altezza autorata): due segnali
  // che non sanno l'uno dell'altro, e un default che per entrambi vale
  // "nessun effetto".
  useGSAP(
    () => {
      const binario = binarioRef.current;
      const pista = pistaRef.current;
      const testina = testinaRef.current;
      if (!binario || !pista || !testina) return;
      if (compattoAttivo()) return;

      const asse = pista.querySelector<HTMLElement>(`.${styles.asse}`);
      const elementi = elementiRef.current;
      if (!asse || elementi.length === 0) return;

      const denti = elementi.filter((e) => e.base > 0);
      const apparato = elementi.filter((e) => e.base <= 0);
      const partenza = visibileRef.current;

      /** Il ritardo dell'onda: la distanza in anni dal nonio, la stessa
       *  `|t − visibile|` del fuoco. Non uno stagger d'indice — un dentino e
       *  la voce che gli sta sotto devono partire insieme perché condividono
       *  l'ascissa, non perché sono vicini nel DOM. */
      const onda = (t: number) =>
        Math.min(Math.abs(t - partenza) * INGRESSO.ondaAnni, INGRESSO.ondaMax);

      const posa = () => {
        gsap.set(testina, { opacity: 1 });
        gsap.set(asse, { clipPath: "none" });
        gsap.set(
          elementi.map((e) => e.el),
          { "--ingresso": 1 },
        );
      };

      // §9.4: stesso stato finale, nessun percorso per arrivarci.
      if (motoRidotto()) {
        posa();
        return;
      }

      // L'asse cresce in pixel e non in scala: il ritaglio parte chiuso sul
      // nonio e si apre di mezza larghezza di binario per parte, che è quanto
      // basta a coprire il visibile. Oltre non c'è niente da guardare, quindi
      // il ritaglio si toglie del tutto invece di continuare fino ai capi.
      const nonioSullaPista = puntoLetturaRef.current - scorrimentoPxRef.current;
      const larghezzaPista = pista.offsetWidth;
      const mezzo = binario.getBoundingClientRect().width / 2;

      gsap.set(asse, {
        "--asse-sx": `${nonioSullaPista}px`,
        "--asse-dx": `${larghezzaPista - nonioSullaPista}px`,
      });
      gsap.set(testina, { opacity: 0 });
      gsap.set(
        elementi.map((e) => e.el),
        { "--ingresso": 0 },
      );

      const tl = gsap.timeline();

      // 1. La testina: è l'origine, quindi arriva prima di ciò che ne nasce.
      tl.to(testina, { opacity: 1, duration: INGRESSO.testina, ease: "power1.out" }, 0)
        // 2. L'asse si allunga da sotto di lei verso i due capi insieme.
        .to(
          asse,
          {
            "--asse-sx": `${Math.max(0, nonioSullaPista - mezzo)}px`,
            "--asse-dx": `${Math.max(0, larghezzaPista - nonioSullaPista - mezzo)}px`,
            duration: INGRESSO.asse,
            ease: "power2.out",
          },
          INGRESSO.tAsse,
        )
        .set(asse, { clipPath: "none" })
        // 3. I dentini scendono dall'asse, con l'onda che corre dal nonio.
        .to(
          denti.map((e) => e.el),
          {
            "--ingresso": 1,
            duration: INGRESSO.dente,
            ease: "power2.out",
            stagger: (i: number) => onda(denti[i].t),
          },
          INGRESSO.tDenti,
        )
        // 4. Numeri e voci, ciascuno dietro il proprio dentino.
        .to(
          apparato.map((e) => e.el),
          {
            "--ingresso": 1,
            duration: INGRESSO.apparato,
            ease: "power1.out",
            stagger: (i: number) => onda(apparato[i].t),
          },
          INGRESSO.tDenti + INGRESSO.ritardoApparato,
        );

      return () => {
        tl.kill();
      };
    },
    { scope: binarioRef },
  );

  return (
    <ContestoTimeline.Provider
      value={{
        corrente,
        voceInEvidenza,
        mostraVoce,
        nascondiVoce,
        riaggancio,
        puntatore,
        vaiA,
        muto,
        setMuto,
      }}
    >
      <div ref={binarioRef} className={styles.binario}>
        <div ref={pistaRef} className={styles.pista} style={stilePista}>
          {nastro}
        </div>
      </div>

      <span ref={testinaRef} className={styles.testina} aria-hidden="true" />
      <PannelloMateriale />

      {children}
    </ContestoTimeline.Provider>
  );
}
