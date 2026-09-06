// L'indice: la striscia numerata di /works, e le costanti del suo scorrimento.
// Stanno qui come quelle della timeline in lib/timeline.ts e quelle della
// mensola in lib/mensola.ts.
//
// ── Scorrimento continuo, non a passi ───────────────────────────────────────
// L'archivio è una riga sola, lunga più di cinquemila pixel contro i ~1.400
// visibili. Lo scorrimento la trascina in CONTINUO — niente cursore che salta
// da un'opera all'altra: la rotella (o il dito) muove un obiettivo in pixel, e
// la posizione lo insegue smorzata. Ai due capi un elastico, non un muro.
//
// La mensola invece scorre A PASSI, ed è voluto: lì ogni fotografia deve
// fermarsi esattamente sotto la linea di lettura. Qui non c'è niente da
// allineare, quindi il passo sarebbe solo un attrito.

/** Quanti pixel di striscia per ogni pixel di rotella. Sopra 1 perché uno
 *  scatto grezzo (~100px) copra circa una lastra invece di mezza: la striscia
 *  è lunga, e a 1:1 sembrava non muoversi abbastanza. */
export const FATTORE_ROTELLA = 1.8;

/** Il dito trascina la striscia quasi 1:1 col movimento reale, appena
 *  assecondato — non si sfoglia una sequenza, si sposta una superficie. */
export const SENSIBILITA_TOCCO = 1.15;

/** L'inseguimento smorzato della posizione verso l'obiettivo, per frame a
 *  60fps: alto abbastanza da posarsi in fretta, non da arrivare di scatto. */
export const SMORZAMENTO = 0.16;

/** Quanti pixel si può forzare oltre il primo o l'ultimo prima che l'elastico
 *  diventi quasi un muro (a questo sconfinamento la spinta è già dimezzata).
 *  L'indice è l'archivio: ha un inizio e una fine, come la cronologia, e vale
 *  il ragionamento del §4.4 che ha scartato il giro in tondo sulla timeline. */
export const ELASTICO_PX = 140;

/** Quanto in fretta la molla riporta l'obiettivo dentro i capi quando l'input
 *  si ferma, per frame. Senza, resterebbe teso in attesa di un altro evento. */
export const RILASSAMENTO_BORDO = 0.12;

/** Millisecondi che il puntatore deve posarsi su un'opera prima che la banda
 *  la mostri. Spazzando la striscia l'hover cambia ogni pochi millisecondi:
 *  senza questa attesa la scheda inseguirebbe ogni opera di passaggio, e ogni
 *  cambio è una dissolvenza che riparte. Uscire dalla striscia non è una
 *  spazzata e non aspetta. */
export const RITARDO_BANDA = 80;

/** Lo scorrimento gentile fino alla prima opera di una categoria appena
 *  scelta nella banda: più lento e più deliberato di un colpo di rotella —
 *  è il sito che porta qualcosa in vista, non l'utente che spinge. Un input
 *  manuale lo annulla (vedi `spingi` in motore.tsx). */
export const VAI_A_CATEGORIA = { durata: 0.7, ease: "power3.inOut" } as const;
