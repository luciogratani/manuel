import { Player } from "./player";
import { PiedeHome } from "./piede-home";
import styles from "./page.module.css";

// La soglia. Una schermata sola e ferma, come le altre: la home a due
// schermate è stata scartata, e senza niente sotto la piega uno scorrimento
// da cinquanta pixel era solo rumore. Se un giorno tornerà del contenuto sotto
// — ed è lì che entrerebbe Lenis, non GSAP — sono due righe da riaprire.
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
          l'anagrafe sta qui. Il piede ha un ingresso suo — vedi
          `piede-home.tsx` — che arriva dopo la sequenza dell'header e non
          prima: la regola resta vera perché non parte mai da opacità zero,
          solo più enfatizzata a fine sequenza. */}
      <PiedeHome />
    </div>
  );
}
