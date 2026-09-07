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
#
# A BOY'S CLOSET è l'unica voce della tabella che NON viene da una selezione.
# Quella cartella non porta nessun tag del Finder: niente rossi da escludere,
# ma nemmeno un verde che dica qual è la copertina. Gli otto file ci sono
# tutti — sono pochi e nessuno è scarto — mentre l'ordine e la copertina li ha
# scelti una sessione guardando i derivati. Copertina `image00005`, l'unica
# delle tre inquadrature d'ambiente che regga la misura piccola dell'indice:
# nelle due più larghe gli abiti diventano un punto. Da rivedere con Manuel.
#
# NB: qui dentro non si scrivono commenti. La tabella è una stringa fra apici
# singoli letta riga per riga: un `#` diventerebbe uno slug, e un apostrofo
# chiuderebbe la stringa (per questo «Boy'"'"'s» è scritto così).
TABELLA='
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319435_911359268957829_198592860_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12305885_911064522320637_1360306086_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12308846_911064112320678_1059644038_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12308986_911358362291253_944476195_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12312127_911358978957858_615894769_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319288_911359135624509_2042221569_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319308_911063758987380_920179213_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12319483_911358428957913_652225524_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12325043_911358345624588_1522507196_n.jpg
shooting-editoriale|archivio/Ph Shoot Anto 25.11.15/immagini selezionate e impaginate/12325217_911064292320660_1229689628_n.jpg
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
le-reve-lever|LE REVE LEVER 21-09-22/performance/image00043-standard v2-2x.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/performance/image00052-standard v2-2x.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/performance/image00056-standard v2-2x.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00057.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00035.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00042.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00044.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00046.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00058.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/_selected copy/image00059.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/display/image00055.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/display/image00060.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/display/image00062.jpeg
le-reve-lever|LE REVE LEVER 21-09-22/display/image00063.jpeg
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
oser-savoir|archivio/ph Veronica Diaz seduta spiritica e altro/OSER SAVOIR 15-03-015/seduta 12 photos 6+6bw/_MG_0485.jpg
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
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/Photo Davide Fanton Milano Fashion Week.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/22.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/23.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/24.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/25.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/26.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/27.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/28.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/29.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/30.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/31.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/Editorial Design Scene.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/Editorial.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/New editorial coming soon.jpg
fanton-milano-fashion-week|archivio/Photo Editorial Design Scene 28.09.15/Photo Davide Fanton.jpg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00005.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00003.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00007.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00004.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00006.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00002.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00001.jpeg
a-boys-closet|A Boy'"'"'s Closet Guardaroba di un ragazzo 09-10-020/image00008.jpeg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/1603461384152_DSCT8334-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8199-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT82181603106428758-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8262-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8270-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8285-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8300-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8326-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8331-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8359-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8418-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8450-min.jpg
la-distanza|archivio/LA DISTANZA/ph giuseppe esposito/DSCT8465-min.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1016511_601373343251254_1225950662_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1044265_507560252671098_136659531_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1186749_601375956584326_1843395711_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1231310_601374103251178_1009214640_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1233388_507563769337413_1398053138_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1233532_601373933251195_1734541522_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1233633_601374616584460_1191448038_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1234430_601376796584242_651711431_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1234498_507561106004346_89285915_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1235319_601374753251113_1835283328_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1235977_507567332670390_934237991_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1238043_601373833251205_1530736794_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1238292_601385869916668_267739827_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1239566_507565252670598_1567577467_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1239579_506972332729890_1039693257_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1240329_601376343250954_460523892_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1265105_507565282670595_397035388_o.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/12655_601372986584623_347435929_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1277159_506973142729809_2083624678_o.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/1375934_506972329396557_1517973716_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/44756_601376056584316_2122706823_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/554127_601374206584501_1317019922_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/554625_601375759917679_1895413631_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/561537_601373213251267_1447259262_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/578012_601374999917755_703674172_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/579091_601373443251244_1648308245_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/75037_601374346584487_1962438605_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/954786_601373629917892_1346022322_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/988648_507560069337783_1100210744_n.jpg
candide-a-palazzo-guillot|archivio/Intervento per il Candide a palazzo Guillot, Alghero 21.09.13/ph blanka meccanica/993034_507564806003976_254257198_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10003913_10201989213267152_1073737992556055272_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1012567_10201995429302549_6267519285621431813_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10153790_10201992583751412_6146149810869238279_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10153953_10201995432542630_4965903518183407972_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10153966_10201989205586960_7477715372127014096_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10157211_10201992582751387_5250180789182123363_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10167917_10201992587871515_6937757833944954328_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10167945_10201989230027571_6572176774138063952_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10170777_10201995427742510_6582808239036939800_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10170797_10201989217307253_1355273073961015229_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10171047_10201989215987220_6516002113057245126_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10171125_10201992583391403_6107680814722821146_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10171268_10201989210947094_7690157600478546199_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10171904_10201992588791538_5071196500551821909_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10172632_10201989210547084_2505247416742208758_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10173700_10201989226067472_5752050358042546836_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10174876_10201992584591433_4683328408012347610_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10176053_10201992586791488_6432839146020184333_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10176132_10201989214747189_2285338097862276630_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10177325_10201989214987195_8548240326269915825_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10247268_10201989215507208_910256561280604443_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10247381_10201992581111346_2109135099344923852_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10252018_10201992581511356_1296773703556794426_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10253748_10201989218667287_2101400532574871761_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10253926_10201989221507358_2525292267889547453_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10256533_10201992584071420_617811248541972420_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10258047_10201995428022517_5528352053925942248_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10258139_10201995431062593_4583710435463031558_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10259891_10201992587071495_4735608952952420668_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10259934_10201992585911466_5426448448938016329_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10259998_10201989207146999_7079195887783032053_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10262044_10201989223187400_6474170218447646674_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10262086_10201992582551382_6665085313506265284_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10262204_10201989227667512_3681227046052499167_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10268625_10201989212027121_6470587212110519778_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10269514_10201992588311526_3055205600109556405_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10269640_10201989209507058_8795463875891842856_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10270767_10201992589311551_3867850738709974159_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10271542_10201992583031394_8894348425979222649_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10275978_10201995428862538_8400312007525450109_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10277716_10201989217067247_3807646312272974228_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10277858_10201989210187075_3699001555062402421_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10291311_10201989224187425_6560883935993560323_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10291858_10201989213747164_173937928174021682_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10294265_10201995433102644_8518553207633697828_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10294387_10201989214467182_8854101522385965190_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10297567_10201995432342625_2448162992512725987_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10297719_10201989220387330_3946366716809763268_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10297751_10201995428302524_2006087892143618126_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10298753_10201995432502629_4100186830307603568_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10300774_10201989228707538_1424057472829603944_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10306482_10201992585071445_206945525513891476_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10306629_10201989219707313_3919566836704733802_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10309661_10201989207627011_7852400110766935455_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10310114_10201989204706938_7525461444957752037_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10313357_10201989219387305_3554227721858375563_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10313564_10201995430182571_5006135815074121387_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10313611_10201989230547584_2034685689367410585_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10314527_10201992585431454_8661225200670552159_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10314645_10201989220987345_8956032824433600592_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10320390_10201989226667487_8016139626741394666_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10325559_10201992587471505_5766312747888335311_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10325751_10201989224027421_6674211271337376429_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10330377_10201992586391478_7356962440430520514_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10330408_10201989209027046_5210938435135145488_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10334392_10201989225587460_1301793128948366231_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10337737_10201989228467532_6781766618626037975_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10341817_10201989225187450_4208205364315631047_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/10351580_10201992584751437_2021794140793989489_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1499584_10201995430662583_7200204669272065646_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1536627_10201989222347379_3291060979462958067_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1781936_10201989211467107_4837855734224979216_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1797625_10201989212387130_1617275611108610674_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1798691_10201989215667212_5261149889357741270_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1922078_10201989230747589_4814708745334848328_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/foto ufficiali ph chiara cordeschi/1922267_10201989229147549_8353014904538110841_n.jpg
glamour-confusion|archivio/GLAMOUR CONFUSION 04-05-2014/locandina.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Michela Roggio/IMG_1772.JPG
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Alssandro Marongiu/11187783_10205117185424293_1098701665127202500_o.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Luciano Piras/11147872_828932950533825_7256199755798097251_n.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Luciano Piras/11152341_828938690533251_7647810022314042278_n.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Luciano Piras/11233487_828930360534084_1941262981551699242_n.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Luciano Piras/11257837_828939437199843_819850916382024616_n.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Luciano Piras/1231660_828939277199859_6486818405478496866_n.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Michela Roggio/IMG_1816.JPG
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Michela Roggio/IMG_1873 2.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Michela Roggio/IMG_1886 2.jpg
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Michela Roggio/IMG_1924.JPG
corsa-futurista-i|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista I edizione 10-05-2015/ph Michela Roggio/IMG_1962.JPG
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Lotrella/_DSC3689.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Blanka Meccanica/13138931_1135995783119153_7223389102657881034_n.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Blanka Meccanica/13139024_263691613983332_5874646536773351821_n.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Blanka Meccanica/13151628_263690457316781_1164533189057917093_n.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Blanka Meccanica/13173807_263691313983362_3626903592980833825_n.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Blanka Meccanica/13214794_263689053983588_1088627980_o.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Blanka Meccanica/13234517_266925783659915_1556902473_o.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Lotrella/_DSC3684.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Lotrella/_DSC3686.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Lotrella/_DSC3688.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/Ph Lotrella/_DSC3691.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/foto ufficiali Ph depalmas/Corsa Futurista II  (20).jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/foto ufficiali Ph depalmas/Corsa Futurista II  (22).jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/foto ufficiali Ph depalmas/Corsa Futurista II  (6).jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/photo marongiu/13211169_10207504087215346_1137708229_o.jpg
corsa-futurista-ii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista II edizione 08-05-2016/photo marongiu/13214413_10207504090535429_1575069856_o.jpg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5428.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/31542762_10214496831008667_7851701358167064576_o.jpg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5413.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5414.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5415.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5416.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5417.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5418.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5419.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5420.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5421.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5422.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5423.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5425.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5426.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5427.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5430.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5433.jpeg
corsa-futurista-iii|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista III edizione 04-05-2018/foto ufficiali ph depalmas/IMG_5434.jpeg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/2.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_6943.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_6973.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7128.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7260.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7367.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7434.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7505.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7548.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7632.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7660.jpg
corsa-futurista-iv|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista IV edizione/DSC_7677.jpg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_0999.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_0994.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_0995.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_0996.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_0997.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_0998.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_1001.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_1002.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_1003.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_1004.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_1005.jpeg
corsa-futurista-vi|archivio/CORSA FUTURISTA 2015-2024/CORSA FUTURISTA tutte le edizioni/Corsa Futurista VI edizione 07-05-2023/foto ufficiali ph tommy bentivegna/IMG_1006.jpeg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI I performance ss Liceo Artistico - maggio 2017/ph lorella comi/_DSC5140.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/ph di blanka foto per locandina- modella raffaela ariano/Creazione di una Musa Alghero (5).jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/ph di blanka foto per locandina- modella raffaela ariano/IMG_2259.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/ph di blanka foto per locandina- modella raffaela ariano/IMG_2345.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI I performance ss Liceo Artistico - maggio 2017/ph lorella comi/_DSC5129.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI I performance ss Liceo Artistico - maggio 2017/ph lorella comi/_DSC5142.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI I performance ss Liceo Artistico - maggio 2017/ph lorella comi/_DSC5148.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/performance/1.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/performance/16.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/performance/25.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/performance/6.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/performance/9.jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/ph bacstage/Creazione di una Musa Alghero (1).jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/ph bacstage/Creazione di una Musa Alghero (3).jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/ph bacstage/Creazione di una Musa Alghero (37).jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/ph bacstage/Creazione di una Musa Alghero (39).jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/ph bacstage/Creazione di una Musa Alghero (41).jpg
apoteosi|archivio/APOTEOSI Creazione di una Musa/APOTEOSI II performance aho mostra a Lu Quarter - maggio 2017/ph blanka meccanica/ph bacstage/Creazione di una Musa Alghero (42).jpg
'

# Il referto si azzera SOLO in una passata intera. Con degli slug in riga di
# comando si tolgono le righe di quelli e basta: prima non era così, e un
# `./scripts/scatti.sh apoteosi` cancellava dal referto le misure di tutte le
# altre opere senza dirlo. Il file committato con `eb79aad` porta il segno di
# quella volta — sei opere su quindici — e non è stato ricostruito qui perché
# rifarlo vuol dire riderivare 334 fotografie.
if [ $# -eq 0 ]; then
  : > "$OUT/scatti.txt"
elif [ -f "$OUT/scatti.txt" ]; then
  resta=$(grep -v -E "^($(printf '%s|' "$@" | sed 's/|$//'))\|" "$OUT/scatti.txt" || true)
  printf '%s\n' "$resta" | grep -v '^$' > "$OUT/scatti.txt" || true
fi

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
