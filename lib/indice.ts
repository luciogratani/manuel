// L'indice: la griglia numerata di /works, e il motore che ci fa avanzare la
// selezione. Le costanti stanno qui come quelle della timeline in
// lib/timeline.ts e quelle della mensola in lib/mensola.ts.
//
// ── Perché la selezione e non la striscia ───────────────────────────────────
// La griglia non scorre quasi: ventuno opere fanno 1.413px contro i 1.404
// disponibili — nove pixel — e anche con le ventisei definitive sarebbero 258,
// due colonne e mezza. Una striscia che scorre, qui, non esiste.
//
// Quindi è la SELEZIONE ad avanzare: lo scorrimento muove un cursore lungo la
// sequenza 01→21, e la griglia si sposta solo di quel poco che può per tenere
// visibile ciò che è selezionato. Vale a nove pixel come a duecento, e vale
// anche il giorno in cui l'archivio sarà lungo il doppio.

/** Quanti pixel di rotella per passare da un'opera alla successiva. Uno scatto
 *  di rotella tipico ne muove un centinaio, quindi il gesto naturale avanza di
 *  un'opera per volta invece di attraversare l'archivio. */
export const PASSO = 120;

/** Il dito percorre la stessa distanza della rotella: 1:1 non ha senso qui,
 *  perché non si trascina una striscia ma si sfoglia una sequenza. */
export const SENSIBILITA_TOCCO = 1.4;

/** L'inseguimento smorzato del cursore verso l'obiettivo, per frame a 60fps. */
export const SMORZAMENTO = 0.18;

/** Il momento residuo dopo il rilascio, e la soglia sotto cui si spegne. */
export const MOMENTO_DECADIMENTO = 0.04;
export const MOMENTO_SOGLIA = 8;

/** Quanto si può forzare oltre il primo e l'ultimo, in opere. L'indice è
 *  l'archivio: ha un inizio e una fine, come la cronologia, e vale il
 *  ragionamento del §4.4 che ha fatto scartare il giro in tondo sulla timeline.
 *  Ai capi ci va l'elastico, non l'anello — che sulla mensola invece è
 *  legittimo, perché le fotografie di un'opera non hanno un ordine che
 *  significhi qualcosa. */
export const ELASTICO_OPERE = 0.6;

/** Quanto in fretta la molla torna quando l'input si ferma, per frame. Senza,
 *  resterebbe tesa in attesa di un altro evento. */
export const RILASSAMENTO_BORDO = 0.14;
