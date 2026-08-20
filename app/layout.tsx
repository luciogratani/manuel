import type { Metadata } from "next";
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
    <html lang="it" className={fontVariables}>
      {/* L'header sta qui e non nelle pagine: è ciò che gli permette di NON
          rimontarsi cambiando rotta. Durante una transizione fra pagine resta
          fermo mentre il corpo cambia — non perché sia animato bene, ma
          perché non ha niente da far scattare. */}
      <body>
        <Testa />
        {children}
      </body>
    </html>
  );
}
