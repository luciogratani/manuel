import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { RAPPORTO, formato, numerato, type Opera } from "@/lib/opere";
import styles from "./page.module.css";

// La versione dell'indice sotto la soglia compatta (vedi app/globals.css).
//
// Non è il motore con lo scorrimento smorzato: è una griglia in flusso
// verticale nativo. La ragione non è solo di spazio — è che la banda sotto la
// griglia (banda.tsx) non mostra niente senza hover, per design esplicito, e
// su touch l'hover non esiste. Qui il titolo sta sotto ogni lastra sempre,
// non solo quando ci passa sopra un mouse che non c'è.
export function IndiceCompatta({ opere }: { opere: Opera[] }) {
  return (
    <div className={styles.indiceCompatta}>
      {opere.map((opera) => {
        const copertina = opera.scatti[0];
        const f = formato(copertina.w, copertina.h);
        return (
          <Link key={opera.slug} className={styles.compattaCella} href={`/works/${opera.slug}`}>
            <span className={styles.compattaNumero}>{numerato(opera.numero)}</span>
            <span
              className={styles.compattaLastra}
              style={{ "--ar": RAPPORTO[f] } as CSSProperties}
            >
              <Image
                src={copertina.src}
                alt={opera.titolo}
                fill
                sizes="50vw"
                className={styles.foto}
              />
            </span>
            <span className={styles.compattaTitolo}>{opera.titolo}</span>
          </Link>
        );
      })}
    </div>
  );
}
