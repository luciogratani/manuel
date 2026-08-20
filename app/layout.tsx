import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { ROSSO } from "@/lib/movimento";
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
    // `--rosso` sull'elemento radice perché la tenda della transizione vive
    // nei pseudo-elementi di `::view-transition`, che stanno fuori dall'albero
    // e non ereditano da nessuna pagina. Arriva comunque da `ROSSO`: il foglio
    // non ne tiene una copia.
    <html lang="it" className={fontVariables} style={{ "--rosso": ROSSO } as CSSProperties}>
      {/* L'header sta qui e non nelle pagine: è ciò che gli permette di NON
          rimontarsi cambiando rotta. Durante una transizione fra pagine resta
          fermo mentre il corpo cambia — non perché sia animato bene, ma
          perché non ha niente da far scattare. */}
      <body>
        <Testa />
        {/* La tenda fra pagine (§3.4). L'header sta FUORI: è la stessa riga su
            tutte le pagine, quindi non ha niente da far scattare, e tenerlo
            fermo dà il punto di riferimento che dice che a muoversi è il
            contenuto e non la finestra. */}
        <ViewTransition default="tenda">{children}</ViewTransition>
      </body>
    </html>
  );
}
