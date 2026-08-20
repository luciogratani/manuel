import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { AVORIO } from "@/lib/movimento";
import { Testa } from "@/components/testa";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manuel Casati",
  description: "",
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
        {/* Il cambio pagina (§3.4): una dissolvenza, non un taglio. L'header
            sta FUORI ed è la ragione per cui: è la stessa riga su tutte le
            pagine, quindi cambiando rotta non si esce da nessuna parte, ed è
            variazione interna e non passaggio di stato. */}
        <ViewTransition default="pagina">{children}</ViewTransition>
      </body>
    </html>
  );
}
