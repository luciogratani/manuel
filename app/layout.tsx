import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { AVORIO } from "@/lib/movimento";
import { SITO } from "@/lib/sito";
import { Cursore } from "@/components/cursore";
import { Testa } from "@/components/testa";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Il sito SI FA INDICIZZARE. C'era un `robots: { index: false }` qui e un
// `Disallow: /` in `app/robots.ts`, messi l'8 settembre 2026 ragionando sulla
// bozza legale — ma era una deduzione, non una decisione di Lucio, e la
// decisione è l'opposto: home, about, cronologia, indice e curriculum sono
// pagine sicure e vanno trovate.
//
// A restare fuori dai motori sono le sole opere che contengono nudo, una per
// una, con il campo `nudo` di `lib/opere.ts`. Il blocco totale, oltre a non
// essere voluto, era anche tecnicamente sbagliato: impedendo la scansione
// nessun robot leggeva il `noindex` della pagina, e i robot delle anteprime —
// WhatsApp, X, Slack — non prendevano nemmeno la card.
export const metadata: Metadata = {
  metadataBase: SITO,
  title: {
    default: "Manuel Casati",
    // Le pagine che dichiarano un titolo proprio lo vedono completato qui, così
    // il nome non va scritto ventitré volte.
    template: "%s — Manuel Casati",
  },
  description:
    "Archivio di Manuel Casati: moda, sartoria, performance e ricerca sul " +
    "corpo. Ventitré opere dal 2013, in ordine cronologico.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Manuel Casati",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `--avorio` sull'elemento radice perché la dissolvenza fra pagine vive
    // nei pseudo-elementi di `::view-transition`, che stanno fuori dall'albero
    // e non ereditano da nessuna pagina. Arriva comunque da `AVORIO`: il
    // foglio non ne tiene una copia.
    <html lang="it" className={fontVariables} style={{ "--avorio": AVORIO } as CSSProperties}>
      {/* L'header sta qui e non nelle pagine: è ciò che gli permette di NON
          rimontarsi cambiando rotta. Durante una transizione fra pagine resta
          fermo mentre il corpo cambia — non perché sia animato bene, ma
          perché non ha niente da far scattare. */}
      <body>
        <Testa />
        {/* Fuori da `<ViewTransition>` per la stessa ragione dell'header: resta
            fermo e non ha niente da far scattare cambiando rotta. Il gruppo
            `root` che lo riceve è già congelato in app/globals.css. */}
        <Cursore />
        {/* Il cambio pagina (§3.4): una dissolvenza, non un taglio. L'header
            sta FUORI ed è la ragione per cui: è la stessa riga su tutte le
            pagine, quindi cambiando rotta non si esce da nessuna parte, ed è
            variazione interna e non passaggio di stato. */}
        <ViewTransition default="pagina">{children}</ViewTransition>
      </body>
    </html>
  );
}
