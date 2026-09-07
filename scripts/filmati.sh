#!/bin/bash
# Deriva i filmati web dai montati finiti. Sorgenti intatte, derivati piccoli —
# stessa regola di `bozze-media.sh`, altro mestiere: lì `sips` sulle immagini,
# qui `ffmpeg` sui video.
#
# Per ogni opera produce tre file in public/media/filmati/:
#   <slug>.mp4            l'opera intera, con audio        — si chiede, non parte
#   <slug>-anteprima.mp4  10 secondi muti, per il ripasso  — pesa come una foto
#   <slug>-poster.jpg     il fermo immagine                — è ciò che si vede fermo
#
# E scrive `public/media/filmati.txt`: nome|w|h|durata|peso. Le misure che
# finiscono in lib/opere.ts si copiano DA LÌ, non si scrivono a occhio.
#
#   ./scripts/filmati.sh                  tutte le opere della tabella
#   ./scripts/filmati.sh glamour-confusion funeral-rave
set -e

MEDIA="/Users/lucio/Desktop/manuel-portfolio/01-assets/media"
OUT="/Users/lucio/Desktop/manuel-portfolio/04-site/public/media/filmati"

# ── La tabella: slug | sorgente (relativa a $MEDIA) | offset dell'anteprima
#
# L'offset è in percentuale della durata, e serve a non aprire l'anteprima su
# un nero o su un cartello di testa. È una MANOPOLA, non una misura: il
# fotogramma giusto lo sceglie la curatela guardando, e si cambia qui.
# Glamour Confusion è a 50 e non a 20 proprio per questo: al 20% il video è
# ancora sul cartello di testa, e l'anteprima erano dieci secondi di titolo.
#
# Fuori dall'archivio per decisione di Lucio (7 settembre 2026), quindi fuori
# di qui: The Red White Horse, Marie Antoinette in thr Fridge, Editoriale x
# Vogue. Il montato di THE RED WHITE HORSE resta nelle sorgenti, non nel sito.
#
# Le tre opere che esistono SOLO come filmato — l-affair, love-and-eat,
# sauvage — non sono in questa tabella perché non sono ancora in lib/opere.ts:
# inserirle è curatela (serve decidere se un fermo immagine può fare da
# copertina d'archivio). Le sorgenti sono pronte, le righe si aggiungono qui.
TABELLA='
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/Glamour Confusion - Videoclip - V1 [HD 1080x24p].mp4|50
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/video Tommy Bentivegna.mp4|20
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/VIdeo.MOV|20
'

# ── Le ricette
#
# H.264 e non AV1 o HEVC: è l'unico codec che ogni browser decodifica in
# hardware da anni. Un archivio consultato da curatori su macchine qualunque
# non è il posto per il codec più efficiente, è il posto per quello che parte.
#
# CRF e non un bitrate fisso: la qualità resta costante e il peso lo decide il
# materiale — un video fermo pesa poco, uno mosso pesa quel che deve.
#
# `+faststart` sposta il `moov` in testa (come già fa l'hero della home): senza,
# il browser deve scaricare tutto il file prima del primo fotogramma.
#
# NIENTE upscaling: le due verticali (360x640, 480x848) e l'SD (720x576) sono
# nate così. Ingrandirle sarebbe inventare pixel e triplicare il peso per
# mostrare la stessa immagine più sfocata.
#
# CRF 25 e larghezza 1600 sono MISURATI, non scelti: il videoclip di Glamour
# Confusion a CRF 23 / 1920 pesava 142 MB — oltre il limite di GitHub, per tre
# minuti di video. Le due manopole insieme lo riportano dentro il tetto, e la
# cornice del sito non è mai a schermo intero.
CRF=25
LARGHEZZA_MAX=1600
ANTEPRIMA_SECONDI=10
ANTEPRIMA_ALTEZZA_MAX=720

# Il tetto per file. Nel repo, quindi sotto il limite di GitHub (100 MB) con
# margine. Se un derivato lo supera lo script non fallisce: lo dice, e la
# decisione (estratto, risoluzione più bassa, origine esterna) resta di Lucio.
TETTO_MB=90

mkdir -p "$OUT"

# w, h e durata su tre righe: `csv=nk=1` metterebbe width e height sulla STESSA
# riga separati da virgola, e la durata finirebbe letta come altezza.
misura() { # file -> "w h durata"
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$1" | tr '\n' ' '
}

echo "$TABELLA" | grep -v '^$' | while IFS='|' read -r slug rel offset; do
  # Se lo script ha argomenti, fa solo quegli slug.
  if [ $# -gt 0 ]; then
    voluto=0
    for a in "$@"; do [ "$a" = "$slug" ] && voluto=1; done
    [ $voluto -eq 1 ] || continue
  fi

  src="$MEDIA/$rel"
  if [ ! -f "$src" ]; then
    echo "  ! sorgente mancante: $rel" >&2
    continue
  fi

  read -r w h dur <<< "$(misura "$src")"
  t=$(awk -v d="$dur" -v p="$offset" 'BEGIN{printf "%.2f", d*p/100}')
  printf '── %-22s %sx%s  %ss  anteprima da %ss\n' "$slug" "$w" "$h" "$(printf '%.0f' "$dur")" "$t"

  # scale solo se la sorgente è più larga del massimo; -2 tiene l'altezza pari
  # (H.264 in 4:2:0 non ammette dimensioni dispari) e il rapporto intatto.
  scala="scale='min($LARGHEZZA_MAX,iw)':-2"

  echo "   intero…"
  ffmpeg -nostdin -v error -y -i "$src" \
    -vf "$scala" \
    -c:v libx264 -profile:v high -crf $CRF -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart \
    "$OUT/$slug.mp4"

  echo "   anteprima…"
  ffmpeg -nostdin -v error -y -ss "$t" -t $ANTEPRIMA_SECONDI -i "$src" \
    -vf "scale='min($LARGHEZZA_MAX,iw)':'min($ANTEPRIMA_ALTEZZA_MAX,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -an \
    -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p \
    -movflags +faststart \
    "$OUT/$slug-anteprima.mp4"

  echo "   poster…"
  ffmpeg -nostdin -v error -y -ss "$t" -i "$src" -frames:v 1 \
    -vf "scale='min(1600,iw)':-2" -q:v 3 \
    "$OUT/$slug-poster.jpg"
done

# ── Il referto. Da qui si copiano le misure in lib/opere.ts.
echo
: > "$OUT/../filmati.txt"

echo "--- filmati ---"
for f in "$OUT"/*.mp4; do
  [ -e "$f" ] || continue
  read -r w h dur <<< "$(misura "$f")"
  mb=$(awk -v b="$(stat -f %z "$f")" 'BEGIN{printf "%.1f", b/1048576}')
  echo "$(basename "$f")|$w|$h|$dur|${mb}MB" >> "$OUT/../filmati.txt"
  avviso=""
  awk -v m="$mb" -v t="$TETTO_MB" 'BEGIN{exit !(m>t)}' && avviso="   <- OLTRE IL TETTO DI ${TETTO_MB}MB"
  printf '%-40s %5s x %-5s %6ss %7s MB%s\n' "$(basename "$f")" "$w" "$h" "$(printf '%.0f' "$dur")" "$mb" "$avviso"
done

echo "--- poster ---"
for f in "$OUT"/*.jpg; do
  [ -e "$f" ] || continue
  read -r w h _ <<< "$(misura "$f")"
  mb=$(awk -v b="$(stat -f %z "$f")" 'BEGIN{printf "%.1f", b/1048576}')
  echo "$(basename "$f")|$w|$h|—|${mb}MB" >> "$OUT/../filmati.txt"
  printf '%-40s %5s x %-5s %14s MB\n' "$(basename "$f")" "$w" "$h" "$mb"
done

echo
echo "--- peso totale ---"; du -sh "$OUT"
