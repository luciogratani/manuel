import Link from "next/link";
import { Copia } from "@/components/copia";
import { Marchio } from "@/components/marchio";
import { ROSSO } from "@/lib/movimento";
import { OPERE } from "@/lib/opere";
import { FINE, INIZIO } from "@/lib/timeline";
import styles from "./page.module.css";

// La bio, in due schermate alte quanto la finestra.
//
//   1. LA SCHEDA — l'autore trattato come un record d'archivio.
//   2. LA CHIUSURA — il rosso, il marchio a tutta larghezza, i contatti.
//
// ── La scheda ────────────────────────────────────────────────────────────────
// Questo sito tratta ogni cosa come un record: un'opera ha un numero, un anno,
// un medium, un luogo, e un apparato che li dispone in colonne accanto al
// materiale. La bio riceve lo stesso trattamento, applicato all'autore — non è
// una citazione di stile, è la coerenza del sistema. La differenza è che qui
// NON C'È materiale: non esiste un ritratto in `public/media` e non se ne
// inventa uno, quindi è il testo a fare da materiale.
//
// ── I numeri non si scrivono, si derivano ───────────────────────────────────
// Il segnaposto che c'era qui prima diceva "Ventisei opere": l'archivio ne
// contiene ventuno. Il §3.3 progetta una sequenza 01→26, ma cinque di quelle
// opere non sono ancora in `lib/opere.ts`, e una pagina che dichiara un numero
// a mano mente appena i dati si muovono. Conteggio, arco e medium vengono da
// `OPERE` e da `INIZIO`/`FINE`: quando l'archivio cresce, la bio lo sa.
//
// Tutto ciò che non è derivabile è segnaposto DICHIARATO.

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

const TELEFONO = "+39 345 871 9638";
const EMAIL = "hello@manuelcasati.it";

const PROFILI: [string, string][] = [
  ["Instagram", "https://www.instagram.com/manuelcasatidegliamman_/"],
  ["Facebook", "https://www.facebook.com/p/Manuel-Casati-100066875731669/"],
];

export default function Page() {
  return (
    <div className={styles.pagina}>
      <section className={styles.scheda}>
        {/* Il nome apre il record, come il titolo apre un'opera. È anche ciò
            che tiene il §2.1 su questa pagina: `manuel` sta nell'header, e qui
            accanto c'è per esteso. */}
        <h1 className={styles.nome}>Manuel Casati</h1>

        {/* La voce. È l'unica riga del sito in cui una persona parla in prima
            persona invece di essere schedata, ed è il posto dove PP Hatton —
            dichiarata in `lib/fonts.ts` «candidata al ruolo di voce» e finora
            mai usata — prende finalmente quel ruolo.

            MOCK: frase da riscrivere con la curatela. */}
        <p className={styles.voce}>
          «La sartoria è una forma di ascolto: prende le misure di un corpo e
          gli restituisce uno sguardo.»
        </p>

        {/* MOCK: i primi due paragrafi sono segnaposto scritti nel registro del
            sito. Il secondo però dice una cosa vera e verificabile in
            `lib/opere.ts`: la numerazione è unica e cronologica, e non separa
            le commesse dalla ricerca. */}
        <div className={styles.dichiarazione}>
          <p className={styles.paragrafo}>
            Lavora fra moda, sartoria, performance e ricerca sul corpo. Le opere
            nascono quasi sempre da un indumento — costruito, disfatto,
            indossato da qualcun altro — e finiscono in fotografia, in video o
            in una stanza.
          </p>
          <p className={styles.paragrafo}>
            Tiene un archivio solo invece di distinguere fra progetti, commesse
            e ricerca: la numerazione è cronologica e non dichiara quale delle
            tre sia stata l&apos;origine di un lavoro.
          </p>
          <p className={styles.paragrafo}>Testo da scrivere con la curatela.</p>
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

        {/* L'archivio, allineato al margine destro come la nota delle work
            page. Nessun dato scritto a mano. */}
        <div className={styles.archivio}>
          <p className={styles.etichetta}>in archivio</p>
          <p>{OPERE.length} opere</p>
          <p>
            {INIZIO} — {FINE}
          </p>
          <p className={styles.medium}>{MEDIUM.join(", ")}</p>
        </div>

        {/* L'invito alla seconda schermata vive nel piede, al posto
            dell'arco di anni che l'archivio già dice qui sopra. È un àncora
            vero e non un ornamento: cliccandolo la pagina ci arriva, e chi
            naviga col tab lo trova come qualunque link. Senza, due schermate
            senza alcun segnale che ce ne sia una seconda. */}
        <footer className={styles.piede}>
          <p>about</p>
          <a className={styles.invito} href="#contatti">
            contact
          </a>
        </footer>
      </section>

      {/* ── La chiusura ───────────────────────────────────────────────────────
          Il rosso qui è una SUPERFICIE, e va detto: il §2.3 lo vuole solo nel
          taglio, «non colora l'interfaccia». Questa schermata è l'eccezione
          voluta — l'accento che si prende l'ultima parola invece di lampeggiare
          per un istante — e finché resta l'unica il resto della regola tiene.

          Il colore arriva da `ROSSO` in lib/movimento: è lo stesso della tenda,
          e averne una sorgente sola significa che non potranno divergere. */}
      <section
        id="contatti"
        className={styles.chiusura}
        // `data-fondo="colore"` non è decorativo: è il segnale con cui
        // l'header condiviso si accorge di trovarsi sopra una tinta e passa
        // all'avorio (vedi components/testa.tsx).
        data-fondo="colore"
        style={{ "--rosso": ROSSO } as React.CSSProperties}
      >
        <div className={styles.colonne}>
          <div className={styles.colonna}>
            <p className={styles.etichetta}>contatti</p>
            {/* Si copiano al clic invece di aprire il telefono o il client di
                posta: da desktop un `tel:` non porta da nessuna parte e un
                `mailto:` apre spesso il programma sbagliato, mentre il numero
                negli appunti serve sempre. */}
            <p>
              <Copia valore={TELEFONO} azione="il numero" />
            </p>
            <p>
              {/* Da desktop un `mailto:` apre spesso il programma sbagliato
                  (o nessuno) — copiare l'indirizzo è più affidabile, quindi
                  resta l'unico comportamento sopra la soglia compatta. Su un
                  telefono un `mailto:` apre la app di posta configurata, che
                  lì è quasi sempre quella giusta: sotto la soglia il link
                  vero sostituisce la copia, il numero resta invariato — è
                  già utile com'è, un `tel:` non aggiungerebbe niente che il
                  copia-e-incolla in un dialer non faccia già. */}
              <Copia valore={EMAIL} azione="l'email" className={styles.emailCopia} />
              <a className={styles.emailMobile} href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </p>
          </div>

          {/* `rel="noreferrer"` con `target="_blank"`: il primo evita che la
              scheda aperta possa manipolare questa attraverso `window.opener`,
              il secondo è la convenzione per un profilo che sta fuori dal
              sito. Sono i primi link esterni del progetto. */}
          <div className={styles.colonna}>
            <p className={styles.etichetta}>seguire</p>
            {PROFILI.map(([nome, href]) => (
              <p key={nome}>
                <a className={styles.rimando} href={href} target="_blank" rel="noreferrer">
                  {nome}
                </a>
              </p>
            ))}
          </div>

          <div className={styles.colonna}>
            <p className={styles.etichetta}>legali</p>
            <p>
              <Link className={styles.rimando} href="/legali">
                Note legali
              </Link>
            </p>
          </div>

          {/* La quarta colonna del riferimento era una newsletter, che qui non
              esiste. Invece di lasciarla vuota o di inventare un servizio,
              porta l'unica cosa che questa pagina sa e nessun'altra dice: da
              dove viene il nome. È anche ciò che prepara la citazione in
              fondo, che altrimenti arriverebbe senza spiegazione. */}
          <div className={styles.colonna}>
            <p className={styles.etichetta}>il nome</p>
            <p>
              Delogu di nascita. Casati per scelta, dalla Marchesa Luisa Casati
              (1881–1957).
            </p>
          </div>
        </div>

        {/* Il marchio a tutta larghezza, debordante di poco dai due lati: è la
            firma della pagina, non un logo da leggere daccapo. */}
        <Marchio className={styles.insegna} />

        <figure className={styles.citazione}>
          <blockquote>
            <p>«Voglio essere un&apos;opera d&apos;arte vivente.»</p>
          </blockquote>
          <figcaption>Luisa Casati</figcaption>
        </figure>
      </section>
    </div>
  );
}
