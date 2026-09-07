#!/bin/bash
# Deriva le icone del sito e le immagini di profilo dal ritratto stilizzato.
#
# Sorgente: 01-assets/webico/svg.svg — il VETTORE, dal 7 settembre 2026.
#
# Prima si partiva dal livello 2 del PSD, ed era una sorgente peggiore per due
# ragioni. Il colore: nel PSD inchiostro e fondo sono pixel, e per ricolorarne
# uno solo bisognava sperare che l'alfa fosse pulita — il composito era già
# appiattito su avorio, e la prima versione rossa venne fuori un quadrato
# vuoto. Nell'SVG i 56 tracciati non dichiarano `fill`, quindi lo ereditano
# dalla radice: un attributo solo e l'inchiostro cambia tutto insieme. Il fondo
# è un `<rect id="SFONDO">` a sé, che si ricolora o si toglie.
#
# E la resa: ogni misura si RASTERIZZA a quella misura invece di rimpicciolire
# un bitmap, quindi 32 e 48 pixel escono con i tratti puliti invece che
# mediati. ImageMagick qui non ha il delegato rsvg, ma il suo renderer interno
# su questo file è corretto — verificato contro Quick Look, resa identica.
#
# `logo.psd` e `bw.png` restano nella cartella come sorgenti storiche.
#
#   ./scripts/icone.sh
#
# ── PERCHÉ IL FONDO NON È MAI TRASPARENTE ───────────────────────────────────
# Nel disegno il volto NON è disegnato: è vuoto. Il nero è solo inchiostro, e
# pelle, bianco degli occhi e riccioli sono trasparenza. Su fondo scuro il
# volto diventa scuro, i tratti neri ci spariscono dentro e la massa dei
# capelli si fonde col fondo: non resta un ritratto. Ogni piattaforma compone
# sul proprio fondo e parecchie lo cambiano col tema dell'app, quindi un PNG
# con alfa caricato come propic è una scommessa sul tema di chi guarda.
# La trasparenza resta il master; ciò che si carica è appiattito.
#
# ── PERCHÉ IL ROSSO STA NELLA TELA E NON NELL'INCHIOSTRO ────────────────────
# Contrasti misurati sulla tavolozza vera (rosso #C1121C, avorio #f5f5f0,
# inchiostro #090d16):
#
#   inchiostro su avorio   17,77 : 1
#   avorio su rosso         5,70 : 1
#   inchiostro su rosso     3,12 : 1
#
# Il disegno è quasi tutto linee sottili — i riccioli, i tratti del viso — e a
# quaranta pixel le linee sono la prima cosa che si perde. Per questo la
# versione rossa porta l'inchiostro AVORIO e non nero: 5,70 invece di 3,12.
#
# ── I MARGINI ───────────────────────────────────────────────────────────────
# Nella sorgente l'inchiostro occupa 1902 su 1950: l'1% di margine, il disegno
# è a filo. Le propic vengono ritagliate IN CERCHIO da quasi tutte le
# piattaforme, e in un cerchio inscritto gli angoli spariscono — che è dove
# stanno le punte dei capelli. Perciò ogni uscita rimonta il contenuto su una
# tela più grande:
#
#   92%  favicon e icone quadrate — lì si vuole il massimo ingombro
#   82%  propic — sta dentro il cerchio senza sembrare rimpicciolita
#   76%  icona `maskable` — la specifica PWA garantisce solo l'80% centrale
set -e

SORGENTE="/Users/lucio/Desktop/manuel-portfolio/01-assets/webico/svg.svg"
APP="/Users/lucio/Desktop/manuel-portfolio/04-site/app"
SOCIAL="/Users/lucio/Desktop/manuel-portfolio/01-assets/webico/export"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

AVORIO="#f5f5f0"
ROSSO="#C1121C"

[ -f "$SORGENTE" ] || { echo "manca $SORGENTE" >&2; exit 1; }

INCHIOSTRO="#090d16"   # l'inchiostro del sito, non il nero puro del disegno

# Tre varianti dello STESSO vettore, ottenute riscrivendo due colori:
#   · `.cls-1` è il fill del `<rect id="SFONDO">`, cioè la tela
#   · il `fill` sulla radice `<svg>` lo ereditano i 56 tracciati, cioè l'inchiostro
# La variante trasparente toglie il rect invece di ricolorarlo.
variante() { # $1=tela ("" per nessuna) $2=inchiostro $3=uscita
  local tela=$1 inch=$2 uscita=$3
  if [ -n "$tela" ]; then
    sed -e "s|\.cls-1{fill:#fff;}|.cls-1{fill:$tela;}|" \
        -e "s|<svg |<svg fill=\"$inch\" |" "$SORGENTE" > "$uscita"
  else
    sed -e "s|<rect id=\"SFONDO\"[^/]*/>||" \
        -e "s|<svg |<svg fill=\"$inch\" |" "$SORGENTE" > "$uscita"
  fi
}

variante "$AVORIO" "$INCHIOSTRO" "$TMP/avorio.svg"
variante "$ROSSO"  "$AVORIO"     "$TMP/rosso.svg"
variante ""        "$INCHIOSTRO" "$TMP/nudo.svg"
echo "vettore: $(magick "$SORGENTE" -format '%wx%h' info:)"

# lato | percentuale del contenuto | vettore già colorato | uscita
#
# Il vettore si rasterizza AL DOPPIO della misura del contenuto e poi si
# riduce: il renderer interno di ImageMagick antialiasa poco, e un passaggio di
# riduzione su un disegno di sole linee vale più di quanto costi.
resa() {
  local lato=$1 pc=$2 sorg=$3 uscita=$4
  local c=$((lato * pc / 100))
  local fondo
  fondo=$(magick "$sorg" -format "%[pixel:p{2,2}]" info:)
  magick -background none "$sorg" -density 300 -resize "$((c * 2))x$((c * 2))" \
    -resize "${c}x${c}" -background "$fondo" -gravity center \
    -extent "${lato}x${lato}" -strip "$uscita"
}

echo "── icone del sito (app/, convenzioni Next.js)"
# Il vettore come favicon: i browser moderni lo preferiscono al PNG e lo
# disegnano alla misura che vogliono, senza passare da nessuna riduzione.
variante "$AVORIO" "$INCHIOSTRO" "$APP/icon.svg"

# `favicon.ico` porta tre misure nello stesso file: 16 per la scheda, 32 per il
# segnalibro, 48 per la scorciatoia sul desktop. Le tre sono costruite UNA PER
# UNA e non con `auto-resize`, perché a 16 pixel il disegno va trattato.
#
# A quella misura i riccioli non ci stanno: la riduzione li media in un grigio
# uniforme e il ritratto diventa una macchia. Un `-level` prima di scendere
# spinge i mezzitoni verso i due estremi, e quello che resta è una testa scura
# attorno a un volto chiaro — non il ritratto, ma una sagoma riconoscibile.
# Provate anche le soglie dure (`-threshold`): bruciano tutto in bianco.
#
# Resta vero che a 16 pixel questo disegno dà il suo minimo: vedi il commento
# in coda allo script.
resa 48 92 "$TMP/avorio.svg" "$TMP/ico48.png"
resa 32 92 "$TMP/avorio.svg" "$TMP/ico32.png"
resa 128 92 "$TMP/avorio.svg" "$TMP/ico-grande.png"
magick "$TMP/ico-grande.png" -resize 16x16 -level 20%,80% "$TMP/ico16.png"
magick "$TMP/ico48.png" "$TMP/ico32.png" "$TMP/ico16.png" "$APP/favicon.ico"

resa 512 92 "$TMP/avorio.svg" "$APP/icon.png"
# Apple non tollera la trasparenza e arrotonda gli angoli da sé: fondo pieno e
# nessun angolo disegnato.
resa 180 82 "$TMP/avorio.svg" "$APP/apple-icon.png"

echo "── propic e icone larghe ($SOCIAL)"
mkdir -p "$SOCIAL"
# Il master, gli unici due file con l'alfa. Non si caricano da nessuna parte.
cp "$TMP/nudo.svg" "$SOCIAL/master-trasparente.svg"
magick -background none "$TMP/nudo.svg" -resize 2048x2048 -background none \
  -gravity center -extent 2048x2048 "$SOCIAL/master-trasparente.png"

for lato in 1080 800 400 180; do
  resa "$lato" 82 "$TMP/avorio.svg" "$SOCIAL/propic-avorio-$lato.png"
  resa "$lato" 82 "$TMP/rosso.svg"  "$SOCIAL/propic-rosso-$lato.png"
done

# `maskable`: Android ritaglia questa icona con una forma che decide lui, e
# garantisce solo il cerchio centrale all'80%. Fondo pieno fino al bordo.
resa 512 76 "$TMP/avorio.svg" "$SOCIAL/maskable-512.png"

echo "── la card delle anteprime (app/opengraph-image.png)"
# 1200x630 è la misura che WhatsApp, X, Slack, Facebook e LinkedIn si aspettano:
# sotto la ritagliano, sopra la rimpiccioliscono.
#
# Rosso con ritratto e marchio avorio: è la coppia della chiusura di /about, il
# momento più riconoscibile del sito, e a questa misura il rosso non costa
# contrasto — il problema delle linee sottili si presenta sotto i sessanta
# pixel, non a milleduecento.
MARCHIO="/Users/lucio/Desktop/manuel-portfolio/01-assets/svg/manuel-wide-web.svg"
sed "s|<svg |<svg fill=\"$AVORIO\" |" "$MARCHIO" > "$TMP/marchio.svg"
# Le misure: ritratto 420 quadrato a sinistra con 90 di margine (90→510),
# ottanta di stacco, marchio largo 520 a destra (590→1110). Nessuno dei due
# tocca l'altro, e il marchio resta alto 44 — leggibile anche quando una chat
# rimpicciolisce la card a un terzo.
magick -background none "$TMP/nudo.svg" -resize 420x420 \
  -channel RGB -fill "$AVORIO" -colorize 100 +channel "$TMP/og-ritratto.png"
magick -background none "$TMP/marchio.svg" -resize 520x "$TMP/og-marchio.png"
magick -size 1200x630 "xc:$ROSSO" \
  "$TMP/og-ritratto.png" -gravity west -geometry +90+0 -composite \
  "$TMP/og-marchio.png" -gravity east -geometry +90+0 -composite \
  -strip "$APP/opengraph-image.png"
identify -format "card: %wx%h\n" "$APP/opengraph-image.png"

echo
echo "--- fatto ---"
ls -1 "$APP"/favicon.ico "$APP"/icon.png "$APP"/icon.svg "$APP"/apple-icon.png
ls -1 "$SOCIAL"

# ── QUELLO CHE QUESTO SCRIPT NON PUÒ FARE ───────────────────────────────────
# A 16 pixel il ritratto non regge, e non è un problema di risoluzione: il
# disegno porta più dettaglio di quanto 256 pixel possano contenere, e nessun
# master più grande lo risolve. Quello che servirebbe è un SEGNO SEMPLIFICATO
# per le misure piccole — meno riccioli, tratti più spessi — che è una
# decisione di disegno e non un'esportazione.
#
# Da un bitmap si può solo sfocare. Con un VETTORE si potrebbe ricavarlo
# pulito, e sarebbe anche la sorgente giusta per `app/icon.svg`, che i browser
# moderni preferiscono al PNG. È la ragione per cui il vettore serve: non per
# ingrandire — a ingrandire il PNG da 1902px basta — ma per poter semplificare.
