# Lavori aperti

Cose decise, valutate o misurate che **non hanno un posto nel codice** — perché
riguardano più file, o perché sono domande ancora aperte.

Quello che invece riguarda un punto solo sta accanto a quel punto, com'è lo
stile di questo repo: ogni pagina dichiara da sé cosa le manca (`/about` era un
segnaposto, `/works` ha la selezione ancora da fare in JS, `/works/[slug]` ha lo
scroll nativo come ponteggio, il §8 dei video è dichiarato irrisolto). Quelle
non si ripetono qui.

---

## La home a due schermate

Valutata, non fatta. La prima schermata mostrerebbe la sola navbar al centro,
il piede alleggerito e un invito allo scorrimento; uno scorrimento guidato
porterebbe poi alla schermata dell'hero, che entra con la sequenza che c'è già.

Richiede **Lenis**, installato in `package.json` e mai attivato, e lo snap fra
sezioni. È la cosa più cara fra quelle rimaste.

Un vincolo da non perdere: il §2.1 chiede che `manuel` non compaia mai in una
schermata dove `Manuel Casati` non sia leggibile. Se il piede si svuota nella
prima schermata la regola salta proprio dove il marchio è protagonista —
`Manuel Casati` va tenuto, semmai lasciando cadere `ITA, 1986` e l'arco.

## La transizione fra pagine (§3.4)

Il pezzo difficile **è già sciolto**, e conviene saperlo prima di riaprirlo.

Era: l'header è condiviso, non può scattare da un titolo all'altro senza
transizione. Ma da `9f1b7f3` l'header vive in `app/layout.tsx` ed è identico su
tutte le pagine — `manuel` a sinistra, le tre rotte a destra — quindi **durante
una transizione non transisce affatto**: non si rimonta, e non ha niente da far
scattare. Resta il corpo che cambia, e per quello c'è la tenda
(`components/tenda.tsx`), che nasce proprio come primitivo riusabile.

Il percorso per-pagina, che era l'unica parte variabile in testa, è sceso nei
piedi: lì è locale alla pagina e cambia con lei.

Entrando in `/timeline` la tenda della transizione sarà **l'unica** lavata
rossa: l'ingresso della timeline non usa il rosso di proposito (vedi
`655668c`), e due tende in fila sarebbero state una di troppo.

## La posizione del player nella home

Da guardare. `--player margin-top` vale 434px, ed è la somma di dove stava la
nav nella bozza (357) più la sua altezza (18) più la fuga (59).

Ma la nav **non è più lì**: da `9f1b7f3` è l'header del sito e sta in cima, a
28px. Il player è rimasto alla quota che aveva quando sotto la nav c'era. Il
risultato è un vuoto fra 46px e 434px che nella bozza non esisteva.

Non l'ho toccato perché ricentrare la composizione è una scelta d'autore, non
una conseguenza tecnica. Ma è una quota che adesso deriva da un elemento che
non c'è più.

## `--rif-altezza` — i numeri misurati

`app/globals.css` frena la scala del sito su `--rif-altezza: 980`, e il suo
commento avverte che quel numero deve essere «l'altezza che la composizione
RICHIEDE, non una a piacere»: se è sottostimato il freno non morde, se è
sovrastimato tutto rimpicciolisce prima del necessario.

Le intestazioni dei fogli dichiarano viewport diverse (`/works` dice 1440×980,
le altre 1440×780), quindi ho calcolato dai CSS l'altezza che ciascuna pagina
occupa davvero, dal contenuto più in alto al piede:

| pagina | richiede | da cosa |
|---|---|---|
| home | **~851px** | player a 434 + 381 di altezza, più aria sotto |
| `/works` | ~792px | banda a 628 + ~111 di scheda + piede |
| `/works/[slug]` | ~767px | base 614 + sporgenza 99 + piede |
| `/timeline` | ~733px | voci fino a 503 dall'alto, pannello 230 dal basso |
| `/about` | ~624px | apparato a 316 + tre paragrafi + piede |

Il massimo è la **home, ~851px**. `--rif-altezza: 980` sembra quindi
sovrastimato di circa 130px: su una finestra alta 900 la scala scende a 14,7px
invece di restare a 16, pur essendoci lo spazio.

**Non l'ho cambiato.** Sono misure calcolate dai fogli, non lette da un browser,
e il valore è una manopola d'autore: 980 potrebbe essere deliberato per lasciare
margine a contenuti non ancora scritti. Ma se 851 è la verità, portarlo a ~870
restituisce la scala piena a tutte le finestre fra 870 e 980.

Va rimisurato dopo aver deciso della quota del player qui sopra: è la home a
fissare il massimo.

## L'archivio dichiara 26 opere, ne contiene 21

`lib/opere.ts` progetta «una sequenza unica 01→26» (§3.3) e il numero più alto
in `OPERE` è 21. Il segnaposto di `/about` diceva «Ventisei opere»; adesso la
pagina conta `OPERE.length` e dice ventuno, quindi non può più mentire — ma
restano **cinque opere da inserire**, ed è curatela, non codice.

---

## Una nota per chi lavora qui

La **guida di progetto** (i `§1`–`§9` citati ovunque nei commenti) è **esterna
a questo repository**. Ogni citazione che trovi nel codice è una parafrasi
scritta da una sessione precedente, non la fonte.

Finora ha retto perché le parafrasi sono buone, ma è fragile: se una è
imprecisa, l'errore si propaga senza che nessuno se ne accorga. Lo stesso vale
per gli artboard (le «bozze 01, 02, 04» citate in testa ai fogli). **Chiedi la
guida prima di fidarti di un `§`.**
