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
  /** Un fotogramma preso dal filmato, che esiste SOLO per fare da copertina:
   *  l'indice e la cronologia leggono `scatti[0]` e un'opera solo-video non
   *  avrebbe niente da mostrare lì. Non è materiale da guardare, e infatti
   *  `materiali()` lo salta: nella mensola di un'opera solo-video c'è il
   *  filmato e basta, non il filmato preceduto da un suo fotogramma. */
  fermoImmagine?: true;
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
  /** Dieci secondi muti: ciò che si può mostrare senza chiedere niente.
   *  ASSENTE sotto i trenta secondi di durata, perché lì `scripts/filmati.sh`
   *  non la genera — dieci secondi presi da una clip di otto sarebbero la clip
   *  stessa. Chi la usa deve ricadere su `src`, che in quei casi è già corto. */
  anteprima?: string;
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

/** La copertina di un'opera solo-video: un fotogramma del filmato, che fa da
 *  copertina e non compare fra i materiali. Vedi `Scatto.fermoImmagine`. */
const fermo = (slug: string, w: number, h: number): Scatto[] => [
  { src: `/media/${slug}/01.jpg`, w, h, fermoImmagine: true },
];

// `indice()` è stato tolto il 7 settembre 2026, con A Boy's Closet: era la
// scorciatoia che dava a un'opera non ancora curata la copertina singola
// pescata da `bozze-media.sh` in /media/indice/, e A Boy's Closet era l'ultima
// a usarla. Adesso OGNI opera dell'archivio ha fotografie derivate dalle
// sorgenti con `scripts/scatti.sh`. I ventiquattro file di
// `public/media/indice/` non li guarda più nessuno: restano su disco, come le
// copertine delle opere uscite dall'archivio, e vanno tolti in blocco quando
// si decide di farlo — vedi `APERTI.md`.

/** Sotto questa durata `scripts/filmati.sh` non genera l'anteprima. Il numero
 *  è scritto in due posti — qui e là — perché sono due linguaggi; se cambia,
 *  cambia in entrambi. */
const ANTEPRIMA_SOGLIA = 30;

/** I tre derivati di `scripts/filmati.sh`, che stanno tutti in
 *  /media/filmati/ e prendono il nome dallo slug dell'opera. Come `foto()`: la
 *  convenzione sta qui una volta sola, non ventisei. */
const film = (
  slug: string,
  w: number,
  h: number,
  durata: number,
  audio: boolean,
  di?: string,
): Filmato => ({
  src: `/media/filmati/${slug}.mp4`,
  // La soglia è la stessa dello script che i derivati li produce: sotto,
  // l'anteprima non esiste su disco e dichiararla qui significherebbe mandare
  // il browser a chiedere un file che non c'è.
  anteprima: durata > ANTEPRIMA_SOGLIA ? `/media/filmati/${slug}-anteprima.mp4` : undefined,
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
      "Sant'Elia di Sassari, il 4 maggio 2014, per Monumenti Aperti. L'abito " +
      "perde la sua natura funzionale e diventa il protagonista della scena: " +
      "dal tardo Settecento agli anni Trenta, fra Maria Antonietta e la " +
      "marchesa Luisa Casati, con abiti dismessi rimessi in gioco.",
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
      "che racchiude un istante di decadente simbolismo. Musa principale Luisa " +
      "Casati Amman e il suo mondo, che cerca nei fantasmi gotici e nelle " +
      "teosofie orientali l'evasione dall'ordinario, e danza attorno a una " +
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
    slug: "shooting-editoriale",
    titolo: "Shooting per Editoriale",
    anno: "2015",
    medium: "fotografia",
    luogo: "—",
    densita: "documentata",
    descrizione:
      "Servizio fotografico del 25 novembre 2015, di cui restano le tavole già " +
      "impaginate. Nessun documento accompagna la cartella.",
    scatti: foto("shooting-editoriale",
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
  // La data viene dalla data di COPIA dei file (dicembre 2016), non da un
  // documento e non dallo scatto: decisione di Lucio il 7 settembre 2026, presa
  // sapendo cos'è. Vale come collocazione, non come datazione — per questo
  // l'anno sta nel campo `anno` e NON nella descrizione, dove suonerebbe come
  // un fatto accertato.
  //
  // È il motivo per cui questa voce è salita di quattro posti: la sequenza è
  // cronologica per regola (§3.3), e datare un'opera la rimescola. Gli slug non
  // contengono il numero, quindi nessun URL è cambiato.
  {
    numero: 8,
    slug: "editorial-blanka",
    titolo: "Editorial Blanka",
    anno: "2016",
    medium: "editoriale",
    luogo: "—",
    densita: "documentata",
    descrizione:
      "Servizio editoriale fotografato da Blanka Meccanica.",
    crediti: [["foto", "Blanka Meccanica"]],
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
    numero: 9,
    slug: "apoteosi",
    titolo: "Apoteosi — Creazione di una Musa",
    anno: "2017",
    medium: "sfilata-performance",
    luogo: "Sassari e Alghero",
    densita: "piena",
    descrizione:
      "Sfilata e performance in bilico tra rito pagano e passerella glamour: la " +
      "solenne semplicità dell'arte greca arcaica e gli estremismi della Wiener " +
      "Aktionismus. Tre parti — lo shooting per la locandina con Raffaella " +
      "Ariano, la sfilata al Liceo Artistico Figari di Sassari il 6 maggio 2017, " +
      "e quella nella mostra a Lu Quarter di Alghero.",
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
    numero: 10,
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
    numero: 11,
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
  // Come per Editorial Blanka: l'anno viene dalla data di COPIA dei file
  // (novembre 2019), non da un documento e non dallo scatto. Decisione di Lucio
  // il 7 settembre 2026. Vale come collocazione, non come datazione — per
  // questo sta nel campo `anno` e NON nella descrizione, dove suonerebbe come
  // un fatto accertato.
  {
    numero: 12,
    slug: "the-missing",
    titolo: "The Missing",
    anno: "2019",
    medium: "—",
    luogo: "—",
    densita: "documentata",
    // La copertina è il file che Manuel ha marcato verde.
    descrizione:
      "Una capsule di quattro ensemble ispirata all'ultimo decennio del " +
      "Settecento: un omaggio a Marie Antoinette e ai suoi abiti chiari del " +
      "Trianon, con un forte riferimento a Picnic ad Hanging Rock.",
    scatti: foto("the-missing",
      ["01", 1200, 800], ["02", 1200, 800], ["03", 800, 1200],
      ["04", 800, 1200], ["05", 800, 1200], ["06", 1200, 800],
      ["07", 1200, 800], ["08", 800, 1200], ["09", 1200, 800],
      ["10", 800, 1200], ["11", 1200, 800], ["12", 1200, 800],
      ["13", 800, 1200], ["14", 800, 1200], ["15", 800, 1200],
    ),
    crediti: [["foto", "Giuseppe Esposito"]],
  },
  // La data viene dal nome della cartella («09-10-020», che nel formato delle
  // altre — gg-mm-aa — è il 9 ottobre 2020 con uno zero di troppo); il CV
  // (`public/cv/`) conferma quella data e dà la chiusura, 14 novembre. Non da un
  // documento: i due PDF sono un comunicato e un testo di progetto, e nessuno
  // dei due porta una data.
  //
  // `medium: "guardaroba"` è la parola che usano tutte e due le fonti («il
  // guardaroba del ragazzo, realizzato attraverso la collaborazione con il
  // fashion designer Manuel Casati»), e dice meglio di «collezione» che cosa
  // ci ha messo Manuel dentro la mostra di un altro.
  //
  // Cyb_God NON è fra i crediti, ed è una scelta. Il testo di progetto lo dà
  // come performer che indosserà gli abiti per le immagini documentative — ma
  // è scritto al futuro, in un documento che dichiara i suoi stessi pezzi
  // «ancora in fase di sviluppo», e nelle otto fotografie della cartella non
  // c'è nessuno che li indossi: gli abiti sono appesi o stesi. Un credito che
  // il materiale non conferma è una cosa da chiedere a Manuel, non da
  // scrivere.
  {
    numero: 13,
    slug: "a-boys-closet",
    titolo: "A Boy's Closet — Guardaroba di un ragazzo",
    anno: "2020",
    medium: "guardaroba",
    luogo: "Rehearsal, Milano",
    densita: "documentata",
    descrizione:
      "Il guardaroba di un adolescente per la mostra di Stefano Serusi, che ne " +
      "rievoca la stanza come una fiaba. Gli abiti, in una rilettura punk, " +
      "prendono fogge e colori dal manierismo italiano del Cinquecento. " +
      "Dal 9 ottobre al 14 novembre 2020.",
    crediti: [
      ["mostra di", "Stefano Serusi"],
      ["produzione", "Rehearsal Project, con Contemporary Attitude"],
    ],
    scatti: foto("a-boys-closet",
      ["01", 1600, 1060], ["02", 1600, 1060], ["03", 1600, 1060],
      ["04", 1600, 1060], ["05", 1060, 1600], ["06", 1600, 1060],
      ["07", 1600, 1060], ["08", 1600, 1060],
    ),
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
      "Reinterpretazione fotografica di Boom di Joseph Losey (1968), realizzata ad " +
      "Alghero nella stessa location del film, tratto da Tennessee Williams. Due " +
      "archetipi in un'atmosfera tesa fra la violenza della natura e il camp. " +
      "Testo di Stefano Serusi, fotografie di Giuseppe Esposito.",
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
    slug: "l-affair",
    titolo: "L'Affair",
    anno: "2021",
    medium: "video performance",
    // Il CV (`public/cv/`) dà «26/11/2021 — Acre - Lume Occupato, Milano»,
    // mentre la cartella sorgente si chiama `L'AFFAIR video performance
    // 20-07-021` e il testo diceva «girata ad Alghero nel luglio 2021». Non
    // sono due versioni della stessa cosa in disaccordo: sono due momenti —
    // le riprese a luglio in Sardegna, la presentazione a novembre a Milano.
    // `luogo` porta il secondo, che è dove l'opera è stata mostrata; il primo
    // resta nel testo, perché un archivio che tiene solo l'ultimo dei due
    // perde la metà del lavoro.
    luogo: "Acre — Lume Occupato, Milano",
    densita: "minima",
    descrizione:
      "Video performance girata ad Alghero nel luglio 2021, per la regia di " +
      "Giuseppe Esposito, con lo styling e la direzione artistica di Manuel " +
      "Casati. Presentata il 26 novembre 2021 ad Acre — Lume Occupato, Milano.",
    // Fermo immagine da 0:42. Il montato è l'opera: qui non c'è nient'altro.
    scatti: fermo("l-affair", 1600, 681),
    filmati: [film("l-affair", 1600, 680, 80.62, true, "Giuseppe Esposito")],
    crediti: [
      ["regia", "Giuseppe Esposito"],
      ["styling e art direction", "Manuel Casati"],
      ["modelli", "Joshua Castiglione, Stefano Raffo"],
    ],
  },
  {
    numero: 16,
    slug: "le-reve-lever",
    titolo: "Le Rêve — Lever",
    anno: "2022",
    medium: "capsule collection e performance",
    luogo: "studioamatoriale, Milano",
    densita: "piena",
    descrizione:
      "Un progetto in due livelli: una capsule collection e una performance, " +
      "dal 21 al 24 settembre 2022. I tre look sviluppano lo studio filologico " +
      "del costume in una riformulazione contemporanea. La performance, " +
      "ripetuta durante l'opening, riflette su corpo, eroticità, ritualità e " +
      "voyeurismo.",
    // 01→03 sono le tre ORIZZONTALI, da `performance`, e stanno in testa per
    // scelta di Lucio: la prima è anche la copertina, ed è l'unica misura in
    // cui l'indice e la cronologia leggono quest'opera. 04→10 sono la
    // selezione di `_selected copy`, 11→14 le vedute dell'allestimento da
    // `display`.
    //
    // Le sette aggiunte il 7 settembre 2026 non sono solo curatela: l'opera
    // era tutta verticale e la sua mensola non arrivava a riempire il binario,
    // quindi l'anello non si accendeva e la fila restava ferma. Vedi
    // `APERTI.md` — è il motivo per cui le orizzontali contano doppio qui.
    scatti: foto("le-reve-lever",
      ["01", 1600, 1199], ["02", 1600, 1200], ["03", 1600, 1200],
      ["04", 919, 1600], ["05", 914, 1600], ["06", 901, 1600],
      ["07", 917, 1600], ["08", 919, 1600], ["09", 1200, 1600],
      ["10", 1200, 1600], ["11", 1200, 1600], ["12", 1200, 1600],
      ["13", 1200, 1600], ["14", 1200, 1600],
    ),
    filmati: [film("le-reve-lever", 360, 640, 53.66, true, "Alessandro Di Palma")],
    // Dal comunicato (`descrizione.jpeg`), che è il documento pubblicato. Il
    // `descrizione.rtf` dà il performer come «Giorgi»: due fonti in disaccordo,
    // e qui vince quella stampata.
    crediti: [
      ["a cura di", "Eleonora Angiolini"],
      ["testi", "Francesco Tola"],
      ["display", "Angelo Castucci"],
      ["produzione", "studioamatoriale, con Contemporary Attitude"],
    ],
  },
  {
    numero: 17,
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
    numero: 18,
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
    numero: 19,
    slug: "feral",
    titolo: "Feral",
    anno: "2024",
    medium: "performance",
    // Dal CV (`public/cv/`), 7 settembre 2026: era un trattino perché nessun
    // documento della cartella dava il luogo.
    luogo: "Maison du Sabotage, Sassari",
    densita: "piena",
    descrizione:
      "Una performance che esplora le zone d'ombra della psiche. Inquadrature " +
      "strette, telecamere, l'atto di spiare: lo spettatore diventa parte " +
      "dell'opera. Lo stereotipo maschile e femminile messo in scena per " +
      "rovesciarlo, e il kink come pratica identitaria. Un omaggio a Querelle " +
      "de Brest di Fassbinder. Con Alex Akashi, per Sabotage.",
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
    slug: "sauvage",
    titolo: "Sauvage",
    anno: "2025",
    medium: "video",
    luogo: "Sassari",
    densita: "minima",
    descrizione:
      "Video di presentazione per la seconda serata di Sauvage, di Technoroom, " +
      "a Sassari. Maggio 2025.",
    crediti: [
      ["in collaborazione con", "Technoroom"],
    ],
    // Fermo immagine da 0:36. Il derivato è RITAGLIATO: la sorgente porta due
    // bande nere verticali impresse da un export sbagliato, e sotto di esse
    // l'immagine vera è 4:3, non 16:9 — vedi `scripts/filmati.sh`.
    scatti: fermo("sauvage", 960, 720),
    filmati: [film("sauvage", 960, 720, 139.3, true)],
  },
  {
    numero: 21,
    slug: "don-giovanni",
    titolo: "Don Giovanni",
    anno: "2025",
    medium: "performance",
    // Dal CV (`public/cv/`), 7 settembre 2026: era un trattino perché nessun
    // documento della cartella dava il luogo.
    luogo: "Teatro Genova, Sassari",
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
      ["foto", "Irene Stefanini"],
    ],
  },
  {
    numero: 22,
    slug: "love-and-eat",
    titolo: "LOVE AND EAT",
    anno: "2026",
    medium: "video",
    luogo: "—",
    densita: "minima",
    descrizione:
      "Una ricerca sul cannibalismo come fame d'amore — la (dis)associazione " +
      "di fame, sesso e sentimento che l'elaborato Cannibal Affection indaga " +
      "dal rito azteco ai casi contemporanei. 12 febbraio 2026.",
    // Un fermo immagine preso dal video a 2:05, che è anche il cartello del
    // titolo. Fa da copertina nell'indice e nella cronologia, e NON compare
    // nella mensola: lì c'è il filmato, che è l'opera.
    scatti: fermo("love-and-eat", 1600, 900),
    // Il montato è l'opera, non la sua documentazione: qui la fotografia è il
    // fermo immagine e il filmato è il materiale. È il primo caso in archivio
    // in cui il rapporto fra i due si rovescia.
    filmati: [film("love-and-eat", 1600, 900, 375.83, true)],
    crediti: [
      ["sceneggiatura", "Manuel Casati"],
      ["performer", "Irene Stefanini, Mattia Mennuti, Christopher Dicky, Francesca Malagesi, Martina Bazzoni"],
      // Probabilmente la stessa persona che in Don Giovanni è creditata come
      // «Alex Ilushenka»: le due grafie vengono da due fonti diverse e nessuno
      // ha detto quale sia quella giusta.
      ["montaggio", "Aliaksandr Ilyushenka"],
    ],
  },
  {
    numero: 23,
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
      "Il lavoro esplora il rapporto sessuale a pagamento attraverso il letto, " +
      "inteso come palcoscenico di interazioni intime e sociali. Degli schermi " +
      "proiettano ciò che avviene nella camera; chi vuole può entrarvi, e " +
      "trovare il performer che lo invita a un rapporto dietro un'offerta. Il " +
      "corpo in vendita e sacralizzato insieme.",
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

/** Il testo dell'opera, o il segnaposto se la curatela non l'ha ancora scritto.
 *
 *  Sta qui e non nelle pagine perché le due viste che lo mostrano — la work
 *  page e la banda dell'indice — devono dire la STESSA cosa. Non era così: la
 *  banda scriveva una stringa fissa, uguale per tutte e ventitré le opere,
 *  mentre i testi di curatela esistevano già. Il segnaposto era pure diverso
 *  fra le due («dell'opera» contro «del progetto»), quindi nemmeno il buco
 *  combaciava.
 *
 *  Il segnaposto resta un segnaposto e si deve vedere: un'opera non raccontata
 *  non si copre con una frase generica che sembra vera (§6.1). */
export const descrizioneDi = (opera: Opera) =>
  opera.descrizione ??
  "descrizione dell'opera — cosa succede, quando, dove, e perché sta in questa " +
    "sequenza. Testo da scrivere con la curatela.";

/** Una cosa da guardare, ferma o in movimento. Le due viste dell'opera — la
 *  mensola e il ravvicinato — scorrono QUESTA lista, non `scatti`, perché
 *  altrimenti i filmati non avrebbero un posto in pagina.
 *
 *  L'unione vive qui e non nel tipo `Opera`: nei dati fotografie e filmati
 *  restano separati, perché l'apparato deve poterli contare separatamente
 *  (§3.3). Qui invece si guardano, e chi guarda vede una sequenza sola. */
export type Materiale =
  | { tipo: "foto"; n: number; scatto: Scatto }
  | { tipo: "filmato"; n: number; filmato: Filmato };

/** I filmati vanno IN CODA alle fotografie. Non è più provvisorio: guardata la
 *  pagina il 7 settembre 2026, Lucio ha detto che va bene così.
 *
 *  Da sapere, perché è controintuitivo: la mensola è un ANELLO, quindi «in
 *  coda» nei dati si legge «subito a sinistra della corrente» a schermo —
 *  entrando in Funeral Rave il filmato è la lastra attaccata alla fotografia
 *  grande, non l'ultima della fila. È stato visto ed è accettato: l'ordine
 *  resta discendente dal tipo, l'opera non lo dichiara. */
export function materiali(opera: Opera): Materiale[] {
  // I fermi immagine restano fuori: sono copertine, non materiale. In un'opera
  // solo-video la mensola mostra il filmato e basta.
  const scatti = opera.scatti.filter((s) => !s.fermoImmagine);
  const lista: Materiale[] = [
    ...scatti.map((scatto, i) => ({ tipo: "foto" as const, n: i + 1, scatto })),
    ...(opera.filmati ?? []).map((filmato, i) => ({
      tipo: "filmato" as const,
      n: scatti.length + i + 1,
      filmato,
    })),
  ];
  return lista;
}

/** Il rapporto con cui la cornice va disegnata. Per una fotografia è uno dei
 *  cinque formati ammessi; per un filmato è il suo, esatto — vedi il commento
 *  del tipo `Filmato`. */
export const rapporto = (m: Materiale) =>
  m.tipo === "foto"
    ? RAPPORTO[formato(m.scatto.w, m.scatto.h)]
    : m.filmato.w / m.filmato.h;

export const numerato = (n: number) => String(n).padStart(3, "0");

/** `95` → `1:35`. Come `numerato`, è apparato: si legge, non si somma.
 *  L'arrotondamento è sul totale e non sui secondi, se no 119,7 dà «1:60». */
export const durataLeggibile = (secondi: number) => {
  const tot = Math.round(secondi);
  return `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, "0")}`;
};
