"use client";

import { useCallback, useRef, useState } from "react";
import type { Filmato } from "@/lib/opere";
import styles from "./filmato.module.css";

// Il video in pagina (§8). Due modi, e da qui in avanti partono TUTTI E DUE da
// soli, come l'hero della soglia: autoplay, muto, in loop, senza comandi.
//
// ── Perché non più l'hover ──────────────────────────────────────────────────
// `Muto` partiva al passaggio del puntatore e tornava al poster quando se ne
// andava. Su un telefono l'hover non esiste: `pointerenter` scatta al tocco e
// `pointerleave` spesso non scatta affatto, così un filmato restava fermo, un
// altro partiva e non si fermava più, e nessuno dei due faceva quello che
// sembrava promettere. Non era un bug da aggiustare: era un'interazione che
// presuppone un dispositivo che metà dei visitatori non ha.
//
// La soglia ha sempre fatto la cosa giusta — il suo video parte e basta — e
// adesso la fanno anche gli altri. Meno stato, meno codice, stesso
// comportamento ovunque (decisione di Lucio, 9 settembre 2026).
//
// ── Il peso ─────────────────────────────────────────────────────────────────
// L'autoplay scarica, mentre `preload="none"` no: è il prezzo della scelta. Si
// paga poco perché la mensola mostra le ANTEPRIME — dieci secondi, generate da
// `scripts/filmati.sh` sopra i trenta secondi di durata — e sotto quella soglia
// il montato intero è già corto. In pratica nessuna lastra supera i 4 MB,
// contro gli 85 di `love-and-eat.mp4`, che in mensola non entra mai.

/** Il filmato come lastra: parte da sé, muto, in loop.
 *
 *  Il `poster` resta dichiarato sul video e non è decorazione: se l'autoplay
 *  viene negato — iOS in risparmio energetico lo nega anche ai video muti — si
 *  vede la fotografia invece di un rettangolo nero. */
export function Muto({
  filmato,
  className,
  alt,
}: {
  filmato: Filmato;
  className?: string;
  alt: string;
}) {
  return (
    <span className={[styles.muto, className].filter(Boolean).join(" ")}>
      <video
        className={styles.video}
        src={filmato.anteprima ?? filmato.src}
        poster={filmato.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
        tabIndex={-1}
      />
      {/* La durata è l'unico segno che dice «questo si muove»: un numero, come
          gli altri numeri dell'archivio, non un triangolino da player. */}
      <span className={styles.durata}>{leggibile(filmato.durata)}</span>
    </span>
  );
}

/** Il filmato per intero, nella vista ravvicinata: l'unico posto dove il suono
 *  esiste, e l'unica pagina che di contenuto ha soltanto quel video.
 *
 *  Parte muto come gli altri, così la pagina non aggredisce chi ci arriva. AL
 *  PRIMO CLIC diventa un film: entra l'audio e compaiono i comandi nativi del
 *  browser. Prima di quel clic non c'è nessuna barra, perché non serve — il
 *  video sta già andando.
 *
 *  Comandi NATIVI e non più media-chrome. La libreria serviva a vestire una
 *  barra sempre presente; una barra che compare solo dopo un clic esplicito
 *  non vale una dipendenza, e quella del browser è già accessibile da tastiera,
 *  tradotta, e uguale a quella che il visitatore conosce. */
export function Intero({ filmato, titolo }: { filmato: Filmato; titolo: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [aperto, setAperto] = useState(false);

  const apri = useCallback(() => {
    const v = video.current;
    if (!v || aperto) return;
    // L'ordine conta: si toglie il muto PRIMA di dichiarare aperto, così il
    // browser lega l'audio al clic che lo ha chiesto. Fatto dopo, il gesto è
    // già consumato e Safari rimette il muto da sé.
    v.muted = false;
    setAperto(true);
    void v.play().catch(() => undefined);
  }, [aperto]);

  return (
    <video
      ref={video}
      className={styles.intero}
      style={{ aspectRatio: `${filmato.w} / ${filmato.h}` }}
      src={filmato.src}
      poster={filmato.poster}
      autoPlay
      muted
      loop
      playsInline
      controls={aperto}
      onClick={apri}
      aria-label={titolo}
    />
  );
}

function leggibile(secondi: number) {
  const t = Math.round(secondi);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
