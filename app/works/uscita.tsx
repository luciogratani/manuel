"use client";

import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DISSOLVENZA, TENDA, USCITA, motoRidotto } from "@/lib/movimento";
import styles from "./page.module.css";

// L'uscita dall'archivio: al clic su un lavoro la pagina si svuota attorno a
// quello scelto. La coreografia sta in `USCITA` in lib/movimento.ts.
//
// ── Ventuno tagli, non un sipario ───────────────────────────────────────────
// Ogni altra lastra viene cancellata dal PROPRIO taglio, e tutti nello stesso
// istante. Un sipario unico sulla striscia avrebbe coperto la pagina; così
// invece l'archivio si legge cancellato opera per opera.
//
// La simultaneità è la ragione per cui venti rossi insieme non sono rumore:
// sfalsati sarebbero venti eventi in fila, insieme sono un gesto solo. È
// l'esatto contrario della regola che vale per la preview della timeline, dove
// il rosso deve restare raro perché arriva uno alla volta.
//
// ── Perché si spegne il contenuto e non la lastra ───────────────────────────
// Il taglio è figlio della lastra — è così che ne prende la forma esatta senza
// che nessuno debba misurarla. Ma spegnere la lastra spegnerebbe anche lui,
// quindi a copertura piena si spengono la foto e il fondo inchiostro, e il
// taglio resta a ritirarsi su una lastra ormai vuota.
//
// ── Perché intercetta il clic invece di usare `onNavigate` ──────────────────
// `<Link onNavigate>` esiste in questa versione, ma è una prop: per usarla le
// ventuno celle dovrebbero essere rese da un componente client, e con loro
// ventuno `<Image>`. Così la striscia resta server-renderizzata, come il nastro
// della timeline. Si intercetta solo il clic semplice: con un modificatore il
// browser apre in una scheda nuova, e mettersi in mezzo significherebbe rubare
// un gesto che l'utente conosce meglio di noi.

export function Uscita({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ancoraRef = useRef<HTMLSpanElement>(null);
  /** Una navigazione per volta: il secondo clic durante la coreografia non
   *  deve farla ripartire da capo né spingere due volte il router. */
  const inCorsoRef = useRef(false);
  /** La linea del tempo nasce dentro un gestore di evento, quindi `useGSAP`
   *  non la conosce e non la ripulirebbe: se si lascia la pagina in altro modo
   *  mentre la coreografia corre, resterebbe ad animare nodi staccati. */
  const coreografiaRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const ancora = ancoraRef.current;
    const pagina = ancora?.closest<HTMLElement>(`.${styles.pagina}`);
    if (!pagina) return;

    const alClic = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const bersaglio = e.target as Element | null;
      const cella = bersaglio?.closest<HTMLAnchorElement>(`.${styles.cella}`);
      const rotta = cella?.getAttribute("href");
      if (!cella || !rotta) return;

      // A moto ridotto (§9.4) si va e basta: stesso stato, nessun percorso.
      if (motoRidotto()) return;

      e.preventDefault();
      if (inCorsoRef.current) return;
      inCorsoRef.current = true;

      const altre = gsap.utils
        .toArray<HTMLElement>(`.${styles.cella}`, pagina)
        .filter((c) => c !== cella);
      const tagli = altre.flatMap((c) =>
        gsap.utils.toArray<HTMLElement>(`.${styles.taglio}`, c),
      );
      const lastre = altre.flatMap((c) =>
        gsap.utils.toArray<HTMLElement>(`.${styles.lastra}`, c),
      );
      const foto = altre.flatMap((c) => gsap.utils.toArray<HTMLElement>(`.${styles.foto}`, c));
      const parole = [
        ...gsap.utils.toArray<HTMLElement>(`.${styles.banda}`, pagina),
        ...gsap.utils.toArray<HTMLElement>(`.${styles.piede}`, pagina),
        ...gsap.utils.toArray<HTMLElement>(`.${styles.numero}`, pagina),
      ];

      const copertura = TENDA.copertura * TENDA.scalaRisposta;
      const ritiro = TENDA.ritiro * TENDA.scalaRisposta;
      const attesa = TENDA.attesa * TENDA.scalaRisposta;

      gsap.set(tagli, { transformOrigin: "left center", scaleX: 0 });

      coreografiaRef.current = gsap
        .timeline({ onComplete: () => router.push(rotta) })
        // 1. Ogni taglio entra sulla propria lastra, tutti insieme.
        .to(tagli, { scaleX: 1, duration: copertura, ease: TENDA.easeCopertura }, 0)
        // 2. Le parole se ne vanno mentre il rosso arriva, non dopo: sono due
        //    modi di togliere la stessa pagina, non due tempi. Il rosso toglie
        //    le immagini, la dissolvenza toglie le parole.
        .to(parole, { opacity: 0, duration: DISSOLVENZA.durata, ease: DISSOLVENZA.ease }, 0)
        // 3. A copertura piena la lastra si svuota SOTTO il proprio taglio.
        //    Foto e fondo separatamente, perché spegnere la lastra spegnerebbe
        //    anche il taglio, che le è figlio.
        .set(foto, { autoAlpha: 0 })
        .set(lastre, { backgroundColor: "transparent" })
        .set(tagli, { transformOrigin: "right center" })
        // 4. I tagli si ritirano nel verso in cui sono arrivati, e resta una
        //    pagina con una lastra sola.
        .to(tagli, { scaleX: 0, duration: ritiro, ease: TENDA.easeRitiro }, `+=${attesa}`)
        // 5. La sosta, poi la navigazione: da lì è la dissolvenza generica fra
        //    pagine a portare via anche quella.
        .to({}, { duration: USCITA.sosta });
    };

    pagina.addEventListener("click", alClic);
    return () => {
      pagina.removeEventListener("click", alClic);
      coreografiaRef.current?.kill();
    };
  }, { scope: ancoraRef });

  return (
    <>
      {children}
      {/* Nessun elemento da animare: serve solo un nodo da cui risalire alla
          pagina, perché un `useGSAP` senza un riferimento non ha da dove
          partire. Non occupa spazio e non si vede. */}
      <span ref={ancoraRef} hidden />
    </>
  );
}
