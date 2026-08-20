# Lavori aperti

Cose decise, valutate o misurate che **non hanno un posto nel codice** — perché
riguardano più file, o perché sono domande ancora aperte.

Quello che invece riguarda un punto solo sta accanto a quel punto, com'è lo
stile di questo repo: ogni pagina dichiara da sé cosa le manca (`/works` ha la
selezione ancora da fare in JS, `/works/[slug]` ha lo scroll nativo come
ponteggio, il §8 dei video è dichiarato irrisolto). Quelle non si ripetono qui.

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

## `--rif-altezza` — i numeri, rimisurati

`app/globals.css` frena la scala del sito su `--rif-altezza: 980`, e il suo
commento avverte che quel numero deve essere «l'altezza che la composizione
RICHIEDE, non una a piacere»: se è sottostimato il freno non morde, se è
sovrastimato tutto rimpicciolisce prima del necessario.

Altezza calcolata dai fogli, dal contenuto più alto al piede:

| pagina | richiede | da cosa |
|---|---|---|
| `/works` | **~792px** | banda a 628 + ~111 di scheda + piede |
| `/works/[slug]` | ~767px | base 614 + sporgenza 99 + piede |
| `/timeline` | ~733px | voci fino a 503 dall'alto, pannello 230 dal basso |
| `/about` (scheda) | ~624px | apparato a 316 + tre paragrafi + piede |
| home | ~520px | il player è centrato: gli serve solo di non toccare i bordi |

Il massimo è ora `/works`, **~792px**: la home è scesa da ~851 a ~520 da quando
il player si centra invece di stare appeso a una quota dall'alto. `980` sembra
quindi sovrastimato di circa 190px — su una finestra alta 900 la scala scende a
14,7px invece di restare a 16, pur essendoci lo spazio.

**Non l'ho cambiato.** Sono misure calcolate dai fogli e non lette da un
browser, e il valore è una manopola d'autore: 980 potrebbe essere deliberato
per lasciare margine a contenuti non ancora scritti. Da rimisurare quando
`/works` avrà la sua parte interattiva, che è la pagina che fissa il massimo.

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

## Recapiti ancora da avere

`/about` ha telefono, email e i due profili social. Mancano ancora, se servono:
un indirizzo postale e — se un giorno ci sarà una partita IVA o una ragione
sociale — la riga che nel riferimento stava in fondo e che qui è occupata dalla
citazione di Luisa Casati.

---

## Una nota per chi lavora qui

La **guida di progetto** (i `§1`–`§9` citati ovunque nei commenti) è **esterna
a questo repository**. Ogni citazione che trovi nel codice è una parafrasi
scritta da una sessione precedente, non la fonte.

Finora ha retto perché le parafrasi sono buone, ma è fragile: se una è
imprecisa, l'errore si propaga senza che nessuno se ne accorga. Lo stesso vale
per gli artboard (le «bozze 01, 02, 04» citate in testa ai fogli). **Chiedi la
guida prima di fidarti di un `§`.**
