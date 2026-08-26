# Handoff — 26 agosto 2026

Sessione breve e mirata: la soglia compatta, e il giorno dopo tre correzioni
trovate provando da un telefono vero. Branch `dopo-helper`, non pushato,
albero pulito, `npm run build`/`typecheck`/`lint` verdi.

Questo documento è **datato e si consuma**. Le cose aperte che restano vere
nel tempo stanno in `APERTI.md`.

---

## 0. Il seguito del 26 agosto

Lucio ha provato la soglia compatta (§1 sotto) su un telefono vero e ha
trovato tre cose che Chrome headless non aveva mostrato (commit `457bca1`):

- **Il piede di `/about` sezione 1** era finito in flusso statico invece che
  ancorato al fondo — l'avevo scritto `position: static; margin-top: 0.5rem`
  nella soglia compatta, perdendo l'ancoraggio che aveva da `position:
  absolute` sopra la soglia. `margin-top: auto` sul flex column lo rimette
  in fondo senza tornare ad `absolute` (che avrebbe sovrapposto un
  contenuto più alto della schermata, se mai capitasse).
- **`100dvh` cambia live** quando la barra degli indirizzi del browser si
  nasconde scorrendo — è quello che Lucio vedeva come "la sezione che
  cresce". L'avevo usato pensando fosse la scelta più corretta (si adatta
  alla viewport vera), ma è proprio l'adattarsi in tempo reale a leggersi
  come un salto. Sostituito con `100svh` — la misura MINIMA, con la barra
  sempre visibile, che non cambia mai — in tutti i punti dove compariva
  (`/about`, `/works`, `/works/[slug]`, `/works/[slug]/[n]`, `/timeline`),
  più un secondo `vh` semplice rimasto nell'altezza del marchio della
  chiusura di `/about`.
- **L'email di `/about` sezione 2** copiava negli appunti anche sotto la
  soglia compatta — comportamento pensato per desktop, dove un `mailto:`
  apre spesso il programma sbagliato (vedi il commento originale in
  `page.tsx`). Su un telefono `mailto:` apre quasi sempre la app di posta
  giusta: sotto la soglia un `<a href="mailto:...">` vero sostituisce il
  componente `Copia`, mostrato/nascosto via CSS allo stesso breakpoint. Il
  numero resta copiabile su entrambe le soglie — un `tel:` non
  aggiungerebbe nulla che il copia-e-incolla in un dialer non faccia già.

Nessuna delle tre era visibile nei test con Chrome headless di ieri: la
lezione è che un provino su un telefono vero resta necessario, non solo
un'emulazione via CDP.

---

## 1. Cosa è cambiato

**Il sito ha smesso di essere solo desktop.** Fino a ieri l'unico meccanismo
"responsive" era lo scaling uniforme in `app/globals.css`: sotto
`--pavimento` la composizione smetteva di rimpicciolire e restava tagliata,
non reimpaginata. Il commento nel foglio lo diceva già da sessioni fa — "è
il punto in cui prima o poi entrerà un impianto mobile a sé" — ed era vero
alla lettera: su un telefono, crediti e nota della pagina opera cadevano
fuori dal viewport (per le venti opere a foto singola anche titolo e
descrizione), la banda di `/works` non mostrava mai nulla su touch
(`pointerType !== "mouse"`), le colonne di `/about` uscivano dallo schermo.
Non erano difetti estetici: era contenuto vero, irraggiungibile.

### La soglia

`SOGLIA_COMPATTA` (`lib/movimento.ts`) è 860px, condivisa fra CSS
(`@media (max-width: 860px)`, letterale in ogni foglio — il progetto non ha
un plugin per le custom media query) e JS (`compattoAttivo()`). Sotto la
soglia:

- **`/timeline`** — il nastro (canvas orizzontale) lascia il posto a un
  elenco verticale delle stesse voci.
- **`/works`** — la griglia con scorrimento smorzato lascia il posto a una
  griglia che si impila, col titolo sempre leggibile sotto la lastra invece
  che in una banda che si accende solo in hover.
- **`/works/[slug]`** — la mensola (o l'unica foto) lascia il posto alla
  sequenza intera in pila verticale; scheda, crediti e nota tornano in
  flusso normale.
- **`/works/[slug]/[n]`** — restava già scrollabile nativamente: qui è solo
  un aggiustamento di larghezze (l'apparato non sta più al 40% fisso) e un
  riordino via `order` (back e didascalia prima delle foto, non dopo).
- **`/about`** — le tre colonne della scheda e le quattro della chiusura si
  impilano; l'ordine del DOM era già quello di lettura.
- **`/`, `/legali`, l'header** — non toccati: erano già a posto (verificato,
  non presunto — vedi §3).

### Perché gli Observer si spengono, non solo il CSS

I tre motori (`app/works/motore.tsx`, `app/timeline/motore.tsx`,
`app/works/[slug]/mensola.tsx`) agganciano il loro GSAP `Observer` a
`.pagina` intera, non al solo canvas — per non perdere la rotella quando il
puntatore è sopra testa o piede. Nascondere il canvas via CSS non basta:
l'Observer resterebbe comunque lì a intercettare wheel/touch, impedendo lo
scroll nativo del layout compatto sotto di lui. `compattoAttivo()` letta una
volta al montaggio (stesso compromesso di `motoRidotto()`/
`ATTERRATO_SULLA_SOGLIA`: un resize che attraversa la soglia — rotazione di
un tablet — non fa ripartire il motore a pagina già caricata).

---

## 2. Decisioni, e di chi sono

Presa da Claude, vale la pena poterla contestare:

- **860px come soglia unica**, non due (mobile e tablet separati). Scelta
  perché anche un iPad in verticale (768-834px reali) ha lo stesso problema
  di fondo — colonne pensate per 1440px che non ci stanno — non solo il
  telefono. Non è una misura da un foglio come `--rif-altezza`: è una
  soglia scelta a occhio e verificata su 375/820/1440px. Se si vuole una
  fascia tablet intermedia, oggi non esiste.
- **Niente reflow delle composizioni esistenti**: per ogni pagina a canvas
  fisso, sotto la soglia c'è una seconda vista — stessi dati, markup
  diverso, non le stesse coordinate ripiegate con media query. Il
  ragionamento: le pagine sono composizioni ad artboard (1440px, posizioni
  assolute), non documenti che scorrono — provare a far reimpaginare
  elementi assoluti con breakpoint avrebbe dato un risultato raffazzonato.
  `/legali`, l'unica pagina già in flusso normale, era già corretta: è il
  modello seguito.
- **La mensola non prova a diventare mobile**: sotto la soglia sparisce
  (Observer spento, striscia nascosta) e le stesse foto tornano in una pila
  verticale nativa. Nessun tentativo di adattare l'anello a schermi stretti.

---

## 3. Da controllare a mano

Verificato con Chrome headless via CDP (`Emulation.setDeviceMetricsOverride`,
non `--window-size` da riga di comando — vedi §5) a 375×812, 820×1180,
1440×900. **Il giudizio resta di chi guarda**:

1. Il testo segnaposto della sezione compatta di `/works/[slug]` e
   `/timeline` è duplicato da quello desktop (stessi dati, stesso markup
   scritto due volte in JSX): quando la curatela scriverà i testi veri,
   vanno aggiornati in entrambi i punti finché non si estrae un componente
   condiviso.
2. Il breakpoint a 860px è una scelta, non una misura: se un domani arriva
   un tablet reference (artboard dedicato), va rivista.
3. Non testato su un dispositivo touch reale — solo emulazione
   `Emulation.setTouchEmulationEnabled` e `mobile:true`.

---

## 4. Cosa manca

Non cambiato da questa sessione: il video (§8), i venti testi segnaposto, i
tag/filtro dell'indice, la revisione legale, il telefono ancora un
segnaposto. Vedi `APERTI.md`.

**Nuovo**: nessuna pagina compatta ha un proprio artboard di riferimento —
sono state disegnate da questa sessione in continuità stilistica (stessi
font, stesso rosso, stesso ritmo verticale di `/legali`), non da un
disegno approvato. Se la guida di progetto (fuori da questo repo) ha
opinioni sul layout mobile, vale più di quanto costruito qui.

---

## 5. Una cosa imparata su come testare qui

**Chrome headless via `--window-size=WxH --screenshot=out.png URL` in
un'unica invocazione non è affidabile per verificare layout stretti**: in
più di un caso la pagina è stata renderizzata a una larghezza diversa da
quella richiesta (osservato ~500px invece di 375px) e lo screenshot veniva
comunque ritagliato a 375×812, dando l'impressione di un overflow
orizzontale che non esisteva. Il modo affidabile è pilotare Chrome via CDP
(`--remote-debugging-port`, poi `Emulation.setDeviceMetricsOverride` prima
di navigare) — più lento da mettere in piedi ma l'unico che ha dato misure
coerenti con `document.documentElement.scrollWidth`.

**Riusare a lungo la stessa scheda per navigazioni ripetute rompe il lazy
loading di `next/image`**: dopo una decina di navigazioni consecutive nella
stessa scheda via `Page.navigate`, le immagini smettevano di caricare
(nessuna richiesta di rete, `IntersectionObserver` apparentemente muto) —
non riproducibile su una scheda aperta fresca. Se un test mostra immagini
mancanti dopo molte navigazioni, prima di sospettare il codice aprire una
scheda nuova.

Restano valide le due note della sessione precedente (CSS globale stantio
su Turbopack, `--force-prefers-reduced-motion=0` per lo stato a riposo).

---

## 6. E la cosa più importante

**La guida di progetto è fuori da questo repository.** Nessuno dei `§`
consultati in questa sessione parla esplicitamente di mobile — la strategia
del §2 sopra è dedotta dal resto del sito, non dalla guida. **Chiedi la
guida prima di fidarti di un `§`.**
