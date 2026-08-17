import type { Metadata } from "next";
import { MisuraFinestra } from "@/components/misura-finestra";
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
      <body>
        {children}
        {/* Strumento di sviluppo: non esiste in produzione. */}
        {process.env.NODE_ENV === "development" ? <MisuraFinestra /> : null}
      </body>
    </html>
  );
}
