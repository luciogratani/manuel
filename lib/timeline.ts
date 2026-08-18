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

/** Quanto insegue l'obiettivo la posizione visibile, e quanto in fretta
 *  `obiettivo` torna al capo quando è stato tirato oltre e nessun input lo
 *  spinge più: entrambi normalizzati a 60fps (`smorza()` in motore.tsx). Più
 *  basso = più morbido/lento. Abbassato da 0.25 a 0.1 su segnalazione che lo
 *  scroll sembrava 1:1. */
export const SMORZAMENTO = 0.1;
export const RILASSAMENTO_BORDO = 0.12;

/** Sensibilità: quanto di un delta in ingresso arriva davvero a `obiettivo`.
 *  Non "frizione" nel nome perché è un moltiplicatore, non una resistenza da
 *  invertire — ma è la stessa manopola: 0.8 = 20% meno sensibile ovunque
 *  (chiesto: "aumenta la frizione generale del 20%"), 0.7 si applica IN PIÙ
 *  solo dentro la zona elastica (chiesto: "del 30% ai bordi") — le due si
 *  moltiplicano, quindi ai bordi la resistenza totale è maggiore delle due
 *  prese singolarmente, non la somma. */
export const SENSIBILITA_GENERALE = 0.8;
export const SENSIBILITA_BORDO = 0.7;

/** Il momento residuo dopo che l'input smette: quanta velocità sopravvive
 *  dopo un secondo (decadimento esponenziale, indipendente dal frame rate).
 *  Senza questo l'interazione si fermava di scatto al rilascio — "immersivo
 *  ma ancora leggermente bloccato". Rispetta la stessa fisica di bordo/salto
 *  di un push diretto: non è un sistema a parte. */
export const MOMENTO_DECADIMENTO = 0.05;
/** Sotto questa velocità (anni/secondo) il momento si azzera invece di
 *  continuare a scemare all'infinito. */
export const MOMENTO_SOGLIA = 0.01;

/** La scala dei dentini attorno al nonio (scala diretta: tutti bassi, quello
 *  sotto il nonio al picco). Curva a campana di Lorentz, non a coseno: sale
 *  ripida vicino al centro e poi ha una coda lunga e morbida invece di un
 *  taglio netto al raggio — "centro più chiuso, bordi lunghi e morbidi".
 *  `FOCUS_RAGGIO_MESI` è dove la campana è a metà altezza, non un confine:
 *  oltre continua a scendere verso `FOCUS_MIN` senza mai un salto. Prima
 *  ipotesi, da tarare a occhio. */
export const FOCUS_RAGGIO_MESI = 14;
export const FOCUS_MIN = 0.1;
export const FOCUS_PICCO = 2.9;

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
// Sono le sole voci il cui anno è leggibile dai nomi delle cartelle in
// 01-assets/media. Le altre non hanno una data che io possa ricavare senza
// inventarla. Meglio dodici voci vere che ventisei con quattordici anni finti.
//
// Qui dentro finiranno anche le voci che opere non sono — formazione, appunti,
// lavori esterni — che Manuel aggiungerà.
export const VOCI: Voce[] = [
  { titolo: "Intervento per il Candide", anno: 2013, medium: "intervento", luogo: "Palazzo Guillot, Alghero", slug: "intervento-per-il-candide" },
  { titolo: "Glamour Confusion", anno: 2014, medium: "—", luogo: "—" },
  { titolo: "Photo Editorial Design Scene", anno: 2015, medium: "editoriale", luogo: "—" },
  { titolo: "Ph Shoot Anto", anno: 2015, medium: "—", luogo: "—" },
  { titolo: "Corsa Futurista", anno: 2015, fine: 2024, medium: "—", luogo: "—" },
  { titolo: "A Boy's Closet", anno: 2020, medium: "—", luogo: "—" },
  { titolo: "L'Affair", anno: 2021, medium: "video performance", luogo: "—" },
  { titolo: "Le Rêve Lever", anno: 2022, medium: "—", luogo: "—" },
  { titolo: "Funeral Rave", anno: 2023, medium: "—", luogo: "—", slug: "funeral-rave" },
  { titolo: "Don Giovanni", anno: 2025, medium: "—", luogo: "—" },
  { titolo: "BDSM", anno: 2025, medium: "video", luogo: "—" },
  { titolo: "Coucher avec moi", anno: 2026, medium: "—", luogo: "—" },
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
  /** Risolti da `lib/opere.ts` quando `slug` è presente. */
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
