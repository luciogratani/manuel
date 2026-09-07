import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { AVORIO } from "@/lib/movimento";
import { SITO } from "@/lib/sito";
import { Cursore } from "@/components/cursore";
import { Testa } from "@/components/testa";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// ── PERCHÉ IL SITO NON SI FA INDICIZZARE ────────────────────────────────────
// `index: false` non è una svista né una precauzione generica: indicizzare
// significa mandare le fotografie in Google Immagini, e questo archivio
// pubblica ritratti di persone identificabili. L'art. 96 L. 633/1941 chiede il
// consenso della persona ritratta, `APERTI.md` dice che le liberatorie non
// sono ancora state raccolte, e `/legali` è una bozza mai letta da un legale.
//
// Così il sito si può pubblicare e mandare a curatori e open call — chi ha il
// link lo apre — senza che finisca nei motori. È una riga, e si toglie il
// giorno in cui quella parte è chiusa. Il resto dei metadati è già pronto per
// quel giorno: toglierla è l'unica cosa da fare.
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
  robots: { index: false, follow: false },
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
