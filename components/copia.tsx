"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import styles from "./copia.module.css";

// Un valore che si copia al clic — un numero, un indirizzo.
//
// È un `<button>` e non uno `<span>` con un handler: così ci si arriva col tab,
// si attiva con invio e con la barra, e i lettori di schermo lo annunciano come
// qualcosa che si può fare. Il nome accessibile dice l'AZIONE ("copia l'email")
// perché il valore da solo non spiegherebbe cosa succede premendo.
//
// ── Il riquadro ─────────────────────────────────────────────────────────────
// Segue il cursore invece di stare appeso sopra il valore. La prima versione
// era una scritta della stessa tinta del testo, sopra un fondo pieno: non si
// leggeva perché non aveva un fondo suo. Ora è un riquadro avorio con
// l'inchiostro dentro — 17,77:1, la stessa coppia del resto del sito — e su
// una tinta piena si stacca senza doversi affidare al contrasto del fondo che
// ha sotto, qualunque esso sia.
//
// Si muove scrivendo il `transform` direttamente sul nodo, non passando da uno
// stato: seguire un cursore significa un aggiornamento per movimento del
// mouse, e farne render sarebbe un albero ricalcolato per pixel.
//
// Col tab il cursore non c'è, quindi il riquadro si àncora al valore che sta
// descrivendo: stesso oggetto, due modi di trovarne la posizione.
//
// L'esito è detto due volte, per due pubblici: il riquadro cambia in "copiato"
// per chi guarda, e un `aria-live` discreto lo annuncia per chi non guarda.

/** Quanto resta scritto "copiato" prima di tornare l'invito. Abbastanza da
 *  leggerlo senza doverlo rincorrere, poco da non restare appeso. */
const DURATA_ESITO_MS = 1600;

/** Lo scarto dal cursore, in px. Sotto e a destra, dove la mano non copre. */
const SCARTO = 14;

export function Copia({
  valore,
  azione,
  className,
}: {
  valore: string;
  /** Cosa si sta copiando, per il nome accessibile: "il numero", "l'email". */
  azione: string;
  className?: string;
}) {
  const [copiato, setCopiato] = useState(false);
  const [visibile, setVisibile] = useState(false);
  /** Gli appunti non esistono in un contesto non sicuro né se il permesso è
   *  negato. Si scopre solo provando, quindi lo stato parte ottimista e si
   *  spegne al primo fallimento invece di indovinare in anticipo. */
  const [inerte, setInerte] = useState(false);

  const tastoRef = useRef<HTMLButtonElement>(null);
  const riquadroRef = useRef<HTMLSpanElement>(null);
  const attesaRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (attesaRef.current) clearTimeout(attesaRef.current);
    };
  }, []);

  const porta = (x: number, y: number) => {
    const riquadro = riquadroRef.current;
    if (riquadro) riquadro.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const segui = (e: ReactPointerEvent) => porta(e.clientX + SCARTO, e.clientY + SCARTO);

  /** Col tab non c'è un cursore da seguire: il riquadro si mette sopra il
   *  valore, che è l'unica posizione che ha senso senza un puntatore. */
  const ancora = () => {
    const tasto = tastoRef.current;
    if (!tasto) return;
    const r = tasto.getBoundingClientRect();
    porta(r.left, r.top - SCARTO * 2);
  };

  const copia = async () => {
    try {
      await navigator.clipboard.writeText(valore);
    } catch {
      // Il valore resta scritto e selezionabile a mano: si perde la comodità,
      // non l'informazione.
      setInerte(true);
      return;
    }
    setCopiato(true);
    if (attesaRef.current) clearTimeout(attesaRef.current);
    attesaRef.current = setTimeout(() => setCopiato(false), DURATA_ESITO_MS);
  };

  if (inerte) {
    return <span className={className}>{valore}</span>;
  }

  return (
    <button
      ref={tastoRef}
      type="button"
      className={`${styles.copia}${className ? ` ${className}` : ""}`}
      onClick={copia}
      onPointerEnter={(e) => {
        segui(e);
        setVisibile(true);
      }}
      onPointerMove={segui}
      onPointerLeave={() => setVisibile(false)}
      onFocus={() => {
        ancora();
        setVisibile(true);
      }}
      onBlur={() => setVisibile(false)}
      aria-label={`copia ${azione}: ${valore}`}
    >
      {valore}
      <span
        ref={riquadroRef}
        className={styles.riquadro}
        data-visibile={visibile ? "" : undefined}
        aria-hidden="true"
      >
        {copiato ? "copiato" : "copia"}
      </span>
      <span role="status" aria-live="polite" className={styles.soloLettori}>
        {copiato ? `${azione} copiato negli appunti` : ""}
      </span>
    </button>
  );
}
