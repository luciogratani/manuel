import { Player } from "./player";
import styles from "./page.module.css";

// La soglia. Unica pagina a scorrimento verticale nativo: è qui che entrerà
// Lenis, non GSAP.
//
// Il player è un rettangolo 3:2. La gestione dei video (§8) è il problema
// irrisolto del progetto e non si affronta da qui.
//
// La nav non è più qui: è l'header del sito (`components/testa.tsx`), che vive
// nel layout. Su questa pagina — e solo su questa — l'header entra in scena
// invece di esserci già, e la pagina se ne accorge in un punto solo: il
// ritardo della tenda del player.

export default function Page() {
  return (
    <div className={styles.pagina}>
      <section className={styles.soglia}>
        {/* Il caso d'origine della tenda: il player non compare, viene
            scoperto. La taglia sta sul telaio, non sul contenitore, così la
            tenda si misura da ciò che copre. */}
        <Player />
      </section>

      {/* §2.1: `manuel` non compare mai in una schermata dove `Manuel Casati`
          non sia leggibile da qualche parte. In alto c'è il marchio, quindi
          l'anagrafe sta qui — e proprio per questo il piede non è animato: è
          l'unica cosa già presente mentre il marchio deve ancora comparire,
          che è il solo modo di tenere la regola vera anche durante
          l'ingresso. */}
      <footer className={styles.piede}>
        <p>Manuel Casati</p>
        <p>ITA, 1986</p>
        <p>2010 — 2026</p>
      </footer>
    </div>
  );
}
