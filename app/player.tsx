"use client";

import { Tenda } from "@/components/tenda";
import { ATTERRATO_SULLA_SOGLIA, SOGLIA } from "@/lib/movimento";
import styles from "./page.module.css";

// Il player, e l'unico motivo per cui è un componente client: il ritardo della
// tenda dipende da COME sei arrivato qui.
//
// Atterrando sulla soglia il video si scopre durante il quarto tempo della
// sequenza, mentre la riga si divide. Arrivandoci da un'altra pagina la
// sequenza non c'è — l'header è già al suo posto — e la tenda non deve
// aspettare nessuno: lì è semplicemente la transizione del corpo.

export function Player() {
  return (
    <Tenda
      className={styles.player}
      ritardo={ATTERRATO_SULLA_SOGLIA ? SOGLIA.attesa + SOGLIA.tVideo : 0}
    >
      <div className={styles.telaio}>
        {/* Muto e in loop: è lo sfondo della soglia, non un video da guardare
            con l'audio — nessun controllo, nessuna UI di player.

            Il file è un derivato, come tutti i filmati del sito: il master sta
            in `01-assets/media/hero.mp4`. Non passa da `scripts/filmati.sh`
            perché è l'unico video che non appartiene a un'opera, ma la ricetta
            è la stessa a un CRF più generoso — è la prima immagine del sito:

              ffmpeg -i 01-assets/media/hero.mp4 -map 0:v:0 -map_metadata -1 \
                -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
                -movflags +faststart -an public/media/home/hero.mp4

            `-map 0:v:0 -an` tiene solo il video: il montato porta una traccia
            dati di timecode e nessun audio serve a un loop muto. `+faststart`
            mette il `moov` in testa, altrimenti il browser scarica tutto il
            file prima del primo fotogramma — e questo è il fotogramma su cui
            si apre il sito. Il master di settembre 2026 era 7,4 Mbps per un
            rettangolo largo 572px: 18,9 MB diventati 5,3 senza differenza
            visibile al ritaglio 1:1.

            `hero_old.mp4` è il video precedente, 16:9 ritagliato dal telaio. */}
        <video
          className={styles.video}
          src="/media/home/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </Tenda>
  );
}
