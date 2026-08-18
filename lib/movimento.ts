// La grammatica del taglio (guida di progetto §3.1): un bordo netto scopre
// l'elemento, il rosso precede la rivelazione per un istante nella fessura,
// poi sparisce. Assi ammessi solo verticale e orizzontale, mai diagonale.
//
// Centralizzato qui perché il pannello della timeline (`pannello-materiale.tsx`)
// è il primo taglio mai implementato nel progetto: la futura maschera di
// transizione fra pagine (§3.4) userà le stesse costanti, non una copia.
export const TAGLIO = {
  durata: 0.9,
  ease: "cubic-bezier(0.76, 0, 0.24, 1)",
  rosso: "#C1121C",
  anticipoRosso: 0.07,
} as const;

/** L'altra metà del §3.2: la dissolvenza segna una variazione interna a uno
 *  stato già stabilito, dove il taglio segna il passaggio di stato. Sta qui
 *  accanto al taglio perché la scelta fra i due è la regola, e una regola con
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
