# Handoff — 8 settembre 2026

Due giorni sui **contenuti**, e in fondo il §8. L'archivio è passato da opere
segnaposto a **ventitré opere vere**: 334 fotografie scelte a mano, 16 filmati
che adesso **si vedono in pagina**, tutti i testi, tutti i crediti che i
documenti danno. Branch `dopo-helper`, albero pulito,
`typecheck`/`lint`/`build` verdi, 379 pagine. Quattordici commit, da `3b2a4f6`
a `77804c9`.

Questo documento è **datato e si consuma**. Ciò che resta vero nel tempo sta in
`APERTI.md`, aggiornato passo per passo.

---

## 1. Lo stato, in una riga

Il §6.1 — la curatela dell'archivio, che la guida dà come **bloccante** — è
fatto. Quello che manca adesso non sono più i contenuti: è **il video, che
nessuna pagina mostra**.

## 2. Cosa è cambiato

### I filmati sono nei dati, e in nessuna pagina

`Filmato` sta accanto a `Scatto`, non dentro: `scatti.length` deve restare il
conteggio delle fotografie (§3.3). Il rapporto non passa da `formato()` — i
cinque formati sono fotografici, e accostarci un 2,35:1 vuol dire ritagliare
l'inquadratura del videomaker.

`scripts/filmati.sh` deriva per ogni filmato l'intero (H.264, CRF 25, lato
lungo 1600, max 30 fps, `+faststart`), un'anteprima muta di dieci secondi
sopra i trenta secondi di durata, e un poster.

**E dal 8 settembre si vedono.** `components/filmato.tsx` ha due modi: `Muto`
nella mensola — poster fermo, movimento all'hover, `preload="none"`, nessun
audio — e `Intero` nella vista ravvicinata, l'unico posto del sito dove un
filmato suona (media-chrome). Le due viste dell'opera scorrono `materiali()` e
non `scatti`.

I **fermi immagine** non entrano fra i materiali: `Scatto.fermoImmagine` marca
il fotogramma che esiste solo per fare da copertina, e nella mensola di
un'opera solo-video c'è il filmato e basta.

### L'archivio, opera per opera

Ventuno opere, tutte con fotografie scelte da Manuel e Lucio, non pescate in
ordine alfabetico. Da sapere:

- **Corsa Futurista sono cinque opere**, una per edizione (I 2015, II 2016,
  III 2018, IV 2019, VI 2023 — la V manca, ed è l'unica a cui Manuel non ha
  partecipato). Si distribuiscono lungo tutta la cronologia.
- **«Antropologia» era LOVE AND EAT** e **«Seduta spiritica» era Oser Savoir**:
  due opere che sembravano senza sorgente perché portavano il nome sbagliato.
- **Fuori dall'archivio**: The Red White Horse, Marie Antoinette in thr Fridge,
  Editoriale x Vogue, l'Istituto d'Arte Filippo Figari, Bozzetti, Biglietto da
  visita, Sketch for Casati Project.
- La sequenza è **cronologica sul serio** e rinumerata 01→21 tre volte, perché
  ogni datazione nuova la rimescolava. Il numero è apparato: gli slug non lo
  contengono, quindi nessun URL è mai cambiato.

### Le regole di selezione

Le ha dette Lucio e valgono per il futuro: **tag rosso del Finder = escluso**,
**verde = da includere** (se è l'unico, è la copertina), **`Verde, Arancio` =
la copertina** quando i verdi sono molti. I tag sono in italiano — `Rosso`,
`Verde`, `Arancio` — e si leggono con
`mdfind -onlyin <cartella> "kMDItemUserTags == 'Verde'"`.

### Testi e crediti

Tutte e ventuno hanno un testo. Dove i documenti esistono il testo viene da
lì; dove non esistono dice cosa si sa e dichiara che la cartella è muta.
**Nessun testo di riempimento**: un'opera non raccontata si deve vedere.

`Credito` è una tupla `[ruolo, nome]`, e le righe stanno nella terza colonna.

---

## 3. Da controllare a mano

Verificato in Chrome a 1440×900 su tutte e ventuno le opere, misurando le
sovrapposizioni invece di guardarle: **nessun testo sopra le fotografie,
nessun overflow orizzontale**, vista compatta provata a 375 e 820px.

Restano da guardare con gli occhi:

1. **La striscia di `/works` con ventuno opere**, e Corsa Futurista che ora la
   scandisce a intervalli dal 2015 al 2023 invece di stare tutta insieme.
2. **Lo scorrimento dell'indice con una rotellata vera.** La memoria della
   posizione è verificata (chiedendo 900 riprende a −900, un valore assurdo
   viene limitato allo scorrimento massimo), ma il moto no: gli eventi `wheel`
   sintetici non arrivano all'Observer di GSAP, e la finestra di prova non
   saliva sopra i 789px di viewport, dove il motore è spento.
3. **Le mensole più lunghe** — Glamour Confusion ha 77 fotografie, Candide 30,
   Editorial Blanka 19.

---

## 4. Il tetto delle 330 battute

L'apparato della work page ha **169px verticali**: il testo attacca a 136, le
fotografie a 305. Con la colonna larga 416px ci stanno **~330 battute**. Oltre,
il testo finisce sulle fotografie, e **niente nel codice lo impedisce** — non
è un contenitore che taglia, è una posizione assoluta che non se ne accorge.

Chi scrive i prossimi testi deve saperlo. Se un'opera meritasse più spazio, la
strada non è stringere la scrittura ma abbassare la mensola, e quella è una
decisione sull'artboard.

---

## 5. Cosa manca

**Da guardare per primo, perché non è mai stato visto muoversi**: la lastra del
filmato nella mensola. Il player della vista ravvicinata sì (controlli, tempo,
audio); la lastra è verificata solo nel DOM, perché la scheda di prova era in
background e Chrome lì mette in pausa le animazioni CSS — tutte le lastre
restavano a `clip-path: inset(100%)`, quindi nemmeno raggiungibili dal
puntatore.

**Una domanda aperta che si chiude guardando**: i filmati stanno in coda alle
fotografie, ma la mensola è un anello, quindi entrando in un'opera compaiono
per primi, a sinistra della corrente. Non è sbagliato — è l'opposto di «in
coda». Vale per Feral (tre teaser) e Funeral Rave.

Poi, in ordine sparso: i testi di `/about`, ancora segnaposto; la `.nota` della
work page, ancora segnaposto; le didascalie per-foto (`Scatto.didascalia`) mai
compilate; i tag/filtro dell'indice, ancora MOCK; la revisione legale; il
montaggio di Coucher che farà Lucio, e con lui l'hero della home; il crop degli
altri filmati, da controllare con l'occhio con cui è stato trovato quello di
Sauvage; «Alex Ilushenka» contro «Aliaksandr Ilyushenka», due grafie della
stessa persona; **BDSM**, voce di cronologia senza nessuna cartella; e le tre
opere che mancherebbero per arrivare a 26 — se 26 regge dopo sette esclusioni,
ed è una domanda per Manuel.

---

## 6. Due cose imparate

**L'EXIF Orientation.** Tredici sorgenti su 332 hanno i pixel orizzontali e
l'immagine vera verticale. `sips -Z` conserva pixel e tag: il file misura
1600×1200 e il browser mostra 1200×1600, quindi le misure dichiarate sarebbero
rovesciate e la cornice ritaglierebbe l'immagine sbagliata. `scatti.sh` usa
ffmpeg, che l'orientamento lo applica scrivendo, con `-map_metadata -1`. Se un
domani si torna a `sips`, il problema torna con lui.

**Guardare i derivati, non fidarsi del referto.** Quel bug è emerso solo
perché ho aperto una copertina per controllarla e l'ho vista verticale mentre
il referto la diceva orizzontale.

---

## 7. E la cosa più importante

**La guida di progetto è fuori da questo repository.** Ogni `§` citato nei
commenti è una parafrasi. In questi due giorni il §3.3, il §4.1 e il §8 sono
stati usati parecchio per giustificare decisioni. **Chiedi la guida prima di
fidarti di un `§`.**
