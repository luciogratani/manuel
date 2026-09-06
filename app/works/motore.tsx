"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Observer } from "@/lib/gsap";
import {
  ELASTICO_PX,
  FATTORE_ROTELLA,
  RILASSAMENTO_BORDO,
  RITARDO_BANDA,
  SENSIBILITA_TOCCO,
  SMORZAMENTO,
  VAI_A_CATEGORIA,
} from "@/lib/indice";
import { compattoAttivo, motoRidotto } from "@/lib/movimento";
import { ContestoIndice } from "./contesto";
import styles from "./page.module.css";

// Il motore dell'indice. Trascina la striscia orizzontale delle opere in
// CONTINUO: la rotella muove un obiettivo in pixel, la posizione lo insegue
// smorzata, e ai due capi c'è un elastico. Nessun cursore che salta di opera
// in opera — quella era la mensola, dove il passo serve ad allineare ogni
// foto alla lettura; qui non c'è niente da allineare.
//
// Il markup pesante resta server-renderizzato e arriva come `children`: le
// celle con le loro `<Image>` non hanno ragione di finire nel bundle client.
// Stessa scelta del nastro della timeline e della mensola.
//
// ── Due Observer, non uno ───────────────────────────────────────────────────
// Ogni cella è un `<Link>`, e GSAP Observer con `ignore: "a, button"` scarta
// OGNI evento — rotella inclusa — il cui target sia dentro un `<a>`: scorrere
// col cursore sopra un'opera non muoveva niente (stesso bug già visto sulla
// timeline e sulla mensola). La rotella non attiva mai una navigazione,
// quindi non c'è ragione di ignorarla lì; il tocco sì, o un tap-per-navigare
// rischierebbe di partire come trascinamento. Due istanze sullo stesso
// target: una per la rotella senza `ignore`, una per il tocco con `ignore`.
//
// ── Scorrimento e hover non si conoscono ────────────────────────────────────
//   · Dove si sposta la striscia? Lo decide solo lo scorrimento.
//   · Quale opera è "in evidenza"? Lo decide solo l'hover: l'attenuazione
//     delle altre è pura CSS (`:has(:hover)`), e la banda mostra il testo
//     dell'opera in hover o niente. L'hover si ascolta sul contenitore
//     perché le celle sono server-renderizzate.
//
// L'hover che arriva alla banda è RITARDATO (`RITARDO_BANDA`): spazzando il
// mouse lungo la striscia si passa sopra molte opere al secondo, e senza
// l'attesa la banda le inseguirebbe tutte, riavviando una dissolvenza ogni
// volta. Chi passa non conta; chi si ferma sì. Uscire dalla striscia è
// immediato — non è una spazzata.
//
// ── La categoria (dalla banda) ─────────────────────────────────────────────
// Sceglierne una nella banda fa due cose: le opere fuori categoria prendono
// `data-fuoricategoria` e il CSS le attenua, e la striscia scorre gentile
// fino alla prima che vi rientra. È una lente sull'archivio, non un filtro
// che taglia: le opere restano tutte, al loro posto. Un input manuale annulla
// lo scorrimento verso la categoria (`gsap.killTweensOf` in `spingi`).
// MOCK: il criterio è il `medium` dell'opera; diventerà un tag curato.

/** Il fattore di smorzamento indipendente dal frame rate. */
function smorza(fattore: number, dt: number) {
  return 1 - Math.pow(1 - fattore, dt * 60);
}

/** La resistenza oltre i capi: cresce con lo sconfinamento, così il primo e
 *  l'ultimo si sentono senza essere un muro. */
function frena(oltre: number) {
  return 1 / (1 + oltre / ELASTICO_PX);
}

export function MotoreIndice({
  children,
  banda,
  iniziale,
}: {
  children: ReactNode;
  banda: ReactNode;
  /** Posizione di partenza in pixel — zero, la striscia al suo posto naturale. */
  iniziale: number;
}) {
  const binarioRef = useRef<HTMLDivElement>(null);
  const grigliaRef = useRef<HTMLDivElement>(null);

  /** L'opera in evidenza per la banda, già ritardata. `sottoRef` è invece
   *  quella FISICAMENTE sotto il puntatore ora, senza attesa: serve a non
   *  riarmare il timer quando il puntatore si muove dentro la stessa cella. */
  const [hover, setHover] = useState<number | null>(null);
  const sottoRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Lo scorrimento in pixel: `posizione` insegue `obiettivo`, e la striscia
   *  è traslata di `-posizione`. */
  const posizioneRef = useRef(iniziale);
  const obiettivoRef = useRef(iniziale);

  /** La categoria scelta nella banda, o `null`. Vive qui perché serve a due
   *  cose che stanno in questo componente: attenuare le celle e scorrere. */
  const [categoria, setCategoria] = useState<string | null>(null);
  const scegliCategoria = useCallback((c: string | null) => setCategoria(c), []);

  /** Il tween dello scorrimento gentile fino alla prima opera di una
   *  categoria. In un ref perché lo crea l'effetto qui sotto ma lo annulla
   *  `spingi` (un input manuale riprende il controllo). */
  const vaiTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const binario = binarioRef.current;
      const griglia = grigliaRef.current;
      if (!binario || !griglia) return;
      // Sotto la soglia compatta l'indice è una lista in flusso verticale
      // (vedi indice-compatta.tsx): niente da spostare, e l'Observer sotto
      // resterebbe comunque agganciato a `.pagina` — vedi il commento
      // accanto a SOGLIA_COMPATTA in lib/movimento.ts.
      if (compattoAttivo()) return;

      const ridotto = motoRidotto();
      const celle = gsap.utils.toArray<HTMLElement>(`.${styles.cella}`, griglia);
      if (celle.length === 0) return;

      const pagina = binario.closest<HTMLElement>(`.${styles.pagina}`) ?? binario;

      /** Quanto la striscia può scorrere: la sua larghezza vera meno la
       *  finestra visibile. Misurata a trasformazione azzerata. */
      let scorrimentoMax = 0;
      const misura = () => {
        gsap.set(griglia, { x: 0 });
        scorrimentoMax = Math.max(0, griglia.scrollWidth - binario.clientWidth);
      };
      misura();
      window.addEventListener("resize", misura);

      /** Sposta l'obiettivo di `dpx`, con l'elastico se è già oltre un capo.
       *  Un input manuale annulla lo scorrimento verso una categoria: chi
       *  scorre riprende il controllo. */
      const spingi = (dpx: number) => {
        vaiTweenRef.current?.kill();
        const o = obiettivoRef.current;
        const oltre = o < 0 ? -o : o > scorrimentoMax ? o - scorrimentoMax : 0;
        obiettivoRef.current += dpx * (oltre > 0 ? frena(oltre) : 1);
      };

      const osservatoreRotella = ridotto
        ? null
        : Observer.create({
            target: pagina,
            type: "wheel",
            onWheel: (self) => {
              // Scorrere GIÙ (o due dita verso sinistra) avanza nell'archivio,
              // dalla più recente verso le più vecchie: stesso verso del
              // nastro della timeline.
              const asseX = Math.abs(self.deltaX) > Math.abs(self.deltaY);
              const grezzo = asseX ? self.deltaX : self.deltaY;
              spingi(grezzo * FATTORE_ROTELLA);
            },
          });

      const osservatoreTocco = ridotto
        ? null
        : Observer.create({
            target: pagina,
            type: "touch",
            ignore: "a, button",
            onChange: (self) => {
              spingi(-self.deltaX * SENSIBILITA_TOCCO);
            },
          });

      /** Posa l'evidenza sulla banda: dopo `RITARDO_BANDA` se è un'opera,
       *  subito se è l'uscita. Il timer pendente si annulla ad ogni cambio,
       *  così una spazzata veloce non lascia dietro di sé una fila di
       *  aggiornamenti in coda. */
      const posa = (i: number | null) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (i === null) {
          setHover(null);
          return;
        }
        timerRef.current = setTimeout(() => setHover(i), RITARDO_BANDA);
      };

      /** `sottoRef` è la cella sotto il puntatore ORA — muoversi dentro la
       *  stessa non riarma niente.
       *
       *  Sopra una fuga fra due lastre il puntatore non è dentro nessuna
       *  `.cella`: si tiene l'ultima invece di svuotare la banda, o spazzando
       *  la striscia si vedrebbe un lampo a vuoto fra un'opera e l'altra. Si
       *  svuota solo uscendo dalla griglia (`pointerleave`, qui sotto). */
      const alPuntatore = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const cella = (e.target as Element | null)?.closest<HTMLElement>(`.${styles.cella}`);
        if (!cella) return;
        const i = celle.indexOf(cella);
        if (i === sottoRef.current) return;
        sottoRef.current = i;
        posa(i);
      };
      const fuoriDallaGriglia = () => {
        if (sottoRef.current === null) return;
        sottoRef.current = null;
        posa(null);
      };
      griglia.addEventListener("pointermove", alPuntatore, { passive: true });
      griglia.addEventListener("pointerleave", fuoriDallaGriglia);

      const tick = () => {
        const dt = gsap.ticker.deltaRatio(60) / 60;

        // Rilassamento continuo verso il capo: se l'obiettivo è oltre i confini
        // e non arriva altro input, la molla torna da sola invece di restare
        // tesa in attesa. A moto ridotto il capo è un muro.
        if (ridotto) {
          obiettivoRef.current = Math.min(scorrimentoMax, Math.max(0, obiettivoRef.current));
        } else if (obiettivoRef.current > scorrimentoMax) {
          obiettivoRef.current -=
            (obiettivoRef.current - scorrimentoMax) * smorza(RILASSAMENTO_BORDO, dt);
        } else if (obiettivoRef.current < 0) {
          obiettivoRef.current -= obiettivoRef.current * smorza(RILASSAMENTO_BORDO, dt);
        }

        posizioneRef.current +=
          (obiettivoRef.current - posizioneRef.current) * (ridotto ? 1 : smorza(SMORZAMENTO, dt));

        griglia.style.transform = `translateX(${(-posizioneRef.current).toFixed(1)}px)`;
      };

      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("resize", misura);
        griglia.removeEventListener("pointermove", alPuntatore);
        griglia.removeEventListener("pointerleave", fuoriDallaGriglia);
        if (timerRef.current) clearTimeout(timerRef.current);
        osservatoreRotella?.kill();
        osservatoreTocco?.kill();
        gsap.ticker.remove(tick);
      };
    },
    { scope: binarioRef },
  );

  // La categoria: marca le celle fuori e porta in vista la prima dentro.
  // Un `useEffect` e non l'`useGSAP` sopra, che gira una volta sola: qui
  // serve rigirare ad ogni cambio di categoria, senza ricreare gli Observer.
  useEffect(() => {
    const binario = binarioRef.current;
    const griglia = grigliaRef.current;
    if (!binario || !griglia || compattoAttivo()) return;

    const celle = Array.from(
      griglia.querySelectorAll<HTMLElement>(`.${styles.cella}`),
    );
    if (celle.length === 0) return;

    let primo = -1;
    for (let i = 0; i < celle.length; i++) {
      const dentro = categoria === null || celle[i].dataset.medium === categoria;
      if (dentro) {
        delete celle[i].dataset.fuoricategoria;
        if (categoria !== null && primo < 0) primo = i;
      } else {
        celle[i].dataset.fuoricategoria = "";
      }
    }

    // `primo <= 0`: nessuna categoria, o la prima dentro è già in testa.
    // `offsetLeft` è la quota di layout, indifferente al `transform` che il
    // motore scrive: la differenza fra le due celle è quanto scorrere.
    if (primo <= 0) return;
    const max = Math.max(0, griglia.scrollWidth - binario.clientWidth);
    const bersaglio = Math.min(
      max,
      Math.max(0, celle[primo].offsetLeft - celle[0].offsetLeft),
    );

    vaiTweenRef.current?.kill();
    if (motoRidotto()) {
      obiettivoRef.current = bersaglio;
      return;
    }
    // Il tween gira su un oggetto suo e riversa il valore nell'obiettivo a
    // ogni frame: il `tick` del motore poi ci porta la posizione, con la sua
    // stessa fisica. `power3.inOut` — parte piano, arriva piano: è il sito che
    // accompagna, non l'utente che spinge.
    const proxy = { v: obiettivoRef.current };
    vaiTweenRef.current = gsap.to(proxy, {
      v: bersaglio,
      duration: VAI_A_CATEGORIA.durata,
      ease: VAI_A_CATEGORIA.ease,
      onUpdate: () => {
        obiettivoRef.current = proxy.v;
      },
    });
    return () => {
      vaiTweenRef.current?.kill();
    };
  }, [categoria]);

  return (
    <ContestoIndice.Provider value={{ hover, categoria, scegliCategoria }}>
      <div ref={binarioRef} className={styles.binario}>
        <div
          ref={grigliaRef}
          className={styles.griglia}
          data-categoria={categoria ?? undefined}
        >
          {children}
        </div>
      </div>
      {banda}
    </ContestoIndice.Provider>
  );
}
