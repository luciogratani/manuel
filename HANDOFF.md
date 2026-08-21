# Handoff — 21 agosto 2026

Fine di una sessione lunga. Branch `dopo-helper`, tutto pushato su
`origin/dopo-helper`, albero pulito, `npm run build` verde.

Questo documento è **datato e si consuma**: dice cos'è successo, chi ha deciso
cosa, e cosa va guardato a mano. Le cose aperte che restano vere nel tempo
stanno in `APERTI.md` e non si ripetono qui.

---

## 1. Cosa è cambiato

**Il sito ha finito di essere fermo.** All'inizio della sessione solo la
timeline aveva un motore; adesso ce l'hanno tutte le pagine interattive, il
cambio pagina ha una grammatica, e `/about` e `/legali` esistono per davvero.

### La grammatica del movimento

- **La tenda** (`components/tenda.tsx`) è il primitivo del taglio: un
  rettangolo rosso che entra, copre e si ritira. Due tempi, un solo verso di
  marcia, nessuna dissolvenza sul rosso. Nasce dal player di `/home` e serve
  anche la preview della timeline, a tempo più corto.
- **Il cambio pagina è una DISSOLVENZA, non un taglio.** L'header non se ne va
  mai — è la stessa riga su tutte le pagine — quindi cambiando rotta non si
  esce da nessuna parte: è variazione interna e non passaggio di stato (§3.2).
  Fatto con `<ViewTransition>` di React dietro `experimental.viewTransition`.
- **Ogni pagina ha un ingresso suo**, e la dissolvenza li lascia parlare invece
  di mettercisi davanti. La pagina nuova si monta MENTRE la dissolvenza corre,
  quindi il suo ingresso è già avviato quando finisce.

### L'header

Vive in `app/layout.tsx`, identico su tutte le pagine, e **nasce sulla soglia**:
atterrando su `/` si compone in quattro tempi, ovunque altro c'è già. Porta il
marchio SVG (`components/marchio.tsx`), si rovescia in avorio sopra una tinta
piena, e non transisce mai.

### Le pagine

| | |
|---|---|
| `/` | player al centro esatto, scoperto dalla tenda |
| `/timeline` | zona di lettura, fuoco additivo, ingresso che costruisce lo strumento dal nonio |
| `/works` | motore nuovo: la selezione avanza scorrendo, la banda la segue |
| `/works/[slug]` | la mensola gira davvero: anello continuo, corrente che segue lo scorrimento |
| `/works/[slug]/[n]` | ingresso proprio |
| `/about` | due schermate: la scheda e la chiusura rossa |
| `/legali` | nuova, bozza in attesa di revisione legale |

---

## 2. Decisioni, e di chi sono

### Prese da Lucio

- **La home a due schermate è cancellata.** Il player va al centro esatto.
- **Il taglio fra pagine non va**: invadente. Prima provata la tenda rossa,
  poi quella di carta, poi scartate entrambe per la dissolvenza.
- **L'uscita coreografata da `/works` è scartata**: riempiva troppo. Cliccando
  un lavoro succede quello che succede ovunque.
- **La dissolvenza fra pagine più morbida.**
- **`/about`**: la chiusura rossa modellata sul riferimento, i contatti che si
  copiano al clic, l'invito `contact ↓`.
- **La citazione** e il testo dei legali: delegati a Claude con istruzione
  esplicita.

### Prese da Claude, e perché

Sono decisioni che vale la pena poter contestare, quindi sono elencate.

- **Il rosso è anche superficie, non solo taglio.** La chiusura di `/about` è
  una schermata rossa piena: contraddice il §2.3 alla lettera. L'eccezione è
  scritta accanto a `ROSSO` in `lib/movimento.ts`, ed è circoscritta a due casi.
- **La citazione di Luisa Casati** — «Voglio essere un'opera d'arte vivente» —
  scelta fra le due proposte perché è un manifesto di una riga e regge sotto il
  marchio. L'altra è un paragrafo e sarebbe diventata una didascalia.
- **La quarta colonna della chiusura** porta l'origine del cognome invece di una
  newsletter che non esiste. È anche ciò che prepara la citazione.
- **PP Hatton prende il ruolo di «voce»** su `/about`, che `lib/fonts.ts` le
  teneva in caldo. Reversibile in una riga.
- **`/legali` è una pagina e non una colonna**, e dichiara in testa di essere
  una bozza: un testo che desse per risolto ciò che non lo è darebbe una falsa
  sicurezza dove serve quella vera.
- **La corrente della mensola cambia altezza e non larghezza**, e cresce in
  proporzione al proprio registro (fattore 2,1, che è l'artboard). Una lastra
  che si allarga spinge le vicine e l'anello andrebbe rimisurato ad ogni cambio.
- **Sull'indice niente anello, sulla mensola sì.** Le opere hanno un ordine che
  significa qualcosa, le fotografie di un'opera no.
- **Ogni lastra della mensola è un rimando**, non solo la corrente: con la
  corrente che si sposta, il rimando sarebbe un bersaglio in movimento.
- **`Observer` ovunque, mai `Draggable`.** Un solo modello d'ingresso.

---

## 3. Da controllare a mano

Le animazioni le ho verificate con Chrome headless (vedi §5), ma **il giudizio
è di chi guarda**. In ordine di quanto conta:

1. **La sequenza della soglia** su `/` — atterrandoci a freddo, non navigandoci.
   Il marchio si materializza al centro, scivola, le rotte escono da sotto di
   lui, la riga si apre e sale nell'header. ~2,7s.
2. **Il cambio pagina**: 0,36s di dissolvenza, l'header fermo. Si vede meglio
   passando a `/timeline`, che ha un ingresso lungo.
3. **La mensola** su `/works/funeral-rave`: rotella, anello continuo, la
   corrente che cambia sotto la linea di lettura. **È l'unica opera con una
   mensola** — le altre venti hanno uno scatto solo.
4. **L'indice** su `/works`: scorrendo la selezione avanza, la cornice si
   sposta, la banda e l'indicatore la seguono. La griglia si muove di nove
   pixel soli, e non è un difetto (vedi `APERTI.md`).
5. **Il riaggancio dopo il fling** sulla timeline: spingi, rilascia, e senza
   muovere il mouse la voce che arriva sotto il cursore riaccende il pannello.
6. **`/about`**: il click-to-copy col riquadro che segue il cursore, e la
   chiusura rossa — avorio su rosso dà 5,70:1, l'inchiostro dava 3,12 ed era
   bocciato.
7. **Le finestre basse.** Tutto è a quote fisse su una viewport di riferimento,
   e il freno di `globals.css` rimpicciolisce. Vedi la voce `--rif-altezza` in
   `APERTI.md`: c'è un sospetto di sovrastima.
8. **Senza JavaScript** (`scripting: disabled` nei devtool): ogni ingresso ha un
   default che vale "nessun effetto", e va confermato che resti vero.

---

## 4. Cosa manca

**Codice.** Una cosa sola, ed è grande: **il video** (§8), che il commento in
`app/page.tsx` chiama «il problema irrisolto del progetto». Il player della
home è ancora un rettangolo grigio e `media-chrome` è installato e mai usato.

**Curatela**, che è la parte più lunga:

- i testi segnaposto di `/about` (la frase in Hatton, due paragrafi, `base: —`)
- le descrizioni delle opere e le didascalie degli scatti
- i tag, `meta-voice`, le categorie del piede di `/works`
- **le cinque opere mancanti** — `APERTI.md` dice dove cercarle
- il numero di telefono in `/about` è ancora un segnaposto sicuro (prefisso 000)

**Decisioni che aspettano Lucio**: le tre voci di `APERTI.md` — `--rif-altezza`,
la revisione legale con le liberatorie, e la riscrittura del §2.3 nella guida.

**Pulizia**: `lenis` è installato e mai importato. Serviva alla home a due
schermate, che è stata cancellata, e adesso nessuna pagina ha uno scorrimento
verticale che valga uno smoothing. Probabilmente si disinstalla.

---

## 5. Due cose da sapere prima di lavorare qui

**Il CSS globale si serve stantio.** Le modifiche a `app/globals.css` non
finiscono nel chunk servito finché non si ferma il dev server, si fa
`rm -rf .next` e si riparte. I CSS Modules invece si aggiornano normalmente. Mi
ha portato due volte a diagnosticare male.

**Le animazioni si possono provare davvero**, con Chrome headless:

```
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
      --window-size=1440,900 --screenshot=out.png http://localhost:3000/works
```

Con due trappole: `--virtual-time-budget` **non** guida le animazioni CSS (per
vederne una a metà bisogna rallentarne le durate nel foglio), e
`--force-prefers-reduced-motion=0` **accende** il moto ridotto invece di
spegnerlo — che è il modo più rapido di catturare lo stato a riposo.

Questo metodo ha trovato tre bug veri che il codice non mostrava: il rientro
che girava dentro l'anello, la corrente che diventava una scheggia, e l'onda
d'ingresso ordinata al contrario.

---

## 6. E la cosa più importante

**La guida di progetto è fuori da questo repository.** Ogni `§` citato nei
commenti è una parafrasi scritta da una sessione precedente, non la fonte —
vale anche per gli artboard. Ha retto perché le parafrasi sono buone, ma se una
è imprecisa l'errore si propaga senza segnali. È scritto anche in `AGENTS.md`,
che viene caricato ad ogni sessione.

**Chiedi la guida prima di fidarti di un `§`.**
