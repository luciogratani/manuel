# Manuel — Portfolio

Sito-archivio di **Manuel Casati** (ITA) — 23 opere, dal 2013 al 2026, dentro
una cronologia che va dal 2010. Non un portfolio: un archivio digitale curato,
usato anche per open call, residenze e contatti con curatori.

Questo `README` descrive **com'è fatto il sito**. Per lo stato dell'ultima
sessione leggi `HANDOFF.md` (datato, si consuma); per ciò che è deciso o
misurato ma non ancora fatto, `APERTI.md`. La guida di progetto (i `§1`–`§9`
citati nei commenti) è **fuori da questo repository** — vedi `AGENTS.md`.

## Stato

Il sito è costruito: otto route, header e cursore propri, transizione fra
pagine, tre motori di scorrimento, una soglia compatta per il mobile.

I due buchi grossi si sono chiusi a settembre 2026. **I video (§8) sono in
pagina**: `components/filmato.tsx` li mostra, le opere solo-video hanno un
fermo immagine come copertina, e la costante `SENZA_IMMAGINI` non esiste più.
**I testi ci sono tutti**: tutte e ventitré le opere hanno una descrizione
curata, il segnaposto di `descrizioneDi` non si vede più in nessuna pagina.
Il sito ha anche metadati, Open Graph, icone, `robots.ts` e `sitemap.ts`.

Quello che resta aperto è **curatoriale e legale**, non tecnico: le note di
`/legali` sono una bozza mai letta da un legale, e le liberatorie delle persone
ritratte vanno raccolte per rendere vero ciò che quella pagina afferma. La
soglia compatta non ha un artboard di riferimento. Dettaglio in `APERTI.md` e
nei commenti in testa a ogni file.

## Stack e versioni installate

| Pacchetto            | Versione | Note                                                        |
| -------------------- | -------- | ---------------------------------------------------------- |
| next                 | 16.2.12  | App Router, Turbopack (default in 16), Server Components   |
| react / react-dom    | 19.2.8   | `<ViewTransition>` per il cambio pagina (flag sperimentale) |
| typescript           | 5.9.3    |                                                            |
| tailwindcss          | 4.2.4    | v4 CSS-first, via `@tailwindcss/postcss`                    |
| @tailwindcss/postcss | 4.2.4    |                                                            |
| eslint               | 9.39.5   | flat config                                                |
| eslint-config-next   | 16.2.12  | `core-web-vitals` + `typescript`                            |
| gsap                 | 3.15.0   | tutti i plugin inclusi nel pacchetto pubblico (dal 3.13)    |
| @gsap/react          | 2.1.2    | hook `useGSAP` — cleanup automatico delle animazioni in React |
| lenis                | 1.3.25   | **installato, non ancora attivato** (nessuna pagina scorre nativamente) |
| media-chrome         | 4.19.2   | **in uso** in `components/filmato.tsx`; l'hero usa un `<video>` nativo |
| sharp                | 0.34.5   | **non dichiarato**: arriva come `optionalDependency` di Next |

Node richiesto: `>=20.9.0`. Package manager: **pnpm** (`pnpm@10.33.0`, lockfile
`pnpm-lock.yaml`).

## Comandi

```bash
pnpm dev        # dev server (Turbopack)
pnpm build      # build di produzione
pnpm start      # serve la build di produzione
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
```

## Struttura

```
app/
  layout.tsx            html radice: monta <Testa> e <Cursore> FUORI da
                        <ViewTransition>, così non rimontano cambiando rotta
  page.tsx              home — la soglia: una schermata, il player 3:2, il piede
  player.tsx            il video della soglia — un <video> muto in loop, avvolto
                        dalla tenda; media-chrome è installato per il player vero (§8)
  piede-home.tsx        il piede della home, con ingresso proprio
  robots.ts             regole per i motori: il sito si fa scansionare, e sono
                        le singole pagine a dire noindex (vedi APERTI.md)
  sitemap.ts            la mappa, senza le opere tenute fuori dai motori
  globals.css           scala uniforme del sito, --rif-altezza / --pavimento,
                        cursore di sistema spento, gruppo ::view-transition
  fonts/               12 .woff2 locali (Neue Haas, PP Air/Frama/Hatton/Object…)
  about/               scheda + chiusura a schermata rossa piena
  cv/                  il curriculum, che risponde a domande dell'archivio
  works/               l'indice: griglia numerata; la selezione avanza scorrendo
    motore.tsx          GSAP Observer agganciato a .pagina
    banda.tsx, indice-compatta.tsx, contesto.ts
    [slug]/             la mensola: striscia orizzontale delle foto di un'opera
      mensola.tsx        GSAP Observer; sotto la soglia sparisce, foto in pila
      [n]/              il ravvicinato su una singola foto
  timeline/            il nastro: canvas orizzontale di sedici anni
    motore.tsx          GSAP Observer; sotto la soglia diventa elenco verticale
    nastro-vivo.tsx, pannello-materiale.tsx, interruttore-suono.tsx
  legali/              note legali — bozza, non letta da un legale
components/
  testa.tsx            l'header del sito (nel layout, non nelle pagine)
  tenda.tsx            la tenda: il rettangolo rosso che copre e si ritira
  cursore.tsx          cursore custom, si apre in anello sopra un cliccabile
  marchio.tsx          il wordmark inline (currentColor)
  filmato.tsx          il video in pagina (§8): `Muto` nella mensola e
                       nell'indice, con i controlli media-chrome nel ravvicinato
  copia.tsx            un valore che si copia al clic (numero, indirizzo)
lib/
  sito.ts              il dominio, in un modulo SENZA dipendenze: robots.ts e
                       sitemap.ts non possono importare il layout (vedi il file)
  movimento.ts         UNICA sorgente dell'accento rosso e dei fondi; SOGLIA_COMPATTA
  gsap.ts              registrazione centralizzata dei plugin (ScrollTrigger, Observer)
  fonts.ts             next/font/local, preload:false finché i ruoli non si fissano
  opere.ts             le 23 opere dell'archivio, il lookup per slug, le
                       `CATEGORIE` della lente e l'unione foto+filmati
  timeline.ts          le voci di cronologia + costanti del nastro
  indice.ts            costanti e motore della griglia di /works
  mensola.ts           costanti della striscia orizzontale
  suono.ts             hook useSuonoBreve (Web Audio) per i tick della timeline
public/media/          home/, indice/ e una cartella per opera (asset serviti
                       as-is; i master stanno in ../01-assets, fuori dal repo)
scripts/               scatti.sh e filmati.sh derivano i media dai master,
                       icone.sh le icone dal vettore, bozze-media.sh i segnaposto
AGENTS.md / CLAUDE.md  la guida è esterna: chiedila prima di fidarti di un §
APERTI.md              lavori aperti: deciso/valutato/misurato, non ancora fatto
HANDOFF.md             stato dell'ultima sessione (datato, si consuma)
```

### Meccanismi trasversali

- **Cambio pagina (§3.4)** — una dissolvenza via `<ViewTransition>` di React,
  dietro `experimental.viewTransition` in `next.config.ts`. Senza supporto del
  browser la navigazione funziona identica, senza animazione.
- **La tenda** — un rettangolo rosso accento (`ROSSO` in `lib/movimento.ts`)
  che entra, copre e si ritira. È il caso originario della grammatica del taglio.
- **Scala uniforme** — `app/globals.css` rimpicciolisce tutta la composizione
  in proporzione alla viewport, di un unico fattore, così i rapporti fra le
  parti non cambiano mai. Quattro manopole: `--rif-larghezza`, `--rif-altezza`
  (l'altezza che la composizione *richiede*, non una a piacere), `--tetto`
  quanto può crescere, `--pavimento` dove smette di rimpicciolire. I numeri
  rimisurati stanno in `APERTI.md`.
- **Soglia compatta (860px)** — è la risposta a ciò che succede sotto il
  pavimento della scala. `SOGLIA_COMPATTA` in `lib/movimento.ts`, ripetuta
  letterale in ogni `@media (max-width: 860px)` (niente plugin per le custom
  media query). Sotto la soglia i tre motori GSAP si spengono e ogni pagina a
  canvas fisso ha una seconda vista che scorre nativamente. Non ha un artboard
  di riferimento — vedi `APERTI.md`.
- **Indicizzazione selettiva** — il sito *si fa* scansionare: `robots.ts` non
  vieta niente, perché un `Disallow` impedisce la scansione e quindi impedisce
  anche di leggere il `noindex` scritto nella pagina. Sono le singole opere con
  nudo a dichiarare `noindex` + `noimageindex`, e `sitemap.ts` le tiene fuori.
  Il perché, per esteso, in `APERTI.md`.
- **L'accento rosso** — sorgente sola in `lib/movimento.ts`: né i fogli né i
  componenti ne tengono una copia. Il `§2.3` della guida («il rosso non colora
  l'interfaccia») è ormai superato dal codice — vedi `APERTI.md`.

## Decisioni sulle versioni

Il criterio è stato: **ultima patch di una minor già consolidata**, non il
numero più alto. Vedi la memoria `version-pinning-conservative`.

- **Next 16.2.12** invece di 16.3.0 (03/08/2026): la linea 16.2 è in
  circolazione da marzo 2026 con 13 patch di stabilizzazione.
- **TypeScript 5.9.3** invece di 6.x / 7.x: la 7.0 è il port nativo in Go
  (luglio 2026), la 6.0 rimuove API deprecate. Nessun vantaggio concreto qui a
  fronte del rischio.
- **Tailwind 4.2.4** invece di 4.3.x: stessa superficie di configurazione,
  linea più rodata.
- **ESLint 9** invece di 10: è la major su cui è impostato il template
  ufficiale di Next 16.2, e `eslint-plugin-import` è storicamente lento ad
  allinearsi alle major di ESLint.
- **Sharp non installato esplicitamente**: `next@16.2.12` lo dichiara come
  `optionalDependency` (`sharp: ^0.34.5`), quindi è già presente e usato da
  `next/image` in produzione. Aggiungerlo a mano rischierebbe solo un
  disallineamento con la versione attesa da Next.
- **media-chrome al posto di Vidstack**: su npm il dist-tag `latest` di
  `@vidstack/react` punta ancora alla 0.6.15, e la linea 1.x sotto il tag
  `next` è rimasta ferma da febbraio 2025 a maggio 2026 — troppo poco
  consolidata. `media-chrome` (Mux) copre gli stessi requisiti: primitive
  web-component senza estetica di default, wrapper React tipizzati, ARIA e
  tastiera integrati, una sola dipendenza (`ce-la-react`, ~3KB). Verificato
  SSR-safe sotto Next 16 + React 19.
- **@gsap/react**: installato quando è iniziata l'animazione. `useGSAP` fa il
  cleanup automatico dei tween/timeline al dismount del componente React —
  senza, ogni motore dovrebbe gestirlo a mano.
- **Lenis**: installato ma **non attivato** — nessuna pagina oggi ha uno scroll
  nativo da smorzare (le pagine a canvas sono pilotate da `Observer`, la home è
  una schermata sola). L'integrazione prevista resta `ReactLenis` da
  `lenis/react` in un Client Component attorno al layout, con il ticker di GSAP
  a pilotare il raf (`autoRaf: false` + `gsap.ticker.add`) e
  `lenis.on("scroll", ScrollTrigger.update)`.

## Note tecniche

- **GSAP**: importare sempre da `@/lib/gsap` (mai da `"gsap"`), dove
  `ScrollTrigger` e `Observer` sono registrati una volta sola lato client.
  Altri plugin (SplitText, Flip, …) sono nel pacchetto: si aggiungono a
  `registerPlugin` in `lib/gsap.ts` solo quando servono.
- **Player**: `media-chrome/react` va importato in un Client Component
  (definisce custom elements).
- **Font**: `preload: false` su tutte le facce finché i ruoli semantici non
  sono fissati (§5); le variabili CSS sono nominate per faccia, non per ruolo.
- **Turbopack**: modifiche a `globals.css` possono non propagarsi a caldo — se
  un cambiamento globale non compare, riavviare `pnpm dev`.
