"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./copia.module.css";

// Un valore che si copia al clic — un numero, un indirizzo.
//
// È un `<button>` e non un `<span>` con un handler: così ci si arriva col tab,
// si attiva con invio e con la barra, e i lettori di schermo lo annunciano
// come qualcosa che si può fare. Il nome accessibile dice l'AZIONE ("copia
// l'email") perché il valore da solo non spiegherebbe cosa succede premendo.
//
// L'esito viene detto due volte, per due pubblici: il suggerimento cambia in
// "copiato" per chi guarda, e un `aria-live` discreto lo annuncia per chi non
// guarda. Senza il secondo, premere il tasto non produrrebbe alcun riscontro
// percepibile.

/** Quanto resta scritto "copiato" prima di tornare l'invito. Abbastanza da
 *  leggerlo senza doverlo rincorrere, poco da non restare appeso. */
const DURATA_ESITO_MS = 1600;

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
  /** Gli appunti non esistono in un contesto non sicuro né se il permesso è
   *  negato. Si scopre solo provando, quindi lo stato parte ottimista e si
   *  spegne al primo fallimento invece di indovinare in anticipo. */
  const [inerte, setInerte] = useState(false);
  const attesaRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (attesaRef.current) clearTimeout(attesaRef.current);
    };
  }, []);

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
      type="button"
      className={`${styles.copia}${className ? ` ${className}` : ""}`}
      onClick={copia}
      aria-label={`copia ${azione}: ${valore}`}
      data-copiato={copiato ? "" : undefined}
    >
      {valore}
      <span className={styles.suggerimento} aria-hidden="true">
        {copiato ? "copiato" : "copia"}
      </span>
      <span role="status" aria-live="polite" className={styles.soloLettori}>
        {copiato ? `${azione} copiato negli appunti` : ""}
      </span>
    </button>
  );
}
