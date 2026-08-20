import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* La transizione fra pagine (§3.4) usa `<ViewTransition>` di React, che in
       App Router è dietro questa bandiera. È l'unico modo per avere ENTRAMBI i
       tempi della tenda: `template.tsx` da solo rimonta la pagina nuova e dà
       quindi il solo ritiro, mentre la copertura richiede di animare la pagina
       che se ne va — cioè uno snapshot del vecchio, che solo l'API del browser
       sa produrre.

       Sperimentale, e va saputo: senza supporto del browser la navigazione
       funziona identica, semplicemente senza animazione. */
    viewTransition: true,
  },
};

export default nextConfig;
