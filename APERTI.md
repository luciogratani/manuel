# Lavori aperti

Cose decise, valutate o misurate che **non hanno un posto nel codice** — perché
riguardano più file, o perché sono domande ancora aperte.

Quello che invece riguarda un punto solo sta accanto a quel punto, com'è lo
stile di questo repo: ogni pagina dichiara da sé cosa le manca — oggi resta il
§8 dei video, dichiarato irrisolto in `app/page.tsx`. Quelle non si ripetono
qui.

Per lo stato di una singola sessione — cos'è appena cambiato, cosa va guardato
a mano, chi ha deciso cosa — c'è `HANDOFF.md`, che è datato e si consuma. Qui
sta solo ciò che resta vero nel tempo.

---

## Le cinque opere che mancano

`lib/opere.ts` progetta «una sequenza unica 01→26» (§3.3) e contiene ventuno
opere, numerate 01→21. Le pagine adesso contano invece di dichiarare, quindi
nessuna mente — ma le cinque assenti restano da inserire, ed è curatela.

Il repo non dice quali siano. Dice però dove cercarle:

- **Quattro immagini senza opera.** `public/media/indice/` contiene ventiquattro
  file (001→024) e `lib/opere.ts` ne referenzia venti. Orfani: **002, 003, 014,
  022**.
- **Due voci di cronologia senza opera.** In `lib/timeline.ts` tutte le voci
  hanno uno slug che rimanda all'archivio, tranne **L'Affair** (2021, video
  performance) e **BDSM** (2025, video). Sono in cronologia ma non in archivio,
  quindi non hanno numero.

Le due liste possono sovrapporsi: una delle immagini orfane potrebbe essere
proprio L'Affair o BDSM.

## `/works` legge dalla più recente, e i tag aspettano

Dal 6 settembre 2026 l'indice è **una riga sola che scorre in orizzontale**,
letta dalla più recente (a sinistra) alla più vecchia. `lib/opere.ts` resta in
ordine cronologico 01→26; il verso di lettura lo decide `page.tsx`
(`INDICE = [...OPERE].reverse()`). Prima era a due righe riempite per colonna,
con le opere consecutive impilate.

Due cose restano aperte:

- **I tre tag** (`performance`, `fotografia`, `editoriale`) sono ancora un MOCK:
  l'interazione c'è (un radio ciascuno, gli altri si attenuano) ma `lib/opere.ts`
  non ha un campo `tags` reale e non filtrano niente. Quando la curatela scrive
  il campo, `Banda` collega lo stato al contesto della griglia — vedi i commenti
  in `banda.tsx` e `page.tsx`. Da decidere anche **come** il filtro agisce sulla
  striscia: nasconde le opere fuori tag, le attenua, o le salta col cursore.
- Nella banda la **coordinata** mostra il numero d'archivio dell'opera (`006`),
  l'**indicatore** la sua posizione nella striscia (`(16—21)`): rovesciando
  l'ordine i due numeri divergono. È coerente col resto del sito (numero ≠
  posizione), ma se dà fastidio l'indicatore è in `banda.tsx`.

## `--rif-altezza` — i numeri, rimisurati

`app/globals.css` frena la scala del sito su `--rif-altezza: 980`, e il suo
commento avverte che quel numero deve essere «l'altezza che la composizione
RICHIEDE, non una a piacere»: se è sottostimato il freno non morde, se è
sovrastimato tutto rimpicciolisce prima del necessario.

Altezza calcolata dai fogli, dal contenuto più alto al piede:

| pagina | richiede | da cosa |
|---|---|---|
| `/works/[slug]` | ~767px | base 614 + sporgenza 99 + piede |
| `/timeline` | ~733px | voci fino a 503 dall'alto, pannello 230 dal basso |
| `/works` | ~707px | banda a 596 (alto 128 + zona 352 + stacco 116) + ~111 di scheda |
| `/about` (scheda) | ~624px | apparato a 316 + tre paragrafi + piede |
| home | ~520px | il player è centrato: gli serve solo di non toccare i bordi |

Il massimo è ora `/works/[slug]`, **~767px**. `/works` è sceso a ~707 col
passaggio alla riga singola (6 settembre 2026): la striscia è più alta (`--zona`
da 24 a 22rem, ma una riga sola invece di due) e la banda sale di conseguenza.
`980` resta sovrastimato di ~210px — su una finestra alta 900 la scala scende a
14,1px invece di restare a 16, pur essendoci lo spazio.

**Non l'ho cambiato.** Sono misure calcolate dai fogli e non lette da un
browser, e il valore è una manopola d'autore: 980 potrebbe essere deliberato
per lasciare margine a contenuti non ancora scritti. Con la riga singola la
striscia di `/works` sta alta nel canvas e sotto resta molto vuoto — se si
decide di ricentrarla, `--alto` è la manopola.

## Il rosso è anche superficie: il §2.3 va riscritto

Il §2.3 dice che «il rosso sta nel taglio, non colora l'interfaccia». Da
`f5f59a4` non è più vero alla lettera: la chiusura di `/about` è una schermata
intera di rosso pieno.

L'eccezione è dichiarata e circoscritta — la formulazione aggiornata sta accanto
a `ROSSO` in `lib/movimento.ts`, che è dove chiunque voglia usare l'accento
guarda per primo. Due casi ammessi, la tenda e la chiusura; tutto il resto no,
compreso il riquadro del copia, che avrebbe avuto contrasto sufficiente e usa
l'inchiostro proprio per non spendere l'accento una terza volta.

Quando la guida tornerà sotto mano, **il §2.3 va riscritto per dire questo**
invece di essere contraddetto dal codice.

## Il marchio del header è il lockup intero, non più la sola `manuel`

Il §2.2 descrive il wordmark come `manuel` a proporzione 6,05:1. Dal 6 settembre
2026 (scelta di Lucio) **l'header porta `manuel casati`** — il lockup completo,
rapporto ~11,7:1 — e con lui la sequenza della soglia, che lo misura a runtime e
si adatta senza numeri scritti a mano.

Il componente `components/marchio.tsx` tiene le due forme: `manuel` è il default
(lo usa ancora la chiusura di `/about`), `manuel casati` è la prop `esteso`. Le
coordinate di `manuel` non cambiano fra le due — `casati` si aggiunge a destra
nello stesso `viewBox` allargato. La sorgente è
`01-assets/svg/manuel-wide-web.svg` (fuori dal repo), che contiene entrambi i
gruppi.

**Quando la guida tornerà sotto mano**: il §2.2 va aggiornato per dire quale
forma vale dove, e va deciso cosa fa il header sotto la soglia compatta — oggi
non è adattato (come `/` e `/legali`) e `manuel casati` + le tre voci a 375px
stanno strette. Il `data-letter` di `casati` è in ordine di lettura come quello
di `manuel`, ma non è mai stato verificato contro un taglio lettera per lettera.

## Le note legali sono una bozza

`/legali` esiste e dice cose vere, ma **non è stata letta da un legale** e la
pagina stessa lo dichiara in testa.

Due parti meritano attenzione vera prima della pubblicazione:

- **Persone ritratte.** Il sito pubblica ritratti di persone identificabili;
  l'art. 96 L. 633/1941 richiede il consenso della persona ritratta. La pagina
  afferma che ogni ritratto è pubblicato con quel consenso e offre un canale per
  chiederne la rimozione. **Quell'affermazione va resa vera**, cioè le
  liberatorie vanno raccolte e conservate: in caso di contestazione è chi
  pubblica a dover provare di avere l'autorizzazione.
- **Natura dei contenuti.** La pagina dichiara che alcune opere contengono
  nudità artistica e che nessuna ritrae minorenni in quel contesto. Va
  verificato contro l'archivio reale, opera per opera, prima di andare online.

Le affermazioni sui dati invece sono **verificate nel codice**: nessuna
analitica, nessuna terza parte, nessun modulo, e una sola chiave in
`localStorage` per la preferenza del suono della timeline. Se arriva
un'analitica, un modulo o un servizio esterno, quella pagina va riscritta per
prima.

## La soglia compatta non ha un artboard

Da `f9c8302` le pagine a canvas fisso hanno una seconda vista sotto 860px
(`SOGLIA_COMPATTA` in `lib/movimento.ts`) — vedi `HANDOFF.md` del 25 agosto
2026 per il dettaglio. **Nessuna delle due cose è stata misurata da un
disegno**: la soglia di 860px è scelta a occhio (copre un iPad in verticale,
non solo il telefono) e verificata su tre larghezze, non calcolata come
`--rif-altezza`; le composizioni compatte sono state disegnate in continuità
stilistica col resto del sito, non da un artboard dedicato.

Se un giorno arriva un riferimento visivo per il mobile — o la guida di
progetto (fuori da questo repo) dice qualcosa di esplicito sul tema — **va
riconfrontato con quanto costruito qui**, che è una prima risposta e non una
misura.

## Recapiti

`/about` ha email e i due profili social, veri. Il **telefono è stato tolto**
del tutto (6 settembre 2026, scelta di Lucio): i canali di contatto sono email
e social, non un numero. Mancano ancora, se serviranno: un indirizzo postale e,
se un giorno ci sarà una partita IVA o una ragione sociale, la riga che nel
riferimento stava in fondo e che qui è occupata dalla citazione di Luisa Casati.

---

## Una nota per chi lavora qui

La **guida di progetto** (i `§1`–`§9` citati ovunque nei commenti) è **esterna
a questo repository**. Ogni citazione che trovi nel codice è una parafrasi
scritta da una sessione precedente, non la fonte.

Finora ha retto perché le parafrasi sono buone, ma è fragile: se una è
imprecisa, l'errore si propaga senza che nessuno se ne accorga. Lo stesso vale
per gli artboard (le «bozze 01, 02, 04» citate in testa ai fogli). **Chiedi la
guida prima di fidarti di un `§`.**
