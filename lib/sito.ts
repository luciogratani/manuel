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
 *  CONFERMATO il 9 settembre 2026: il dominio è registrato (IONOS), collegato
 *  al progetto Vercel e validato. Era rimasto a lungo un'ipotesi — dedotta da
 *  una casella `hello@manuelcasati.it` che non è mai esistita — e adesso non
 *  lo è più. Il sito risponde all'apex, e `www` ci rimanda con un 308.
 *
 *  Serve a Next per risolvere in URL assoluti le immagini delle anteprime:
 *  senza, le card si vedono senza figura, perché un percorso relativo a
 *  WhatsApp o a X non dice niente. Da qui nascono anche `metadataBase`, tutti
 *  i `canonical`, `robots.txt` e `sitemap.xml`: è l'unico posto in cui il
 *  dominio è scritto, e va tenuto d'accordo con quale dei due indirizzi Vercel
 *  serve davvero — se un giorno diventasse `www` la primaria, si cambia qui. */
export const SITO = new URL("https://manuelcasati.it");

/** L'indirizzo a cui si scrive: contatti di /about e richieste di /legali.
 *
 *  Un canale solo, così non può accadere che uno dei due smetta di essere
 *  letto senza che nessuno se ne accorga. Stava scritto due volte, una per
 *  pagina; da quando è anche quello del PDF del curriculum sarebbero state
 *  tre copie della stessa riga, ed è il momento in cui una costante si sposta.
 *
 *  È QUELLO DEL CV, non un indirizzo di servizio (scelta di Lucio, 9 settembre
 *  2026): il curriculum scaricabile porta in testa `manuelcasati89@gmail.com`,
 *  e un sito che ne mostrava un altro dava a chi scrive due strade diverse per
 *  la stessa persona — con il dubbio, per chi arriva da un'open call, di quale
 *  delle due venga letta davvero. Prima o poi resta una scelta da rifare: un
 *  indirizzo sul proprio dominio è più solido di una casella gratuita, ma
 *  allora va cambiato ANCHE nel PDF, che è la sorgente. */
export const EMAIL = "manuelcasati89@gmail.com";
