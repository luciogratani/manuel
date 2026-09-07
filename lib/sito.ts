/** Il dominio del sito, in un modulo SENZA dipendenze — ed è il punto.
 *
 *  Stava in `app/layout.tsx`, che è il posto naturale finché a leggerlo sono
 *  solo i metadati. Ma `app/robots.ts` e `app/sitemap.ts` sono moduli a sé, e
 *  importando il layout si tiravano dietro font, componenti e fogli di stile:
 *  entrambe le rotte rispondevano 500 con «Cannot read properties of undefined
 *  (reading 'variable')» — `next/font` valutato fuori dal suo contesto.
 *
 *  Una costante non deve vivere in un modulo di componenti. Qui non importa
 *  niente, quindi chiunque può importarla.
 *
 *  DA CONFERMARE: ricavato dall'indirizzo che il sito usa ovunque,
 *  `hello@manuelcasati.it`. Serve a Next per risolvere in URL assoluti le
 *  immagini delle anteprime — senza, le card si vedono senza figura, perché un
 *  percorso relativo a WhatsApp o a X non dice niente. È l'unico posto in cui
 *  il dominio è scritto: quando sarà quello vero si cambia qui. */
export const SITO = new URL("https://manuelcasati.it");
