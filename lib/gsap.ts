"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrazione centralizzata dei plugin GSAP.
// Importare `gsap` / `ScrollTrigger` da questo modulo (e non da "gsap"),
// così la registrazione avviene una sola volta e solo lato client.
//
// Altri plugin disponibili nel pacchetto pubblico (gsap >= 3.13):
// SplitText, Observer, Flip, ScrollToPlugin, DrawSVGPlugin, MorphSVGPlugin...
// Aggiungerli qui solo quando servono davvero, per non appesantire il bundle.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
