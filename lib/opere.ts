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

const fr = (n: string, w: number, h: number): Scatto => ({
  src: `/media/funeral-rave/${n}.jpg`,
  w,
  h,
});

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
  { numero: 4, slug: "ph-shoot-anto", titolo: "Ph Shoot Anto", anno: "2015", medium: "fotografia", luogo: "—", densita: "minima", scatti: [indice("012", 900, 600)] },
  { numero: 5, slug: "photo-editorial-design-scene", titolo: "Photo Editorial Design Scene", anno: "2015", medium: "editoriale", luogo: "—", densita: "minima", scatti: [indice("013", 695, 900)] },
  { numero: 6, slug: "corsa-futurista", titolo: "Corsa Futurista", anno: "2015–2024", medium: "—", luogo: "—", densita: "minima", scatti: [indice("004", 505, 900)] },
  { numero: 7, slug: "apoteosi", titolo: "Apoteosi — Creazione di una Musa", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("001", 900, 600)] },
  { numero: 8, slug: "la-distanza", titolo: "La Distanza", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("009", 600, 900)] },
  { numero: 9, slug: "the-missing", titolo: "The Missing", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("015", 900, 600)] },
  { numero: 10, slug: "seduta-spiritica", titolo: "Seduta spiritica", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("016", 600, 900)] },
  { numero: 11, slug: "blanka", titolo: "Blanka", anno: "—", medium: "fotografia", luogo: "—", densita: "minima", scatti: [indice("011", 900, 588)] },
  { numero: 12, slug: "a-boys-closet", titolo: "A Boy's Closet — Guardaroba di un ragazzo", anno: "2020", medium: "—", luogo: "—", densita: "minima", scatti: [indice("017", 900, 596)] },
  { numero: 13, slug: "le-reve-lever", titolo: "Le Rêve Lever", anno: "2022", medium: "—", luogo: "—", densita: "minima", scatti: [indice("023", 514, 900)], filmati: [film("le-reve-lever", 360, 640, 53.66, true)] },
  {
    numero: 14,
    slug: "funeral-rave",
    titolo: "Funeral Rave",
    anno: "2023",
    medium: "performance",
    luogo: "—",
    densita: "piena",
    scatti: [
      fr("01", 1600, 1142), fr("02", 1600, 1143), fr("03", 1600, 1142),
      fr("04", 1600, 1142), fr("05", 1600, 1200), fr("06", 1600, 1143),
      fr("07", 1600, 1600), fr("08", 1600, 1600), fr("09", 1280, 1600),
      fr("10", 1280, 1600), fr("11", 1600, 1066), fr("12", 1600, 1200),
    ],
    filmati: [film("funeral-rave", 480, 848, 95.11, true, "Tommaso Bentivegna")],
  },
  { numero: 15, slug: "antropologia", titolo: "Antropologia", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("018", 854, 900)] },
  { numero: 16, slug: "feral", titolo: "Feral", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("021", 900, 675)] },
  { numero: 17, slug: "don-giovanni", titolo: "Don Giovanni", anno: "2025", medium: "—", luogo: "—", densita: "minima", scatti: [indice("020", 900, 675)] },
  { numero: 18, slug: "coucher-avec-moi", titolo: "Coucher avec moi", anno: "2026", medium: "—", luogo: "—", densita: "minima", scatti: [indice("019", 900, 675)] },
];

export const perSlug = (slug: string) => OPERE.find((o) => o.slug === slug);

export const numerato = (n: number) => String(n).padStart(3, "0");

/** `95` → `1:35`. Come `numerato`, è apparato: si legge, non si somma.
 *  L'arrotondamento è sul totale e non sui secondi, se no 119,7 dà «1:60». */
export const durataLeggibile = (secondi: number) => {
  const tot = Math.round(secondi);
  return `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, "0")}`;
};
