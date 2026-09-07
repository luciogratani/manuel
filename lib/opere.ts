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
  /** Il testo dell'opera: cosa succede, quando, dove. Dove manca, la work page
   *  mostra ancora il segnaposto — così si vede a colpo d'occhio quali opere
   *  la curatela non ha ancora raccontato, invece di riempire il buco con una
   *  frase generica che sembra vera. */
  descrizione?: string;
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
  {
    numero: 1,
    slug: "candide-a-palazzo-guillot",
    titolo: "Candide a palazzo Guillot",
    anno: "2013",
    medium: "intervento",
    luogo: "Palazzo Guillot, Alghero",
    densita: "documentata",
    descrizione:
      "Intervento a Palazzo Guillot, ad Alghero, il 21 settembre 2013. " +
      "Nessun documento accompagna questa cartella: restano le fotografie di " +
      "Blanka Meccanica.",
    scatti: foto("candide-a-palazzo-guillot",
      ["01", 960, 640], ["02", 640, 960], ["03", 960, 640],
      ["04", 640, 960], ["05", 960, 693], ["06", 960, 640],
      ["07", 640, 960], ["08", 960, 640], ["09", 643, 960],
      ["10", 640, 960], ["11", 960, 693], ["12", 640, 960],
      ["13", 960, 640], ["14", 640, 960], ["15", 640, 960],
      ["16", 960, 640], ["17", 1600, 1068], ["18", 960, 640],
      ["19", 1600, 1068], ["20", 640, 960], ["21", 960, 640],
      ["22", 640, 960], ["23", 960, 640], ["24", 640, 960],
      ["25", 960, 640], ["26", 960, 640], ["27", 640, 960],
      ["28", 960, 640], ["29", 693, 960], ["30", 640, 960],
    ),
    crediti: [["foto", "Blanka Meccanica"]],
  },
  // Dal comunicato nella cartella (`Glamour Confusion di Manuel Delogu 5.odt`),
  // che è anche la fonte che scioglie il doppio nome: «L'idea di Manuel
  // Delogu, in arte Manuel Casati».
  {
    numero: 2,
    slug: "glamour-confusion",
    titolo: "Glamour Confusion",
    anno: "2014",
    medium: "evento",
    luogo: "Villa Sant'Elia, Sassari",
    densita: "piena",
    descrizione:
      "Un evento nato dal connubio fra l'arte e la storia del costume, a Villa " +
      "Sant'Elia — Villa Mimosa — di Sassari, domenica 4 maggio 2014, per " +
      "Monumenti Aperti. L'abito perde la sua natura funzionale e diventa il " +
      "protagonista della scena: ispirazioni dalla seconda metà del Settecento " +
      "agli anni Trenta, con riferimenti a Maria Antonietta, alla contessa di " +
      "Castiglione, a Elisabetta d'Austria e alla marchesa Luisa Casati. Nella " +
      "scelta dei capi è determinante il riuso di abiti dismessi e " +
      "l'accostamento di tessuti pregiati con altri più poveri.",
    scatti: foto("glamour-confusion",
      ["01", 960, 585], ["02", 582, 960], ["03", 960, 662],
      ["04", 960, 831], ["05", 960, 620], ["06", 609, 960],
      ["07", 696, 960], ["08", 624, 960], ["09", 792, 960],
      ["10", 960, 916], ["11", 578, 960], ["12", 960, 637],
      ["13", 960, 753], ["14", 761, 960], ["15", 960, 685],
      ["16", 733, 960], ["17", 659, 960], ["18", 664, 960],
      ["19", 561, 960], ["20", 960, 627], ["21", 960, 919],
      ["22", 960, 616], ["23", 698, 960], ["24", 960, 730],
      ["25", 960, 602], ["26", 960, 718], ["27", 960, 723],
      ["28", 960, 602], ["29", 632, 960], ["30", 599, 960],
      ["31", 960, 640], ["32", 960, 567], ["33", 640, 960],
      ["34", 692, 960], ["35", 629, 960], ["36", 833, 960],
      ["37", 593, 960], ["38", 630, 960], ["39", 601, 960],
      ["40", 711, 960], ["41", 960, 640], ["42", 960, 640],
      ["43", 960, 640], ["44", 960, 581], ["45", 960, 755],
      ["46", 960, 782], ["47", 477, 960], ["48", 960, 640],
      ["49", 960, 741], ["50", 960, 644], ["51", 960, 640],
      ["52", 960, 650], ["53", 650, 960], ["54", 960, 625],
      ["55", 794, 960], ["56", 960, 695], ["57", 719, 960],
      ["58", 960, 637], ["59", 960, 695], ["60", 960, 669],
      ["61", 886, 960], ["62", 511, 960], ["63", 640, 960],
      ["64", 960, 709], ["65", 554, 960], ["66", 611, 960],
      ["67", 677, 960], ["68", 808, 960], ["69", 610, 960],
      ["70", 757, 960], ["71", 960, 634], ["72", 562, 960],
      ["73", 632, 960], ["74", 667, 960], ["75", 960, 922],
      ["76", 640, 960], ["77", 960, 575],
    ),
    filmati: [film("glamour-confusion", 1600, 666, 179.18, true)],
    crediti: [
      ["foto", "Chiara Cordeschi"],
      ["testo", "Franca Mascolo"],
      ["nell'ambito di", "Monumenti Aperti, con la Confindustria Nord Sardegna"],
    ],
  },
  // Era «Seduta spiritica», che è il nome informale della cartella sorgente
  // («ph Veronica Diaz seduta spiritica e altro»): dentro, tolte le quattro
  // sottocartelle rosse, resta una sola cosa — OSER SAVOIR, che nel portfolio
  // compilato ha un testo curatoriale intero sulla collezione Marchesa Casati,
  // le sedute spiritiche e la tavoletta Ouija. La seduta è una scena
  // dell'opera, non l'opera. Veronica Diaz è la fotografa.
  {
    numero: 3,
    slug: "oser-savoir",
    titolo: "Oser Savoir",
    anno: "2015",
    medium: "collezione",
    luogo: "—",
    densita: "documentata",
    // La copertina è quella scelta guardando un provino; le sedici che seguono
    // sono i file che Manuel ha marcato verdi.
    descrizione:
      "La collezione Marchesa Casati: una capsule, o meglio un sarcofago decorato " +
      "che racchiude un istante di decadente simbolismo estetico. Antichi pizzi, " +
      "seta, pelliccia, broccato, aigrettes di piume. Musa principale Luisa " +
      "Casati Amman e il suo mondo — un mondo che cerca nei fantasmi gotici e " +
      "nelle teosofie orientali l'evasione dall'ordinario, e che varca per mano " +
      "a una medium la soglia dell'inconsistente, danzando attorno a una " +
      "tavoletta Ouija.",
    scatti: foto("oser-savoir",
      ["01", 1600, 975], ["02", 1067, 1600], ["03", 1600, 1509],
      ["04", 1600, 1067], ["05", 1600, 1067], ["06", 1062, 1600],
      ["07", 1067, 1600], ["08", 1600, 1000], ["09", 1067, 1600],
      ["10", 1067, 1600], ["11", 1148, 1600], ["12", 1600, 1067],
      ["13", 1100, 1600], ["14", 1600, 951], ["15", 1600, 835],
      ["16", 1067, 1600],
    ),
    crediti: [["foto", "Veronica Diaz"]],
  },
  {
    numero: 4,
    slug: "corsa-futurista-i",
    titolo: "Corsa Futurista — I edizione",
    anno: "2015",
    medium: "corsa itinerante",
    luogo: "Sassari",
    densita: "documentata",
    descrizione:
      "Una corsa itinerante per la città, con soste nei monumenti storici aperti per l'occasione. I edizione, 10 maggio 2015.",
    scatti: foto("corsa-futurista-i",
      ["01", 1066, 1600], ["02", 1600, 1063], ["03", 960, 640],
      ["04", 636, 960], ["05", 636, 960], ["06", 960, 636],
      ["07", 960, 693], ["08", 426, 640], ["09", 1066, 1355],
      ["10", 1009, 1377], ["11", 640, 426], ["12", 1600, 1066],
    ),
    crediti: [
      ["foto", "Alessandro Marongiu, Luciano Piras, Michela Roggio"],
      ["in collaborazione con", "Club il Volante"],
      ["nell'ambito di", "Monumenti Aperti"],
    ],
  },
  // Il titolo è quello che ha dato Lucio. Vale la pena sapere che le fonti
  // dicono altro: la cartella contiene le pagine dell'editoriale pubblicato su
  // Design Scene (28.09.15) sotto il titolo DARK ROMANCE, e «Dark Romance» è
  // anche una delle voci del portfolio compilato. Davide Fanton è il fotografo.
  {
    numero: 5,
    slug: "fanton-milano-fashion-week",
    titolo: "Fanton Milano Fashion Week",
    anno: "2015",
    medium: "editoriale",
    luogo: "—",
    densita: "documentata",
    descrizione:
      "Editoriale pubblicato su Design Scene Magazine il 28 settembre 2015, con " +
      "le fotografie di Davide Fanton. Sulle pagine della rivista porta il " +
      "titolo Dark Romance.",
    scatti: foto("fanton-milano-fashion-week",
      ["01", 768, 960], ["02", 1236, 1600], ["03", 1236, 1600],
      ["04", 1236, 1600], ["05", 1236, 1600], ["06", 1236, 1600],
      ["07", 1236, 1600], ["08", 1236, 1600], ["09", 1236, 1600],
      ["10", 1236, 1600], ["11", 1236, 1600], ["12", 960, 625],
      ["13", 960, 728], ["14", 960, 960], ["15", 640, 960],
    ),
    crediti: [["foto", "Davide Fanton"]],
  },
  // `Nuova cartella` è rossa e resta fuori: quel che c'è qui viene tutto da
  // «immagini selezionate e impaginate». Sono tavole già impaginate, non scatti
  // sciolti, e piccole (640px) perché la sorgente lo è.
  {
    numero: 6,
    slug: "ph-shoot-anto",
    titolo: "Ph Shoot Anto",
    anno: "2015",
    medium: "fotografia",
    luogo: "—",
    densita: "documentata",
    descrizione:
      "Servizio fotografico del 25 novembre 2015, di cui restano le tavole già " +
      "impaginate. Nessun documento accompagna la cartella.",
    scatti: foto("ph-shoot-anto",
      ["01", 640, 960], ["02", 960, 807], ["03", 960, 722],
      ["04", 960, 819], ["05", 640, 960], ["06", 640, 960],
      ["07", 960, 742], ["08", 960, 714], ["09", 960, 758],
      ["10", 960, 740],
    ),
  },
  {
    numero: 7,
    slug: "corsa-futurista-ii",
    titolo: "Corsa Futurista — II edizione",
    anno: "2016",
    medium: "corsa itinerante",
    luogo: "Sassari",
    densita: "documentata",
    descrizione:
      "Una corsa itinerante per la città, con soste nei monumenti storici aperti per l'occasione. II edizione, 8 maggio 2016.",
    scatti: foto("corsa-futurista-ii",
      ["01", 531, 800], ["02", 960, 692], ["03", 960, 640],
      ["04", 960, 640], ["05", 960, 640], ["06", 1600, 1066],
      ["07", 1600, 1066], ["08", 800, 531], ["09", 800, 531],
      ["10", 800, 531], ["11", 800, 531], ["12", 960, 640],
      ["13", 960, 640], ["14", 640, 960], ["15", 1600, 1063],
      ["16", 1600, 1063],
    ),
    crediti: [
      ["foto", "Blanka Meccanica, Lotrella, Depalmas, Alessandro Marongiu"],
      ["in collaborazione con", "Club il Volante"],
      ["nell'ambito di", "Monumenti Aperti"],
    ],
  },
  {
    numero: 8,
    slug: "apoteosi",
    titolo: "Apoteosi — Creazione di una Musa",
    anno: "2017",
    medium: "sfilata-performance",
    luogo: "Sassari e Alghero",
    densita: "piena",
    descrizione:
      "Sfilata e performance in bilico tra rito pagano e passerella glamour: " +
      "un'estetica che mette in comunione la solenne semplicità dell'arte greca " +
      "arcaica e gli estremismi disturbanti della Wiener Aktionismus. Il lavoro " +
      "è in tre parti — lo shooting per la locandina con la modella Raffaella " +
      "Ariano, e due sfilate: la prima al Liceo Artistico Figari di Sassari, " +
      "sabato 6 maggio 2017, la seconda ad Alghero, dentro la mostra a Lu Quarter.",
    scatti: foto("apoteosi",
      ["01", 820, 545], ["02", 1600, 1066], ["03", 1600, 1066],
      ["04", 1600, 1066], ["05", 545, 820], ["06", 545, 820],
      ["07", 820, 545], ["08", 1600, 1066], ["09", 1600, 1058],
      ["10", 1600, 1066], ["11", 1600, 1066], ["12", 1600, 1066],
      ["13", 1600, 1067], ["14", 1063, 708], ["15", 1600, 1066],
      ["16", 1600, 1066], ["17", 1600, 1066], ["18", 1600, 1066],
    ),
    crediti: [
      ["modella, locandina", "Raffaella Ariano"],
      ["foto", "Blanka Meccanica, Lorella Comi"],
    ],
  },
  {
    numero: 9,
    slug: "corsa-futurista-iii",
    titolo: "Corsa Futurista — III edizione",
    anno: "2018",
    medium: "corsa itinerante",
    luogo: "Sassari",
    densita: "documentata",
    descrizione:
      "Una corsa itinerante per la città, con soste nei monumenti storici aperti per l'occasione. III edizione, 4 maggio 2018.",
    scatti: foto("corsa-futurista-iii",
      ["01", 640, 960], ["02", 1600, 857], ["03", 640, 960],
      ["04", 640, 960], ["05", 640, 960], ["06", 365, 548],
      ["07", 720, 480], ["08", 720, 480], ["09", 720, 480],
      ["10", 640, 960], ["11", 640, 960], ["12", 720, 480],
      ["13", 640, 960], ["14", 640, 960], ["15", 640, 960],
      ["16", 365, 548], ["17", 720, 480], ["18", 640, 960],
      ["19", 720, 480],
    ),
    crediti: [
      ["foto", "Depalmas"],
      ["in collaborazione con", "Club il Volante"],
      ["nell'ambito di", "Monumenti Aperti"],
    ],
  },
  {
    numero: 10,
    slug: "corsa-futurista-iv",
    titolo: "Corsa Futurista — IV edizione",
    anno: "2019",
    medium: "corsa itinerante",
    luogo: "Sassari",
    densita: "documentata",
    descrizione:
      "Una corsa itinerante per la città, con soste nei monumenti storici aperti per l'occasione. IV edizione, 4 maggio 2019.",
    scatti: foto("corsa-futurista-iv",
      ["01", 1600, 1600], ["02", 1600, 1068], ["03", 1068, 1600],
      ["04", 1068, 1600], ["05", 1600, 1600], ["06", 1600, 1068],
      ["07", 1600, 1068], ["08", 1068, 1600], ["09", 1068, 1600],
      ["10", 1600, 1068], ["11", 1068, 1600], ["12", 1600, 1068],
    ),
    crediti: [
      ["in collaborazione con", "Club il Volante"],
      ["nell'ambito di", "Monumenti Aperti"],
    ],
  },
  {
    numero: 11,
    slug: "the-missing",
    titolo: "The Missing",
    anno: "—",
    medium: "—",
    luogo: "—",
    densita: "documentata",
    // La copertina è il file che Manuel ha marcato verde.
    descrizione:
      "Una capsule di quattro ensemble ispirata alla moda dell'ultimo decennio " +
      "del Settecento, negli anni che precedono la Rivoluzione francese. Un " +
      "omaggio a Marie Antoinette e alla sua predilezione per gli abiti " +
      "semplici e chiari, come quelli raccomandati agli invitati della festa nei " +
      "giardini del Trianon. L'altro riferimento è Picnic ad Hanging Rock, dove " +
      "il bianco accecante degli abiti dà alle protagoniste una presenza eterea " +
      "sullo sfondo di una natura aspra. Fotografie di Giuseppe Esposito.",
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
    numero: 12,
    slug: "editorial-blanka",
    titolo: "Editorial Blanka",
    anno: "—",
    medium: "editoriale",
    luogo: "—",
    densita: "documentata",
    descrizione:
      "Servizio editoriale fotografato da Blanka Meccanica. La cartella non porta " +
      "documenti né una data: restano le diciannove fotografie.",
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
  {
    numero: 13,
    slug: "a-boys-closet",
    titolo: "A Boy's Closet — Guardaroba di un ragazzo",
    anno: "2020",
    medium: "—",
    luogo: "—",
    densita: "minima",
    descrizione:
      "I capi nascono dalla collaborazione con l'artista Stefano Serusi, per la " +
      "sua mostra personale A boy's closet alla galleria Rehearsal di Milano, a " +
      "cura di Contemporary Attitude. Serusi rievoca la stanza di un " +
      "adolescente come una fiaba; gli abiti, in una rilettura punk, prendono " +
      "fogge e colori dal manierismo italiano del Cinquecento, da Allori e dal " +
      "Bronzino. A introdurre il progetto, una domanda: quanto di ciò che ora " +
      "ami porterai con te nell'età adulta?",
    scatti: [indice("017", 900, 596)],
  },
  // L'anno viene dai timestamp dentro i nomi dei file (1603461384152 →
  // 23 ottobre 2020), non da un documento: due file coerenti, ottobre 2020.
  {
    numero: 14,
    slug: "la-distanza",
    titolo: "La Distanza",
    anno: "2020",
    medium: "fotografia",
    luogo: "Alghero",
    densita: "documentata",
    descrizione:
      "Reinterpretazione fotografica di Boom di Joseph Losey (1968), realizzata " +
      "ad Alghero nella stessa location del film, a sua volta tratto da " +
      "Tennessee Williams. I due protagonisti sono archetipi calati in " +
      "un'atmosfera tesa fra la violenza della natura e il camp più esasperato. " +
      "Le immagini sono accompagnate da un testo narrativo di Stefano Serusi. " +
      "Fotografie di Giuseppe Esposito.",
    scatti: foto("la-distanza",
      ["01", 1067, 1600], ["02", 1067, 1600], ["03", 1067, 1600],
      ["04", 1600, 1067], ["05", 1067, 1600], ["06", 1067, 1600],
      ["07", 1067, 1600], ["08", 1600, 1067], ["09", 1067, 1600],
      ["10", 1067, 1600], ["11", 1600, 1067], ["12", 1600, 1067],
      ["13", 1600, 1067],
    ),
    crediti: [
      ["foto", "Giuseppe Esposito"],
      ["testo", "Stefano Serusi"],
    ],
  },
  {
    numero: 15,
    slug: "le-reve-lever",
    titolo: "Le Rêve — Lever",
    anno: "2022",
    medium: "capsule collection e performance",
    luogo: "studioamatoriale, Milano",
    densita: "piena",
    descrizione:
      "Un progetto in due livelli: il design di una capsule collection e un " +
      "progetto performativo, presentato da studioamatoriale a Milano dal 21 al " +
      "24 settembre 2022. I tre look della capsule Lever sviluppano lo studio " +
      "filologico del costume e la sua riformulazione contemporanea. La " +
      "performance, attivata a più riprese durante l'opening, fa parte della " +
      "riflessione sul corpo, l'eroticità, la ritualità e il voyeurismo: lo " +
      "spazio diventa il luogo privato di un performer che indossa i capi in " +
      "una dimensione parallela a quella del pubblico.",
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
    numero: 16,
    slug: "corsa-futurista-vi",
    titolo: "Corsa Futurista — VI edizione",
    anno: "2023",
    medium: "corsa itinerante",
    luogo: "Sassari",
    densita: "documentata",
    descrizione:
      "Una corsa itinerante per la città, con soste nei monumenti storici aperti per l'occasione. VI edizione, 7 maggio 2023.",
    scatti: foto("corsa-futurista-vi",
      ["01", 853, 1280], ["02", 1280, 960], ["03", 960, 1280],
      ["04", 853, 1280], ["05", 853, 1280], ["06", 853, 1280],
      ["07", 960, 1280], ["08", 853, 1280], ["09", 960, 1280],
      ["10", 853, 1280], ["11", 853, 1280], ["12", 853, 1280],
    ),
    crediti: [
      ["foto", "Tommy Bentivegna"],
      ["in collaborazione con", "Club il Volante"],
      ["nell'ambito di", "Monumenti Aperti"],
    ],
  },
  {
    numero: 17,
    slug: "funeral-rave",
    titolo: "Funeral Rave",
    anno: "2023",
    medium: "performance",
    luogo: "Spazio Sabotage, Sassari",
    densita: "piena",
    // Le prime sei sono la selezione di Manuel (foto di Blanka Meccanica), le
    // ultime due l'artwork di Fabrizio Casu. Le dodici di prima venivano da
    // `bozze-media.sh`, che pescava i primi dodici file in ordine alfabetico.
    descrizione:
      "Nata sul tema della legge anti-rave, la performance racconta le dinamiche " +
      "di un rave condensate in una forma dal gusto berlinese, con il dj Nazar. " +
      "È anche un omaggio a Kenneth Anger. Spazio Sabotage, in via Canopolo a " +
      "Sassari, il 30 giugno 2023.",
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
  {
    numero: 18,
    slug: "antropologia",
    titolo: "Antropologia",
    anno: "—",
    medium: "—",
    luogo: "—",
    densita: "minima",
    descrizione:
      "Di quest'opera l'archivio conserva una sola immagine e nessun documento: " +
      "non c'è una cartella sorgente che le corrisponda. Titolo, anno e luogo " +
      "restano da stabilire.",
    scatti: [indice("018", 854, 900)],
  },
  {
    numero: 19,
    slug: "feral",
    titolo: "Feral",
    anno: "2024",
    medium: "performance",
    luogo: "—",
    densita: "piena",
    descrizione:
      "Una performance che invita a mettere in discussione i valori tradizionali " +
      "e a esplorare le zone d'ombra della psiche. Inquadrature strette, " +
      "telecamere, l'atto di spiare: lo spettatore diventa parte dell'opera. Si " +
      "mette in scena lo stereotipo maschile e femminile per rovesciarlo, fra " +
      "pop art barocca e Nouvelle Vague, con tinte cyberpunk. Il kink come " +
      "pratica identitaria. Un omaggio a Querelle de Brest di Fassbinder, dal " +
      "romanzo di Jean Genet. Con Alex Akashi, per Sabotage.",
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
    numero: 20,
    slug: "don-giovanni",
    titolo: "Don Giovanni",
    anno: "2025",
    medium: "performance",
    luogo: "—",
    densita: "piena",
    descrizione:
      "Regia e scrittura di Manuel Casati e Stefano Serusi, per la rassegna Senza " +
      "Sipario di Simone Gelsomino, il 30 maggio 2025.",
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
    numero: 21,
    slug: "coucher-avec-moi",
    titolo: "Coucher avec moi",
    anno: "2026",
    medium: "performance",
    luogo: "Teatro Genova, Sassari",
    // PARZIALE: per ora solo i contenuti che Manuel ha marcato verdi. La
    // selezione vera si fa più avanti — è l'opera più recente e merita una
    // passata a sé (scelta di Lucio, 7 settembre 2026).
    densita: "piena",
    descrizione:
      "Il lavoro esplora il rapporto sessuale a pagamento attraverso la " +
      "rappresentazione simbolica del letto, inteso come palcoscenico di " +
      "interazioni intime e sociali. Nello spazio riservato al pubblico degli " +
      "schermi proiettano ciò che avviene nella camera da letto; chi vuole può " +
      "entrarvi, e trovare il performer che lo invita a un rapporto dietro " +
      "un'offerta, deposta in una cassetta come quelle delle chiese. Il corpo " +
      "in vendita e sacralizzato insieme. Teatro Genova, Sassari, 29 maggio 2026.",
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
