"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

// Registrazione centralizzata dei plugin GSAP.
// Importare `gsap` / `ScrollTrigger` / `Observer` da questo modulo (e non da
// "gsap"), così la registrazione avviene una sola volta e solo lato client.
//
// Observer serve al motore della timeline (`app/timeline/motore.tsx`): a
// differenza di ScrollTrigger non presuppone uno scroll nativo della pagina,
// normalizza rotella/touch/pointer in un'unica interfaccia — è il primitivo
// giusto quando lo scroll è sostituito, non letto.
//
// Altri plugin disponibili nel pacchetto pubblico (gsap >= 3.13):
// SplitText, Flip, ScrollToPlugin, DrawSVGPlugin, MorphSVGPlugin, InertiaPlugin...
// Aggiungerli qui solo quando servono davvero, per non appesantire il bundle.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Observer);
}

export { gsap, ScrollTrigger, Observer };
