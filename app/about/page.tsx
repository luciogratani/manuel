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

// La formazione NON si deriva più da `OPERE`. C'era una costante che cercava
// l'opera con `medium: "formazione"` per rileggerla come dato biografico, ma
// quell'opera in archivio non esiste — la scuola d'arte è fra le voci tenute
// fuori — quindi la riga ha sempre mostrato un trattino. Il dato sta scritto
// qui: non è derivabile, ed è meglio un fatto dichiarato che un campo vuoto in
// attesa di un'opera che non arriverà.
//
// La fonte è il CV (`/cv`). La bio diceva «Istituto d'Arte Filippo Figari»; il
// CV dice «Liceo Artistico Filippo Figari», diploma in Arti Applicate
// 2008–2013, e vince il CV — deciso da Lucio il 7 settembre 2026. La bio qui
// sotto è stata corretta di conseguenza, e adesso concorda anche con la
// descrizione di Apoteosi, che il Liceo lo nominava già col nome giusto.
//
// Questa riga porta invece la formazione più alta, che la bio non nomina: la
// laurea triennale in Comunicazione e Didattica dell'Arte all'Accademia di
// Belle Arti Mario Sironi, 2023–2026. Nell'apparato di una persona
// `formazione` è il titolo più alto, non il primo in ordine di tempo. L'arco
// finisce quest'anno: se il titolo non è ancora conseguito la riga va
// sfumata, ed è una cosa da chiedere a Manuel.

/** I medium davvero presenti in archivio, meno la formazione — che nella
 *  colonna dei dati è già una riga a sé — e meno i `—` non ancora compilati. */
const MEDIUM = [...new Set(OPERE.map((o) => o.medium))].filter(
  (m) => m !== "—" && m !== "formazione",
);

const DATI: [string, string][] = [
  ["nato", "ITA"],
  ["base", "Sassari"],
  ["pratica", "arte, performance, design"],
  ["formazione", "Accademia di Belle Arti Mario Sironi, Sassari"],
];

/** La bio, scritta da Manuel il 7 settembre 2026. Non più un segnaposto.
 *
 *  È RIDOTTA: l'originale è ~2900 battute e la colonna ne regge ~1900 su due
 *  colonne senza arrivare addosso all'apparato in basso. Tagliati i passaggi
 *  che ripetevano un concetto già detto, non i concetti. Il registro è di
 *  Manuel — terza persona, presente — e non è stato riscritto.
 *
 *  Tre cose corrette leggendo, e due che restano da chiedergli:
 *   · corretti: «performonce», «un azione», e i titoli riportati come stanno
 *     in archivio (`Le Rêve — Lever`, `L'Affair`, `Feral`, `Don Giovanni`).
 *   · da chiedere: l'originale dice «Dal 2015 al 2024» per la Corsa Futurista,
 *     ma in archivio le edizioni vanno dal 2015 al 2023 (la V manca). Qui
 *     l'arco è aperto — «dal 2015» — per non scrivere una data che i dati
 *     smentiscono.
 *   · da chiedere: l'originale dà Don Giovanni come «spettacolo di chiusura
 *     della rassegna Senza Sipario al Teatro Genova». Quella riga è stata
 *     tolta dai crediti dell'opera il 7 settembre 2026, quindi qui non c'è: se
 *     è vera va rimessa in tutt'e due i posti, non in uno solo. */
const BIO = [
  "Nato a Sassari. Fin dall'infanzia coltiva un forte interesse per la " +
    "letteratura e la storia, ed è quest'ultima a introdurlo alla storia " +
    "dell'arte attraverso i ritratti dei personaggi che ne stuzzicano la " +
    "curiosità: figure diverse fra loro, in cui trova affinità.",
  "I primi approcci con l'arte sono la scultura, la riproduzione in argilla " +
    "di ciò che lo circonda. Il trasformismo e il teatro sono una scoperta " +
    "che sfocia nella realizzazione di costumi: dapprima un gioco, più tardi " +
    "un linguaggio espressivo.",
  "Lo studio del costume al Liceo Artistico Filippo Figari di Sassari " +
    "affina le sue conoscenze — il figurino, le tecniche di confezionamento " +
    "— e lo porta a organizzare sfilate con abiti dal forte impatto " +
    "teatrale. La sua formazione resta quasi interamente da autodidatta.",
  "Il lavoro si basa sulla ricerca nella storia del costume: rivisita i " +
    "periodi storici guardando ai dettagli che, filtrati da una lente " +
    "moderna, tornano attuali. Nella fotografia, il ritratto diventa il " +
    "mezzo di un'azione performativa bidimensionale.",
  "Un periodo a Milano lo mette in contatto diretto con il mondo dell'arte. " +
    "Dopo un excursus nel fashion design abbandona " +
    "quell'ambiente per dedicarsi alla formazione di artista visivo: un " +
    "lavoro performativo sul corpo maschile e sul desiderio, spesso " +
    "attraverso riletture contemporanee del Settecento francese. " +
    "L'happening è il campo di ricerca, e l'indagine sono le reazioni del " +
    "pubblico.",
  "Fra i suoi lavori Apoteosi (2017), L'Affair (2021), Le Rêve — Lever " +
    "(2022), Funeral Rave (2023), Feral (2024) e Don Giovanni (2025). Dal " +
    "2015 organizza e dirige la Corsa Futurista, evento itinerante di " +
    "Monumenti Aperti.",
];

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

        {/* La voce. È l'unica riga del sito in cui una persona parla invece di
            essere schedata, ed è il posto dove PP Hatton — dichiarata in
            `lib/fonts.ts` «candidata al ruolo di voce» e finora mai usata —
            prende quel ruolo.

            La frase è VERA e non è di Manuel: la dice un suo amico. Prima qui
            c'era un segnaposto in prima persona, scritto da una sessione
            precedente e attribuito a lui dal solo fatto di stare in questa
            pagina — cioè una citazione inventata messa in bocca all'autore.

            Proprio perché non è sua, sotto c'è la riga dell'attribuzione: una
            citazione senza nome, in cima alla pagina di qualcuno, diventa sua.
            Il nome MANCA ed è dichiarato: va chiesto a Manuel. */}
        {/* Lo spazio unificatore fra «ma» e «spogliare» non è un vezzo: senza,
            la riga si spezza dopo «ma» e la congiunzione resta appesa in fondo
            alla prima riga. Legandoli, il capo cade dopo «domande,» — fra le
            due proposizioni, che è dove cade anche il senso — e ci resta a
            qualunque larghezza. */}
        <p className={styles.voce}>
          {"«Non voglio le domande, ma spogliare le risposte.»"}
        </p>
        <p className={styles.attribuzione}>— nome da chiedere a Manuel</p>

        {/* La bio di Manuel, non più segnaposto. Sta su DUE colonne: alla
            misura di una sola (400px, ~58 battute per riga) sarebbero
            cinquanta righe che arriverebbero addosso all'apparato in basso, e
            allargare la riga invece di sdoppiarla avrebbe portato la misura
            oltre le cento battute — leggibile la metà. La metà destra della
            pagina era vuota, quindi lo spazio c'era. */}
        <div className={styles.dichiarazione}>
          {BIO.map((paragrafo, i) => (
            <p key={i} className={styles.paragrafo}>
              {paragrafo}
            </p>
          ))}
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
            <p>
              {/* Da desktop un `mailto:` apre spesso il programma sbagliato
                  (o nessuno) — copiare l'indirizzo è più affidabile, quindi
                  resta l'unico comportamento sopra la soglia compatta. Su un
                  telefono un `mailto:` apre la app di posta configurata, che
                  lì è quasi sempre quella giusta: sotto la soglia il link
                  vero sostituisce la copia. */}
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

          {/* Il curriculum sta qui e non nella navigazione principale: non è
              una quarta sezione accanto ad archivio, timeline e about — è un
              allegato della bio, e chi arriva in fondo a questa pagina è
              esattamente chi lo cerca. Accanto alle note legali perché sono la
              stessa specie di rimando: documenti, non opere. */}
          <div className={styles.colonna}>
            <p className={styles.etichetta}>documenti</p>
            <p>
              <Link className={styles.rimando} href="/cv">
                Curriculum
              </Link>
            </p>
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
