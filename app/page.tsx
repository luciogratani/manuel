import Link from "next/link";
import styles from "./page.module.css";

// La soglia. Unica pagina a scorrimento verticale nativo: è qui che entrerà
// Lenis, non GSAP.
//
// Il player è un rettangolo 3:2. La gestione dei video (§8) è il problema
// irrisolto del progetto e non si affronta da qui.

const NAV = [
  ["archivio", "/works"],
  ["timeline", "/timeline"],
  ["about", "/about"],
];

export default function Page() {
  return (
    <div className={styles.pagina}>
      <section className={styles.soglia}>
        <nav className={styles.nav}>
          <span className={styles.marchio}>manuel</span>
          {NAV.map(([voce, href]) => (
            <Link key={voce} href={href}>
              {voce}
            </Link>
          ))}
        </nav>

        <div className={styles.player} />
      </section>

      {/* §2.1: `manuel` non compare mai in una schermata dove `Manuel Casati`
          non sia leggibile da qualche parte. In alto c'è il marchio, quindi
          l'anagrafe sta qui. */}
      <footer className={styles.piede}>
        <p>Manuel Casati</p>
        <p>ITA, 1986</p>
        <p>2010 — 2026</p>
      </footer>
    </div>
  );
}
