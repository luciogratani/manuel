// La mensola: la striscia orizzontale delle fotografie di un'opera, in
// /works/[slug]. Le costanti stanno qui come quelle della timeline stanno in
// lib/timeline.ts — i due motori si somigliano ma non condividono i numeri:
// là si scorre una cronologia di sedici anni, qui una dozzina di fotografie.

/** Dove cade la lastra corrente, in px sulla viewport di riferimento. È la
 *  stessa quota dell'artboard, e fa per questa pagina quello che il nonio fa
 *  per la timeline: non è una posizione, è il punto in cui si legge. */
export const LETTURA = 282;

/** Quanto scorre la striscia per unità di rotella. Più bassa della
 *  `SENSIBILITA_GENERALE` della timeline perché qui il passo è una fotografia
 *  e non un anno: lo stesso gesto deve coprire molta meno strada. */
export const SENSIBILITA = 1.6;

/** Il dito muove la striscia 1:1. Come sulla timeline: qualunque altro
 *  rapporto si legge come rotto, non come pesante. */
export const SENSIBILITA_TOCCO = 1;

/** L'inseguimento smorzato verso l'obiettivo, per frame a 60fps. */
export const SMORZAMENTO = 0.12;

/** Il momento residuo dopo il rilascio, e la soglia sotto cui si spegne. Senza,
 *  la striscia si fermerebbe di scatto: tecnicamente smorzata, percettivamente
 *  inerte. */
export const MOMENTO_DECADIMENTO = 0.06;
export const MOMENTO_SOGLIA = 0.5;
