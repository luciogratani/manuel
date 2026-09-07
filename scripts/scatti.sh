#!/bin/bash
# Deriva le fotografie web dalla selezione di Manuel e Lucio. Sorgenti intatte,
# derivati piccoli — come `bozze-media.sh`, ma non più «il primo file che trovo»:
# qui ogni scatto è scelto a mano, e l'ORDINE della tabella è l'ordine in cui si
# leggono nella mensola. Il primo di ogni opera è la copertina (`scatti[0]`).
#
# Perché una tabella scritta e non una regola: `bozze-media.sh` pescava il primo
# jpg in ordine alfabetico, e per due opere d'archivio ha pescato dentro
# cartelle che Manuel aveva marcato ROSSE, cioè da escludere. Una selezione
# curata non si deduce dal filesystem.
#
#   ./scripts/scatti.sh                 tutte le opere della tabella
#   ./scripts/scatti.sh feral funeral-rave
set -e

MEDIA="/Users/lucio/Desktop/manuel-portfolio/01-assets/media"
OUT="/Users/lucio/Desktop/manuel-portfolio/04-site/public/media"

# ffmpeg e non `sips` come in `bozze-media.sh`, per una ragione precisa:
# l'ORIENTAMENTO. Tredici delle sorgenti selezionate portano un EXIF
# Orientation 6 o 8 — i pixel sono orizzontali, l'immagine vera è verticale.
# `sips -Z` conserva sia i pixel che il tag, quindi il file misura 1600x1200 ma
# il browser (che l'EXIF lo applica) ne mostra 1200x1600: le misure dichiarate
# in `lib/opere.ts` sarebbero rovesciate, `formato()` sceglierebbe 4:3 al posto
# di 3:4 e la cornice ritaglierebbe l'immagine sbagliata.
#
# ffmpeg invece l'EXIF lo applica in scrittura, e `-map_metadata -1` non lascia
# il tag nel derivato: i pixel sono già girati e nessuno li gira una seconda
# volta. Le misure del referto sono quelle che si vedono.
LATO=1600
QUALITA=5   # -q:v di ffmpeg: 2 è il massimo, 31 il minimo. 5 ≈ 200 KB a 1600px

# ── La selezione: slug | percorso (relativo a $MEDIA)
#
# Le opere d'archivio non sono qui: si vedranno più avanti, e per ora tengono la
# copertina singola generata da `bozze-media.sh`.
TABELLA='
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00057.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00035.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00042.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00044.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00046.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00058.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00059.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/image00002.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/image00005.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/image00007.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/image00015.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/image00016.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/_selected copy/image00023.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/artwork Fabrizio Casu/image00029.jpeg
funeral-rave|FUNERAL RAVE 30-06-23/artwork Fabrizio Casu/image00030.jpeg
feral|FERAL 17-11-24/Pictures/Steven/IMG_2242.JPG
feral|FERAL 17-11-24/After/_MG_4166.jpg
feral|FERAL 17-11-24/After/_MG_4784.jpg
feral|FERAL 17-11-24/foto e video performance/foto/image00008.jpeg
feral|FERAL 17-11-24/Pictures/0 - Post/1. MAIN.JPG
feral|FERAL 17-11-24/Pictures/0 - Post/3. Testo 1-1.JPG
feral|FERAL 17-11-24/Pictures/0 - Post/3. Testo 1-2.JPG
feral|FERAL 17-11-24/Pictures/0 - Post/5. Testo 2-1.JPG
feral|FERAL 17-11-24/Pictures/0 - Post/5. Testo 2-2.png
feral|FERAL 17-11-24/Pictures/0 - Post/7. Testo 3.JPG
feral|FERAL 17-11-24/Pictures/0 - Post/8. Ringraziamenti.JPG
don-giovanni|DON GIOVANNI 30 -05 - 25/_selected copyed/IMG_0542.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/_selected copyed/IMG_0543.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/_selected copyed/IMG_1458.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/_selected copyed/IMG_8197.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/set/image00069.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/post happening/image00002.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/backstage/image00054.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/backstage/image00056.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/backstage/image00058.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/backstage/image00060.jpeg
don-giovanni|DON GIOVANNI 30 -05 - 25/Locandina definitiva DON GIOVANNI.jpeg
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/DSCN2349.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2327.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2334.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2344.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2347.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2350.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2366.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2371.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2380.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2383.JPG
coucher-avec-moi|COUCHER AVEC MOI 29 - 05 -26/COUCHER AVEC MOI performance 29 - 05 - 26/foto e video Irene Stefanini/foto/DSCN2388.JPG
'

: > "$OUT/scatti.txt"

echo "$TABELLA" | grep -v '^$' | {
  precedente=""
  i=0
  while IFS='|' read -r slug rel; do
    if [ $# -gt 0 ]; then
      voluto=0
      for a in "$@"; do [ "$a" = "$slug" ] && voluto=1; done
      [ $voluto -eq 1 ] || continue
    fi

    # Cambio opera: la cartella si rifà da zero, così un file tolto dalla
    # tabella sparisce davvero invece di restare orfano.
    if [ "$slug" != "$precedente" ]; then
      rm -rf "$OUT/$slug"
      mkdir -p "$OUT/$slug"
      precedente="$slug"
      i=0
      echo "── $slug"
    fi

    src="$MEDIA/$rel"
    if [ ! -f "$src" ]; then
      echo "   ! manca: $rel" >&2
      continue
    fi

    i=$((i + 1))
    n=$(printf "%02d" "$i")
    # `decrease` non ingrandisce mai: una sorgente più piccola del lato resta
    # com'è invece di essere gonfiata.
    ffmpeg -nostdin -v error -y -i "$src" \
      -vf "scale='min($LATO,iw)':'min($LATO,ih)':force_original_aspect_ratio=decrease" \
      -map_metadata -1 -q:v $QUALITA \
      "$OUT/$slug/$n.jpg"
    wh=$(sips -g pixelWidth -g pixelHeight "$OUT/$slug/$n.jpg" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w" "h}')
    kb=$(awk -v b="$(stat -f %z "$OUT/$slug/$n.jpg")" 'BEGIN{printf "%.0f", b/1024}')
    echo "$slug|$n|$wh|${kb}KB|$rel" >> "$OUT/scatti.txt"
    printf '   %s  %-10s %5s KB  %s\n' "$n" "$wh" "$kb" "$(basename "$rel")"
  done
}

echo
echo "--- per opera ---"
awk -F'|' '{print $1}' "$OUT/scatti.txt" | sort -u | while read -r s; do
  printf '%-20s %3d scatti  %6s\n' "$s" "$(ls "$OUT/$s" | wc -l | tr -d ' ')" "$(du -sh "$OUT/$s" | cut -f1)"
done
