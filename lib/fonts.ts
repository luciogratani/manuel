import localFont from "next/font/local";

// Dichiarazione dei caratteri del progetto.
//
// Le variabili sono nominate per FACCIA, non per ruolo (--font-pp-hatton, non
// --font-display): i ruoli semantici non sono ancora fissati e rinominare una
// variabile dopo costa più che nominarla bene adesso.
//
// `preload: false` ovunque, di proposito: finché nessuna faccia è usata davvero,
// precaricarle tutte significherebbe scaricare ~260 KB per niente. Quando i ruoli
// si chiudono, si mette `preload: true` solo su quelle presenti above the fold.
//
// I `fallback` sono ripetuti per esteso in ogni chiamata e non estratti in una
// costante: next/font analizza questi argomenti staticamente a build time e
// accetta solo letterali scritti a mano.

/** Serif editoriale — candidata al ruolo di "voce". */
export const ppHatton = localFont({
  src: [{ path: "../app/fonts/pp-hatton-medium.woff2", weight: "500", style: "normal" }],
  variable: "--font-pp-hatton",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Grottesca, taglio ottico da display. */
export const ppFrama = localFont({
  src: [{ path: "../app/fonts/pp-frama-extralight.woff2", weight: "200", style: "normal" }],
  variable: "--font-pp-frama",
  display: "swap",
  preload: false,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/** Grottesca, taglio ottico da testo — l'alternativa da confrontare a corpo 16. */
export const ppFramaText = localFont({
  src: [{ path: "../app/fonts/pp-frama-text-regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-pp-frama-text",
  display: "swap",
  preload: false,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/** Monospaziata — metadati, numerazione, apparato d'archivio. */
export const ppAir = localFont({
  src: [
    { path: "../app/fonts/pp-air-extralight-mono.woff2", weight: "200", style: "normal" },
    { path: "../app/fonts/pp-air-medium-mono.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-pp-air",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/** Grottesca geometrica. */
export const ppObjectSans = localFont({
  src: [
    { path: "../app/fonts/pp-object-sans-regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/pp-object-sans-heavy.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-pp-object-sans",
  display: "swap",
  preload: false,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/** Neo-grottesca, taglio da testo — candidata al ruolo di "struttura". */
export const neueHaasText = localFont({
  src: [
    { path: "../app/fonts/neue-haas-text-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/neue-haas-text-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-neue-haas-text",
  display: "swap",
  preload: false,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/** Neo-grottesca, taglio da display. */
export const neueHaasDisplay = localFont({
  src: [
    { path: "../app/fonts/neue-haas-display-700.woff2", weight: "700", style: "normal" },
    { path: "../app/fonts/neue-haas-display-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-neue-haas-display",
  display: "swap",
  preload: false,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

/** Tutte le variabili, da applicare una volta sola sull'elemento radice. */
export const fontVariables = [
  ppHatton.variable,
  ppFrama.variable,
  ppFramaText.variable,
  ppAir.variable,
  ppObjectSans.variable,
  neueHaasText.variable,
  neueHaasDisplay.variable,
].join(" ");
