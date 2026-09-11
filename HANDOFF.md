# Handoff — 11 settembre 2026

Tre blocchi di lavoro in una sessione: il **CV** sostituito, la **mensola di
Don Giovanni** rimessa in riga, e una **lista di ritocchi di curatela** data da
Lucio. `typecheck` e `lint` verdi. Non c'è stato un branch: i commit vanno su
`main`, come tutta la storia recente del repo.

Questo documento è **datato e si consuma**. Ciò che resta vero nel tempo sta in
`APERTI.md`. **Leggi quello per secondo, dopo `AGENTS.md`.**

---

## 1. Il CV (`/cv`)

Sostituito con la versione del **10 settembre 2026**: una pagina, ~19 KB,
LibreOffice. `app/cv/page.tsx` è allineato (scheda, peso, data).

- **Non porta più email né fotografia** in testa (la vecchia aveva
  `manuelcasati89@gmail.com` e un ritratto). I due dubbi «prima di pubblicare»
  segnati in `APERTI.md` sono chiusi dal file stesso.
- **`EMAIL` in `lib/sito.ts` resta `manuelcasati89@gmail.com`** — il valore non
  cambia, ma il PDF non ne è più la sorgente perché ora tace. Commento
  aggiornato lì.
- La nuova versione è **più asciutta**: niente formazione, niente chiusura
  «14 novembre» per A Boy's Closet. Le decisioni del 7 settembre basate su
  quelle righe **restano valide** (non contraddette), ma i commenti in
  `app/about/page.tsx` e `lib/opere.ts` che citano `public/cv/` come prova ora
  puntano a un file che quel dettaglio non ha più.
- **Corsa Futurista**: il CV dice ancora «2015–2024». Contraddizione con
  l'archivio invariata (vedi `APERTI.md`).

## 2. La mensola di Don Giovanni

**Il bug segnalato**: lo scroll non scrollava e la foto in evidenza non era
allineata alla colonna di testo. Una sola causa: la guardia dell'anello a
`mensola.tsx:207` scatta (striscia più corta del binario, ~40px) e nel ramo
che esce subito **nessuno portava la lastra corrente sotto la linea di
lettura** — `.fila` ha `padding-left: 0` apposta, di norma ce la porta il
motore.

**Il fix** (`mensola.tsx`): nel ramo fermo la fila viene traslata una volta (e
a ogni resize) per allineare la corrente. La striscia **resta non scorrevole**
— è documentato come accettabile in `APERTI.md`, e la sezione «mensola» lì
spiega perché non conviene forzare l'anello con una guardia più generosa
(oscilla attorno alla soglia al variare dell'altezza della finestra).

Verificato a schermo: `delta` corrente ↔ `.scheda` = **0**. Le Rêve Lever
invece **l'anello lo accende** — le 7 foto aggiunte il 7 settembre l'hanno
portata oltre il binario; `APERTI` che la dava ancora ferma era stale, corretto.

## 3. Ritocchi di curatela (Lucio, 11 settembre)

Tutti in `lib/opere.ts` salvo dove detto. Nessuno slug è cambiato, nessun URL.

| opera | cosa |
|---|---|
| **Candide a palazzo Guillot** | tolta dalla descrizione la frase-nota «Nessun documento accompagna questa cartella…». Il credito «foto: Blanka Meccanica» era già nei crediti. |
| **Editorial Blanka** → **Editoriale per KALTBLUT** | titolo e descrizione (le foto le ha pubblicate KALTBLUT Magazine, Berlino). **Slug invariato** `editorial-blanka` — un nome già servito non si sposta. Aggiornato anche `lib/timeline.ts`. |
| **Apoteosi** | tolta la foto **17** (un backstage). File `17.jpg` cancellato. La sequenza salta 16 → 18: nessuno legge il nome del file. `scatti: 17`. |
| **The Missing** | **anno 2019 → 2018** (Lucio). Scavalca la IV Corsa Futurista (2019): array riordinato, **numero 12 → 11**, e corsa-futurista-iv **11 → 12**. Copertina → foto **2** (i quattro ensemble nel campo). Aggiornato `lib/timeline.ts`. |
| **Corsa Futurista — VI** | copertina → foto **7**. Tuple riordinati, file non rinominati. |
| **Don Giovanni** | tolta la foto **11** (la locandina dello spettacolo — grafica, non fotografia). File `11.jpg` cancellato. `scatti: 10`. La mensola è ancora più corta di prima, ma il fix del punto 2 la tiene allineata. |
| **`/about`** | vedi `APERTI.md` › «Recapiti»: tolta la colonna «il nome», curriculum e note legali separati (restano 4 colonne), la voce in cima attribuita a **Manuel Casati**, la citazione di Luisa Casati in fondo **tenuta**. |

---

## 4. Da controllare a mano

1. **Le nuove copertine con l'occhio**: `the-missing/02.jpg`, `corsa-futurista-vi/07.jpg`
   — scelte di Lucio, viste in derivato ma non su tutte le viste (indice,
   cronologia, card OG).
2. **`/about`**: la ripetizione «Manuel Casati» (`<h1>`) + «— Manuel Casati»
   (attribuzione della voce) a cinque righe di distanza. Se stona, l'alternativa
   è togliere la riga dell'attribuzione. Vedi `APERTI.md`.
3. **`shooting-editoriale` (numero 6)** ha la stessa frase-nota di Candide:
   «Nessun documento accompagna la cartella.» Non toccata — Lucio ha segnalato
   solo Candide. Da decidere se vale lo stesso taglio.
4. **`public/media/scatti.txt`** è un referto generato e **già monco** (vedi
   `APERTI.md`). Non l'ho toccato: contiene ancora `apoteosi|17`, e non ha mai
   avuto don-giovanni né the-missing. Si sistema rigenerandolo con
   `scripts/scatti.sh`, non a mano.

## 5. Cosa resta aperto (invariato da prima)

Tutto ciò che era in `APERTI.md` e non è nominato qui sopra: i testi di
`/about` (segnaposto), le didascalie per-foto, i tag/filtro dell'indice (MOCK),
la revisione legale, il montaggio di Coucher e l'hero della home, Corsa
Futurista (arco 2015/2024 vs archivio), «BDSM» senza cartella, il campo `nudo`
come prima passata, i file orfani in `public/media/indice/`.

---

## E la cosa più importante

**La guida di progetto è fuori da questo repository.** Ogni `§` citato nei
commenti è una parafrasi scritta da una sessione precedente, non la fonte.
**Chiedi la guida prima di fidarti di un `§`**, soprattutto prima di usarne uno
per giustificare una decisione.
