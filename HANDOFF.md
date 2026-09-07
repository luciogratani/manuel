# Handoff — 7 settembre 2026

Sessione lunga, tutta sui **contenuti**: il §8 aperto a metà, la selezione
delle cinque opere recenti, i crediti, e due copertine che venivano da
materiale escluso. Branch `dopo-helper`, albero pulito,
`pnpm typecheck`/`lint`/`build` verdi — 86 pagine generate, erano 54.

Questo documento è **datato e si consuma**. Ciò che resta vero nel tempo sta in
`APERTI.md`, aggiornato passo per passo in questa sessione.

---

## 1. Cosa è cambiato

### I filmati entrano nel modello dati (§8)

`Filmato` sta **accanto** a `Scatto` e non dentro: se un filmato entrasse in
`scatti`, i crediti direbbero «scatti: 13» per dodici fotografie e un video, e
il §3.3 esiste per tenere onesto quel conteggio. Il rapporto **non passa da
`formato()`** — i cinque formati ammessi sono fotografici, e accostarci un
2,35:1 vuol dire ritagliare l'inquadratura che il videomaker ha composto.

`scripts/filmati.sh` deriva per ogni filmato l'intero (H.264, CRF 25, lato
lungo 1600, `+faststart`), un'anteprima muta di dieci secondi e un poster.
Sotto i trenta secondi l'anteprima non si fa. Le misure finiscono in
`public/media/filmati.txt`, da cui si copiano in `opere.ts`.

**Nessuna pagina mostra ancora un filmato.** I dati sono pronti e inerti: il
player, la lastra della mensola e la vista con audio restano da fare.

### Le cinque opere recenti hanno la selezione vera

Da una fotografia pescata in ordine alfabetico a **48 fotografie e 13 filmati**
scelti da Manuel e Lucio, tutte passate a `densita: "piena"`.

| opera | scatti | filmati |
|---|---|---|
| 13 Le Rêve — Lever | 7 | 1 |
| 14 Funeral Rave | 8 | 1 |
| 16 Feral | 11 | 3 teaser |
| 17 Don Giovanni | 11 | 1 |
| 18 Coucher avec moi | 11 | 6 clip |

`scripts/scatti.sh` è la selezione **scritta a mano**, non una regola: la
tabella elenca ogni file nell'ordine di lettura della mensola, e il primo è la
copertina.

### I crediti

`Credito` è una tupla `[ruolo, nome]`; le righe stanno in coda alla `dl`
dell'apparato — prima il materiale, poi le persone. Vengono dai
`descrizione.rtf`/`.pdf`/`.jpeg` delle cartelle sorgente: dove il documento
tace, la riga non c'è.

### L'archivio: tre opere fuori, una rinominata, la sequenza riordinata

- **Fuori** (scelta di Lucio): The Red White Horse, Marie Antoinette in thr
  Fridge, Editoriale x Vogue.
- **L'opera 10 non era «Seduta spiritica»**: è **Oser Savoir**. Vedi
  `APERTI.md` — è la scoperta più importante della sessione.
- **La sequenza è ora davvero cronologica** (prima le quattro opere del 2015
  stavano in ordine qualunque) e rinumerata 01→18.

---

## 2. Decisioni, e di chi sono

Di Lucio: i video **nel repo** e non su un'origine esterna (il §5 esclude i
servizi esterni e `/legali` dichiara che non ce ne sono); il **fermo immagine**
può fare da copertina d'archivio; l'**audio** vive solo nella vista
ravvicinata, la mensola resta muta; le tre opere fuori dall'archivio; Feral
resta con gli undici scatti che ha.

Di Claude, contestabili: `Filmato` accanto e non dentro `scatti`; la
rinumerazione consecutiva invece dei buchi; le due copertine scelte guardando
un provino; l'ordine delle voci nella `dl`.

Aperta: **il filmato è opera o documentazione?** Chiesto, risposta «non
saprei». Si chiude guardando la pagina, quando la pagina ci sarà.

---

## 3. Da controllare a mano

**Non ho guardato una sola pagina a schermo in questa sessione**: il dev server
era spento e tutta la verifica è passata da `pnpm build` e dall'HTML generato.
Da guardare sul dev server:

1. **Le work page delle cinque opere recenti**: la mensola con sette-undici
   lastre invece di una, che è un caso che il layout non aveva mai visto.
2. **I crediti nella `dl`**: sei righe in più, e `.credito[data-persone]` che
   va a capo a 16rem. Il rischio è la sovrapposizione con `.nota`, che attacca
   a 1096px.
3. **Le due copertine nuove** in `/works`, e Oser Savoir al posto giusto nella
   striscia.
4. **La timeline**, che ha due voci in più (Oser Savoir 2015, Apoteosi 2017).

---

## 4. Cosa manca

Il **player** e tutta la resa dei filmati; i **testi di curatela**, che restano
segnaposto ovunque; le opere d'**archivio**, che Lucio vuole vedere più avanti;
le cinque opere che mancano per arrivare a 26 — se 26 regge dopo le tre
esclusioni, ed è una domanda aperta.

**Due cose che il sistema non regge**, entrambe in `APERTI.md`:

- **Il 9:16 è fuori dai cinque formati.** Cinque scatti di Le Rêve Lever e due
  di Don Giovanni hanno rapporto 0,57 e `formato()` li accosta a 2:3: la
  cornice ne ritaglia il 16-18% dell'altezza, che su un verticale vuol dire
  togliere testa o piedi.
- **`bozze-media.sh` non sa niente dei tag del Finder.** Due copertine
  d'archivio venivano da cartelle rosse; le altre quindici non sono state
  ricontrollate.

---

## 5. Una cosa imparata su come lavorare qui

**L'EXIF Orientation.** Tredici delle sorgenti selezionate portano un
Orientation 6 o 8: i pixel sono orizzontali, l'immagine vera è verticale.
`sips -Z` — quello che usa `bozze-media.sh` — conserva sia i pixel che il tag,
quindi il file misura 1600×1200 ma il browser, che l'EXIF lo applica, ne mostra
1200×1600. Le misure dichiarate in `opere.ts` sarebbero state rovesciate,
`formato()` avrebbe scelto 4:3 al posto di 3:4 e **la cornice avrebbe
ritagliato l'immagine sbagliata** su undici scatti fra Feral e Don Giovanni.

Me ne sono accorto solo perché ho aperto una copertina per guardarla e l'ho
vista verticale mentre il referto la diceva orizzontale. **Guardare i derivati,
non fidarsi del referto.**

`scripts/scatti.sh` usa ffmpeg, che l'orientamento lo applica scrivendo, e
`-map_metadata -1` non lascia il tag. Se un domani si torna a `sips`, il
problema torna con lui.

**I tag del Finder sono in italiano**: `Rosso` e `Verde`, non `Red` e `Green`.
`mdfind -onlyin <cartella> "kMDItemUserTags == 'Verde'"`.

---

## 6. E la cosa più importante

**La guida di progetto è fuori da questo repository.** Ogni `§` citato nei
commenti è una parafrasi. **Chiedi la guida prima di fidarti di un `§`**,
soprattutto prima di usarne uno per giustificare una decisione — e in questa
sessione il §3.3 e il §4.1 sono stati usati parecchio.
