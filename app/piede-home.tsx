"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ATTERRATO_SULLA_SOGLIA, DISSOLVENZA, SOGLIA, motoRidotto } from "@/lib/movimento";
import styles from "./page.module.css";

// Il piede della soglia, isolato dalla pagina perché è l'unico pezzo che
// anima: prima entrava insieme all'header (comparsa 1) invece che dopo (fine
// sequenza), poi restava comunque visibile a bassa opacità fin dal primo
// paint — ambiguo, sembrava già lì mentre in realtà stava aspettando. Adesso
// non c'è proprio, fino a quando non arriva.
//
// Gioca solo sull'atterraggio a freddo sulla soglia, stessa costante di
// `components/testa.tsx`: navigando qui da un'altra pagina il piede c'è già.
// `giaNata`, come in testa.tsx: tornando alla home dopo essere già stati sulla
// soglia una volta in questa sessione, la sequenza non ricomincia.
const RITARDO = SOGLIA.attesa + SOGLIA.tApertura;
let giaNata = false;

export function PiedeHome() {
  const piedeRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const piede = piedeRef.current;
    if (!piede) return;

    // §9.4: stesso stato finale, nessun percorso per arrivarci.
    if (!ATTERRATO_SULLA_SOGLIA || giaNata || motoRidotto()) {
      gsap.set(piede, { opacity: 1, y: 0 });
      return;
    }
    giaNata = true;

    gsap.fromTo(
      piede,
      { opacity: 0, y: 4 },
      {
        opacity: 1,
        y: 0,
        duration: DISSOLVENZA.durata,
        ease: DISSOLVENZA.ease,
        delay: RITARDO,
      },
    );
  }, []);

  return (
    <footer ref={piedeRef} className={styles.piede}>
      <p>Manuel Casati</p>
      <p>ITA, 1986</p>
      <p>2010 — 2026</p>
    </footer>
  );
}
