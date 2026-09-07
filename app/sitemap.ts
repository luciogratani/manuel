import type { MetadataRoute } from "next";
import { OPERE } from "@/lib/opere";
import { SITO } from "@/lib/sito";

// La mappa del sito, DERIVATA e non scritta: le opere vengono da `OPERE`, come
// il conteggio di /about e le voci di /works. Quando l'archivio cresce, la
// mappa lo sa — che è l'unica ragione per cui vale la pena averla in codice
// invece che in un file statico.
//
// ── COSA NON C'È DENTRO ─────────────────────────────────────────────────────
// Le viste ravvicinate, `/works/[slug]/[n]`: sono trecentotrentaquattro, e
// ognuna porta una fotografia sola dentro la stessa cornice. Per un motore
// sono pagine sottili e quasi identiche fra loro, e sommergerebbero le
// ventitré che contano davvero. Chi arriva alla work page le trova tutte
// cliccando: non sono nascoste, semplicemente non si annunciano una per una.
//
// ── LE PRIORITÀ NON SONO UN'OPINIONE ────────────────────────────────────────
// `priority` dice a un motore come pesare le pagine FRA LORO, dentro questo
// sito. L'indice e la home valgono 1, le opere 0.8 — sono il contenuto —, le
// pagine di servizio meno. `/legali` sta in fondo perché è una nota, non una
// destinazione.
//
// Finché `app/robots.ts` blocca tutto questa mappa non invita nessuno: sta
// pronta per il giorno in cui il blocco cade.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, SITO).toString();

  return [
    { url: url("/"), priority: 1, changeFrequency: "monthly" },
    { url: url("/works"), priority: 1, changeFrequency: "monthly" },
    { url: url("/timeline"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/about"), priority: 0.7, changeFrequency: "yearly" },
    { url: url("/cv"), priority: 0.6, changeFrequency: "yearly" },
    { url: url("/legali"), priority: 0.2, changeFrequency: "yearly" },
    ...OPERE.map((opera) => ({
      url: url(`/works/${opera.slug}`),
      priority: 0.8,
      changeFrequency: "yearly" as const,
    })),
  ];
}
