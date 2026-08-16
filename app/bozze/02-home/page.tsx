import Link from "next/link";
import styles from "./page.module.css";

// Bozza 02 — home. Ricostruzione statica dell'artboard.
//
// Unica delle bozze a scorrimento verticale nativo: è la pagina dove entrerà
// Lenis, non GSAP. Per questo non è `position: fixed` come le altre — il
// documento scorre davvero.
//
// Il player è un rettangolo 3:2, come concordato: la gestione dei video (§8
// della guida) è il problema irrisolto del progetto e non si affronta qui.

// `archivio` punta a una route non ancora costruita: l'indice torna al disegno
// originale (griglia numerata) e aspetta l'artboard a risoluzione piena.
const NAV = [
  ["home", "/bozze/02-home"],
  ["bio", "/bozze/05-timeline"],
  ["about", "/bozze/02-home"],
  ["archivio", "/bozze/03-archivio"],
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

      {/* Il footer è anche il posto dove il nome completo deve essere leggibile:
          §2.1 dice che `manuel` non compare mai in una schermata dove
          `Manuel Casati` non sia da qualche parte. In alto c'è solo il marchio,
          quindi l'anagrafe sta qui. Contenuto provvisorio. */}
      <footer className={styles.piede}>
        <p>Manuel Casati</p>
        <p>ITA, 1986</p>
        <p>2010 — 2026</p>
      </footer>
    </div>
  );
}
