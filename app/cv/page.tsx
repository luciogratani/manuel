import Link from "next/link";
import styles from "./page.module.css";

// Il curriculum: una pagina che lo OSPITA e lo dà da scaricare.
//
// ── Perché una route e non un link diretto al PDF ───────────────────────────
// Un `<a href="/cv/....pdf">` nel piede avrebbe funzionato, ma avrebbe portato
// chi lo apre fuori dal sito dentro il visore del browser, senza titolo, senza
// data e senza un modo di tornare indietro. Qui il file è un record come gli
// altri: ha un apparato che dice cos'è e di quando, ha un piede, e da lì si
// scarica. È la stessa scelta di `/legali` — una pagina intera quando la cosa
// da dire non entra in una riga.
//
// ── IL NOME DEL FILE ────────────────────────────────────────────────────────
// La sorgente si chiama `Manuel_Delogu_CV.pdf`. Servito si chiama
// `manuel-casati-cv.pdf`: il §2.1 dice che il nome pubblico è Manuel Casati e
// che l'anagrafe non va in pagina — e l'URL di un file scaricabile È pagina,
// anzi è la sola parte che resta scritta sul computer di chi lo scarica.
// Dentro il PDF il nome è già «Manuel Casati» (lo dice anche il titolo del
// documento): era solo il nome del file a portare l'altro.
//
// ── L'email ─────────────────────────────────────────────────────────────────
// Il PDF porta in testa `manuelcasati89@gmail.com`, e per un po' il sito ne ha
// mostrato un altro (`hello@manuelcasati.it`, una casella di servizio mai
// aperta): chi scaricava il curriculum si trovava due strade diverse per la
// stessa persona. Dal 9 settembre 2026 il sito usa quella del PDF — `EMAIL` in
// `lib/sito.ts` — quindi qui non c'è più niente da riconciliare.

export const metadata = {
  alternates: { canonical: "/cv" },
  title: "Curriculum",
  // Propria e non ereditata dalla home: è la pagina che si cerca per nome, e
  // dice cosa si trova QUI — un CV da scaricare — non cos'è il sito.
  description:
    "Il curriculum di Manuel Casati in PDF: mostre, performance, sfilate e " +
    "collaborazioni dal 2013, con formazione e contatti.",
};

/** Il file servito. Il nome vive qui una volta sola: lo usano il visore, il
 *  collegamento di scarico e il nome con cui il file arriva sul disco. */
const FILE = "/cv/manuel-casati-cv.pdf";

/** Dalla sorgente, non dall'occhio: `pdfinfo` dà due pagine A4 e la data di
 *  creazione, `du` la taglia. Come le misure dei derivati, si leggono dallo
 *  strumento e si scrivono qui. */
const SCHEDA: [string, string][] = [
  ["formato", "PDF, 2 pagine A4"],
  ["peso", "3,2 MB"],
  ["aggiornato", "2 settembre 2026"],
];

export default function Page() {
  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <h1 className={styles.titolo}>Curriculum</h1>

        <p className={styles.testo}>
          Il curriculum di Manuel Casati: profilo, competenze, esperienze,
          istruzione. Si può leggere qui sotto o scaricare.
        </p>

        {/* Il record del file, nell'idioma dell'apparato delle work page. */}
        <dl className={styles.scheda}>
          {SCHEDA.map(([voce, valore]) => (
            <div key={voce} className={styles.riga}>
              <dt className={styles.etichetta}>{voce}:</dt>
              <dd>{valore}</dd>
            </div>
          ))}
        </dl>

        {/* `download` porta il file sul disco invece di aprirlo nel visore, e
            gli dà il nome pubblico. Il testo del collegamento dice cosa
            succede — non «qui», che a un lettore di schermo non dice niente. */}
        <p className={styles.scarico}>
          <a className={styles.bottone} href={FILE} download>
            Scarica il curriculum (PDF, 3,2 MB)
          </a>
        </p>
      </div>

      {/* Il visore. `<object>` e non `<iframe>`: se il browser un lettore di
          PDF non ce l'ha — succede su parecchi telefoni — mostra il contenuto
          di riserva invece di una cornice vuota, e lì dentro c'è di nuovo il
          collegamento. Il titolo lo annuncia a chi naviga a voce. */}
      <object
        className={styles.visore}
        data={FILE}
        type="application/pdf"
        aria-label="Curriculum di Manuel Casati"
      >
        <p className={styles.testo}>
          Il browser non mostra i PDF in pagina.{" "}
          <a className={styles.rimando} href={FILE} download>
            Scarica il curriculum
          </a>
          .
        </p>
      </object>

      <footer className={styles.piede}>
        <p>curriculum</p>
        <p>
          <Link className={styles.rimando} href="/about">
            about
          </Link>
        </p>
      </footer>
    </div>
  );
}
