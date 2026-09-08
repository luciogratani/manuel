import Link from "next/link";
import styles from "./page.module.css";

// Le note legali.
//
// ── Perché una pagina e non una colonna ─────────────────────────────────────
// La chiusura di /about ha una colonna "legali" larga un quarto di schermo:
// ci sta un rimando, non un testo. E questo testo ha una funzione precisa che
// una riga non assolve — dire chi risponde delle persone ritratte, e dare a
// chi è ritratto un indirizzo a cui scrivere.
//
// ── BOZZA, e va detto in pagina ─────────────────────────────────────────────
// Quanto segue è scritto con attenzione ma NON è consulenza legale, e il testo
// stesso lo dichiara. Un sito che pubblica ritratti di persone identificabili
// espone il suo autore a una responsabilità reale (artt. 96–97 L. 633/1941,
// art. 10 c.c., GDPR), e una pagina che desse per risolto ciò che non lo è
// sarebbe peggio di nessuna pagina: darebbe una falsa sicurezza proprio dove
// serve quella vera. Va letta da chi di dovere prima della pubblicazione.
//
// ── Cosa il sito fa davvero ─────────────────────────────────────────────────
// Le affermazioni sui dati sono verificate nel codice, non promesse: non c'è
// analitica, non ci sono terze parti, non ci sono moduli. Le sole cose
// memorizzate sono DUE, entrambe sul dispositivo e mai inviate: la preferenza
// del suono della timeline, una chiave in `localStorage` scritta da
// `app/timeline/motore.tsx`; e la posizione dell'indice, una chiave in
// `sessionStorage` scritta da `app/works/motore.tsx`, che serve a non far
// ripartire la striscia da capo quando si torna indietro da un'opera e che
// muore chiudendo la scheda. Se un giorno arriveranno analitica, moduli o un
// servizio esterno, QUESTA PAGINA VA RISCRITTA per prima.

export const metadata = {
  alternates: { canonical: "/legali" },
  title: "Note legali",
  // Chi arriva qui cerca una cosa precisa — di solito come far togliere una
  // propria immagine. La descrizione lo dice subito, invece di ripetere cos'è
  // l'archivio.
  description:
    "Diritti sulle opere, consenso delle persone ritratte e richieste di " +
    "rimozione, natura dei contenuti e trattamento dei dati.",
};

/** L'indirizzo a cui si scrive per le richieste, lo stesso della chiusura di
 *  /about: un canale solo, così non può accadere che uno dei due smetta di
 *  essere letto senza che nessuno se ne accorga. */
const EMAIL = "hello@manuelcasati.it";

export default function Page() {
  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <h1 className={styles.titolo}>Note legali</h1>

        <p className={styles.avvertenza}>
          Bozza in attesa di revisione legale. Il testo descrive come questo
          sito è fatto e come intende comportarsi, ma non è consulenza legale e
          non sostituisce il parere di un professionista.
        </p>

        <section className={styles.sezione}>
          <h2 className={styles.rubrica}>Titolarità</h2>
          <p className={styles.testo}>
            Le opere, le fotografie, i video e i testi pubblicati su questo sito
            sono di Manuel Casati o dei rispettivi autori, e sono protetti dalla
            legge sul diritto d&apos;autore (L. 633/1941). Sono consultabili
            liberamente; non possono essere riprodotti, modificati, ridistribuiti
            o usati a fini commerciali senza autorizzazione scritta.
          </p>
          <p className={styles.testo}>
            Per richieste di riproduzione, stampa, prestito o pubblicazione:{" "}
            <a className={styles.rimando} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            .
          </p>
        </section>

        <section className={styles.sezione}>
          <h2 className={styles.rubrica}>Persone ritratte</h2>
          <p className={styles.testo}>
            Molte delle opere in archivio ritraggono persone identificabili.
            L&apos;art. 96 della legge sul diritto d&apos;autore stabilisce che
            il ritratto di una persona non può essere esposto, riprodotto o messo
            in commercio senza il suo consenso, salvo i casi previsti
            dall&apos;art. 97. Ogni ritratto pubblicato su questo sito lo è con
            il consenso della persona ritratta, raccolto per iscritto quando
            possibile e riferito all&apos;uso espositivo e documentario che
            l&apos;archivio fa dell&apos;opera.
          </p>
          <p className={styles.testo}>
            Il consenso non è definitivo. Chi è ritratto in un&apos;opera può
            chiederne in qualsiasi momento la rimozione, la sostituzione con una
            versione non riconoscibile, o la modifica del testo dell&apos;opera, senza
            dover motivare la richiesta. Basta scrivere a{" "}
            <a className={styles.rimando} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>{" "}
            indicando l&apos;opera. La rimozione dal sito avviene entro pochi
            giorni dalla richiesta; l&apos;opera resta nell&apos;archivio fisico
            ma smette di essere pubblica.
          </p>
          <p className={styles.testo}>
            Chiunque ritenga che un contenuto pubblicato qui leda un proprio
            diritto — d&apos;immagine, d&apos;autore, di riservatezza — può
            segnalarlo allo stesso indirizzo. Le segnalazioni sono valutate e
            riscontrate; in caso di dubbio il contenuto viene oscurato mentre la
            questione è aperta, non dopo.
          </p>
        </section>

        <section className={styles.sezione}>
          <h2 className={styles.rubrica}>Natura dei contenuti</h2>
          <p className={styles.testo}>
            La ricerca di Manuel Casati riguarda il corpo, l&apos;indumento e la
            performance. Alcune opere contengono nudità o rappresentazioni del
            corpo che possono risultare inattese: sono opere d&apos;arte,
            documentate qui nel loro contesto e senza finalità pornografica o
            commerciale.
          </p>
          <p className={styles.testo}>
            Nessuna opera ritrae persone minorenni in contesti di nudità. Le
            opere che coinvolgono minori, se presenti, sono realizzate e
            pubblicate con il consenso di chi ne esercita la responsabilità
            genitoriale.
          </p>
        </section>

        <section className={styles.sezione}>
          <h2 className={styles.rubrica}>Dati personali</h2>
          <p className={styles.testo}>
            Questo sito non raccoglie dati personali. Non usa cookie di
            profilazione né tecnici di terze parti, non ha strumenti di
            analitica, non ospita moduli di contatto, non ha iscrizioni e non
            condivide nulla con servizi esterni.
          </p>
          <p className={styles.testo}>
            Le uniche informazioni memorizzate sono due, e servono entrambe a
            far comportare il sito come chi lo consulta si aspetta. La
            preferenza sul suono della{" "}
            <Link className={styles.rimando} href="/timeline">
              timeline
            </Link>{" "}
            è conservata nella memoria locale del browser perché il sito la
            ricordi alla visita successiva. La posizione raggiunta
            nell&apos;
            <Link className={styles.rimando} href="/works">
              archivio
            </Link>{" "}
            è conservata per la sola sessione, perché tornando indietro da
            un&apos;opera la sequenza riprenda da dove era rimasta invece che
            da capo: si cancella da sé chiudendo la scheda. Nessuna delle due
            lascia il dispositivo, e si rimuovono svuotando i dati del sito
            dalle impostazioni del browser.
          </p>
          <p className={styles.testo}>
            Scrivendo agli indirizzi indicati in queste pagine, il messaggio e i
            dati che contiene sono trattati per rispondere alla richiesta e per
            il tempo necessario a farlo.
          </p>
        </section>

        <section className={styles.sezione}>
          <h2 className={styles.rubrica}>Contatti</h2>
          <p className={styles.testo}>
            Per ogni richiesta relativa a queste note:{" "}
            <a className={styles.rimando} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            .
          </p>
        </section>
      </div>

      <footer className={styles.piede}>
        <p>legali</p>
        <p>
          <Link className={styles.rimando} href="/about">
            about
          </Link>
        </p>
      </footer>
    </div>
  );
}
