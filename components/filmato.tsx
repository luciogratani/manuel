"use client";

import { useCallback, useRef, useState } from "react";
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
} from "media-chrome/react";
import type { Filmato } from "@/lib/opere";
import styles from "./filmato.module.css";

// Il video, finalmente in pagina (§8). Due modi, e la differenza fra i due è
// una decisione di Lucio, non una comodità tecnica:
//
//   · `Muto` sta nella mensola e nell'indice. Nessun controllo, nessun audio:
//     è una fotografia che si muove, e serve a far capire che lì c'è un
//     filmato. Parte quando il puntatore ci passa sopra e si rimette sul
//     poster quando se ne va.
//   · `Intero` sta nella vista ravvicinata, ed è l'unico posto dove il suono
//     esiste. Lì c'è spazio per i crediti del videomaker, e nessuno ci arriva
//     per sbaglio: ci si arriva cliccando.
//
// Il passaggio fermo → movimento è una DISSOLVENZA e non un taglio: §3.2, il
// taglio segna un passaggio di stato strutturale, la dissolvenza una
// variazione dentro uno stato già stabilito. Qui l'opera è già aperta.

/** Il filmato come lastra: poster fermo, e il movimento all'hover.
 *
 *  L'anteprima esiste per i filmati sopra i trenta secondi ed è dieci secondi
 *  muti; sotto quella soglia si usa il montato intero, che è già corto. In
 *  entrambi i casi `preload="none"`: finché nessuno ci passa sopra, di questo
 *  video non si scarica un byte — e ci sono opere con sei filmati. */
export function Muto({
  filmato,
  className,
  alt,
}: {
  filmato: Filmato;
  className?: string;
  alt: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [corre, setCorre] = useState(false);

  const parti = useCallback(() => {
    const v = video.current;
    if (!v) return;
    setCorre(true);
    void v.play().catch(() => setCorre(false));
  }, []);

  const fermati = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setCorre(false);
  }, []);

  return (
    <span
      className={[styles.muto, className].filter(Boolean).join(" ")}
      onPointerEnter={parti}
      onPointerLeave={fermati}
      data-corre={corre ? "" : undefined}
    >
      {/* Il poster è un `img` e non l'attributo `poster` del video: così è
          `next/image` a servirlo — no, qui no: la cornice ritaglia in `cover`
          e il file è già derivato alla misura giusta, quindi un `img` semplice
          fa meno lavoro e non passa dall'ottimizzatore per un'immagine che
          esiste in una sola taglia. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.poster} src={filmato.poster} alt={alt} />
      <video
        ref={video}
        className={styles.video}
        src={filmato.anteprima ?? filmato.src}
        poster={filmato.poster}
        preload="none"
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* La durata è l'unico segno che dice «questo si muove»: un numero, come
          gli altri numeri dell'archivio, non un triangolino da player. */}
      <span className={styles.durata}>{leggibile(filmato.durata)}</span>
    </span>
  );
}

/** Il filmato per intero, con il suono. Media-chrome porta i controlli;
 *  l'aspetto glielo dà `filmato.module.css` — bordi durissimi, nessun angolo
 *  arrotondato (§3.5), e l'accento non si spende sui comandi (§2.3). */
export function Intero({ filmato, titolo }: { filmato: Filmato; titolo: string }) {
  return (
    <MediaController
      className={styles.controller}
      style={{ aspectRatio: `${filmato.w} / ${filmato.h}` }}
    >
      {/* `tabIndex={-1}` è dichiarato qui perché media-chrome lo mette da sé
          appena idrata — il fuoco lo gestisce il controller, non il video — e
          senza dirlo anche al server React segnala un disallineamento di
          idratazione a ogni caricamento. */}
      <video
        slot="media"
        src={filmato.src}
        poster={filmato.poster}
        preload="metadata"
        playsInline
        crossOrigin=""
        aria-label={titolo}
        tabIndex={-1}
      />
      <MediaControlBar className={styles.barra}>
        <MediaPlayButton />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}

function leggibile(secondi: number) {
  const t = Math.round(secondi);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
