"use client";

import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DISSOLVENZA, TENDA, USCITA, motoRidotto } from "@/lib/movimento";
import styles from "./page.module.css";

// L'uscita dall'archivio. La coreografia sta in `USCITA` in lib/movimento.ts;
// qui c'è il montaggio.
//
// ── Perché intercetta il clic invece di usare `onNavigate` ──────────────────
// `<Link onNavigate>` sarebbe l'aggancio dichiarato di Next, ma è una prop:
// per usarla le ventuno celle dovrebbero essere rese da un componente client,
// e con loro ventuno `<Image>`. La striscia resta invece server-renderizzata e
// arriva come `children`, esattamente come il nastro della timeline: qui si
// ascolta un clic sul contenitore e si chiama il router a mano.
//
// Si intercetta solo il clic "semplice". Con un modificatore — cmd, ctrl,
// shift, o il tasto centrale — il browser apre in una scheda nuova, e mettersi
// in mezzo significherebbe rubare un gesto che l'utente conosce meglio di noi.
//
// ── Chi sta sopra e chi sotto ───────────────────────────────────────────────
// La tenda è sorella della striscia e la copre per intero. La cella cliccata
// viene sollevata SOPRA la tenda, quindi il rosso le passa sotto senza
// toccarla: non c'è nessun ritaglio da calcolare, è l'ordine di
// impilamento a disegnare il buco.
//
// A copertura piena le altre celle spariscono — sotto il rosso, dove nessuno
// le vede — che è la stessa meccanica con cui la tenda scambia il contenuto in
// `components/tenda.tsx`.

export function Uscita({ children }: { children: ReactNode }) {
  const router = useRouter();
  const tendaRef = useRef<HTMLDivElement>(null);
  /** Una navigazione per volta: il secondo clic durante la coreografia non
   *  deve farla ripartire da capo né spingere due volte il router. */
  const inCorsoRef = useRef(false);
  /** La linea del tempo nasce dentro un gestore di evento, quindi `useGSAP`
   *  non la conosce e non la ripulirebbe: se si lascia la pagina in altro modo
   *  mentre la coreografia corre, resterebbe ad animare nodi staccati. */
  const coreografiaRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const tenda = tendaRef.current;
    if (!tenda) return;
    const pagina = tenda.closest<HTMLElement>(`.${styles.pagina}`);
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
      const parole = [
        ...gsap.utils.toArray<HTMLElement>(`.${styles.banda}`, pagina),
        ...gsap.utils.toArray<HTMLElement>(`.${styles.piede}`, pagina),
        ...gsap.utils.toArray<HTMLElement>(`.${styles.numero}`, cella),
      ];

      cella.dataset.scelta = "";
      gsap.set(tenda, { transformOrigin: "left center", scaleX: 0, autoAlpha: 1 });

      const copertura = TENDA.copertura * TENDA.scalaRisposta;
      const ritiro = TENDA.ritiro * TENDA.scalaRisposta;
      const attesa = TENDA.attesa * TENDA.scalaRisposta;

      coreografiaRef.current = gsap
        .timeline({ onComplete: () => router.push(rotta) })
        // 1. Il rosso entra e copre la striscia.
        .to(tenda, { scaleX: 1, duration: copertura, ease: TENDA.easeCopertura }, 0)
        // 2. Le parole se ne vanno insieme al rosso che arriva, non dopo: sono
        //    due modi di togliere la stessa pagina, non due tempi.
        .to(parole, { opacity: 0, duration: DISSOLVENZA.durata, ease: DISSOLVENZA.ease }, 0)
        // 3. A copertura piena spariscono le altre lastre, sotto il rosso.
        .set(altre, { opacity: 0 })
        .set(tenda, { transformOrigin: "right center" })
        // 4. Il rosso si ritira nel verso in cui era arrivato, e resta una
        //    pagina con una lastra sola.
        .to(tenda, { scaleX: 0, duration: ritiro, ease: TENDA.easeRitiro }, `+=${attesa}`)
        // 5. La sosta, poi la navigazione: da lì è la dissolvenza generica fra
        //    pagine a portare via anche quella.
        .to({}, { duration: USCITA.sosta });
    };

    pagina.addEventListener("click", alClic);
    return () => {
      pagina.removeEventListener("click", alClic);
      coreografiaRef.current?.kill();
    };
  }, { scope: tendaRef });

  return (
    <>
      {children}
      <div
        ref={tendaRef}
        className={styles.tendaUscita}
        style={{ "--tenda-rosso": TENDA.rosso } as React.CSSProperties}
        aria-hidden="true"
      />
    </>
  );
}
