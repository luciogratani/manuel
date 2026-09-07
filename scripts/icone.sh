#!/bin/bash
# Deriva le icone del sito e le immagini di profilo dal ritratto stilizzato.
#
# Sorgente: 01-assets/webico/logo.psd, LIVELLO 2 — e il livello conta.
#
# Il PSD ha quattro immagini dentro: il composito (`[0]`), il fondo avorio
# (`[1]`), il disegno (`[2]`) e un livello nero (`[3]`). Solo il `[2]` porta
# trasparenza vera: 1902x1894, angolo `srgba(0,0,0,0)`. Il composito è già
# appiattito su avorio, e usarlo sembra funzionare finché non si prova a
# ricolorare l'inchiostro — allora si colora tutta la tela, perché per il
# programma «inchiostro» e «fondo» sono lo stesso pixel opaco. È successo, e
# la versione rossa veniva fuori un quadrato vuoto.
#
# `bw.png` accanto è lo stesso appiattimento: comodo da guardare, inutile come
# sorgente, perché da un fondo non si torna indietro.
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

SORGENTE="/Users/lucio/Desktop/manuel-portfolio/01-assets/webico/logo.psd"
APP="/Users/lucio/Desktop/manuel-portfolio/04-site/app"
SOCIAL="/Users/lucio/Desktop/manuel-portfolio/01-assets/webico/export"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

AVORIO="#f5f5f0"
ROSSO="#C1121C"

[ -f "$SORGENTE" ] || { echo "manca $SORGENTE" >&2; exit 1; }

# Il composito del PSD, al vivo: da qui in poi si lavora sul solo inchiostro,
# così i margini li decide questo script e non il file di Photoshop.
magick "$SORGENTE[2]" -alpha on -trim +repage "$TMP/inchiostro.png"
[ "$(magick "$TMP/inchiostro.png" -format %[opaque] info:)" = "False" ] || {
  echo "il livello scelto non ha trasparenza: controlla gli indici del PSD" >&2
  exit 1
}
echo "inchiostro: $(identify -format '%wx%h' "$TMP/inchiostro.png")"

# lato | percentuale del contenuto | fondo | colore dell'inchiostro (vuoto = com'è) | uscita
resa() {
  local lato=$1 pc=$2 fondo=$3 inch=$4 uscita=$5
  local c=$((lato * pc / 100))
  if [ -n "$inch" ]; then
    magick "$TMP/inchiostro.png" -channel RGB -fill "$inch" -colorize 100 +channel \
      -resize "${c}x${c}" -background "$fondo" -gravity center -extent "${lato}x${lato}" \
      -strip "$uscita"
  else
    magick "$TMP/inchiostro.png" \
      -resize "${c}x${c}" -background "$fondo" -gravity center -extent "${lato}x${lato}" \
      -strip "$uscita"
  fi
}

echo "── icone del sito (app/, convenzioni Next.js)"
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
resa 48 92 "$AVORIO" "" "$TMP/ico48.png"
resa 32 92 "$AVORIO" "" "$TMP/ico32.png"
resa 128 92 "$AVORIO" "" "$TMP/ico-grande.png"
magick "$TMP/ico-grande.png" -resize 16x16 -level 20%,80% "$TMP/ico16.png"
magick "$TMP/ico48.png" "$TMP/ico32.png" "$TMP/ico16.png" "$APP/favicon.ico"
resa 512 92 "$AVORIO" "" "$APP/icon.png"
# Apple non tollera la trasparenza e arrotonda gli angoli da sé: fondo pieno e
# nessun angolo disegnato.
resa 180 82 "$AVORIO" "" "$APP/apple-icon.png"

echo "── propic e icone larghe ($SOCIAL)"
mkdir -p "$SOCIAL"
# Il master, l'unico file con l'alfa. Non si carica da nessuna parte.
magick "$TMP/inchiostro.png" -resize 2048x2048 -background none -gravity center \
  -extent 2048x2048 "$SOCIAL/master-trasparente.png"

for lato in 1080 800 400 180; do
  resa "$lato" 82 "$AVORIO" "" "$SOCIAL/propic-avorio-$lato.png"
  resa "$lato" 82 "$ROSSO" "$AVORIO" "$SOCIAL/propic-rosso-$lato.png"
done

# `maskable`: Android ritaglia questa icona con una forma che decide lui, e
# garantisce solo il cerchio centrale all'80%. Fondo pieno fino al bordo.
resa 512 76 "$AVORIO" "" "$SOCIAL/maskable-512.png"

echo
echo "--- fatto ---"
ls -1 "$APP"/favicon.ico "$APP"/icon.png "$APP"/apple-icon.png
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
