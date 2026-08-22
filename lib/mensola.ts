// La mensola: la striscia orizzontale delle fotografie di un'opera, in
// /works/[slug]. Le costanti stanno qui come quelle della timeline stanno in
// lib/timeline.ts — i due motori si somigliano ma non condividono i numeri:
// là si scorre una cronologia di sedici anni, qui una dozzina di fotografie.

/** Dove cade la lastra corrente, in px sulla viewport di riferimento — e lo
 *  stesso numero di `left` in `.scheda` (page.module.css): non per caso, è il
 *  punto in cui il testo comincia, ed è lì che il bordo sinistro della
 *  corrente deve cadere esattamente, non solo «contenerlo» come prima. */
export const LETTURA = 282;

/** L'altezza assoluta della corrente, uguale per ogni registro di partenza —
 *  prima cresceva in proporzione al registro (tre altezze finali diverse),
 *  adesso è un solo numero: chi guarda deve vedere la stessa fotografia «in
 *  prima fila» a prescindere da dove stava prima di arrivarci. Stesso numero
 *  di `--corrente-h` in page.module.css — due linguaggi, un solo valore,
 *  come `LETTURA` e `.scheda { left }` qui sopra. */
export const CORRENTE_H = 382;

/** Quanto delta di scorrimento grezzo (px, sulla viewport di riferimento)
 *  serve per far scattare un passo. Un gesto piccolo non deve far scattare
 *  niente: o è un passo intero, o non è ancora un passo — a differenza della
 *  vecchia striscia continua, che seguiva anche il più piccolo movimento. */
export const SOGLIA_STEP = 40;

/** Il dito accumula 1:1: un passo per un trascinamento di `SOGLIA_STEP` px,
 *  senza il moltiplicatore che aveva la rotella. */
export const SENSIBILITA_TOCCO = 1;

/** Un passo, dall'inizio alla fine: la posizione (il tween di
 *  `scorrimentoRef` in mensola.tsx) e l'ingombro della corrente (la
 *  transition CSS di `--corrente-durata`, page.module.css) condividono questa
 *  durata — restano due animazioni distinte, ma finiscono insieme. */
export const DURATA_STEP = 0.36;
export const EASE_STEP = "power1.inOut";
