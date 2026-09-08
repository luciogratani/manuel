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

`lib/opere.ts` progetta «una sequenza unica 01→26» (§3.3) e contiene
**ventitré** opere, numerate 01→23.

**8 settembre 2026 — le opere solo-video sono entrate tutte.** L'Affair (2021,
Alghero) e Sauvage (maggio 2025, Sassari) hanno seguito la strada aperta da
LOVE AND EAT: un fermo immagine fa da copertina, il montato è il materiale.
`SENZA_IMMAGINI` **non esiste più** — era la costante che dichiarava il buco
del §8, e non ha più niente da dichiarare.

Il fermo immagine si genera dalla pipeline: `scripts/filmati.sh` ha un campo
`copertina` con il secondo da cui prenderlo, scelto dalla curatela guardando.

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

## A Boy's Closet, e la fine delle copertine d'indice

**7 settembre 2026 — A Boy's Closet è popolata.** Otto fotografie derivate
dalla cartella sorgente, `medium: "guardaroba"`, `luogo: "Rehearsal, Milano"`,
due crediti, e la densità passata da `minima` a `documentata`. La data —
9 ottobre 2020 — viene dal nome della cartella (`09-10-020`, che nel formato
delle altre è gg-mm-aa con uno zero di troppo): i due PDF sono un comunicato
stampa e un testo di progetto, e nessuno dei due è datato.

**L'ordine e la copertina non li ha scelti Manuel.** Quella cartella è l'unica
della tabella di `scatti.sh` che non porta **nessun tag del Finder**: niente
rossi da escludere, ma nemmeno un verde che dica qual è la copertina. Gli otto
file sono entrati tutti — sono pochi e nessuno è scarto — mentre la sequenza è
stata composta guardando i derivati: la copertina è `image00005`, l'unica delle
tre inquadrature d'ambiente che regga la misura piccola dell'indice, perché
nelle due più larghe gli abiti diventano un punto. **Da rivedere con Manuel**
come le altre selezioni.

**Cyb_God non è fra i crediti, ed è una domanda aperta.** Il testo di progetto
lo dà come performer che indosserà gli abiti per le immagini documentative e
aggiungerà grafica 3D in postproduzione — ma è scritto **al futuro**, in un
documento che dichiara i suoi stessi pezzi «ancora in fase di sviluppo», e
nelle otto fotografie della cartella **non c'è nessuno che indossi gli abiti**:
sono appesi alla scultura a orecchio o stesi a terra. Da chiedere a Manuel: la
partecipazione c'è stata, e in quali immagini?

**Era l'ultima opera con la copertina d'indice.** `indice()` — la scorciatoia
che dava a un'opera non ancora curata la copertina singola pescata da
`bozze-media.sh` — è stata tolta da `lib/opere.ts`: adesso **ogni opera
dell'archivio ha fotografie derivate dalle sorgenti** con `scripts/scatti.sh`.
I ventiquattro file di `public/media/indice/` non li guarda più nessuno.
Restano su disco insieme alle copertine delle opere uscite dall'archivio, e
vanno tolti in blocco quando si decide di farlo — è una cancellazione, non una
rifinitura.

**Un bug di `scatti.sh`, trovato usandolo.** Lo script azzerava
`public/media/scatti.txt` a ogni avvio, **anche in una passata parziale**:
`./scripts/scatti.sh apoteosi` cancellava dal referto le misure di tutte le
altre opere senza dirlo. Corretto — ora con degli slug in riga di comando
toglie solo le righe di quelli. **Il file committato con `eb79aad` porta già il
segno di quella volta**: contiene sei opere su quindici. Non è stato
ricostruito, perché rifarlo vuol dire riderivare 334 fotografie; le misure in
`lib/opere.ts` restano quelle giuste, è il referto a essere monco.

## Il CV di Manuel, e quello che dice all'archivio

**7 settembre 2026.** Il curriculum è entrato nel sito (`/cv`, il file in
`public/cv/manuel-casati-cv.pdf`). È un documento formale, datato 2 settembre
2026, e **risponde a mezza dozzina di domande che stavano aperte qui** — ma su
tre punti contraddice l'archivio, e nessuno dei tre l'ho toccato.

**Risposte.** I due `luogo: "da chiarire"` non lo sono più: **Feral** è
«Maison du Sabotage, Sassari», **Don Giovanni** «Teatro Genova, Sassari».
A Boy's Closet ha un arco, non una data sola: **9 ottobre – 14 novembre 2020**,
Rehearsal, Milano — il 9 ottobre ricavato dal nome della cartella era giusto.
Apoteosi è «Lo Quarter, Alghero, 29 maggio 2017».

**Due opere che l'archivio non ha, e adesso stanno in cronologia.** La sezione
«Le opere che mancano» chiede da giorni quali siano le tre che porterebbero a
26. Il CV ne nomina due che in `lib/opere.ts` non esistono: **Retrospettiva**
(23 novembre 2024, mostra personale, Gebaude Gallery, Sassari) e **Ombre
Corte** (20 giugno 2026, performance, MAST, San Teodoro).

Il 7 settembre 2026 Lucio ha deciso di **documentarle in `lib/timeline.ts`
senza slug e senza copertina**, come già BDSM: nella cronologia si vedono e si
contano, ma non rimandano a niente, perché di materiale non se ne ha. È il modo
in cui questo repo dice ciò che sa senza fingere di averlo — una voce senza
slug dichiara la propria assenza meglio di una pagina vuota. Se il materiale
arriva, prendono uno slug e diventano opere.

**Tre contraddizioni da sciogliere.**

- ~~**L'Affair.**~~ **Sciolta il 7 settembre 2026, e non era una
  contraddizione**: sono due momenti dello stesso lavoro. Le riprese ad
  Alghero nel luglio 2021 (da cui il nome della cartella, `20-07-021`), la
  presentazione il **26 novembre 2021 ad Acre — Lume Occupato, Milano** (dal
  CV). `luogo` porta la presentazione, il testo tiene tutt'e due: un archivio
  che tiene solo l'ultimo dei due momenti perde metà del lavoro.
- **Corsa Futurista — LASCIATA APERTA** (Lucio, 7 settembre 2026). Il CV e la
  bio dicono «2015/2024». In archivio le edizioni sono I 2015, II 2016,
  III 2018, IV 2019, VI 2023: la V manca e il 2024 non c'è. O mancano
  edizioni, o l'arco è sbagliato in tutt'e due i documenti. Nessuno dei due
  posti è stato toccato.
- ~~**La scuola d'arte.**~~ **Chiusa il 7 settembre 2026: vince il CV.** La
  bio diceva «Istituto d'Arte Filippo Figari», il CV dice «**Liceo** Artistico
  Filippo Figari» — diploma in Arti Applicate 2008–2013 — e la bio su `/about`
  è stata corretta. Concorda anche con la descrizione di Apoteosi, che il
  Liceo lo nominava già col nome giusto. In `formazione` sta invece la
  **laurea triennale in Comunicazione e Didattica dell'Arte, Accademia di
  Belle Arti Mario Sironi, 2023–2026**, che la bio non nomina: nell'apparato
  di una persona `formazione` è il titolo più alto. Resta da confermare che
  sia conseguito — l'arco finisce quest'anno.

**Due cose prima di pubblicare `/cv`.** Il PDF porta in testa un indirizzo
email **personale** (`manuelcasati89@gmail.com`) e una **fotografia di
Manuel**. Pubblicando la pagina si pubblicano tutti e due. Il file servito è
stato rinominato — la sorgente si chiama `Manuel_Delogu_CV.pdf` e il §2.1 dice
che l'anagrafe non va in pagina — ma il contenuto è quello che è, e va deciso
guardandolo.

**9 settembre 2026 — l'email è decisa, ed è quella.** Lucio ha scelto di usare
in tutto il sito l'indirizzo del PDF invece della casella di servizio
`hello@manuelcasati.it`, che non è mai stata aperta: mostrarne due dava a chi
scrive due strade per la stessa persona. Ora vive una volta sola, in `EMAIL`
dentro `lib/sito.ts`. Resta il fatto che è una casella gratuita e che il
dominio del sito non ha più nessun indizio a sostenerlo — vedi il commento
accanto a `SITO`: il giorno che si passa a un indirizzo sul dominio proprio, va
cambiato **anche nel PDF**, che è la sorgente.

## La mensola: i registri sono larghezze, e due opere restano ferme

**7 settembre 2026.** I tre registri della mensola — alta, media, bassa — erano
**altezze** (182 / 137 / 68), e la larghezza la decideva il rapporto della
fotografia. Su una 3:2, il formato su cui l'artboard è disegnato, funziona. Su
una verticale no: una 2:3 in registro basso era alta 68 e larga **36px**, e il
filmato 9:16 di Le Rêve Lever ne misurava **30** — con la targhetta della
durata, larga 32, tagliata da `overflow: hidden`.

Adesso i registri sono **larghezze** (273 / 205 / 102 — gli stessi numeri letti
dall'altro verso: 273 = 182 × 3:2) e l'altezza scende dal rapporto, fermata da
un tetto di 182px. Il tetto è la quota dell'artboard ed è deliberato tenerla:
così **su una 3:2 non cambia niente al pixel**, la mensola occupa lo stesso
spazio verticale di prima, e cambia solo ciò che si assottigliava.

Misurato su tutte e sette le opere con mensola: la lastra più stretta
dell'archivio passa da **28 a 78px**, la targhetta della durata ci sta, e non
c'è nessuna sovrapposizione fra testo e lastre in nessuna pagina.

### Quello che NON è stato risolto

**Le Rêve Lever e Don Giovanni hanno ancora la mensola ferma.** Il motore
dell'anello non si accende sotto una soglia — `lunghezzaNaturaleRef <=
striscia.clientWidth` in `mensola.tsx` — e la guardia è giusta: un anello più
corto del binario girerebbe mostrando la stessa fotografia due volte nella
stessa schermata. Ma le due strisce restano corte:

| opera | prima | adesso | binario |
|---|---|---|---|
| Le Rêve Lever | 778 | **918** | 1440 |
| Don Giovanni | 1177 | **1391** | 1440 |
| Funeral Rave | 1487 | 1537 | 1440 |

Funeral Rave passava per undici pixel e adesso ne ha novantasette: quella era
la cosa fragile, ed è sistemata. Le altre due no, **e non lo saranno
allargando le lastre**: provato: per far arrivare Le Rêve al binario servirebbe
un tetto sui 300px, e a quell'altezza la lastra corrente sale sopra il testo. È
una decisione sull'artboard e non un numero da girare — o si abbassa la
mensola, o si accetta che un'opera tutta verticale con otto materiali abbia una
fila ferma invece di un anello.

Nel frattempo la fila ferma non è rotta: si vede tutto, non scorre.

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

### Un video con le bande nere dentro

Il montato di **Sauvage** dichiara 1280×720 ma porta due bande nere verticali
impresse da un export sbagliato: sotto, l'immagine vera è **960×720**, cioè
4:3 e non 16:9. `cropdetect` lo conferma in tre punti del filmato, e il campo
`crop` della tabella di `filmati.sh` lo toglie prima della scala — se no il
lato lungo si misurerebbe sulle bande.

Non è una scelta di inquadratura, è togliere quello che non è mai stato
ripreso. Ma **vale la pena guardare gli altri filmati con lo stesso occhio**:
The Red White Horse aveva lo stesso problema in orizzontale, ed è uscita
dall'archivio prima che ce ne occupassimo.

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
  settembre 2026: Shooting per Editoriale (allora «Ph Shoot Anto») prende la
  copertina da «immagini selezionate e
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
  attacca a 1096.

  ~~E in `densita: "minima"` l'apparato parte da 560px: sei righe di crediti ci
  stanno, dodici no — oggi nessuna opera minima ne ha tante, ma il giorno che
  capita va guardato.~~ **È capitato, con LOVE AND EAT.** I due blocchi
  dell'apparato erano due assoluti a quote fisse — le persone a 512, il
  materiale a 640 — con 128px in mezzo e niente che li facesse rispettare. Le
  persone di LOVE AND EAT ne misurano 164, perché «performer: Irene Stefanini,
  Mattia Mennuti, Christopher Dicky, Francesca Malagesi, Martina Bazzoni» va a
  capo tre volte: sconfinavano di 36px e stampavano `anno:` e `medium:` sopra
  il nome del montatore. L'Affair ci arrivava a **due pixel**.

  **Risolto il 7 settembre 2026 invertendo i due blocchi**, non alzando la
  quota. Adesso il materiale sta a 512 e le persone a 624: chi cresce senza
  limite è l'ultimo e sotto di lui non c'è niente, quindi il caso non può più
  presentarsi — mentre alzare la quota avrebbe solo spostato la soglia. In più
  la densità minima adesso legge nello stesso verso di quella piena, prima il
  materiale e poi chi l'ha fatto; prima le due leggevano al contrario.

  ~~Ancora **PROVVISORIO**: l'artwork e le luci di Don Giovanni sono di
  «Lucio», perché il documento sorgente non dà il cognome.~~ Chiuso il 7
  settembre 2026: Lucio ha tolto quella riga e la rassegna dai crediti.

## Due opere senza sorgente, e un fotografo incerto

~~«Antropologia» non ha una cartella.~~ **Risolto** l'8 settembre 2026: era il
nome sbagliato di **LOVE AND EAT**, che una cartella ce l'ha eccome — con il
montato, i performer e un elaborato testuale. L'opera ora si chiama col suo
nome, porta la data (12 febbraio 2026) e ha il video.

Resta vero il metodo che l'aveva fatta emergere: una voce di `lib/opere.ts`
senza cartella corrispondente è un titolo da verificare, non un'opera. **BDSM**
è ancora in quella condizione, in `lib/timeline.ts`.

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

**7 settembre 2026 — tre testi sforano ancora, e non si vedeva.** Fra la cima
della mensola (332) e la quota in cui il testo dovrebbe finire (305) ci sono
27px di margine, e tre testi ci stanno dentro invece di stare sopra: la
descrizione di **Feral** arriva a ~325, quella di **Coucher avec moi** a ~310,
e i crediti di **Le Rêve Lever** — che sono nella terza colonna e scendono —
a ~341. Nessuno dei tre tocca una fotografia oggi, perché il margine li
copre. Sono emersi provando ad alzare la mensola: alzandola di 27px, tutti e
tre andavano a sbattere.

Vuol dire due cose. Che **quel margine non è libero**: chi tocca l'altezza
delle lastre lo consuma e scopre gli sforamenti. E che i tre testi vanno
accorciati comunque, perché oggi stanno dentro per fortuna e non per misura.

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

**Dall'8 settembre 2026 il video si vede.** `components/filmato.tsx` ha due
modi, e la differenza fra i due è una decisione di Lucio: `Muto` sta nella
mensola — poster fermo, movimento all'hover, nessun controllo, nessun audio —
e `Intero` sta nella vista ravvicinata, l'unico posto del sito dove un filmato
suona. Il passaggio fermo → movimento è una dissolvenza (§3.2).

Le due viste dell'opera scorrono `materiali()` e non `scatti`: l'unione di
fotografie e filmati vive in `lib/opere.ts` come funzione, non come campo,
perché nei dati i due devono restare separati (l'apparato li conta a parte) ma
in pagina si guardano come una sequenza sola. I filmati stanno **in coda** alle
fotografie — risposta provvisoria alla domanda «opera o documentazione?», presa
così perché è quella che si può guardare.

**I fermi immagine non entrano fra i materiali.** `Scatto.fermoImmagine` marca
il fotogramma che esiste solo per fare da copertina: nella mensola di un'opera
solo-video c'è il filmato e basta, non il filmato preceduto da un suo
fotogramma (scelta di Lucio, 8 settembre 2026).

`preload="none"` su ogni lastra: finché nessuno ci passa sopra non si scarica
un byte, e ci sono opere con sei filmati.

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
- **Il filmato è opera o documentazione? — DECISO** (Lucio, 7 settembre 2026,
  guardando la pagina): il filmato **resta in coda**, e va bene così. La
  domanda si è chiusa come si era previsto — guardandola, non rispondendo in
  astratto.

  Quello che si vede, e che chi lavora qui deve sapere: la mensola è un
  **anello**, quindi «in coda» nei dati diventa «subito a sinistra della
  corrente» a schermo. Entrando in Funeral Rave il filmato è la lastra
  attaccata alla fotografia grande, non l'ultima della fila. È l'opposto di
  quello che «in coda» fa pensare, ed è accettato.
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
| `/works/[slug]` | ~788px | densità minima: crediti a 624 + persone fino a 164 |
| `/works/[slug]` (piena) | ~767px | base 614 + sporgenza 99 + piede |
| `/timeline` | ~765px | voci fino a 535 dall'alto, pannello 230 dal basso |
| `/works` | ~707px | banda a 596 (alto 128 + zona 352 + stacco 116) + ~111 di scheda |
| `/about` (scheda) | ~624px | apparato a 316 + tre paragrafi + piede |
| home | ~520px | il player è centrato: gli serve solo di non toccare i bordi |

Il massimo è ora `/works/[slug]` a densità minima, **~788px**: i due blocchi
dell'apparato sono stati invertiti il 7 settembre 2026 (vedi qui sotto) e le
persone, che sono il blocco che cresce, sono scese in fondo. `/timeline` sale a
~765 con `--passo-riga` da 3.5 a 4rem. `/works` è sceso a ~707 col
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

## La SEO c'è, e il sito si fa indicizzare — tranne le opere con nudo

**7 settembre 2026.** Il sito non aveva niente: `description` vuota, nessun
Open Graph, nessuna sitemap, e ventitré work page che si chiamavano tutte
«Manuel Casati». Condiviso in chat mostrava l'URL nudo. Adesso ha
`metadataBase`, una descrizione vera, titoli e descrizioni per pagina,
`og:image` per opera (la copertina, con le misure vere), la card 1200×630
disegnata da Lucio, `robots.txt` e `sitemap.xml` derivata da `OPERE`.

**8 settembre 2026 — correzione.** La prima versione bloccava tutto:
`Disallow: /` e `noindex` su ogni pagina. **Quella scelta non era di Lucio, era
una deduzione di chi scriveva** — dalla bozza legale e dai ritratti di persone
identificabili — presentata come se fosse ovvia. Non lo era, ed è stata
ribaltata: **home, about, cronologia, indice e curriculum sono pagine sicure e
vanno trovate.**

Era anche il modo tecnicamente sbagliato di ottenere quel risultato. Un
`Disallow` impedisce la **scansione**, non l'indicizzazione: il robot non
entra, quindi non legge il `noindex` scritto nella pagina, e può indicizzare
l'indirizzo lo stesso se lo trova linkato altrove — una riga vuota senza
titolo. E i robot delle anteprime (WhatsApp, X, Slack, Facebook) rispettano
`robots.txt`: bloccandoli, la card non veniva nemmeno letta.

**Fuori dai motori restano le singole opere con nudo**, dichiarate una per una
con il campo `nudo` di `lib/opere.ts`. Portano `noindex, follow, noimageindex`
sulla work page e sulle viste ravvicinate — il `noimageindex` è quello che
conta, perché senza la copertina potrebbe finire in Google Immagini anche da
una pagina non indicizzata — e non compaiono nella mappa del sito. **Nel sito
non cambia niente**: si vedono come le altre.

### La lista è una prima passata, e va rivista

Marcate: **Le Rêve Lever, La Distanza, Feral, Sauvage, Don Giovanni, Coucher
avec moi**. Le prove sono diverse fra loro, e nessuna è un audit:

- **Le Rêve Lever** è l'unica certa: le quattordici fotografie sono state
  guardate una per una l'8 settembre, derivandole.
- Le altre cinque vengono dalla sola **copertina** — un torso nudo, polsi
  ammanettati, una figura in biancheria, una scena di letto.

**Le copertine non bastano.** Le Rêve ha la copertina vestita e dentro ha nudo:
se il criterio fosse stato la copertina, quella sarebbe sfuggita. Quindi dove
il campo `nudo` manca **non vuol dire «non c'è», vuol dire «non guardato»** —
restano diciassette opere e oltre trecento fotografie mai passate in rassegna
con questo occhio. Va fatto da Manuel e Lucio, non dedotto.

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

## Il dominio è vero, e l'apex è la primaria

**9 settembre 2026.** `manuelcasati.it` è registrato su IONOS e collegato al
progetto Vercel `manuel`. Tre record, e il perché di ognuno:

- `A @ 76.76.21.21` — l'indirizzo dell'apex su Vercel. Il pannello ne suggerisce
  uno più nuovo (`216.198.79.1`) dicendo che il vecchio continua a funzionare:
  cambiarlo è manutenzione, non urgenza.
- `AAAA @` **eliminato**. Vercel non dà un IPv6 per l'apex, e lasciando quello
  di IONOS chi naviga in IPv6 — cioè quasi tutti i telefoni in rete mobile —
  finiva sulla pagina parcheggio mentre da desktop il sito si vedeva giusto.
- `CNAME www` → l'host `…vercel-dns-017.com`.

La posta resta su IONOS (MX, SPF, DKIM, DMARC, autodiscover): quei record non
c'entrano col sito e non vanno toccati quando si cambia hosting.

**La primaria è `www.manuelcasati.it`, l'apex rimanda con un 308.** Era stata
valutata la direzione opposta — l'apex è più corto, e sta bene a un sito che ha
tolto perfino il numero di telefono — ma la configurazione su Vercel era già
questa e funzionava, quindi si è allineato il codice invece della piattaforma.

**Questa scelta e `SITO` in `lib/sito.ts` sono la stessa decisione scritta in
due posti**, e vanno cambiate insieme o non vanno cambiate. Da `SITO` nascono
`metadataBase`, tutti i `canonical`, `robots.txt` e la sitemap: se dichiarassero
l'apex mentre Vercel serve il `www`, direbbero a Google «la pagina vera è qui»
su un indirizzo che poi lo manda altrove — il contrario di ciò per cui i
canonical erano stati aggiunti.

## L'avviso di contenuto c'è, la verifica dell'età no

**9 settembre 2026.** Le sei opere con `nudo: true` mostrano nell'apparato una
riga in più — «contenuto: nudo artistico» — sulla work page, nella vista
compatta e nel ravvicinato. È deliberatamente **minima**: nessuna schermata che
sbarra la strada, nessun clic da fare, stesso registro tipografico dei crediti.
Un cartello a tutto schermo davanti a un archivio d'artista tratterebbe il nudo
come un incidente invece che come materia del lavoro.

**Va saputo cosa questa riga NON è.** Non è una verifica dell'età: chiunque
apre la pagina vede le fotografie, e nessuna delle due cose dipende dall'altra.
Serve a due scopi più modesti — dire a chi legge cosa sta per guardare, e
rendere coerente ciò che `/legali` afferma in generale con ciò che le singole
pagine dichiarano.

Se un giorno servisse una barriera vera (la si valuti insieme alla revisione
legale, non prima), le strade sono due e vanno decise da chi firma il sito: una
schermata di conferma prima delle sole opere segnate, oppure niente. La via di
mezzo — un avviso che sembra un cancello ma non lo è — è la peggiore, perché dà
l'impressione di una tutela che non c'è.

Nota tecnica: il campo `nudo` è ancora **una prima passata**. Finché non è
rivisto opera per opera, la riga manca dove il campo manca — e «manca» non
vuol dire «non c'è nudo», vuol dire «non guardato». Vedi la sezione sulle note
legali qui sopra.

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
