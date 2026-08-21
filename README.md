# Manuel — Portfolio

Sito del portfolio. In questa fase il repository contiene **solo l'infrastruttura tecnica**:
nessuna pagina, nessun componente, nessun design system, nessuna animazione.

## Stack e versioni installate

| Pacchetto           | Versione  | Note                                                        |
| ------------------- | --------- | ----------------------------------------------------------- |
| next                | 16.2.12   | App Router, Turbopack (default in 16), Server Components     |
| react / react-dom   | 19.2.8    |                                                              |
| typescript          | 5.9.3     |                                                              |
| tailwindcss         | 4.2.4     | v4 CSS-first, via `@tailwindcss/postcss`                     |
| @tailwindcss/postcss| 4.2.4     |                                                              |
| eslint              | 9.39.5    | flat config                                                  |
| eslint-config-next  | 16.2.12   | `core-web-vitals` + `typescript`                             |
| gsap                | 3.15.0    | tutti i plugin inclusi nel pacchetto pubblico (dal 3.13)     |
| lenis               | 1.3.25    | installato, non ancora attivato                              |
| media-chrome        | 4.19.2    | video player, wrapper React in `media-chrome/react`          |
| sharp               | 0.34.5    | **non dichiarato**: arriva come `optionalDependency` di Next |

Node richiesto: `>=20.9.0`. Package manager: **pnpm** (`pnpm@10.33.0`, lockfile `pnpm-lock.yaml`).

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
app/            App Router (layout, pagine, e i loro componenti locali)
components/     componenti condivisi fra pagine (header, tenda)
lib/            utilities e configurazioni condivise
public/         asset statici serviti as-is
APERTI.md       lavori aperti: deciso, valutato o misurato ma non ancora fatto
HANDOFF.md      stato dell'ultima sessione: cosa è cambiato, cosa controllare
```

## Decisioni sulle versioni

Il criterio è stato: **ultima patch di una minor già consolidata**, non il numero più alto.

- **Next 16.2.12** invece di 16.3.0 (uscita il 03/08/2026): la linea 16.2 è in circolazione
  da marzo 2026 con 13 patch di stabilizzazione.
- **TypeScript 5.9.3** invece di 6.x / 7.x: la 7.0 è il port nativo in Go (luglio 2026) e la 6.0
  rimuove API deprecate. Nessun vantaggio concreto qui a fronte del rischio.
- **Tailwind 4.2.4** invece di 4.3.x: stessa superficie di configurazione, linea più rodata.
- **ESLint 9** invece di 10: è la major su cui è impostato il template ufficiale di Next 16.2,
  e `eslint-plugin-import` (dipendenza di `eslint-config-next`) è storicamente lento ad allinearsi
  alle major di ESLint.
- **Sharp non installato esplicitamente**: `next@16.2.12` lo dichiara come `optionalDependency`
  (`sharp: ^0.34.5`), quindi è già presente e usato da `next/image` in produzione. Verificato:
  sharp 0.34.5 con libvips 8.17.3, binario prebuilt, si carica correttamente. Aggiungerlo a mano
  significherebbe solo rischiare un disallineamento di versione con quella attesa da Next.
- **media-chrome al posto di Vidstack**: su npm il dist-tag `latest` di `@vidstack/react` punta
  ancora alla 0.6.15, mentre la linea 1.x sta sotto il tag `next` ed è rimasta ferma da
  febbraio 2025 a maggio 2026. Troppo poco consolidata. `media-chrome` (Mux) copre gli stessi
  requisiti meglio: primitive web-component **senza estetica di default** (`<media-controller>`,
  `<media-play-button>`, ...), quindi UI interamente da comporre; wrapper React tipizzati;
  ARIA e gestione tastiera integrati; `<video>` HTML5 nativo con poster, controls e captions;
  una sola dipendenza (`ce-la-react`, ~3KB). Verificato SSR-safe sotto Next 16 + React 19.

## Note per la fase successiva

- **GSAP**: `lib/gsap.ts` registra `ScrollTrigger` una sola volta lato client. Importare sempre
  da lì (`@/lib/gsap`), mai da `"gsap"` direttamente. Altri plugin (SplitText, Observer, Flip)
  sono già nel pacchetto: vanno aggiunti alla `registerPlugin` solo quando servono.
  Se in fase di animazione servirà il cleanup automatico in React, valutare `@gsap/react`
  (hook `useGSAP`) — volutamente non installato ora.
- **Lenis**: installato ma non attivato. L'integrazione prevista è `ReactLenis` da `lenis/react`
  in un Client Component che avvolge il layout, con il ticker di GSAP che pilota il raf
  (`autoRaf: false` + `gsap.ticker.add`) e `lenis.on("scroll", ScrollTrigger.update)`.
- **Player**: `media-chrome/react` va importato in Client Component (definisce custom elements).
- **Font**: nessun font installato, da integrare in seguito.
- `app/page.tsx` è un placeholder vuoto: esiste solo per avere una route valida su `/`.
