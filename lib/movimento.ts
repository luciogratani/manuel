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
