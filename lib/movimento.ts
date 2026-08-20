/** L'unico accento del sito. Sorgente sola: chi lo usa lo riceve, non ne
 *  tiene una copia — né i fogli di stile né i componenti.
 *
 *  ── Dove può stare, aggiornato ─────────────────────────────────────────────
 *  Il §2.3 dice che «il rosso sta nel taglio, non colora l'interfaccia». La
 *  regola vale ancora, ma ha ormai un'eccezione dichiarata e conviene che sia
 *  scritta accanto al colore invece di essere scoperta leggendo i fogli:
 *
 *    · LA TENDA — il taglio vero e proprio, un rettangolo che entra, copre e
 *      si ritira. È il caso originario e non è in discussione.
 *    · LA CHIUSURA DI /about — una schermata intera di rosso pieno. Qui il
 *      rosso è SUPERFICIE e non gesto: l'accento che si prende l'ultima parola
 *      del sito invece di lampeggiare per un istante.
 *
 *  Fuori da questi due, no. In particolare non colora un'affordance
 *  d'interfaccia: il riquadro del copia in `components/copia.tsx` avrebbe
 *  potuto usarlo (5,70:1 su avorio, contrasto sufficiente) e usa l'inchiostro
 *  proprio per non spendere l'accento una terza volta.
 *
 *  Se un giorno arriva un terzo caso, non è più un'eccezione: è che la regola
 *  è cambiata, e va riscritta invece di essere aggirata. */
export const ROSSO = "#C1121C";

/** La carta del sito. Sta qui accanto al rosso perché la transizione fra
 *  pagine ha bisogno di entrambi all'elemento radice, e i pseudo-elementi di
 *  `::view-transition` non ereditano da nessuna pagina. Il resto del sito la
 *  dichiara ancora come `--avorio` dentro ogni `.pagina`: quando la tavolozza
 *  avrà una casa sua, è da qui che si parte. */
export const AVORIO = "#f5f5f0";

/** L'altra metà del §3.2: la dissolvenza segna una variazione interna a uno
 *  stato già stabilito, dove il taglio segna il passaggio di stato. Sta qui
 *  accanto alla tenda perché la scelta fra i due è la regola, e una regola con
 *  un solo termine scritto non è una regola. */
export const DISSOLVENZA = {
  durata: 0.25,
  ease: "power1.out",
} as const;

/** §9.4 della guida — il sito funziona anche senza animazioni. Qui la
 *  preferenza di sistema: chi la chiede ottiene gli stessi stati, raggiunti
 *  senza percorso (nessun momento residuo, nessun inseguimento smorzato,
 *  nessun taglio). Letta una volta al montaggio e non riascoltata: cambiarla
 *  a pagina aperta è raro, e un listener in più sul motore non lo vale. */
export function motoRidotto() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** ── La tenda ─────────────────────────────────────────────────────────────
 *  Il taglio, per come è nato: non un filetto sul bordo di una maschera, ma
 *  un rettangolo rosso che entra, si prende tutta l'area, e poi si ritira
 *  scoprendo il contenuto. Due tempi, un solo verso di marcia.
 *
 *    1. COPERTURA — nasce a larghezza zero sul bordo d'ingresso e cresce
 *       fino a coprire l'elemento per intero.
 *    2. RITIRO    — il bordo d'ingresso insegue quello opposto: il rosso si
 *       stringe fino a sparire, e passando scopre il contenuto.
 *
 *  Tre regole, che sono ciò che lo fa leggere come un taglio e non come un
 *  effetto:
 *
 *  · LA TENDA NON TORNA MAI INDIETRO. Entra da sinistra e si ritira verso
 *    destra — un solo verso per tutta la durata, così il contenuto si scopre
 *    nel senso di lettura. Ritirandosi da dove è venuta leggerebbe "annulla"
 *    e non "rivela".
 *  · LA TENDA NON SFUMA MAI. Esce arrivando a larghezza zero, non con
 *    l'opacità: una dissolvenza sul rosso contraddice il §3.1.
 *  · LA COPERTURA PIENA È IL PUNTO. È l'unico istante in cui il rosso è un
 *    colore e non una linea, ed è lì che il contenuto viene scambiato — sotto
 *    la tenda, quindi senza lampo. `attesa` lo tiene fermo un momento: senza,
 *    i due tempi si fondono in una banda che scivola, cioè si torna al
 *    filetto, solo più largo.
 *
 *  Le curve danno il ritmo: `power2.out` arriva e si posa, `power2.in` riparte
 *  e scatta via. Il contrasto fra le due è il ritmo — un ease unico per
 *  entrambi i tempi lo appiattisce. */
export const TENDA = {
  rosso: ROSSO,
  copertura: 0.45,
  attesa: 0.06,
  ritiro: 0.5,
  easeCopertura: "power2.out",
  easeRitiro: "power2.in",
  /** La tenda che risponde a un puntatore, non quella che apre una pagina.
   *  Stessa grammatica, stesso disegno, tempo più corto: un ingresso
   *  cerimoniale si guarda, una risposta si aspetta — e un secondo prima di
   *  vedere la preview di un titolo su cui sei già col mouse è lentezza, non
   *  eleganza. Moltiplica i tre tempi insieme, così le proporzioni fra
   *  copertura, attesa e ritiro restano quelle. */
  scalaRisposta: 0.55,

  /** Lo scarto fra due tende della stessa composizione. Volutamente più corto
   *  della somma dei due tempi: la seconda entra mentre la prima si sta
   *  ritirando, così la soglia si compone con un'onda sola invece di due
   *  eventi in fila. */
  scarto: 0.22,
} as const;

/** ── La sequenza della soglia ──────────────────────────────────────────────
 *  L'ingresso della home, che NON è una tenda: la tenda resta al video, dove
 *  è nata. Qui il movimento è un'altra cosa — i testi si compongono da soli,
 *  in quattro tempi, e solo alla fine si fanno da parte per il video.
 *
 *    1. Solo lo sfondo.
 *    2. `manuel` si materializza al centro dello schermo — sfocatura che si
 *       chiude e opacità che sale insieme. Il blur è quello che distingue
 *       "compare" da "si accende": senza, è un fade e basta.
 *    3. `manuel` scivola a sinistra, e mentre si sposta le altre parole
 *       escono da sotto di lui e raggiungono il loro posto, sfalsate. Devono
 *       partire mentre il marchio è ancora in movimento: se aspettano che si
 *       fermi non sembrano originarsi da lui, sembrano comparire accanto.
 *    4. La riga sale al suo posto e lascia il campo al video, la cui tenda
 *       attacca durante la salita — non dopo.
 *
 *  I `t*` sono istanti d'attacco misurati dall'inizio della sequenza, non
 *  durate incatenate: con le sovrapposizioni che servono qui, una catena di
 *  `+=`/`-=` renderebbe impossibile dire a che secondo entra il video. Così
 *  la partitura si legge in colonna e si sposta un tempo alla volta.
 *
 *  Le posizioni di partenza NON sono qui: si misurano a runtime (dove cade
 *  davvero il centro dello schermo, quanto è largo il marchio dentro la
 *  riga). Scriverle come numeri le renderebbe vere a una sola viewport. */
/** Vero solo se questo caricamento di pagina è atterrato sulla soglia.
 *  Costante di modulo e non funzione: va valutata una volta sola, perché deve
 *  restare vera anche dopo che una navigazione client ha cambiato il percorso.
 *  È la forma tecnica della regola "l'header nasce sulla soglia, ovunque altro
 *  c'è già". Sul server è falsa; la leggono solo gli effetti, cioè il client. */
export const ATTERRATO_SULLA_SOGLIA =
  typeof window !== "undefined" && window.location.pathname === "/";

export const SOGLIA = {
  attesa: 0.25,
  /** Sfocatura iniziale del marchio, in px. A 0 la comparsa è solo opacità. */
  sfocatura: 10,
  comparsa: 0.8,

  tSpostamento: 0.95,
  spostamento: 0.65,

  tParole: 1.2,
  parole: 0.5,
  scartoParole: 0.06,

  /** Il quarto tempo: la riga si apre in due — il marchio al margine
   *  sinistro, le rotte al destro — e insieme sale nell'header. Non è un
   *  movimento nuovo, è il terzo al contrario: lì le parole erano uscite dal
   *  marchio, qui il gruppo si divide ai due margini. Apertura e salita
   *  condividono l'istante d'attacco perché sono un gesto solo. */
  tApertura: 1.85,
  apertura: 0.7,
  salita: 0.7,

  /** Quando attacca la tenda del video, dall'inizio della sequenza. Sta
   *  dentro l'apertura di proposito: il video si scopre mentre la riga si
   *  sta ancora dividendo, non dopo che si è fermata. */
  tVideo: 2.15,
} as const;
