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
# ── L'ARCHIVIO
#
# Sei opere passate in rassegna con Lucio l'8 settembre 2026. Le altre nove
# tengono ancora la copertina singola di `bozze-media.sh`.
#
# `Sketch for Casati Project` e `Biglietto da visita` restano fuori: non sono
# opere. Delle cinque sottocartelle di `ph Veronica Diaz…` ne vale una sola,
# OSER SAVOIR — le altre quattro sono rosse.
TABELLA='
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Martina 10 photos/_MG_0641.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Francesca 8 photos/_MG_0599.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Martina 10 photos/_MG_0658-001.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Nonnora 9 photos/_MG_0546 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Nonnora 9 photos/_MG_0554 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Stefania 7 photos/_MG_0524.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Stefania 7 photos/_MG_0544.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Valeria 10 photos/_MG_0404.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Valeria 10 photos/_MG_0521 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/Valeria Abito nero 7 photos/_MG_0618.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/colloquio 12 photos/_MG_0415 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/colloquio 12 photos/_MG_0425 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/colloquio 12 photos/_MG_0434 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/eleonora 10 photos/_MG_0346 - Copia.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/eleonora 10 photos/_MG_0359.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/eleonora 10 photos/_MG_0392.jpg
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/seduta 12 photos 6+6bw/_MG_0485.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/Photo Davide Fanton Milano Fashion Week.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/Photo Davide Fanton.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/22.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319435_911359268957829_198592860_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12305885_911064522320637_1360306086_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12308846_911064112320678_1059644038_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12308986_911358362291253_944476195_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12312127_911358978957858_615894769_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319288_911359135624509_2042221569_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319308_911063758987380_920179213_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319483_911358428957913_652225524_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12325043_911358345624588_1522507196_n.jpg
ph-shoot-anto|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12325217_911064292320660_1229689628_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78761876_724276168064472_4553956504008392704_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/75521812_454608408586932_6122281189580472320_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/76944268_418518552390748_474567721267232768_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/77155774_765943817210900_4426691331628204032_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/77303023_663955620677129_4893727643058307072_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/77336811_563165674468211_2050212388321361920_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/77347775_2462937883824664_730351230110400512_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78120480_438548993500888_1429156019920961536_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78180255_2475493419356879_7097274203547631616_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78182255_2434410700147775_5879552036265000960_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78215389_449612449079703_6033461021086056448_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78234442_769520836884399_4540288801381023744_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78322959_431958900818303_2259099840749240320_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78587097_486683731941709_8580035529901342720_n.jpg
the-missing|archivio/THE MISSING/ph giuseppe esposito/78693106_753540808446338_7797147860394311680_n.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_4860.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_4886.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_4895.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_4943.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_4959.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_4964.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5001.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5007.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5044.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5072.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5102.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5114.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5120.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5127.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5136.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5143.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5166.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5171.jpg
editorial-blanka|archivio/Ph Blanka Claudio&Fab/photo for editorial/IMG_5196.jpg
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
