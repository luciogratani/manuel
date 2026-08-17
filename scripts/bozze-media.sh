#!/bin/bash
# Deriva le immagini web per le bozze. Sorgenti intatte, derivati piccoli.
set -e

MEDIA="/Users/lucio/Desktop/manuel-portfolio/01-assets/media"
OUT="/Users/lucio/Desktop/manuel-portfolio/04-site/public/bozze"

rm -rf "$OUT"
mkdir -p "$OUT/indice" "$OUT/funeral-rave"

# ── L'indice: una foto per cartella-opera. Archivio prima (piu vecchie), poi
#    le recenti. E un ordine provvisorio: la cronologia vera la da la curatela.
i=0
: > "$OUT/indice.txt"
{
  find "$MEDIA/archivio" -mindepth 1 -maxdepth 1 -type d | sort
  find "$MEDIA" -mindepth 1 -maxdepth 1 -type d ! -name archivio | sort
} | while IFS= read -r dir; do
  src=$(find "$dir" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) \
        ! -name '._*' | sort | head -1)
  [ -z "$src" ] && continue
  i=$((i + 1))
  n=$(printf "%03d" "$i")
  sips -Z 900 -s format jpeg -s formatOptions 60 "$src" --out "$OUT/indice/$n.jpg" >/dev/null 2>&1 || continue
  wh=$(sips -g pixelWidth -g pixelHeight "$OUT/indice/$n.jpg" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w" "h}')
  echo "$n|$(basename "$dir")|$wh" >> "$OUT/indice.txt"
done

# ── FUNERAL RAVE: la mensola della slide 01 e la colonna della 04.
j=0
: > "$OUT/funeral-rave.txt"
find "$MEDIA/FUNERAL RAVE 30-06-23" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) \
  ! -name '._*' | sort | head -12 | while IFS= read -r src; do
  j=$((j + 1))
  n=$(printf "%02d" "$j")
  sips -Z 1600 -s format jpeg -s formatOptions 62 "$src" --out "$OUT/funeral-rave/$n.jpg" >/dev/null 2>&1 || continue
  wh=$(sips -g pixelWidth -g pixelHeight "$OUT/funeral-rave/$n.jpg" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w" "h}')
  echo "$n|$wh" >> "$OUT/funeral-rave.txt"
done

echo "--- indice ---"; cat "$OUT/indice.txt"
echo "--- funeral rave ---"; cat "$OUT/funeral-rave.txt"
echo "--- peso ---"; du -sh "$OUT"
