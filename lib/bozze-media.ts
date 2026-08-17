// Generato dai file in `public/bozze/`, che sono derivati web delle sorgenti in
// 01-assets/media (fuori dal repository). Larghezze e altezze sono quelle vere
// del derivato: il formato dichiarato si ricava da qui, non viceversa.
//
// PROVVISORIO. L'ordine delle opere e le corrispondenze cartella->opera li dara
// la curatela (§6.1 della guida); qui l'archivio viene prima delle recenti, che
// e solo approssimativamente cronologico.

export type Formato = "2:3" | "3:4" | "1:1" | "4:3" | "3:2";

export const RAPPORTO: Record<Formato, number> = {
  "2:3": 2 / 3,
  "3:4": 3 / 4,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
};

const FORMATI = Object.keys(RAPPORTO) as Formato[];

/** Accosta il rapporto reale al formato piu vicino fra quelli ammessi.
 *  Le foto non vengono ritagliate su disco: e la cornice ad avere il formato,
 *  e l'immagine la riempie con `object-fit: cover`. */
export function formato(w: number, h: number): Formato {
  const r = w / h;
  return FORMATI.reduce((a, b) =>
    Math.abs(RAPPORTO[b] - r) < Math.abs(RAPPORTO[a] - r) ? b : a,
  );
}

export type Scatto = { src: string; w: number; h: number; opera: string };

/** Una foto per opera: le celle dell'indice. */
export const INDICE: Scatto[] = [
  { src: "/bozze/indice/001.jpg", w: 900, h: 600, opera: "APOTEOSI Creazione di una Musa" },
  { src: "/bozze/indice/002.jpg", w: 900, h: 674, opera: "Biglietto da visita" },
  { src: "/bozze/indice/003.jpg", w: 720, h: 900, opera: "Bozzetti" },
  { src: "/bozze/indice/004.jpg", w: 505, h: 900, opera: "CORSA FUTURISTA 2015-2024" },
  { src: "/bozze/indice/005.jpg", w: 900, h: 726, opera: "Editoriale x Vogue photo Giuseppe Esposito" },
  { src: "/bozze/indice/006.jpg", w: 900, h: 539, opera: "GLAMOUR CONFUSION 04-05-2014" },
  { src: "/bozze/indice/007.jpg", w: 900, h: 600, opera: "Intervento per il Candide a palazzo Guillot, Alghero 21.09.13" },
  { src: "/bozze/indice/008.jpg", w: 900, h: 872, opera: "Istituto D'Arte Filippo Figari 2008-2013" },
  { src: "/bozze/indice/009.jpg", w: 600, h: 900, opera: "LA DISTANZA" },
  { src: "/bozze/indice/010.jpg", w: 598, h: 900, opera: "Marie Antoinette in thr Fridge" },
  { src: "/bozze/indice/011.jpg", w: 900, h: 588, opera: "Ph Blanka Claudio&Fab" },
  { src: "/bozze/indice/012.jpg", w: 900, h: 600, opera: "Ph Shoot Anto 25.11.15" },
  { src: "/bozze/indice/013.jpg", w: 695, h: 900, opera: "Photo Editorial Design Scene 28.09.15" },
  { src: "/bozze/indice/014.jpg", w: 631, h: 900, opera: "Sketch for Casati Project" },
  { src: "/bozze/indice/015.jpg", w: 900, h: 600, opera: "THE MISSING" },
  { src: "/bozze/indice/016.jpg", w: 600, h: 900, opera: "ph Veronica Diaz seduta spiritica e altro" },
  { src: "/bozze/indice/017.jpg", w: 900, h: 596, opera: "A Boy's Closet Guardaroba di un ragazzo 09-10-020" },
  { src: "/bozze/indice/018.jpg", w: 854, h: 900, opera: "Antropologia" },
  { src: "/bozze/indice/019.jpg", w: 900, h: 675, opera: "COUCHER AVEC MOI 29 - 05 -26" },
  { src: "/bozze/indice/020.jpg", w: 900, h: 675, opera: "DON GIOVANNI 30 -05 - 25" },
  { src: "/bozze/indice/021.jpg", w: 900, h: 675, opera: "FERAL" },
  { src: "/bozze/indice/022.jpg", w: 900, h: 642, opera: "FUNERAL RAVE 30-06-23" },
  { src: "/bozze/indice/023.jpg", w: 514, h: 900, opera: "LE REVE LEVER 21-09-22" },
  { src: "/bozze/indice/024.jpg", w: 900, h: 599, opera: "progetto THE RED WHITE HORSE" },
];

/** FUNERAL RAVE: la mensola della 01 e la colonna della 04. */
export const FUNERAL_RAVE: Scatto[] = [
  { src: "/bozze/funeral-rave/01.jpg", w: 1600, h: 1142, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/02.jpg", w: 1600, h: 1143, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/03.jpg", w: 1600, h: 1142, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/04.jpg", w: 1600, h: 1142, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/05.jpg", w: 1600, h: 1200, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/06.jpg", w: 1600, h: 1143, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/07.jpg", w: 1600, h: 1600, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/08.jpg", w: 1600, h: 1600, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/09.jpg", w: 1280, h: 1600, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/10.jpg", w: 1280, h: 1600, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/11.jpg", w: 1600, h: 1066, opera: "Funeral Rave" },
  { src: "/bozze/funeral-rave/12.jpg", w: 1600, h: 1200, opera: "Funeral Rave" },
];
