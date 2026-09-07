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

# ── La tabella: chiave | sorgente | offset anteprima | crop | copertina
#
# Gli ultimi due campi sono facoltativi.
#
# `crop` è un `w:h:x:y` da dare a ffmpeg, e si usa quando il contenuto vero è
# più piccolo del fotogramma — bande nere impresse nel file da un export
# sbagliato. Non è una scelta di inquadratura: è togliere ciò che non è mai
# stato ripreso. Il valore si trova con `cropdetect`, campionando in più punti
# e fidandosi solo se concordano.
#
# `copertina` è il secondo da cui prendere il fermo immagine che finisce in
# `public/media/<slug>/01.jpg`. Serve alle opere SOLO-VIDEO, che una copertina
# non ce l'hanno: l'indice e la cronologia leggono `scatti[0]`.
#
# La chiave dà il nome ai tre derivati e NON è lo slug dell'opera: Feral ha tre
# teaser, Coucher sei clip. Dove il filmato è uno solo la chiave coincide con
# lo slug, e resta la cosa più leggibile.
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
# Le tre opere che esistono SOLO come filmato — love-and-eat, l-affair,
# sauvage — sono qui e hanno il campo `copertina`: il fermo immagine è ciò che
# permette loro di stare in un indice che legge `scatti[0]`.
# Heredoc e non una stringa fra apici: `L'AFFAIR` contiene un apostrofo, che
# in una stringa quotata la chiude a metà — lo script leggeva «video» come
# un comando. Con `<<'FINE'` nulla viene interpretato.
TABELLA=$(cat <<'FINE'
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/Glamour Confusion - Videoclip - V1 [HD 1080x24p].mp4|50
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/video Tommy Bentivegna.mp4|20
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/VIdeo.MOV|20
feral-teaser-1|FERAL 17-11-24/Teaser 1 - Final.mp4|30
feral-teaser-2|FERAL 17-11-24/Teaser 2 - Final.mp4|30
feral-teaser-3|FERAL 17-11-24/Teaser 3 - Final.mp4|30
don-giovanni|DON GIOVANNI 30 -05 - 25/1 performance ph Irene Stefanini/video/3d3094b9-4aea-4a8d-ae08-18d5693a642e.mov|25
coucher-avec-moi-1|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/video/DSCN2332.AVI|30
coucher-avec-moi-2|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/video/DSCN2336.AVI|30
coucher-avec-moi-3|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/video/DSCN2348.AVI|30
coucher-avec-moi-4|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/video/DSCN2355.AVI|30
coucher-avec-moi-5|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/video/DSCN2361.AVI|30
coucher-avec-moi-6|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/video/DSCN2375.AVI|30
love-and-eat|LOVE AND EAT 12-02-26/LOVE AND EAT.mp4|35||125
l-affair|L'AFFAIR video performance 20-07-021/Video GIuseppe Esposito - L'Affair 4k h264.mp4|35||42
sauvage|Sauvage/655600bc-80df-4c03-8e87-e4141b72d2bd.mp4|35|960:720:160:0|36.8
FINE
)
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
# CRF 25 e lato lungo 1600 sono MISURATI, non scelti: il videoclip di Glamour
# Confusion a CRF 23 / 1920 pesava 142 MB — oltre il limite di GitHub, per tre
# minuti di video. Le due manopole insieme lo riportano dentro il tetto, e la
# cornice del sito non è mai a schermo intero.
CRF=25
LATO_MAX=1600
ANTEPRIMA_SECONDI=10
ANTEPRIMA_LATO_MAX=1280

# Sotto questa durata l'anteprima non si fa: dieci secondi presi da una clip di
# otto sarebbero la clip stessa, cioè lo stesso file scaricato due volte.
ANTEPRIMA_SOGLIA=30

# Oltre questo, il frame rate scende. Un montato a 60 fps pesa quasi il doppio
# di uno a 30 senza che si veda la differenza in una cornice di un archivio —
# e Love and Eat, che è 1080p60 per sei minuti, senza questo non sarebbe
# rientrato sotto il limite di GitHub. Le sorgenti già a 24, 25 o 30 non si
# toccano: cambiare il loro passo sarebbe una modifica all'opera.
FPS_MAX=30

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

echo "$TABELLA" | grep -v '^$' | while IFS='|' read -r slug rel offset ritaglio copertina; do
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

  # Il ritaglio viene PRIMA della scala: se no il lato lungo si misurerebbe su
  # una larghezza che comprende le bande nere.
  taglia=""
  [ -n "$ritaglio" ] && taglia="crop=$ritaglio,"

  # Il tetto è sul LATO LUNGO e non sulla larghezza: i teaser di Feral sono
  # 1440x2560 verticali, e un `min(1600,iw)` li avrebbe lasciati alti 2560.
  # `decrease` non ingrandisce mai, quindi le sorgenti piccole restano intatte;
  # il secondo `scale` arrotonda a dimensioni pari (H.264 in 4:2:0 non ammette
  # lati dispari).
  scala="${taglia}scale='min($LATO_MAX,iw)':'min($LATO_MAX,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2"

  # Il frame rate della sorgente, come frazione: `50/1`, `60000/1001`…
  fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate \
        -of default=noprint_wrappers=1:nokey=1 "$src")
  giu=""
  if awk -F/ -v m=$FPS_MAX 'BEGIN{ok=1} {if ($2+0>0 && $1/$2 > m+0.5) ok=0} END{exit ok}' <<< "$fps"; then
    giu="-r $FPS_MAX"
    echo "   ($fps fps → $FPS_MAX)"
  fi

  echo "   intero…"
  ffmpeg -nostdin -v error -y -i "$src" \
    -vf "$scala" $giu \
    -c:v libx264 -profile:v high -crf $CRF -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart \
    "$OUT/$slug.mp4"

  if awk -v d="$dur" -v s=$ANTEPRIMA_SOGLIA 'BEGIN{exit !(d>s)}'; then
    echo "   anteprima…"
    ffmpeg -nostdin -v error -y -ss "$t" -t $ANTEPRIMA_SECONDI -i "$src" \
      -vf "${taglia}scale='min($ANTEPRIMA_LATO_MAX,iw)':'min($ANTEPRIMA_LATO_MAX,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
      -an \
      -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p \
      -movflags +faststart \
      "$OUT/$slug-anteprima.mp4"
  else
    rm -f "$OUT/$slug-anteprima.mp4"
    echo "   anteprima saltata (dura meno di ${ANTEPRIMA_SOGLIA}s)"
  fi

  echo "   poster…"
  ffmpeg -nostdin -v error -y -ss "$t" -i "$src" -frames:v 1 \
    -vf "${taglia}scale='min($LATO_MAX,iw)':'min($LATO_MAX,ih)':force_original_aspect_ratio=decrease" -q:v 3 \
    "$OUT/$slug-poster.jpg"

  # La copertina dell'opera, per chi il video ce l'ha e basta.
  if [ -n "$copertina" ]; then
    echo "   copertina (da ${copertina}s)…"
    mkdir -p "$OUT/../$slug"
    ffmpeg -nostdin -v error -y -ss "$copertina" -i "$src" -frames:v 1 \
      -vf "${taglia}scale='min($LATO_MAX,iw)':'min($LATO_MAX,ih)':force_original_aspect_ratio=decrease" \
      -map_metadata -1 -q:v 5 \
      "$OUT/../$slug/01.jpg"
  fi
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
