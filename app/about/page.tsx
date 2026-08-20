import { OPERE } from "@/lib/opere";
import { FINE, INIZIO } from "@/lib/timeline";
import styles from "./page.module.css";

// La bio. Questo sito tratta ogni cosa come un record d'archivio — un'opera ha
// un numero, un anno, un medium, un luogo, e un apparato che li dispone in
// colonne accanto al materiale. La bio riceve lo stesso trattamento, applicato
// all'autore: non è una citazione di stile, è la coerenza del sistema.
//
// La differenza è che qui NON C'È materiale. Non esiste un ritratto in
// `public/media` e non se ne inventa uno, quindi è il testo a fare da
// materiale e l'apparato gli sta accanto come starebbe accanto a una lastra.
//
// ── I numeri non si scrivono, si derivano ───────────────────────────────────
// Il segnaposto che c'era qui prima diceva "Ventisei opere": l'archivio ne
// contiene ventuno. Il §3.3 progetta una sequenza 01→26, ma cinque di quelle
// opere non sono ancora in `lib/opere.ts`, e una pagina che dichiara un numero
// a mano mente appena i dati si muovono. Conteggio, arco e medium vengono da
// `OPERE` e da `INIZIO`/`FINE`: quando l'archivio cresce, la bio lo sa.
//
// Tutto ciò che non è derivabile è segnaposto DICHIARATO — `—` per i dati che
// la curatela deve ancora dare, e l'ultimo paragrafo che lo dice a parole,
// come già fanno le altre pagine del repo.

/** L'opera che è formazione: sta in archivio come le altre (§3.3 non separa la
 *  ricerca dal resto), e da lì la bio la rilegge come dato biografico invece
 *  di tenerne una seconda copia qui. */
const FORMAZIONE = OPERE.find((o) => o.medium === "formazione");

/** I medium davvero presenti in archivio, meno la formazione — che nella
 *  colonna dei dati è già una riga a sé — e meno i `—` non ancora compilati. */
const MEDIUM = [...new Set(OPERE.map((o) => o.medium))].filter(
  (m) => m !== "—" && m !== "formazione",
);

const DATI: [string, string][] = [
  ["nato", "ITA, 1986"],
  ["base", "—"],
  ["pratica", "moda, sartoria, performance"],
  [
    "formazione",
    FORMAZIONE ? `${FORMAZIONE.titolo}, ${FORMAZIONE.luogo}, ${FORMAZIONE.anno}` : "—",
  ],
];

export default function Page() {
  return (
    <div className={styles.pagina}>
      {/* Il nome apre il record, come il titolo apre un'opera. È anche ciò che
          tiene il §2.1 su questa pagina: `manuel` sta nell'header, e qui
          accanto c'è per esteso. */}
      <h1 className={styles.nome}>Manuel Casati</h1>

      {/* La voce. È l'unica riga del sito in cui una persona parla in prima
          persona invece di essere schedata, ed è il posto dove PP Hatton —
          dichiarata in `lib/fonts.ts` «candidata al ruolo di voce» e finora
          mai usata — prende finalmente quel ruolo. Tutto il resto della pagina
          resta l'apparato a 14px del sito.

          MOCK: frase da riscrivere con la curatela. */}
      <p className={styles.voce}>
        «La sartoria è una forma di ascolto: prende le misure di un corpo e gli
        restituisce uno sguardo.»
      </p>

      {/* MOCK: i primi due paragrafi sono segnaposto scritti nel registro del
          sito. Il secondo però dice una cosa vera e verificabile in
          `lib/opere.ts`: la numerazione è unica e cronologica, e non separa le
          commesse dalla ricerca. */}
      <div className={styles.dichiarazione}>
        <p className={styles.paragrafo}>
          Lavora fra moda, sartoria, performance e ricerca sul corpo. Le opere
          nascono quasi sempre da un indumento — costruito, disfatto, indossato
          da qualcun altro — e finiscono in fotografia, in video o in una
          stanza.
        </p>
        <p className={styles.paragrafo}>
          Tiene un archivio solo invece di distinguere fra progetti, commesse e
          ricerca: la numerazione è cronologica e non dichiara quale delle tre
          sia stata l&apos;origine di un lavoro.
        </p>
        <p className={styles.paragrafo}>Testo da scrivere con la curatela.</p>
      </div>

      {/* La persona, nell'idioma dell'apparato delle work page. */}
      <dl className={styles.dati}>
        {DATI.map(([voce, valore]) => (
          <div key={voce} className={styles.dato}>
            <dt className={styles.etichetta}>{voce}:</dt>
            <dd>{valore}</dd>
          </div>
        ))}
      </dl>

      {/* L'archivio, allineato al margine destro come la nota delle work page.
          Nessun dato scritto a mano: tutto viene da `lib/opere.ts` e
          `lib/timeline.ts`. I contatti arriveranno qui quando ci saranno —
          inventarne di finti è peggio che non averne. */}
      <div className={styles.archivio}>
        <p className={styles.etichetta}>in archivio</p>
        <p>{OPERE.length} opere</p>
        <p>
          {INIZIO} — {FINE}
        </p>
        <p className={styles.medium}>{MEDIUM.join(", ")}</p>
      </div>

      <footer className={styles.piede}>
        <p>about</p>
        {/* Le altre pagine mettono qui l&apos;anagrafe; su questa il nome è già
            il titolo del record, quindi il piede porta l&apos;arco invece di
            ripeterlo. */}
        <p>
          {INIZIO} — {FINE}
        </p>
      </footer>
    </div>
  );
}
