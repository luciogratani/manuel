"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { SOGLIA, motoRidotto } from "@/lib/movimento";
import { Marchio } from "./marchio";
import styles from "./testa.module.css";

// L'header del sito, e insieme la sequenza con cui nasce.
//
// Le due cose stanno nello stesso file perché sono la stessa cosa: non c'è una
// nav della home che poi viene sostituita dall'header: c'è UN header, che
// sulla soglia entra in scena e altrove è già lì. Dissolverne uno per farne
// comparire un altro sarebbe una sostituzione travestita da transizione.
//
// ── La regola ────────────────────────────────────────────────────────────────
// L'header nasce sulla soglia; ovunque altro c'è già. Vivendo nel layout non si
// rimonta cambiando pagina, quindi il caso "torno alla home da /timeline" si
// risolve da sé: non c'è niente da sopprimere, semplicemente non ricomincia.
// Serve solo distinguere l'atterraggio a freddo sulla soglia da un arrivo per
// navigazione — ed è quello che fa la costante di modulo qui sotto, valutata
// una volta per caricamento di pagina e indifferente a ciò che accade dopo.

/** Vero solo se questo caricamento è atterrato sulla soglia. Sul server è
 *  falso, ma viene letto solo dentro `useGSAP`, cioè sul client. */
const ATTERRATO_SULLA_SOGLIA =
  typeof window !== "undefined" && window.location.pathname === "/";

/** La sequenza si suona una volta per caricamento, non una per montaggio. */
let giaNata = false;

const ROTTE = [
  ["archivio", "/works"],
  ["timeline", "/timeline"],
  ["about", "/about"],
];

/** Il modo ravvicinato (`/works/<opera>/<n>`) non porta l'header del sito: ha
 *  una testa sua, con un `← back` che è navigazione locale dentro l'opera.
 *  Sovrapporci le rotte del sito metterebbe due uscite diverse sulla stessa
 *  riga. */
function senzaTesta(percorso: string) {
  return percorso.split("/").filter(Boolean).length === 3 && percorso.startsWith("/works/");
}

export function Testa() {
  const percorso = usePathname();
  const testaRef = useRef<HTMLElement>(null);
  const marchioRef = useRef<HTMLAnchorElement>(null);
  const rotteRef = useRef<HTMLElement>(null);

  const soglia = percorso === "/";

  // ── L'header sopra una tinta ────────────────────────────────────────────
  // L'header è fisso e le pagine gli scorrono sotto: dove il fondo cambia
  // colore, il suo cambia con lui. Non è una rifinitura — l'inchiostro sul
  // rosso della chiusura di /about dà 3,12:1, che il WCAG boccia per il testo
  // normale, e l'header è testo normale.
  //
  // Il segnale è generico: qualunque elemento marcato `data-fondo="colore"`,
  // su qualunque pagina, ottiene lo stesso trattamento senza che l'header
  // debba conoscere /about.
  const [sopraColore, setSopraColore] = useState(false);

  useEffect(() => {
    const testa = testaRef.current;
    const zona = document.querySelector("[data-fondo='colore']");
    if (!testa || !zona) {
      setSopraColore(false);
      return;
    }

    // La radice dell'osservatore si stringe fino alla sola banda occupata
    // dall'header: così "sopra la tinta" significa davvero che il colore sta
    // dietro le lettere, e non che è comparso da qualche parte nella pagina.
    let osservatore: IntersectionObserver | null = null;
    const guarda = () => {
      osservatore?.disconnect();
      const r = testa.getBoundingClientRect();
      osservatore = new IntersectionObserver(([voce]) => setSopraColore(voce.isIntersecting), {
        rootMargin: `-${r.top}px 0px -${Math.max(0, window.innerHeight - r.bottom)}px 0px`,
      });
      osservatore.observe(zona);
    };

    guarda();
    window.addEventListener("resize", guarda);
    return () => {
      osservatore?.disconnect();
      window.removeEventListener("resize", guarda);
    };
  }, [percorso]);

  useGSAP(
    () => {
      const testa = testaRef.current;
      const marchio = marchioRef.current;
      const gruppo = rotteRef.current;
      if (!testa || !marchio || !gruppo) return;

      const rotte = gsap.utils.toArray<HTMLElement>(`.${styles.rotta}`, gruppo);
      const posa = () => gsap.set([marchio, ...rotte], { opacity: 1, x: 0, filter: "none" });

      // §9.4: stesso stato finale, nessun percorso per arrivarci.
      if (!soglia || !ATTERRATO_SULLA_SOGLIA || giaNata || motoRidotto()) {
        gsap.set(testa, { y: 0 });
        posa();
        return;
      }
      giaNata = true;

      // ── Le misure ────────────────────────────────────────────────────────
      // Niente posizioni scritte a mano: si parte dal layout già impaginato e
      // si calcolano gli scarti verso i due stati transitori — il marchio da
      // solo al centro, e la riga composta e stretta. L'arrivo è sempre lo
      // zero, cioè il posto che il foglio ha già dato a ciascuno.
      const rMarchio = marchio.getBoundingClientRect();
      const rRotte = rotte.map((r) => r.getBoundingClientRect());
      const passo = parseFloat(getComputedStyle(gruppo).columnGap) || 0;

      // Lo stato 2: il marchio, da solo, al centro esatto dello schermo.
      const dxSolo = (window.innerWidth - rMarchio.width) / 2 - rMarchio.left;

      // Lo stato 3: marchio e rotte impacchettati in una riga sola, centrata.
      const rigaLarga = rRotte.reduce((t, r) => t + passo + r.width, rMarchio.width);
      const rigaSx = (window.innerWidth - rigaLarga) / 2;
      const dxRiga = rigaSx - rMarchio.left;
      let cursore = rigaSx + rMarchio.width;
      const dxRotte = rRotte.map((r) => {
        cursore += passo;
        const dx = cursore - r.left;
        cursore += r.width;
        return dx;
      });

      // Il bordo destro del marchio nella riga composta: è da lì che le parole
      // devono sembrare uscire, quindi è lì che partono, tutte sovrapposte.
      const bordo = rigaSx + rMarchio.width;
      const dy = window.innerHeight / 2 - (rMarchio.top + rMarchio.height / 2);

      gsap.set(testa, { y: dy });
      gsap.set(marchio, { x: dxSolo, opacity: 0, filter: `blur(${SOGLIA.sfocatura}px)` });
      rotte.forEach((r, i) => gsap.set(r, { x: bordo - rRotte[i].left, opacity: 0 }));

      // ── La partitura ─────────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: SOGLIA.attesa });

      // 2. Il marchio si materializza: la sfocatura che si chiude è ciò che
      //    distingue "compare" da "si accende".
      tl.to(
        marchio,
        { opacity: 1, filter: "blur(0px)", duration: SOGLIA.comparsa, ease: "power2.out" },
        0,
      )
        // 3. Scivola verso la sua posizione nella riga, e mentre è ancora in
        //    movimento le parole escono da sotto di lui. Se aspettassero che
        //    si fermi non sembrerebbero originarsi da lui: sembrerebbero
        //    comparire accanto.
        .to(
          marchio,
          { x: dxRiga, duration: SOGLIA.spostamento, ease: "power2.inOut" },
          SOGLIA.tSpostamento,
        )
        .to(
          rotte,
          {
            x: (i: number) => dxRotte[i],
            opacity: 1,
            duration: SOGLIA.parole,
            stagger: SOGLIA.scartoParole,
            ease: "power2.out",
          },
          SOGLIA.tParole,
        )
        // 4. La riga si apre in due e sale: il marchio al margine sinistro, le
        //    rotte al destro, tutto nell'header. Un gesto solo, quindi un solo
        //    istante d'attacco.
        .to(marchio, { x: 0, duration: SOGLIA.apertura, ease: "power2.inOut" }, SOGLIA.tApertura)
        .to(
          rotte,
          {
            x: 0,
            duration: SOGLIA.apertura,
            stagger: SOGLIA.scartoParole,
            ease: "power2.inOut",
          },
          SOGLIA.tApertura,
        )
        .to(testa, { y: 0, duration: SOGLIA.salita, ease: "power2.inOut" }, SOGLIA.tApertura);

      return () => {
        tl.kill();
      };
    },
    { dependencies: [soglia], scope: testaRef },
  );

  if (senzaTesta(percorso)) return null;

  return (
    <header
      ref={testaRef}
      className={styles.testa}
      data-soglia={soglia ? "" : undefined}
      data-sopra-colore={sopraColore ? "" : undefined}
    >
      <Link ref={marchioRef} className={styles.marchio} href="/">
        <Marchio className={styles.segno} />
      </Link>
      <nav ref={rotteRef} className={styles.rotte}>
        {ROTTE.map(([voce, href]) => (
          <Link
            key={voce}
            className={styles.rotta}
            href={href}
            aria-current={percorso.startsWith(href) ? "page" : undefined}
          >
            {voce}
          </Link>
        ))}
      </nav>
    </header>
  );
}
