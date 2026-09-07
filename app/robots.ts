import type { MetadataRoute } from "next";
import { SITO } from "@/lib/sito";

// ── IL SITO NON SI FA INDICIZZARE, ED È DELIBERATO ──────────────────────────
// Indicizzare vuol dire mandare le fotografie in Google Immagini, e questo
// archivio pubblica ritratti di persone identificabili. L'art. 96 L. 633/1941
// chiede il consenso della persona ritratta; `APERTI.md` dice che le
// liberatorie non sono ancora state raccolte, e `/legali` dichiara sé stessa
// una bozza mai letta da un legale.
//
// Il blocco lascia il sito perfettamente utilizzabile: chi ha il link lo apre,
// e un link si manda a un curatore o dentro una open call senza passare da un
// motore. Toglie solo la parte che non si può richiamare indietro — una
// fotografia entrata nella cache di un motore ci resta anche dopo che l'hai
// tolta dal sito.
//
// ── COME SI TOGLIE ──────────────────────────────────────────────────────────
// Due righe, in due file: qui `disallow` torna `[]`, e in `app/layout.tsx`
// sparisce `robots: { index: false }`. Tutto il resto — sitemap, titoli per
// opera, immagini delle anteprime — è già scritto per quel giorno e comincia a
// funzionare da solo.
//
// La sitemap resta dichiarata anche adesso: non invita nessuno a entrare
// finché il `disallow` regge, ed è pronta quando cadrà.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: new URL("/sitemap.xml", SITO).toString(),
  };
}
