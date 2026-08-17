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
};

/** Le opere che non hanno nemmeno una fotografia: solo filmati. Restano fuori
 *  finché §8 non è risolto, e sono la prova che il problema dei video non è un
 *  capitolo a parte ma un buco nell'indice. */
export const SENZA_IMMAGINI = ["L'Affair", "BDSM"];

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

export const OPERE: Opera[] = [
  { numero: 1, slug: "istituto-darte-filippo-figari", titolo: "Istituto d'Arte Filippo Figari", anno: "2008–2013", medium: "formazione", luogo: "Sassari", densita: "minima", scatti: [indice("008", 900, 872)] },
  { numero: 2, slug: "intervento-per-il-candide", titolo: "Intervento per il Candide", anno: "2013", medium: "intervento", luogo: "Palazzo Guillot, Alghero", densita: "minima", scatti: [indice("007", 900, 600)] },
  { numero: 3, slug: "glamour-confusion", titolo: "Glamour Confusion", anno: "2014", medium: "—", luogo: "—", densita: "minima", scatti: [indice("006", 900, 539)] },
  { numero: 4, slug: "ph-shoot-anto", titolo: "Ph Shoot Anto", anno: "2015", medium: "fotografia", luogo: "—", densita: "minima", scatti: [indice("012", 900, 600)] },
  { numero: 5, slug: "photo-editorial-design-scene", titolo: "Photo Editorial Design Scene", anno: "2015", medium: "editoriale", luogo: "—", densita: "minima", scatti: [indice("013", 695, 900)] },
  { numero: 6, slug: "corsa-futurista", titolo: "Corsa Futurista", anno: "2015–2024", medium: "—", luogo: "—", densita: "minima", scatti: [indice("004", 505, 900)] },
  { numero: 7, slug: "apoteosi", titolo: "Apoteosi — Creazione di una Musa", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("001", 900, 600)] },
  { numero: 8, slug: "editoriale-vogue", titolo: "Editoriale per Vogue", anno: "—", medium: "editoriale", luogo: "—", densita: "minima", scatti: [indice("005", 900, 726)] },
  { numero: 9, slug: "la-distanza", titolo: "La Distanza", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("009", 600, 900)] },
  { numero: 10, slug: "marie-antoinette-in-the-fridge", titolo: "Marie Antoinette in the Fridge", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("010", 598, 900)] },
  { numero: 11, slug: "the-missing", titolo: "The Missing", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("015", 900, 600)] },
  { numero: 12, slug: "seduta-spiritica", titolo: "Seduta spiritica", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("016", 600, 900)] },
  { numero: 13, slug: "blanka", titolo: "Blanka", anno: "—", medium: "fotografia", luogo: "—", densita: "minima", scatti: [indice("011", 900, 588)] },
  { numero: 14, slug: "a-boys-closet", titolo: "A Boy's Closet — Guardaroba di un ragazzo", anno: "2020", medium: "—", luogo: "—", densita: "minima", scatti: [indice("017", 900, 596)] },
  { numero: 15, slug: "le-reve-lever", titolo: "Le Rêve Lever", anno: "2022", medium: "—", luogo: "—", densita: "minima", scatti: [indice("023", 514, 900)] },
  {
    numero: 16,
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
  },
  { numero: 17, slug: "antropologia", titolo: "Antropologia", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("018", 854, 900)] },
  { numero: 18, slug: "feral", titolo: "Feral", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("021", 900, 675)] },
  { numero: 19, slug: "the-red-white-horse", titolo: "The Red White Horse", anno: "—", medium: "—", luogo: "—", densita: "minima", scatti: [indice("024", 900, 599)] },
  { numero: 20, slug: "don-giovanni", titolo: "Don Giovanni", anno: "2025", medium: "—", luogo: "—", densita: "minima", scatti: [indice("020", 900, 675)] },
  { numero: 21, slug: "coucher-avec-moi", titolo: "Coucher avec moi", anno: "2026", medium: "—", luogo: "—", densita: "minima", scatti: [indice("019", 900, 675)] },
];

export const perSlug = (slug: string) => OPERE.find((o) => o.slug === slug);

export const numerato = (n: number) => String(n).padStart(3, "0");
