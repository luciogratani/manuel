// Dati e funzioni pure della timeline (§8 della guida — biografia storica,
// non l'indice dell'archivio). Spostati fuori da `page.tsx` perché il motore
// client (`app/timeline/motore.tsx`) ne ha bisogno quanto il Server Component.

export const INIZIO = 2010;
export const FINE = 2026;

/** Pixel per anno sulla viewport di riferimento. Governa la densità dell'asse. */
export const PASSO = 240;

/** Larghezza di una voce. Serve anche a capire quando due voci si accavallano. */
export const VOCE = 200;

/** L'anno letto dalla testina a scorrimento zero: 2013 è quello che cade al
 *  centro della viewport quando `--scorrimento` vale il suo default `0rem`.
 *  Da qui in poi l'anno vero lo calcola il motore dalla posizione. */
export const CORRENTE_INIZIALE = 2013;

/** Quanto si può tirare oltre un capo prima che la molla sia "vinta" (in anni
 *  equivalenti). Quanta spinta sostenuta serve per vincerla e saltare al capo
 *  opposto. Prima ipotesi, da tarare a occhio guardando la pagina. */
export const ELASTICO_ANNI = 1.5;
export const SFORZO_SALTO = 38;

/** Il salto al capo opposto è spento. §4.4 della guida: "un archivio ha un
 *  inizio e una fine, e la cronologia è il suo senso" — il loop infinito era
 *  stato scartato lì, e premiare la spinta prolungata con un teletrasporto
 *  2026→2010 lo rimetteva esattamente nei due punti che invece devono dire
 *  "qui finisce". Senza salto la sola risposta alla spinta resta l'enfasi dei
 *  dentini forzati, che il limite lo dice invece di annullarlo.
 *  Come TRASCINAMENTO_ATTIVO: il codice resta intero, questo è l'unico
 *  interruttore. */
export const SALTO_ATTIVO = false;

/** Quanto insegue l'obiettivo la posizione visibile, e quanto in fretta
 *  `obiettivo` torna al capo quando è stato tirato oltre e nessun input lo
 *  spinge più: entrambi normalizzati a 60fps (`smorza()` in motore.tsx). Più
 *  basso = più morbido/lento. Abbassato da 0.25 a 0.1 su segnalazione che lo
 *  scroll sembrava 1:1. */
export const SMORZAMENTO = 0.1;
export const RILASSAMENTO_BORDO = 0.12;

/** Sensibilità: quanto di un delta in ingresso arriva davvero a `obiettivo`.
 *  Non "frizione" nel nome perché è un moltiplicatore, non una resistenza da
 *  invertire — ma è la stessa manopola. `SENSIBILITA_BORDO` si applica IN
 *  PIÙ, solo dentro la zona elastica — le due si moltiplicano, quindi ai
 *  bordi la resistenza totale è maggiore delle due prese singolarmente.
 *  `SENSIBILITA_GENERALE` abbassata da 0,8 a 0,3: con un solo movimento si
 *  attraversava tutta la timeline, serviva molto più che un -20%. */
export const SENSIBILITA_GENERALE = 0.3;
export const SENSIBILITA_BORDO = 0.7;

/** Il tocco non è la rotella: il dito non "spinge" il nastro, lo tiene. Deve
 *  restare 1:1 sotto il polpastrello, altrimenti si legge come rotto e non
 *  come pesante — quindi ha una sensibilità sua e non passa da
 *  SENSIBILITA_GENERALE. */
export const SENSIBILITA_TOCCO = 1;

/** Il trascinamento col mouse (drag) esiste ancora nel motore ma è spento:
 *  troppo sensibile rispetto a rotella/tastiera e non ancora tarato a sé.
 *  Il codice resta intero apposta — riattivarlo è girare questo booleano,
 *  non riscrivere nulla. Il cursore `grab`/`grabbing` in CSS resta comunque,
 *  segnala che l'area è manipolabile anche solo con la rotella. */
export const TRASCINAMENTO_ATTIVO = false;

/** Il momento residuo dopo che l'input smette: quanta velocità sopravvive
 *  dopo un secondo (decadimento esponenziale, indipendente dal frame rate).
 *  Senza questo l'interazione si fermava di scatto al rilascio — "immersivo
 *  ma ancora leggermente bloccato". Rispetta la stessa fisica di bordo/salto
 *  di un push diretto: non è un sistema a parte. */
export const MOMENTO_DECADIMENTO = 0.05;
/** Sotto questa velocità (anni/secondo) il momento si azzera invece di
 *  continuare a scemare all'infinito. */
export const MOMENTO_SOGLIA = 0.01;

/** Sotto questo scarto fra obiettivo e posizione, in anni, il nastro è fermo.
 *  0,001 anni sono meno di un quarto di pixel a `PASSO` 240: l'inseguimento
 *  smorzato non arriva mai esattamente a zero, quindi "fermo" va definito, non
 *  aspettato. Serve a sapere quando il fling è finito e la voce sotto il
 *  puntatore va riagganciata. */
export const FERMO_SOGLIA = 0.001;

/** Il tick sonoro si intona leggermente con la direzione: più acuto andando
 *  avanti nel tempo, più grave tornando indietro — non una soglia che
 *  sospende, un colore che segue il movimento. `TICK_DETUNE_CENTI` è il
 *  margine massimo (in cent, 1/100 di semitono — appena percettibile di
 *  proposito), raggiunto quando la velocità arriva a
 *  `TICK_DETUNE_VELOCITA_RIFERIMENTO` (anni/secondo); sotto scala in
 *  proporzione. */
export const TICK_DETUNE_CENTI = 25;
export const TICK_DETUNE_VELOCITA_RIFERIMENTO = 3;

/** Quanti anni si muove `obiettivo` per pressione di freccia. Riusa la
 *  stessa fisica di `spingi()`, quindi resta soggetto a elastico e salto. */
export const PASSO_TASTIERA = 0.25;

/** Quanto aspettare dopo un `mouseleave`/`blur` prima di nascondere davvero
 *  il pannello: abbastanza perché passare da un titolo al successivo non
 *  faccia lampeggiare lo stato vuoto in mezzo (il bug dell'hover veloce). */
export const RITARDO_NASCONDI_MS = 100;

/** Il fuoco attorno al nonio. Curva a campana di Lorentz, non a coseno: sale
 *  ripida vicino al centro e poi ha una coda lunga e morbida invece di un
 *  taglio netto al raggio — "centro più chiuso, bordi lunghi e morbidi".
 *  `FOCUS_RAGGIO_MESI` è dove la campana è a metà altezza, non un confine:
 *  oltre continua a scendere senza mai un salto.
 *
 *  ADDITIVO, non moltiplicativo: `FOCUS_AGGIUNTA` è quanto CRESCE il dentino
 *  sotto il nonio, in px di riferimento, uguale per tutti e tre i tipi. Prima
 *  era un fattore di scala (×2,9) applicato all'altezza già autorata, quindi
 *  la differenza fra mese, gennaio e opera veniva esagerata di tre volte
 *  proprio dove l'occhio guarda: 6/12/18px diventavano 17/35/52. Ora la
 *  gerarchia autorata resta intatta e si sposta soltanto in su.
 *
 *  Ne è sparito anche il minimo: prima i dentini lontani erano schiacciati al
 *  10%, cioè la scala diceva "sei lontano" oltre a "sei qui". Quel mestiere
 *  ora è della zona di lettura, che lo fa con l'opacità — un segnale, un
 *  canale. Prima ipotesi, da tarare a occhio. */
export const FOCUS_RAGGIO_MESI = 14;
export const FOCUS_AGGIUNTA = 12;

/** La zona di lettura: denti, anni e voci salgono di opacità avvicinandosi al
 *  nonio. `LETTURA_PIENA` è la frazione CENTRALE della larghezza del binario
 *  che resta a piena opacità — al di là comincia la dissolvenza, che si spegne
 *  su `LETTURA_MIN` al bordo. Margini generosi di proposito: il fattore
 *  scende con una quadratica, quindi l'inizio della dissolvenza è
 *  impercettibile e il buio si concentra negli ultimi pixel.
 *
 *  Moltiplica l'opacità già autorata (0,25 / 0,45 / 1 sui dentini), non la
 *  sostituisce: al centro la gerarchia si legge tutta, ai bordi sparisce
 *  insieme al resto.
 *
 *  Il raggio è di proposito lontano da quello del fuoco: la campana dice
 *  "questo mese" (poco più di un anno), la zona dice "questa parte dello
 *  schermo" (qui ~3,5 anni). Se i due si avvicinano diventano lo stesso
 *  segnale scritto due volte. */
export const LETTURA_PIENA = 0.6;
export const LETTURA_MIN = 0.05;

/** Sotto questa variazione non vale la pena riscrivere una custom property:
 *  ad ogni frame il motore tocca ~270 elementi fra denti, anni e voci, e la
 *  maggior parte è ferma nella zona piena o già spenta ai bordi, dove il
 *  valore non cambia affatto. Non è un'ottimizzazione preventiva: è il costo
 *  di due proprietà per elemento invece di una. */
export const SOGLIA_SCRITTURA = 0.004;

/** I dentini si assottigliano avvicinandosi ai capi (2010/2026) — un segnale
 *  di limite, distinto dal fuoco del nonio. `BORDO_RAGGIO_ANNI` è quanto è
 *  largo l'assottigliamento, `BORDO_MIN` il fattore minimo. Quando si sta
 *  tirando oltre un capo (frizione attiva), il bordo che si sta forzando si
 *  enfatizza invece di assottigliarsi — riusa `eccesso`/`ELASTICO_ANNI` del
 *  motore, non un secondo calcolo. */
export const BORDO_RAGGIO_ANNI = 2;
export const BORDO_MIN = 0.5;
export const BORDO_ENFASI_PICCO = 2;

export type Voce = {
  titolo: string;
  anno: number;
  /** Solo per le voci che occupano un arco di anni. */
  fine?: number;
  medium: string;
  luogo: string;
  /** Quando la voce è anche un'opera del sito: lo slug in `lib/opere.ts`, da
   *  cui si ricavano `href` e copertina — non duplicati qui (§3.3, una sola
   *  fonte per lo stesso dato). */
  slug?: string;
};

// ATTENZIONE — dati provvisori, e volutamente incompleti.
//
// Sono le sole voci il cui anno è leggibile da una fonte: i nomi delle
// cartelle in 01-assets/media, e — da Oser Savoir e Apoteosi in poi — i
// documenti dentro le cartelle e il portfolio compilato. Le altre non hanno
// una data che io possa ricavare senza inventarla. Meglio quattordici voci
// vere che ventisei con dodici anni finti.
//
// Qui dentro finiranno anche le voci che opere non sono — formazione, appunti,
// lavori esterni — che Manuel aggiungerà.
export const VOCI: Voce[] = [
  { titolo: "Candide a palazzo Guillot", anno: 2013, medium: "intervento", luogo: "Palazzo Guillot, Alghero", slug: "candide-a-palazzo-guillot" },
  { titolo: "Glamour Confusion", anno: 2014, medium: "—", luogo: "—", slug: "glamour-confusion" },
  { titolo: "Oser Savoir", anno: 2015, medium: "collezione", luogo: "—", slug: "oser-savoir" },
  { titolo: "Shooting per Editoriale", anno: 2015, medium: "fotografia", luogo: "—", slug: "shooting-editoriale" },
  { titolo: "Fanton Milano Fashion Week", anno: 2015, medium: "editoriale", luogo: "—", slug: "fanton-milano-fashion-week" },
  { titolo: "Corsa Futurista — I edizione", anno: 2015, medium: "corsa itinerante", luogo: "Sassari", slug: "corsa-futurista-i" },
  { titolo: "Corsa Futurista — II edizione", anno: 2016, medium: "corsa itinerante", luogo: "Sassari", slug: "corsa-futurista-ii" },
  { titolo: "Corsa Futurista — III edizione", anno: 2018, medium: "corsa itinerante", luogo: "Sassari", slug: "corsa-futurista-iii" },
  { titolo: "Corsa Futurista — IV edizione", anno: 2019, medium: "corsa itinerante", luogo: "Sassari", slug: "corsa-futurista-iv" },
  { titolo: "Corsa Futurista — VI edizione", anno: 2023, medium: "corsa itinerante", luogo: "Sassari", slug: "corsa-futurista-vi" },
  { titolo: "Apoteosi — Creazione di una Musa", anno: 2017, medium: "sfilata-performance", luogo: "Sassari e Alghero", slug: "apoteosi" },
  { titolo: "A Boy's Closet", anno: 2020, medium: "—", luogo: "—", slug: "a-boys-closet" },
  { titolo: "La Distanza", anno: 2020, medium: "fotografia", luogo: "Alghero", slug: "la-distanza" },
  { titolo: "L'Affair", anno: 2021, medium: "video performance", luogo: "Alghero", slug: "l-affair" },
  { titolo: "Le Rêve Lever", anno: 2022, medium: "—", luogo: "—", slug: "le-reve-lever" },
  { titolo: "Funeral Rave", anno: 2023, medium: "—", luogo: "—", slug: "funeral-rave" },
  { titolo: "Don Giovanni", anno: 2025, medium: "—", luogo: "—", slug: "don-giovanni" },
  { titolo: "Sauvage", anno: 2025, medium: "video", luogo: "Sassari", slug: "sauvage" },
  { titolo: "BDSM", anno: 2025, medium: "video", luogo: "—" },
  { titolo: "LOVE AND EAT", anno: 2026, medium: "video", luogo: "—", slug: "love-and-eat" },
  { titolo: "Coucher avec moi", anno: 2026, medium: "—", luogo: "—", slug: "coucher-avec-moi" },
];

export const ANNI = Array.from({ length: FINE - INIZIO + 1 }, (_, i) => INIZIO + i);

/** Un dentino per mese. Quello di gennaio è più lungo: è l'anno. */
export const MESI = Array.from({ length: (FINE - INIZIO + 1) * 12 }, (_, i) => i);

/** Quanto la PISTA (il tracciato renderizzato) si allunga oltre `INIZIO`/
 *  `FINE`, in mesi: dentini bassi e indifferenziati, niente marcatura di
 *  gennaio e niente etichetta d'anno — è spazio fisico per l'elastico, non
 *  una cronologia (quella resta 2010→2026, §4.1 della guida). Tenuto corto
 *  di proposito: troppa pista oltre i capi sembrava eccessiva. Oggi coincide
 *  con `ELASTICO_ANNI * 12`, ma sono due numeri distinti — uno quanto si
 *  tira, l'altro quanto se ne vede sotto le dita mentre lo si fa. */
export const PISTA_PADDING_MESI = 18;

/** Come `MESI` ma esteso di `PISTA_PADDING_MESI` per lato — solo per il
 *  rendering del nastro, mai per la logica del motore (ancorata a
 *  `INIZIO`/`FINE`). Chi consuma questo array decide da sé quali mesi sono
 *  "dentro" (marcabili come gennaio/anno) e quali sono solo padding. */
export const MESI_PISTA = Array.from(
  { length: (FINE - INIZIO + 1) * 12 + PISTA_PADDING_MESI * 2 },
  (_, i) => i - PISTA_PADDING_MESI,
);

export const rem = (px: number) => `${px / 16}rem`;

export type VoceTimeline = Voce & {
  /** Ascissa in pixel-di-riferimento, prima della conversione in rem. */
  x: number;
  /** L'ordinata non porta significato: serve solo a non far accavallare le voci. */
  riga: number;
  /** Risolti da `lib/opere.ts` quando `slug` è presente. Il numero è quello
   *  della sequenza d'archivio 01→26 (§3.3): non si deriva dalla posizione in
   *  `VOCI`, che è un altro insieme — qui dentro stanno anche voci che opere
   *  non sono, e quelle un numero non ce l'hanno affatto. */
  numero?: number;
  href?: string;
  copertina?: { src: string; w: number; h: number };
};

/** Dispone le voci sull'asse, evitando che due troppo vicine si sovrappongano. */
export function disponi(voci: Voce[]): (Voce & { x: number; riga: number })[] {
  const ultimaX: number[] = [];
  return voci.map((voce) => {
    const x = (voce.anno - INIZIO) * PASSO;
    let riga = 0;
    while (ultimaX[riga] !== undefined && x - ultimaX[riga] < VOCE) riga += 1;
    ultimaX[riga] = x;
    return { ...voce, x, riga };
  });
}

/** ── L'ingresso della timeline ─────────────────────────────────────────────
 *  Lo strumento si costruisce da sé, e si costruisce A PARTIRE DAL NONIO.
 *  Ogni altra cosa in questa pagina è organizzata attorno a quel punto — la
 *  campana del fuoco, la zona di lettura, l'anno che si legge — e un ingresso
 *  che entrasse da un bordo sarebbe l'unica cosa a ignorarlo.
 *
 *  Quattro tempi, nell'ordine in cui lo strumento è fatto:
 *    1. la testina, che è l'origine di tutto il resto;
 *    2. l'asse, che si allunga da sotto di lei verso i due capi insieme;
 *    3. i dentini, che scendono dall'asse — lo stesso verso in cui già
 *       crescono col fuoco, quindi non un movimento nuovo — con un'onda che
 *       corre dal nonio verso il 2010 e il 2026;
 *    4. numeri e voci, ciascuno dietro il proprio dentino, così l'apparato
 *       segue la sua ascissa invece di arrivare come blocco.
 *
 *  `ONDA_ANNI` è il ritardo per ogni anno di distanza dal nonio: è la stessa
 *  `|t − visibile|` con cui il fuoco calcola la sua campana, non uno stagger
 *  d'indice. Un dentino di gennaio 2010 e la voce che gli sta sotto partono
 *  insieme perché hanno la stessa ascissa, non perché sono vicini nel DOM. */
export const INGRESSO = {
  testina: 0.3,
  tAsse: 0.2,
  asse: 0.75,
  tDenti: 0.45,
  dente: 0.5,
  /** Il ritardo per ogni anno di distanza dal nonio. Tarato sulla porzione
   *  VISIBILE e non sull'arco intero: la zona di lettura è larga ±3,2 anni,
   *  quindi è lì che l'onda deve leggersi come un'onda. Un valore calcolato
   *  sui sedici anni della cronologia avrebbe esaurito il tratto visibile in
   *  due decimi di secondo — corretto sulla carta, invisibile a occhio. */
  ondaAnni: 0.15,
  /** Oltre l'orizzonte il ritardo smette di accumularsi. Dopo sei anni dal
   *  nonio nessuno sta guardando, e far aspettare la pagina per una cascata
   *  che accade fuori campo è tempo speso male. */
  ondaMax: 0.9,
  /** Quanto un'etichetta o una voce resta indietro rispetto al proprio
   *  dentino. Poco: devono sembrare appese alla graduazione, non un secondo
   *  ingresso. */
  ritardoApparato: 0.16,
  apparato: 0.45,
} as const;
