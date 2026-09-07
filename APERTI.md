# Lavori aperti

Cose decise, valutate o misurate che **non hanno un posto nel codice** — perché
riguardano più file, o perché sono domande ancora aperte.

Quello che invece riguarda un punto solo sta accanto a quel punto, com'è lo
stile di questo repo: ogni pagina dichiara da sé cosa le manca — oggi resta il
§8 dei video, dichiarato irrisolto in `app/page.tsx`. Quelle non si ripetono
qui.

Per lo stato di una singola sessione — cos'è appena cambiato, cosa va guardato
a mano, chi ha deciso cosa — c'è `HANDOFF.md`, che è datato e si consuma. Qui
sta solo ciò che resta vero nel tempo.

---

## Le opere che mancano

`lib/opere.ts` progetta «una sequenza unica 01→26» (§3.3) e contiene **ventuno**
opere, numerate 01→21.

**8 settembre 2026 — Corsa Futurista non è un'opera, sono cinque.** Erano una
voce sola con l'arco «2015–2024». In archivio ci sono le edizioni **I** (10
maggio 2015), **II** (8 maggio 2016), **III** (4 maggio 2018), **IV** (4 maggio
2019, data letta dall'EXIF perché il nome della cartella non ce l'ha) e **VI**
(7 maggio 2023). La **V manca**, ed è l'unica a cui Manuel non ha partecipato.
Ognuna è un'opera a sé, e le cinque si distribuiscono lungo la cronologia
invece di stare tutte insieme nel 2015 — è il motivo per cui la sequenza si è
riordinata di nuovo.

Il tag che marca la copertina si chiama **`Arancio`** (non «Arancione»), e
convive col verde: cinque file portano `Verde, Arancio`, uno per edizione.

**7 settembre 2026, sera — la sequenza è stata riordinata.** Era cronologica
solo a grandi linee: le quattro opere del 2015 stavano in un ordine qualunque.
Con le date certe dei nomi di cartella e dei documenti — Oser Savoir 15 marzo,
Corsa Futurista 1 maggio, Photo Editorial Design Scene 28 settembre, Ph Shoot
Anto 25 novembre — adesso lo sono davvero, e Apoteosi ha l'anno che il
portfolio le dà (29 maggio 2017). I numeri sono stati riassegnati di
conseguenza: sono apparato, non identità, e gli slug non li contengono. Le pagine adesso contano invece di dichiarare, quindi
nessuna mente — ma le cinque assenti restano da inserire, ed è curatela.

Il repo non dice quali siano. Dice però dove cercarle:

- **Quattro immagini senza opera.** `public/media/indice/` contiene ventiquattro
  file (001→024) e `lib/opere.ts` ne referenzia venti. Orfani: **002, 003, 014,
  022**.
- **Due voci di cronologia senza opera.** In `lib/timeline.ts` tutte le voci
  hanno uno slug che rimanda all'archivio, tranne **L'Affair** (2021, video
  performance) e **BDSM** (2025, video). Sono in cronologia ma non in archivio,
  quindi non hanno numero.

Le due liste possono sovrapporsi: una delle immagini orfane potrebbe essere
proprio L'Affair o BDSM.

**7 settembre 2026 — tre opere sono uscite dall'archivio.** Scelta di Lucio:
**The Red White Horse**, **Marie Antoinette in thr Fridge** e **Editoriale x
Vogue** non ci vanno. Le voci sono state tolte da `lib/opere.ts` e la sequenza
**rinumerata da capo, 01→18**: il numero è apparato e non identità — lo slug non
lo contiene (§3.3), quindi nessun URL è cambiato. Le tre copertine
(`indice/005`, `010`, `024`) restano su disco come file orfani.

Resta da chiarire **se il totale è ancora 26**: la guida lo dà per deciso (§1),
ma è stato scritto prima di queste tre esclusioni. Con 26 le mancanti sono otto,
non cinque.

**Aggiornamento del 7 settembre 2026** — guardando le sorgenti invece dei nomi,
tre delle cinque hanno un nome e un materiale finito, e sono tutte e tre
**solo-video**: `01-assets/media` contiene tre cartelle con un montato e zero
fotografie — **L'Affair** (1:21, video di Giuseppe Esposito, modelli Josh
Castiglioni e Stefano Raffo), **Love and Eat** (6:16, cinque performer, con un
elaborato testuale di Manuel Delogu) e **Sauvage** (2:19, video di
presentazione per la seconda serata di Sauvage di Technoroom, Sassari — la data
manca). Entrare in archivio dipende dalla decisione sulla copertina, qui sotto.

**L'opera 10 non era «Seduta spiritica».** La cartella sorgente si chiama
`ph Veronica Diaz seduta spiritica e altro`, e dentro — tolte le quattro
sottocartelle rosse, che sono Mumi Mumi, David Bowie Tribute, Gruppo in un
interno e Me — resta una cosa sola: `OSER SAVOIR 15-03-015`, 111 fotografie.
**Oser Savoir** è uno dei due titoli trovati nel portfolio compilato che in
`opere.ts` non esistevano, e ha un testo curatoriale intero sulla collezione
Marchesa Casati, le sedute spiritiche e la tavoletta Ouija — che nelle
fotografie si vede, tavolo e Ouija compresi. La seduta è una scena dell'opera,
non l'opera; «Veronica Diaz» è la fotografa e ora è un credito. Slug, titolo e
anno (2015) aggiornati.

**Dark Romance ha una corrispondenza, e crea un conflitto.** L'altro titolo
orfano del portfolio è la cartella `Photo Editorial Design Scene 28.09.15`: le
pagine dell'editoriale pubblicato portano il frontespizio **DARK ROMANCE** con
«photos by Davide Fanton», e il portfolio compilato elenca «Dark Romance»
seguito da «Editoriale per Design Scene Magazine 28/09/2015». Lucio ha però
chiesto di chiamarla **Fanton Milano Fashion Week** — dal nome di uno dei file —
e così è in `opere.ts`. **Due fonti dicono Dark Romance, l'istruzione dice
Fanton**: da sciogliere, è una riga.

**«BDSM» invece non esiste**: nessuna cartella porta quel nome, e nel portfolio
compilato «BDSM» compare come riferimento culturale della collezione 1780/89,
non come titolo. La voce 2025 di `lib/timeline.ts` è senza sorgente. Da
chiarire con Manuel: è un'opera, o è un attributo di un'altra?

## `/works` legge dalla più recente, e i tag aspettano

Dal 6 settembre 2026 l'indice è **una riga sola che scorre in orizzontale**,
letta dalla più recente (a sinistra) alla più vecchia. `lib/opere.ts` resta in
ordine cronologico 01→26; il verso di lettura lo decide `page.tsx`
(`INDICE = [...OPERE].reverse()`). Prima era a due righe riempite per colonna,
con le opere consecutive impilate.

Lo scorrimento (`motore.tsx`) è **continuo**, non più a passi: rotella e dito
trascinano la striscia in pixel, con l'elastico ai capi (costanti in
`lib/indice.ts`). Due Observer sullo stesso target — uno rotella senza
`ignore`, uno tocco con `ignore` — così si scorre anche col cursore sopra
un'opera (era il bug già corretto su timeline e mensola). **Non c'è ancora**
né trascinamento col mouse né navigazione da tastiera: col `Tab` il fuoco
passa da un link all'altro ma la striscia non lo segue.

La banda sotto la striscia riceve un hover **ritardato** (`RITARDO_BANDA`) e
fa un **crossfade** fra un'opera e l'altra (`banda.tsx`): spazzando il mouse
non insegue più le opere di passaggio e non sfarfalla.

Restano aperte:

- **Frecce ←/→ e drag col mouse** da aggiungere: senza, le opere fuori
  schermo non si raggiungono senza rotella. Buon momento prima dei filtri.
- **La banda resta indietro dopo uno scroll con la rotella**: il mouse è
  fermo ma sotto è passata un'altra opera, e la banda si aggiorna solo se
  muovi il puntatore. La timeline lo risolve ri-controllando la posizione
  del puntatore quando il moto si ferma (`setRiaggancio` in `timeline/
  motore.tsx`).
- **I tre tag** (`performance`, `fotografia`, `editoriale`) sono ancora un MOCK:
  l'interazione c'è (un radio ciascuno, gli altri si attenuano) ma `lib/opere.ts`
  non ha un campo `tags` reale e non filtrano niente. Quando la curatela scrive
  il campo, `Banda` collega lo stato al contesto della griglia — vedi i commenti
  in `banda.tsx` e `page.tsx`. Da decidere anche **come** il filtro agisce sulla
  striscia: nasconde le opere fuori tag, le attenua, o le salta col cursore.
- Nella banda la **coordinata** mostra il numero d'archivio dell'opera (`006`),
  l'**indicatore** la sua posizione nella striscia (`(16—21)`): rovesciando
  l'ordine i due numeri divergono. È coerente col resto del sito (numero ≠
  posizione), ma se dà fastidio l'indicatore è in `banda.tsx`.

## La selezione delle opere recenti

Il 7 settembre 2026 cinque opere sono passate dalla copertina singola generata
da `bozze-media.sh` a una **selezione scelta da Manuel e Lucio**: 48 fotografie
e 13 filmati, derivati da `scripts/scatti.sh` e `scripts/filmati.sh`.

| opera | scatti | filmati | luogo |
|---|---|---|---|
| 13 Le Rêve — Lever | 7 | 1 (0:54) | studioamatoriale, Milano |
| 14 Funeral Rave | 8 | 1 (1:35) | Spazio Sabotage, Sassari |
| 16 Feral | 11 | 3 teaser (0:30) | **da chiarire** |
| 17 Don Giovanni | 11 | 1 (0:38) | **da chiarire** |
| 18 Coucher avec moi | 11 | 6 clip (1:23) | Teatro Genova, Sassari |

Tutte e cinque sono passate a `densita: "piena"`: avevano una fotografia sola e
adesso ne hanno da sette a undici, e il layout `minima` è disegnato per la foto
singola.

### Le regole di selezione, dette da Lucio

- **Tag rosso del Finder = escluso.** Vale per una cartella o per un file.
- **Tag verde** = copertina se è l'unico dell'opera; se sono più d'uno, sono i
  materiali importanti da includere. I tag sono in italiano (`Rosso`, `Verde`):
  `mdfind "kMDItemUserTags == 'Verde'"`.
- Ogni opera recente ha un `descrizione.rtf` (Le Rêve Lever anche un
  `descrizione.jpeg`, Feral un `descrizione.pdf`) con crediti e testo.
- Delle cartelle più corpose **non si carica tutto**: la selezione la fa Manuel.

### Una trappola trovata lavorando: l'orientamento EXIF

Tredici delle sorgenti selezionate portano un **EXIF Orientation 6 o 8** — i
pixel sono orizzontali, l'immagine vera è verticale. `sips -Z`, che
`bozze-media.sh` usa, conserva sia i pixel che il tag: il file misura 1600×1200
ma il browser (che l'EXIF lo applica) ne mostra 1200×1600. Le misure in
`lib/opere.ts` sarebbero state rovesciate, `formato()` avrebbe scelto 4:3 al
posto di 3:4 e **la cornice avrebbe ritagliato l'immagine sbagliata**.

`scripts/scatti.sh` usa ffmpeg, che l'orientamento lo applica scrivendo, e
`-map_metadata -1` non lascia il tag nel derivato — i pixel sono già girati e
nessuno li gira una seconda volta. Se un domani si torna a `sips`, questo
problema torna con lui.

### Cosa resta da chiarire

- ~~Feral, il `4734` che non esiste e i due verdi di Carla Rudy.~~ **Chiuso**
  da Lucio il 7 settembre 2026: Feral resta con gli undici scatti che ha.
- ~~Coucher, il video verde da un'ora.~~ **Chiuso** da Lucio il 7 settembre
  2026: il rush a camera fissa (3600 secondi, 1,1 GB) **non va incluso**.

  E vale in generale: **dove un'opera ha troppi video, il montaggio lo fa
  Lucio** — Coucher e gli altri lavori con molte riprese, e anche il filmato
  dell'hero della home. Quindi le sei clip brevi di Coucher che sono in
  archivio adesso sono **provvisorie**: stanno lì finché non arriva il
  montaggio, e allora si sostituiscono con quello. Lo stesso vale per
  `public/media/home/hero.mp4`.

  La conseguenza per chi lavora qui: non spendere tempo a curare la sequenza
  delle clip di un'opera che aspetta un montaggio. Il montaggio è un file solo,
  e quando arriva prende il posto di tutte.
- **La copertina di Don Giovanni** è `_selected copyed/IMG_0542` per posizione,
  non per scelta: nessuno l'ha indicata.
- ~~Le copertine d'archivio vengono da cartelle rosse.~~ **Fatto** il 7
  settembre 2026: Ph Shoot Anto prende la copertina da «immagini selezionate e
  impaginate» (640px — la sorgente è quella, viene da un social), Oser Savoir
  da `OSER SAVOIR 15-03-015`. Le due opere sono in `scripts/scatti.sh` con un
  file solo: è la copertina giusta, non ancora una selezione. **Resta vero il
  problema generale**: `bozze-media.sh` non sa niente dei tag e le altre
  quindici copertine d'archivio non sono state ricontrollate una per una.
- ~~I crediti veri non hanno un posto nel modello.~~ **Fatto** il 7 settembre
  2026: `Credito` è una tupla `[ruolo, nome]`, `Opera.crediti` è opzionale, e
  le righe stanno in coda alla `dl` dell'apparato — prima il materiale (anno,
  medium, luogo, scatti, filmato), poi le persone. Le cinque opere recenti e
  Oser Savoir hanno i crediti dai documenti sorgente; dove il documento tace,
  la riga non c'è. Manuel non compare a meno che non abbia un ruolo che non si
  dà per scontato — in Don Giovanni compare perché lì è anche performer.

  **Due cose da sapere.** È l'unico punto in cui il foglio della work page è
  stato toccato: `.credito[data-persone]` ha una larghezza di 16rem e va a
  capo, perché «Arturo Fraddi, Antonio Cabras, Simone Righi, Dimitri Ruiu,
  Giuseppe Hussein» su una riga sola correrebbe da 817px fin sotto la nota, che
  attacca a 1096. E in `densita: "minima"` l'apparato parte da 560px: sei righe
  di crediti ci stanno, dodici no — oggi nessuna opera minima ne ha tante, ma
  il giorno che capita va guardato.

  Ancora **PROVVISORIO**: l'artwork e le luci di Don Giovanni sono di «Lucio»,
  perché il documento sorgente non dà il cognome.

## Due opere senza sorgente, e un fotografo incerto

**«Antropologia» non ha una cartella.** Come BDSM: è una voce di
`lib/opere.ts` a cui in `01-assets/media` non corrisponde niente. La sua unica
immagine è `indice/018`, derivata da `bozze-media.sh`, che pescava una foto per
cartella — quindi quella copertina viene dalla cartella di **qualcun altro**, e
non si sa quale. Il testo dell'opera adesso lo dice invece di nasconderlo, ma
la voce va chiarita con Manuel: o ha una sorgente che non abbiamo trovato, o
non è un'opera.

**Oser Savoir, chi ha fotografato?** Il credito dice «Veronica Diaz», che è il
nome della cartella padre. Dentro però c'è una sottocartella
`Preview Kismet Habble`, e `Appunti Finali.txt` è una lettera della fotografa
firmata «Kismet_» che parla di 85 immagini e ringrazia per la collaborazione.
Delle due l'una: o Kismet Habble è il nome d'arte di Veronica Diaz, o il
credito è sbagliato. Da chiedere.

## Quanto testo regge la work page

Misurato in Chrome a 1440×900 su tutte e ventuno le opere, l'8 settembre 2026.

L'apparato ha **169px verticali**: la colonna del testo attacca a 136 e le
fotografie a 305. Con la colonna larga 280px — la misura dell'artboard — ci
stanno cinque righe, cioè **~250 battute**. Finché il testo era il segnaposto
(120 battute) il disegno reggeva; con i testi di curatela veri, da 350 a 490
battute, **quattordici opere su ventuno avevano il testo sopra le fotografie**.
Su Glamour Confusion erano sei righe illeggibili sull'immagine.

Sistemato così, e sono tre cose distinte:

- **La colonna del testo è larga 416px** invece di 280. Da 282 arriva a 698, e
  la seconda colonna attacca a 817: lo spazio c'era. Le stesse battute passano
  da undici righe a sette.
- **La terza colonna parte da 136** e non più da 226, cioè dalla quota del
  titolo invece che da quella della descrizione. I sei crediti di Don Giovanni
  finivano 161px dentro le fotografie.
- **I testi hanno un tetto: ~330 battute.** Non è una regola di stile, è
  (305 − 226) / 17px di riga. Otto testi sono stati accorciati per rientrarci.

**Chi scriverà i prossimi testi deve saperlo**: oltre le ~330 battute il testo
finisce sulle fotografie, e non c'è niente nel codice che lo impedisca — non è
un contenitore che taglia, è una posizione assoluta che non se ne accorge. Se
un'opera meritasse un testo più lungo, la strada non è stringere la scrittura
ma abbassare la mensola, e quella è una decisione sull'artboard.

## Manuel Delogu è Manuel Casati — confermato

Il comunicato di Glamour Confusion, nella cartella sorgente
(`Glamour Confusion di Manuel Delogu 5.odt`), lo dice per esteso:
**«L'idea di Manuel Delogu, in arte Manuel Casati»**. Non è più un'inferenza.

Serve saperlo perché **Delogu compare come autore in tre punti dell'archivio**
— il cartello di testa del videoclip di Glamour Confusion («a cura di Manuel
Delogu»), `elaborato Manuel Delogu.mp4` in The Red White Horse, e
`Elaborato Testuale - Manuel Delogu.pdf` in Love and Eat — e sono tutti e tre
Manuel, non un collaboratore. Il §2.1 dice che il nome pubblico è **Manuel
Casati**: l'anagrafe non va in pagina, ma chi cura l'archivio deve sapere che
le due firme sono la stessa persona.

«Casati» viene dalla Marchesa Luisa Casati, che è anche la musa dichiarata di
Oser Savoir e la citazione in fondo a `/about`.

## I video (§8): i dati ci sono, le pagine no

Dal 7 settembre 2026 il §8 non è più intero. **Quello che c'è:**

- **`Filmato` in `lib/opere.ts`**, accanto a `Scatto` e non dentro. La ragione è
  l'apparato: se un filmato entrasse in `scatti`, i crediti direbbero
  «scatti: 13» per dodici fotografie e un video, e il §3.3 esiste per tenere
  onesto quel conteggio. Il rapporto di un filmato **non passa da `formato()`**:
  i cinque formati ammessi sono fotografici, e accostarci un 2,35:1
  significherebbe ritagliare l'inquadratura che il videomaker ha composto — il
  ritaglio di una foto è presentazione, quello di un filmato è una modifica
  dell'opera.
- **`scripts/filmati.sh`**, accanto a `bozze-media.sh`: per ogni opera produce
  l'intero (H.264, CRF 25, max 1600px, `+faststart`), un'anteprima di dieci
  secondi muta, e un poster. Scrive le misure in `public/media/filmati.txt`, da
  cui si copiano in `opere.ts` — come già per le immagini, le misure non si
  scrivono a occhio.
- **Tre opere hanno il filmato nei dati**: 03 Glamour Confusion (2:59),
  13 Le Rêve Lever (0:54), 14 Funeral Rave (1:35, video di Tommaso Bentivegna).
  I crediti della work page mostrano `filmato: m:ss` accanto a `scatti: N`, in
  entrambe le viste. The Red White Horse aveva un montato di 6:53 ed era la
  quarta: è uscita dall'archivio, e con lei i suoi derivati.

**Quello che non c'è: nessuna pagina mostra ancora un filmato.** I dati sono
pronti e inerti. Il player (media-chrome, installato dal primo giorno e mai
importato), la lastra della mensola e la vista con audio restano da fare, e
sono l'unica parte che tocca l'interazione — quindi vanno decise, non dedotte.

### Le decisioni che mancano

- **Dove vivono i file — DECISO** (Lucio, 7 settembre 2026): **nel repo**. Il
  §5 esclude i servizi esterni e `/legali` dichiara che non ce ne sono; il peso
  del repo è un prezzo più basso di una promessa da riscrivere. Lo script tiene
  un tetto di 90 MB per file per stare sotto il limite di GitHub, e avvisa
  invece di fallire. Da sorvegliare quando entreranno Love and Eat (6:16) e
  L'Affair (4K): ogni ri-encode resta per sempre nella storia di git.
- **Il fermo immagine come copertina — DECISO** (Lucio, 7 settembre 2026): sì.
  L'indice e la timeline leggono `scatti[0]`, e un'opera solo-video non ce
  l'ha: si estrae un fotogramma dal montato e lo si dichiara per quello che è
  (`didascalia: "fermo immagine dal video"`). È ciò che permette a L'Affair,
  Love and Eat e Sauvage di entrare in archivio.
- **Il filmato è opera o documentazione? — ANCORA APERTA.** Funeral Rave ha
  dodici fotografie e un video: è la tredicesima cosa da guardare o è la
  documentazione della performance? La risposta decide dove sta nella mensola.
  Chiesto a Lucio il 7 settembre 2026, risposta «non saprei» — quindi la Fase 3
  parte dalle altre tre decisioni e questa si chiude guardando la pagina.
- **L'audio — DECISO** (Lucio, 7 settembre 2026): la mensola resta **muta**, il
  suono vive **solo nella vista ravvicinata** — lì c'è spazio per i crediti del
  videomaker e nessuno ci arriva per sbaglio. Il passaggio poster → movimento
  resta una dissolvenza e non un taglio (§3.2: variazione interna a uno stato
  già stabilito).

### Due cose viste guardando i fotogrammi

- **Il letterbox può stare dentro l'immagine.** The Red White Horse dichiarava
  720×576 ma il contenuto era un dittico con bande nere sopra e sotto: in una
  cornice 4:3 le bande si sarebbero viste. Quell'opera è uscita dall'archivio,
  ma il caso resta — va guardato il fotogramma, non il rapporto dichiarato.
- **L'anteprima non si può prendere a percentuale fissa.** Al 20% Glamour
  Confusion è ancora sul cartello di testa: dieci secondi di titolo. L'offset è
  ora al 50% ed è una manopola per opera nella tabella dello script — il
  fotogramma giusto lo sceglie chi guarda.

## `--rif-altezza` — i numeri, rimisurati

`app/globals.css` frena la scala del sito su `--rif-altezza: 980`, e il suo
commento avverte che quel numero deve essere «l'altezza che la composizione
RICHIEDE, non una a piacere»: se è sottostimato il freno non morde, se è
sovrastimato tutto rimpicciolisce prima del necessario.

Altezza calcolata dai fogli, dal contenuto più alto al piede:

| pagina | richiede | da cosa |
|---|---|---|
| `/works/[slug]` | ~767px | base 614 + sporgenza 99 + piede |
| `/timeline` | ~733px | voci fino a 503 dall'alto, pannello 230 dal basso |
| `/works` | ~707px | banda a 596 (alto 128 + zona 352 + stacco 116) + ~111 di scheda |
| `/about` (scheda) | ~624px | apparato a 316 + tre paragrafi + piede |
| home | ~520px | il player è centrato: gli serve solo di non toccare i bordi |

Il massimo è ora `/works/[slug]`, **~767px**. `/works` è sceso a ~707 col
passaggio alla riga singola (6 settembre 2026): la striscia è più alta (`--zona`
da 24 a 22rem, ma una riga sola invece di due) e la banda sale di conseguenza.
`980` resta sovrastimato di ~210px — su una finestra alta 900 la scala scende a
14,1px invece di restare a 16, pur essendoci lo spazio.

**Non l'ho cambiato.** Sono misure calcolate dai fogli e non lette da un
browser, e il valore è una manopola d'autore: 980 potrebbe essere deliberato
per lasciare margine a contenuti non ancora scritti. Con la riga singola la
striscia di `/works` sta alta nel canvas e sotto resta molto vuoto — se si
decide di ricentrarla, `--alto` è la manopola.

## Il rosso è anche superficie: il §2.3 va riscritto

Il §2.3 dice che «il rosso sta nel taglio, non colora l'interfaccia». Da
`f5f59a4` non è più vero alla lettera: la chiusura di `/about` è una schermata
intera di rosso pieno.

L'eccezione è dichiarata e circoscritta — la formulazione aggiornata sta accanto
a `ROSSO` in `lib/movimento.ts`, che è dove chiunque voglia usare l'accento
guarda per primo. Due casi ammessi, la tenda e la chiusura; tutto il resto no,
compreso il riquadro del copia, che avrebbe avuto contrasto sufficiente e usa
l'inchiostro proprio per non spendere l'accento una terza volta.

Quando la guida tornerà sotto mano, **il §2.3 va riscritto per dire questo**
invece di essere contraddetto dal codice.

## Il marchio del header è il lockup intero, non più la sola `manuel`

Il §2.2 descrive il wordmark come `manuel` a proporzione 6,05:1. Dal 6 settembre
2026 (scelta di Lucio) **l'header porta `manuel casati`** — il lockup completo,
rapporto ~11,7:1 — e con lui la sequenza della soglia, che lo misura a runtime e
si adatta senza numeri scritti a mano.

Il componente `components/marchio.tsx` tiene le due forme: `manuel` è il default
(lo usa ancora la chiusura di `/about`), `manuel casati` è la prop `esteso`. Le
coordinate di `manuel` non cambiano fra le due — `casati` si aggiunge a destra
nello stesso `viewBox` allargato. La sorgente è
`01-assets/svg/manuel-wide-web.svg` (fuori dal repo), che contiene entrambi i
gruppi.

**Quando la guida tornerà sotto mano**: il §2.2 va aggiornato per dire quale
forma vale dove, e va deciso cosa fa il header sotto la soglia compatta — oggi
non è adattato (come `/` e `/legali`) e `manuel casati` + le tre voci a 375px
stanno strette. Il `data-letter` di `casati` è in ordine di lettura come quello
di `manuel`, ma non è mai stato verificato contro un taglio lettera per lettera.

## Le note legali sono una bozza

`/legali` esiste e dice cose vere, ma **non è stata letta da un legale** e la
pagina stessa lo dichiara in testa.

Due parti meritano attenzione vera prima della pubblicazione:

- **Persone ritratte.** Il sito pubblica ritratti di persone identificabili;
  l'art. 96 L. 633/1941 richiede il consenso della persona ritratta. La pagina
  afferma che ogni ritratto è pubblicato con quel consenso e offre un canale per
  chiederne la rimozione. **Quell'affermazione va resa vera**, cioè le
  liberatorie vanno raccolte e conservate: in caso di contestazione è chi
  pubblica a dover provare di avere l'autorizzazione.
- **Natura dei contenuti.** La pagina dichiara che alcune opere contengono
  nudità artistica e che nessuna ritrae minorenni in quel contesto. Va
  verificato contro l'archivio reale, opera per opera, prima di andare online.

Le affermazioni sui dati invece sono **verificate nel codice**: nessuna
analitica, nessuna terza parte, nessun modulo, e una sola chiave in
`localStorage` per la preferenza del suono della timeline. Se arriva
un'analitica, un modulo o un servizio esterno, quella pagina va riscritta per
prima.

## La soglia compatta non ha un artboard

Da `f9c8302` le pagine a canvas fisso hanno una seconda vista sotto 860px
(`SOGLIA_COMPATTA` in `lib/movimento.ts`) — vedi `HANDOFF.md` del 25 agosto
2026 per il dettaglio. **Nessuna delle due cose è stata misurata da un
disegno**: la soglia di 860px è scelta a occhio (copre un iPad in verticale,
non solo il telefono) e verificata su tre larghezze, non calcolata come
`--rif-altezza`; le composizioni compatte sono state disegnate in continuità
stilistica col resto del sito, non da un artboard dedicato.

Se un giorno arriva un riferimento visivo per il mobile — o la guida di
progetto (fuori da questo repo) dice qualcosa di esplicito sul tema — **va
riconfrontato con quanto costruito qui**, che è una prima risposta e non una
misura.

## Recapiti

`/about` ha email e i due profili social, veri. Il **telefono è stato tolto**
del tutto (6 settembre 2026, scelta di Lucio): i canali di contatto sono email
e social, non un numero. Mancano ancora, se serviranno: un indirizzo postale e,
se un giorno ci sarà una partita IVA o una ragione sociale, la riga che nel
riferimento stava in fondo e che qui è occupata dalla citazione di Luisa Casati.

---

## Una nota per chi lavora qui

La **guida di progetto** (i `§1`–`§9` citati ovunque nei commenti) è **esterna
a questo repository**. Ogni citazione che trovi nel codice è una parafrasi
scritta da una sessione precedente, non la fonte.

Finora ha retto perché le parafrasi sono buone, ma è fragile: se una è
imprecisa, l'errore si propaga senza che nessuno se ne accorga. Lo stesso vale
per gli artboard (le «bozze 01, 02, 04» citate in testa ai fogli). **Chiedi la
guida prima di fidarti di un `§`.**
