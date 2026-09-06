# Handoff — 6 settembre 2026

Sessione lunga, tutta su `/works` e sul marchio. Branch `dopo-helper`, albero
pulito, `pnpm typecheck`/`lint` verdi. Otto commit, da `b77306c` a `c05d1b5`.

Questo documento è **datato e si consuma**. Ciò che resta vero nel tempo sta in
`APERTI.md`, aggiornato commit per commit in questa sessione.

---

## 1. Cosa è cambiato

### Il nome, e l'anagrafe

- **L'anno di nascita sparisce da tutto il sito** (`b77306c`). Home, piede: solo
  `ITA`. `/about`, scheda: `nato: ITA`, e `base` non è più un trattino ma
  `Sassari`. `/about`, contatti: **via il numero di telefono**, restano email e
  social.
- **L'header porta `manuel casati`, non più la sola `manuel`** (`6495a93`). Il
  wordmark è ora il lockup intero, e con lui la sequenza della soglia — che lo
  misura a runtime e si adatta al segno più largo. `components/marchio.tsx` ha
  la prop `esteso`: default `manuel` (la chiusura di `/about` resta così),
  `esteso` aggiunge `casati` a destra nello stesso `viewBox`. Sorgente:
  `01-assets/svg/manuel-wide-web.svg` (fuori dal repo). Divergenza dal §2.2
  annotata in `APERTI.md`.

### `/works` — da griglia a striscia

- **Una riga sola che scorre in orizzontale, dalla più recente** (`0a7a1cc`).
  Prima erano due righe riempite per colonna, opere consecutive impilate. Ora
  `page.tsx` rovescia `OPERE` in lettura (`INDICE = [...OPERE].reverse()`);
  `lib/opere.ts` resta cronologico. Lastre da ~330px invece di 148.
- **Scorrimento continuo, non più a passi** (`50483b8`). Il cursore saltava di
  opera in opera con un momento che mandava una rotellata a percorrere mezzo
  archivio. Ora `motore.tsx` trascina la striscia in pixel, risposta lineare
  (`FATTORE_ROTELLA`), decelerazione solo dallo smorzamento. Due Observer sullo
  stesso target (rotella senza `ignore`, tocco con) — così si scorre anche col
  cursore sopra un'opera. Verso allineato alla timeline: giù = avanti.
- **La banda non sfarfalla più** (`64e86c2`). L'hover che le arriva è ritardato
  (`RITARDO_BANDA`, nel motore) e il cambio d'opera è un crossfade (`banda.tsx`,
  due strati sovrapposti) invece di un `fromTo(0→1)` che ripartiva prima di
  finire.
- **I tag non si spostano più all'hover** (`5f040ea` + `64b4a2f`). Erano due
  effetti: l'indicatore `(NN—21)` che compariva spingeva i tag in orizzontale
  (risolto con `min-width`), e `.banda { align-items: flex-end }` li
  trascinava giù di ~80px quando la scheda cresceva (risolto con `flex-start`,
  che è anche ciò che il commento diceva già).
- **Il selettore di categorie funziona** (`c05d1b5`, MOCK). Sceglierne una
  attenua le opere fuori categoria a 0.3 (restano al loro posto, è una lente)
  e scorre gentile alla prima dentro. `motore.tsx` tiene lo stato `categoria`,
  un `useEffect` marca `data-fuoricategoria` sulle celle e avvia lo scorrimento;
  i tag sono bottoni a due stati (`aria-pressed`). Criterio provvisorio: il
  `medium` dell'opera (`data-medium` sulle celle) — vedi §3.

### Documentazione

- `README.md` riscritto: non descriveva più il sito reale (diceva ancora «solo
  infrastruttura tecnica»).
- `02-docs/PROMPT-OPERE.md` (fuori dal repo): contesto per una chat dedicata a
  popolare la sezione opere — immagini vere e testi della curatela.

---

## 2. Decisioni, e di chi sono

Prese da Claude, con l'ok di Lucio sui bivi:

- **`/works` a riga singola**, non a due righe rovesciate né lettura per riga.
  Scelto per la leggibilità (le due righe si leggevano a zig-zag) e perché lo
  scorrimento smorzato ha finalmente una striscia vera da percorrere.
- **Il filtro attenua, non taglia.** L'archivio resta intero — §3.3, «una
  sequenza unica 01→26» — e la categoria è una lente. È anche il linguaggio che
  il sito già usa per l'enfasi (opacità, non il rosso).
- **Scorrimento gentile alla prima della categoria** (`VAI_A_CATEGORIA`), non
  «resta ferma e attenua e basta»: il clic deve fare qualcosa di visibile anche
  se le opere della categoria sono fuori schermo.
- **Categorie mock su `medium`.** Lucio ha chiesto di tenerle mock per ora: il
  meccanismo è collegato, il criterio è provvisorio.

---

## 3. Da controllare a mano

**Non ho potuto guardare le animazioni di `/works` a schermo in questa
sessione** (vedi §5). Verificato solo via DOM: stato, attributi sulle celle
giuste, regole CSS, bersagli. Da guardare sul dev server:

1. **Il selettore di categorie**: la dissolvenza delle opere fuori categoria e
   lo scorrimento gentile alla prima. Se il ritmo non convince, `VAI_A_CATEGORIA`
   in `lib/indice.ts`.
2. **Lo scorrimento continuo di `/works`**: che una rotellata muova «circa una
   lastra» e non troppo/troppo poco. Manopola: `FATTORE_ROTELLA`.
3. **Il crossfade della banda** fra un'opera e l'altra spazzando il mouse.
4. **Il marchio `manuel casati` nell'header sotto la soglia compatta**: a 375px
   sta stretto con le tre voci (annotato in `APERTI.md`, non risolto).
5. **La sequenza della soglia sulla home** col marchio più largo.

Con i dati mock quasi tutte le opere hanno `medium: "—"`: una categoria ne
accende 1-2 e ne attenua ~19. È il dato, non il meccanismo.

---

## 4. Cosa manca

Non toccato: il video (§8), i testi segnaposto delle opere, la revisione
legale, il telefono (ora tolto da `/about`, ma se serve un recapito
telefonico va ripensato), l'artboard del layout compatto. Vedi `APERTI.md`.

**Nuovo in `APERTI.md`** questa sessione:
- il header sotto la soglia compatta e le frecce/drag mancanti su `/works`;
- la banda che resta indietro dopo uno scroll con la rotella (la timeline lo
  risolve con `setRiaggancio`);
- come il filtro tag agirà quando la curatela scrive i tag veri (nasconde,
  attenua, salta col cursore?);
- il §2.2 (proporzione del wordmark) da aggiornare.

---

## 5. Una cosa imparata su come testare qui

**Una scheda di Chrome in background mette in pausa `requestAnimationFrame`, e
con lui il ticker di GSAP e le transizioni CSS.** In questa sessione la scheda
di test è rimasta `document.visibilityState === "hidden"` per gran parte del
tempo: niente si animava — scorrimento, crossfade, dissolvenze — e per un po'
l'ho scambiato per un bug del codice. Prima di sospettare il motore, controllare
`document.visibilityState`. La logica non-animata (stato, attributi, calcoli) si
verifica lo stesso; il *movimento* va guardato con la scheda in primo piano.

Restano valide le note vecchie: CSS globale stantìo su Turbopack (riavviare
`pnpm dev` se un cambiamento globale non compare), e il lazy loading di
`next/image` che si rompe dopo molte navigazioni nella stessa scheda.

---

## 6. E la cosa più importante

**La guida di progetto è fuori da questo repository.** Ogni `§` citato nei
commenti è una parafrasi. **Chiedi la guida prima di fidarti di un `§`**,
soprattutto prima di usarne uno per giustificare una decisione.
