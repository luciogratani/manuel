import type { MetadataRoute } from "next";
import { SITO } from "@/lib/sito";

// I motori possono entrare. Il blocco totale che c'era qui — `Disallow: /` —
// non era una scelta di Lucio ma una mia deduzione dalla bozza legale, ed è
// stato tolto l'8 settembre 2026.
//
// Era anche il modo sbagliato di ottenere quello che sembrava servire. Un
// `Disallow` impedisce la SCANSIONE, non l'indicizzazione: il robot non entra,
// quindi non legge il `noindex` scritto nella pagina, e può indicizzare
// l'indirizzo lo stesso se lo trova linkato altrove — una riga vuota senza
// titolo. Per non farsi catalogare bisogna al contrario farsi leggere.
//
// E i robot delle anteprime (WhatsApp, X, Slack, Facebook) rispettano questo
// file: bloccandoli non prendevano la card, e i link condivisi mostravano
// l'URL nudo.
//
// Ciò che resta fuori dai motori sono le singole opere con nudo, dichiarate
// nel campo `nudo` di `lib/opere.ts`: portano `noindex` nella loro pagina e
// non compaiono nella mappa. È il posto giusto per quella decisione, perché è
// una decisione per opera e non per sito.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", SITO).toString(),
  };
}
