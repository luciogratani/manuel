// Il contenuto del sito. Nessun CMS, nessun database: TypeScript e basta (§5).
//
// ── PROVVISORIO ──────────────────────────────────────────────────────────────
// Questi dati sono ricavati dai nomi delle cartelle in 01-assets/media. Titoli,
// anni, medium e luoghi vanno riscritti dalla curatela (§6.1), che è lavoro di
// Manuel e Lucio ed è l'unico blocco vero del progetto.
//
// Quel che è già strutturale e non cambierà:
//   · una sequenza unica 01→26, cronologica, senza prefissi di fase (§3.3)
//   · lo slug è leggibile e NON contiene il numero: il numero è apparato, lo
//     slug è nome (§3.3)
//   · ogni scatto dichiara un formato fra i cinque ammessi; il ritaglio vive
//     nella cornice, non su disco
//   · `densita` fa piegare il template al materiale a gerarchia invariata (§4.1)
//   · i filmati stanno in `filmati`, ACCANTO agli scatti e non dentro: un
//     filmato non è una fotografia con più fotogrammi, e `scatti.length` deve
//     restare il conteggio delle fotografie (§3.3, §8)

export type Formato = "2:3" | "3:4" | "1:1" | "4:3" | "3:2";

export const RAPPORTO: Record<Formato, number> = {
  "2:3": 2 / 3,
  "3:4": 3 / 4,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
};

const FORMATI = Object.keys(RAPPORTO) as Formato[];

/** Accosta il rapporto reale al formato più vicino fra quelli ammessi. */
export function formato(w: number, h: number): Formato {
  const r = w / h;
  return FORMATI.reduce((a, b) =>
    Math.abs(RAPPORTO[b] - r) < Math.abs(RAPPORTO[a] - r) ? b : a,
  );
}

export type Scatto = {
  src: string;
  /** Dimensioni vere del derivato: il formato dichiarato si ricava da qui. */
  w: number;
  h: number;
  didascalia?: string;
};

/** Il materiale in movimento (§8). Sta accanto agli scatti e non dentro: se
 *  un filmato entrasse in `scatti` l'apparato d'archivio comincerebbe a
 *  mentire — «scatti: 13» per dodici fotografie e un video — e il §3.3 esiste
 *  proprio per tenere onesto quel conteggio.
 *
 *  Il rapporto NON passa da `formato()`. I cinque formati ammessi sono
 *  fotografici, e accostarci un 2,35:1 vorrebbe dire ritagliare
 *  l'inquadratura che il videomaker ha composto: il ritaglio di una foto è una
 *  decisione di presentazione, quello di un filmato è una modifica dell'opera.
 *  `w`/`h` si usano com'è. */
export type Filmato = {
  src: string;
  /** Dieci secondi muti: ciò che si può mostrare senza chiedere niente. */
  anteprima: string;
  /** Il fermo immagine. Finché il filmato non viene chiesto si vede questo, e
   *  non si scarica un byte di video. */
  poster: string;
  /** Dimensioni vere del derivato, non della sorgente. */
  w: number;
  h: number;
  /** Secondi. L'apparato la mostra invece di indovinarla. */
  durata: number;
  audio: boolean;
  /** Chi l'ha girato, quando non è Manuel. */
  di?: string;
  didascalia?: string;
};

/** Una riga di crediti: chi ha fatto cosa. Tupla e non oggetto perché nei dati
 *  se ne scrivono a decine e `["foto", "Irene Stefanini"]` si legge meglio di
 *  `{ ruolo: "foto", nome: "Irene Stefanini" }` — la forma non aggiunge niente
 *  al senso.
 *
 *  Il RUOLO è minuscolo come le altre etichette dell'apparato (`anno:`,
 *  `medium:`), il nome porta le maiuscole che gli spettano. L'ordine è quello
 *  in cui si leggono: prima chi ha fatto l'opera, poi chi l'ha documentata.
 *
 *  Manuel non compare fra i crediti a meno che non abbia un ruolo che non si
 *  dà per scontato — è l'autore dell'archivio, non un collaboratore di sé
 *  stesso. In Don Giovanni compare perché lì è anche performer. */
export type Credito = readonly [ruolo: string, nome: string];

/** Quanto materiale c'è. Il template si piega a questo, la gerarchia no. */
export type Densita = "piena" | "documentata" | "minima";

export type Opera = {
  /** 01→26, cronologico. Apparato d'archivio, non parte dello slug. */
  numero: number;
  slug: string;
  titolo: string;
  /** Stringa e non numero: in archivio ci sono archi ("2015–2024") e date
   *  incerte ("c. 2013"), e la doppia coordinata del §3.3 deve reggerle. */
  anno: string;
  medium: string;
  luogo: string;
  densita: Densita;
  scatti: Scatto[];
  /** Assente nella quasi totalità dell'archivio: quattro opere su ventuno
   *  hanno un montato finito. Chi legge deve poter contare, non presumere. */
  filmati?: Filmato[];
  /** Chi ha fatto cosa. Viene dai `descrizione.rtf` delle cartelle sorgente,
   *  non da una ricostruzione: dove il documento tace, la riga non c'è. */
  crediti?: Credito[];
};

/** Le opere che non hanno nemmeno una fotografia: solo filmati. Restano fuori
 *  finché §8 non è risolto, e sono la prova che il problema dei video non è un
 *  capitolo a parte ma un buco nell'indice.
 *
 *  Corretta il 7 settembre 2026 guardando le sorgenti, non i nomi: le cartelle
 *  con un montato finito e ZERO fotografie sono TRE — L'Affair (1:21, video di
 *  Giuseppe Esposito), Love and Eat (6:16) e Sauvage (2:19). Erano due perché
 *  nessuno le aveva aperte.
 *
 *  «BDSM» invece è uscita di qui perché non esiste: `01-assets/media` non ha
 *  nessuna cartella con quel nome, e nel portfolio compilato «BDSM» compare
 *  come riferimento culturale della collezione 1780/89, non come titolo. La
 *  voce 2025 in lib/timeline.ts resta lì in attesa che Manuel dica cos'è. */
export const SENZA_IMMAGINI = ["L'Affair", "Love and Eat", "Sauvage"];

/** Gli scatti derivati da `scripts/scatti.sh`: una cartella per opera, i file
 *  numerati nell'ORDINE DI LETTURA della mensola — `01` è la copertina. Le
 *  misure vengono da `public/media/scatti.txt`, non dall'occhio.
 *
 *  Sostituisce il vecchio `fr()`, che era la scorciatoia di una sola opera
 *  perché una sola opera aveva una selezione vera. */
const foto = (
  slug: string,
  ...misure: [n: string, w: number, h: number][]
): Scatto[] => misure.map(([n, w, h]) => ({ src: `/media/${slug}/${n}.jpg`, w, h }));

const indice = (n: string, w: number, h: number): Scatto => ({
  src: `/media/indice/${n}.jpg`,
  w,
  h,
});

/** I tre derivati di `scripts/filmati.sh`, che stanno tutti in
 *  /media/filmati/ e prendono il nome dallo slug dell'opera. Come `indice()` e
 *  `fr()`: la convenzione sta qui una volta sola, non ventisei. */
const film = (
  slug: string,
  w: number,
  h: number,
  durata: number,
  audio: boolean,
  di?: string,
): Filmato => ({
  src: `/media/filmati/${slug}.mp4`,
  anteprima: `/media/filmati/${slug}-anteprima.mp4`,
  poster: `/media/filmati/${slug}-poster.jpg`,
  w,
  h,
  durata,
  audio,
  di,
});

export const OPERE: Opera[] = [
  { numero: 1, slug: "istituto-darte-filippo-figari", titolo: "Istituto d'Arte Filippo Figari", anno: "2008–2013", medium: "formazione", luogo: "Sassari", densita: "minima", scatti: [indice("008", 900, 872)] },
  { numero: 2, slug: "intervento-per-il-candide", titolo: "Intervento per il Candide", anno: "2013", medium: "intervento", luogo: "Palazzo Guillot, Alghero", densita: "minima", scatti: [indice("007", 900, 600)] },
  { numero: 3, slug: "glamour-confusion", titolo: "Glamour Confusion", anno: "2014", medium: "—", luogo: "—", densita: "minima", scatti: [indice("006", 900, 539)], filmati: [film("glamour-confusion", 1600, 666, 179.18, true)] },
  // Era «Seduta spiritica», che è il nome informale della cartella sorgente
  // («ph Veronica Diaz seduta spiritica e altro»): dentro, tolte le quattro
  // sottocartelle rosse, resta una sola cosa — OSER SAVOIR, che nel portfolio
  // compilato ha un testo curatoriale intero sulla collezione Marchesa Casati,
  // le sedute spiritiche e la tavoletta Ouija. La seduta è una scena
  // dell'opera, non l'opera. Veronica Diaz è la fotografa.
  {
    numero: 4,
    slug: "oser-savoir",
    titolo: "Oser Savoir",
    anno: "2015",
    medium: "collezione",
    luogo: "—",
    densita: "documentata",
    // La copertina è quella scelta guardando un provino; le sedici che seguono
    // sono i file che Manuel ha marcato verdi.
    scatti: foto("oser-savoir",
      ["01", 1600, 1067], ["02", 1067, 1600], ["03", 1600, 1509],
      ["04", 1600, 1067], ["05", 1600, 1067], ["06", 1062, 1600],
      ["07", 1067, 1600], ["08", 1600, 1000], ["09", 1067, 1600],
      ["10", 1067, 1600], ["11", 1148, 1600], ["12", 1600, 1067],
      ["13", 1100, 1600], ["14", 1600, 951], ["15", 1600, 835],
      ["16", 1067, 1600], ["17", 1600, 975],
    ),
    crediti: [["foto", "Veronica Diaz"]],
  },
  { numero: 5, slug: "corsa-futurista", titolo: "Corsa Futurista", anno: "2015–2024", medium: "—", luogo: "—", densita: "minima", scatti: [indice("004", 505, 900)] },
  // Il titolo è quello che ha dato Lucio. Vale la pena sapere che le fonti
  // dicono altro: la cartella contiene le pagine dell'editoriale pubblicato su
  // Design Scene (28.09.15) sotto il titolo DARK ROMANCE, e «Dark Romance» è
  // anche una delle voci del portfolio compilato. Davide Fanton è il fotografo.
  {
    numero: 6,
    slug: "fanton-milano-fashion-week",
    titolo: "Fanton Milano Fashion Week",
    anno: "2015",
    medium: "editoriale",
    luogo: "—",
    densita: "documentata",
    scatti: foto("fanton-milano-fashion-week",
      ["01", 768, 960], ["02", 640, 960], ["03", 1236, 1600],
    ),
    crediti: [["foto", "Davide Fanton"]],
  },
  // `Nuova cartella` è rossa e resta fuori: quel che c'è qui viene tutto da
  // «immagini selezionate e impaginate». Sono tavole già impaginate, non scatti
  // sciolti, e piccole (640px) perché la sorgente lo è.
  {
    numero: 7,
    slug: "ph-shoot-anto",
    titolo: "Ph Shoot Anto",
    anno: "2015",
    medium: "fotografia",
    luogo: "—",
    densita: "documentata",
    scatti: foto("ph-shoot-anto",
      ["01", 640, 960], ["02", 960, 807], ["03", 960, 722],
      ["04", 960, 819], ["05", 640, 960], ["06", 640, 960],
      ["07", 960, 742], ["08", 960, 714], ["09", 960, 758],
      ["10", 960, 740],
    ),
  },
  { numero: 8, slug: "apoteosi", titolo: "Apoteosi — Creazione di una Musa", anno: "2017", medium: "sfilata-performance", luogo: "—", densita: "minima", scatti: [indice("001", 900, 600)] },
  { numero: 9, slug: "la-distanza", titolo: "La Distanza", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("009", 600, 900)] },
  {
    numero: 10,
    slug: "the-missing",
    titolo: "The Missing",
    anno: "—",
    medium: "—",
    luogo: "—",
    densita: "documentata",
    // La copertina è il file che Manuel ha marcato verde.
    scatti: foto("the-missing",
      ["01", 1200, 800], ["02", 1200, 800], ["03", 800, 1200],
      ["04", 800, 1200], ["05", 800, 1200], ["06", 1200, 800],
      ["07", 1200, 800], ["08", 800, 1200], ["09", 1200, 800],
      ["10", 800, 1200], ["11", 1200, 800], ["12", 1200, 800],
      ["13", 800, 1200], ["14", 800, 1200], ["15", 800, 1200],
    ),
    crediti: [["foto", "Giuseppe Esposito"]],
  },
  {
    numero: 11,
    slug: "editorial-blanka",
    titolo: "Editorial Blanka",
    anno: "—",
    medium: "editoriale",
    luogo: "—",
    densita: "documentata",
    scatti: foto("editorial-blanka",
      ["01", 787, 1181], ["02", 1181, 787], ["03", 1181, 787],
      ["04", 1181, 787], ["05", 787, 1181], ["06", 787, 1181],
      ["07", 1181, 787], ["08", 1181, 787], ["09", 1181, 787],
      ["10", 1181, 787], ["11", 1181, 787], ["12", 787, 1181],
      ["13", 1600, 1066], ["14", 1181, 787], ["15", 787, 1181],
      ["16", 787, 1181], ["17", 787, 1181], ["18", 1181, 787],
      ["19", 1186, 787],
    ),
  },
  { numero: 12, slug: "a-boys-closet", titolo: "A Boy's Closet — Guardaroba di un ragazzo", anno: "2020", medium: "—", luogo: "—", densita: "minima", scatti: [indice("017", 900, 596)] },
  {
    numero: 13,
    slug: "le-reve-lever",
    titolo: "Le Rêve — Lever",
    anno: "2022",
    medium: "capsule collection e performance",
    luogo: "studioamatoriale, Milano",
    densita: "piena",
    scatti: foto("le-reve-lever",
      ["01", 919, 1600], ["02", 914, 1600], ["03", 901, 1600],
      ["04", 917, 1600], ["05", 919, 1600], ["06", 1200, 1600],
      ["07", 1200, 1600],
    ),
    filmati: [film("le-reve-lever", 360, 640, 53.66, true, "Alessandro Di Palma")],
    // Dal comunicato (`descrizione.jpeg`), che è il documento pubblicato. Il
    // `descrizione.rtf` dà il performer come «Giorgi»: due fonti in disaccordo,
    // e qui vince quella stampata.
    crediti: [
      ["a cura di", "Eleonora Angiolini"],
      ["testi", "Francesco Tola"],
      ["display", "Angelo Castucci"],
      ["video", "Alessandro Di Palma"],
      ["performer", "l'accidia"],
      ["produzione", "studioamatoriale, con Contemporary Attitude"],
    ],
  },
  {
    numero: 14,
    slug: "funeral-rave",
    titolo: "Funeral Rave",
    anno: "2023",
    medium: "performance",
    luogo: "Spazio Sabotage, Sassari",
    densita: "piena",
    // Le prime sei sono la selezione di Manuel (foto di Blanka Meccanica), le
    // ultime due l'artwork di Fabrizio Casu. Le dodici di prima venivano da
    // `bozze-media.sh`, che pescava i primi dodici file in ordine alfabetico.
    scatti: foto("funeral-rave",
      ["01", 1600, 1142], ["02", 1600, 1143], ["03", 1600, 1142],
      ["04", 1600, 1142], ["05", 1600, 1200], ["06", 1600, 1143],
      ["07", 1600, 1600], ["08", 1600, 1600],
    ),
    filmati: [film("funeral-rave", 480, 848, 95.11, true, "Tommaso Bentivegna")],
    crediti: [
      ["performer", "Arturo Fraddi, Antonio Cabras, Simone Righi, Dimitri Ruiu, Giuseppe Hussein"],
      ["dj", "Nazar"],
      ["foto", "Blanka Meccanica"],
      ["artwork", "Fabrizio Casu — Tempesta"],
      ["video", "Tommaso Bentivegna"],
    ],
  },
  { numero: 15, slug: "antropologia", titolo: "Antropologia", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("018", 854, 900)] },
  {
    numero: 16,
    slug: "feral",
    titolo: "Feral",
    anno: "2024",
    medium: "performance",
    luogo: "—",
    densita: "piena",
    scatti: foto("feral",
      ["01", 1200, 1600], ["02", 1600, 1068], ["03", 1600, 1068],
      ["04", 1200, 1600], ["05", 1200, 1600], ["06", 1200, 1600],
      ["07", 1200, 1600], ["08", 1200, 1600], ["09", 1200, 1600],
      ["10", 1200, 1600], ["11", 1600, 1200],
    ),
    filmati: [
      film("feral-teaser-1", 900, 1600, 6.69, true, "Alex Akashi"),
      film("feral-teaser-2", 900, 1600, 9.47, true, "Alex Akashi"),
      film("feral-teaser-3", 900, 1600, 13.72, true, "Alex Akashi"),
    ],
    crediti: [
      ["in collaborazione con", "Alex Akashi"],
      ["a cura di", "Carla Carta e Stefania Mele, per Sabotage"],
      ["musica dal vivo", "Angela Colombino"],
      ["supporto tecnico", "Ivan Pes"],
    ],
  },
  {
    numero: 17,
    slug: "don-giovanni",
    titolo: "Don Giovanni",
    anno: "2025",
    medium: "performance",
    luogo: "—",
    densita: "piena",
    scatti: foto("don-giovanni",
      ["01", 1200, 1600], ["02", 1200, 1600], ["03", 1200, 1600],
      ["04", 1200, 1600], ["05", 1200, 1600], ["06", 1200, 1600],
      ["07", 902, 1600], ["08", 902, 1600], ["09", 1200, 1600],
      ["10", 1200, 1600], ["11", 841, 1190],
    ),
    filmati: [film("don-giovanni", 720, 1280, 37.71, true, "Irene Stefanini")],
    crediti: [
      ["regia e scrittura", "Manuel Casati e Stefano Serusi"],
      ["performer", "Manuel Casati, Antonio Cabras, Alex Ilushenka, Simone Righi"],
      ["props", "Stefano Serusi"],
      // PROVVISORIO: il documento sorgente dice solo «lucio», senza cognome.
      ["artwork e luci", "Lucio"],
      ["foto", "Irene Stefanini"],
      ["rassegna", "Senza Sipario, a cura di Simone Gelsomino"],
    ],
  },
  {
    numero: 18,
    slug: "coucher-avec-moi",
    titolo: "Coucher avec moi",
    anno: "2026",
    medium: "performance",
    luogo: "Teatro Genova, Sassari",
    // PARZIALE: per ora solo i contenuti che Manuel ha marcato verdi. La
    // selezione vera si fa più avanti — è l'opera più recente e merita una
    // passata a sé (scelta di Lucio, 7 settembre 2026).
    densita: "piena",
    scatti: foto("coucher-avec-moi",
      ["01", 1600, 1200], ["02", 1600, 1200], ["03", 1600, 1200],
      ["04", 1600, 1200], ["05", 1600, 1200], ["06", 1600, 1200],
      ["07", 1600, 1200], ["08", 1600, 1200], ["09", 1600, 1200],
      ["10", 1200, 1600], ["11", 1600, 1200],
    ),
    filmati: [
      film("coucher-avec-moi-1", 640, 480, 13.17, true, "Irene Stefanini"),
      film("coucher-avec-moi-2", 640, 480, 6.87, true, "Irene Stefanini"),
      film("coucher-avec-moi-3", 640, 480, 23.97, true, "Irene Stefanini"),
      film("coucher-avec-moi-4", 640, 480, 19.47, true, "Irene Stefanini"),
      film("coucher-avec-moi-5", 640, 480, 8.37, true, "Irene Stefanini"),
      film("coucher-avec-moi-6", 640, 480, 10.77, true, "Irene Stefanini"),
    ],
    crediti: [
      ["performer", "Edoardo Gabriel Cois"],
      ["a cura di", "Alice Zucca"],
      ["foto e video", "Irene Stefanini"],
    ],
  },
];

export const perSlug = (slug: string) => OPERE.find((o) => o.slug === slug);

export const numerato = (n: number) => String(n).padStart(3, "0");

/** `95` → `1:35`. Come `numerato`, è apparato: si legge, non si somma.
 *  L'arrotondamento è sul totale e non sui secondi, se no 119,7 dà «1:60». */
export const durataLeggibile = (secondi: number) => {
  const tot = Math.round(secondi);
  return `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, "0")}`;
};
