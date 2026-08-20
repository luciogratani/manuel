"use client";

import { Tenda } from "@/components/tenda";
import { ATTERRATO_SULLA_SOGLIA, SOGLIA } from "@/lib/movimento";
import styles from "./page.module.css";

// Il player, e l'unico motivo per cui è un componente client: il ritardo della
// tenda dipende da COME sei arrivato qui.
//
// Atterrando sulla soglia il video si scopre durante il quarto tempo della
// sequenza, mentre la riga si divide. Arrivandoci da un'altra pagina la
// sequenza non c'è — l'header è già al suo posto — e la tenda non deve
// aspettare nessuno: lì è semplicemente la transizione del corpo.

export function Player() {
  return (
    <Tenda
      className={styles.player}
      ritardo={ATTERRATO_SULLA_SOGLIA ? SOGLIA.attesa + SOGLIA.tVideo : 0}
    >
      <div className={styles.telaio} />
    </Tenda>
  );
}
