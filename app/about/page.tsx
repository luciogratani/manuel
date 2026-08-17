import Link from "next/link";
import styles from "./page.module.css";

// Segnaposto. Esiste perché la nav non abbia link morti; il contenuto lo
// scriverà la curatela.

export default function Page() {
  return (
    <div className={styles.pagina}>
      <header className={styles.testa}>
        <Link href="/">manuel</Link>
        <p className={styles.percorso}>about</p>
      </header>

      <div className={styles.corpo}>
        <h1 className={styles.titolo}>Manuel Casati</h1>
        <p className={styles.testo}>
          ITA, 1986. Artista fra moda, sartoria, performance e ricerca sul
          corpo. Ventisei opere fra il 2010 e il 2026.
        </p>
        <p className={styles.testo}>Testo da scrivere.</p>
      </div>

      <footer className={styles.piede}>
        <Link href="/">
          <span className={styles.freccia} aria-hidden="true">
            ←
          </span>
          home
        </Link>
        <p>Manuel Casati</p>
      </footer>
    </div>
  );
}
