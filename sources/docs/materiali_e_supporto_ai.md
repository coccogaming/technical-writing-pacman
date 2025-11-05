# Linee Guida per Codice di Alta Qualità Generato con AI Companion

## Obiettivo

Fornire un **prompt operativo** e linee guida che guidino un agente LLM (AI Companion) nella scrittura iterativa, test-driven e tracciata tramite git del progetto **replica ad alta fedeltà di Pac‑Man** (Namco, 1980). Il codice deve essere trattato come bozza e sottoposto a revisione umana (Human‑in‑the‑loop).

---

## 1. Regole d'ingaggio (precondizioni per l'agente LLM)

1. Sempre iniziare generando i test unitari per la funzionalità richiesta (Test‑First / TDD). Non scrivere implementazione senza test automatici che falliscono prima.
2. Includere sempre, dentro il prompt di lavoro, i frammenti rilevanti dei documenti `prd.md` e `analisi_tecnica.md` quando si lavora su comportamenti critici (es. IA di Pinky, Inky, timing dei fantasmi). Per requisiti notoriamente delicati (il "bug originale" di Pinky) incollare sempre la frase di requisito.
3. Il codice deve rispettare lo stack: **HTML5 (<canvas>)**, **CSS3**, **JavaScript ES6+**, nessun game framework esterno.
4. Creare e mantenere un file di progresso chiamato `TASKS.md` nella radice del repository che segue il formato:

```markdown
# TASKS
- [ ] ID-001 | titolo breve | descrizione corta
- [ ] ID-002 | titolo breve | descrizione corta
- [ ] ID-003 | titolo breve | descrizione corta

# LEGEND
- [ ] = TODO
- [~] = DOING
- [x] = DONE
```

5. L'agente deve lavorare sempre su un branch git dedicato per task: `feature/<ID>-<short-desc>` e aprire commit frequenti con messaggi chiari: `feat(ID-001): implement target calc for PINKY`.
6. Ogni PR/merge verso `main` deve avere almeno:

   * test automatici verdi
   * descrizione dei cambiamenti
   * checklist di controllo qualità compilata
   * approvazione umana (reviewer umano) prima del merge

---

## 2. Flusso operativo passo‑passo per l'AI Companion (prompt to-do)

Per ogni task:

1. **Leggi TASKS.md** e scegli la più alta priorità (prima TODO non iniziato).
2. **Apri un branch** git: `feature/ID-xxx-short`.
3. **Scrivi test** (unit test) che definiscano il comportamento esatto richiesto. Fornire esempi concreti (assert sulla tile target in coordinate intere). Esegui test: devono fallire.
4. **Implementa il codice minimo** per far passare i test. Esegui test: devono passare.
5. **Aggiungi test di integrazione** se il componente interagisce con il Game Loop o altri moduli critici.
6. **Misura prestazioni** se pertinente (benchmark base: 60 update/sec simulation per logiche IA in node/jest). Documenta risultati nel commit.
7. **Scrivi documentazione breve** (README della feature o commento JSDoc) spiegando le decisioni tecniche rilevanti.
8. **Aggiorna TASKS.md** marcando la subtasca come `[~]` durante il lavoro e `[x]` a completamento.
9. **Crea la PR** con descrizione, lista test e checklist per il reviewer.

Esempio di commit flow:

```
git checkout -b feature/ID-042-pinky-target
# 1. add tests
git add tests/pinky.spec.js
git commit -m "test(ID-042): add unit tests for PINKY target calculation (including up-direction bug)"
# 2. implement
git add src/ghosts/pinky.js
git commit -m "feat(ID-042): implement PINKY target calc with original bug behavior"
# 3. final
git push origin feature/ID-042-pinky-target
open PR
```

---

## 3. Struttura minima del repository e convenzioni

```
/ (repo root)
  |- index.html
  |- style.css
  |- /src
     |- main.js
     |- constants.js
     |- game.js
     |- renderer.js
     |- input.js
     |- audio.js
     |- maze.js
     |- entity.js
     |- pacman.js
     |- ghosts/
         |- ghost.js
         |- blinky.js
         |- pinky.js
         |- inky.js
         |- clyde.js
  |- /tests
     |- jest.config.js
     |- pacman.spec.js
     |- ghosts/
         |- pinky.spec.js
         |- inky.spec.js
         |- clyde.spec.js
  |- /assets
     |- sprites.png
     |- sounds/
  |- TASKS.md
  |- package.json (devDependencies: jest, @babel if needed, esbuild for quick bundling)
```

**Nota:** usare Jest (o altro runner JS che supporti DOM via jsdom) per i test unitari e per i test delle funzioni pure (calcolo target, distanza tile, cambio di modalità). Per test in-browser di rendering o timing, usare test manuali/visuali o strumenti E2E separati (es. Playwright) nelle fasi avanzate.

---

## 4. Linee guida per i test critici (esempi concreti)

*Questi esempi devono essere inclusi come casi di test nel prompt quando si chiede all'AI di implementare l'IA dei fantasmi.*

### 4.1. Pinky (bug originale)

* PacMan in tile (14, 17), direzione UP.
* Pinky deve targettare la tile (10, 13) (4 tile davanti + 4 a sinistra, bug incluso). Il test deve verificare il calcolo del targetTile.

### 4.2. Blinky

* Blinky target = tile corrente di PacMan (es. PacMan tile (14, 17) => target (14, 17)).

### 4.3. Inky (imboscata a pinza)

* Dati: PacMan tile (14, 17) dir RIGHT; Blinky tile (12, 16).
* Calcolo: trovare tile 2 davanti a PacMan (16,17), calcolare vettore da Blinky (12,16) a quel punto => (4,1), raddoppiarlo => (8,2), target = Blinky + (8,2) = (20,18). Verificare con assert.

### 4.4. Clyde

* Se distanza tile (Clyde, PacMan) > 8 => target = PacMan tile.
* Se distanza <= 8 => target = scatter target (es. bottom-left corner, p.e. (0, 35)).

### 4.5. Modalità Frightened

* Dopo consumo di Power Pellet, impostare `ghost.mode = 'FRIGHTENED'`, i fantasmi devono invertire la direzione immediatamente (test: direction invertita) e muoversi con scelta pseudo-random agli incroci.

---

## 5. Checklist di Code Review (da compilare nella PR)

* [ ] Tutti i test passano localmente e in CI
* [ ] Tests critici per IA: Pinky, Inky, Clyde inclusi
* [ ] Copertura dei casi limite (bordo mappa, tunnel, casa fantasmi)
* [ ] Nessun uso di librerie di gioco esterne
* [ ] Performance: non introduce blocchi nella logica update principale
* [ ] Messaggi di commit chiari e TASKS.md aggiornato
* [ ] Documentazione minima della feature
* [ ] Reviewer umano ha verificato i risultati di gioco (visual testing)

---

## 6. Prompt operativo per l'AI Companion (da inviare all'agente LLM ogni volta che si chiede di farmare codice)

> Sei un AI Companion incaricato di implementare una singola task del progetto Pac‑Man. Segui rigidamente il processo TDD + git + TASKS.md descritto qui. Prima di tutto, leggi il TASKS.md e seleziona la task più alta priorità. Se la task riguarda IA o timing, includi sempre i frammenti rilevanti del `prd.md` e `analisi_tecnica.md` nel prompt. Scrivi i test (Jest) per la funzione che andrai a implementare e falliscili intenzionalmente. Poi implementa il codice minimo per farli passare. Commit frequenti. Non unire mai su `main` senza PR, test e approvazione umana.

### Requisiti tecnici nel prompt:

* Stack: HTML5 canvas, CSS3, ES6 JavaScript
* TDD obbligatorio
* Branching git per ogni task
* TASKS.md aggiornato durante il lavoro
* Test unitari per tutte le logiche critiche (IA dei fantasmi, input buffering, collisioni)

---

## 7. Esempi di test (boilerplate Jest)

```javascript
// tests/ghosts/pinky.spec.js
import { calcPinkyTarget } from '../../src/ghosts/pinky.js';

test('Pinky target calcolo - PacMan UP (bug originale)', () => {
  const pac = { tileX: 14, tileY: 17, dir: 'UP' };
  const result = calcPinkyTarget(pac);
  expect(result).toEqual({ x: 10, y: 13 });
});
```

```javascript
// tests/ghosts/inky.spec.js
import { calcInkyTarget } from '../../src/ghosts/inky.js';

test('Inky target calcolo esempio', () => {
  const pac = { tileX: 14, tileY: 17, dir: 'RIGHT' };
  const blinky = { tileX: 12, tileY: 16 };
  const result = calcInkyTarget(pac, blinky);
  expect(result).toEqual({ x: 20, y: 18 });
});
```

---

## 8. Note di sicurezza e qualità

* Trattare il codice generato dall'AI come bozza: la responsabilità finale è dello sviluppatore umano.
* Se l'agente produce codice che modifica le regole del gioco (es. bilanciamento o aggiunte di feature), segnalarlo come `BREAKING_CHANGE` e non procedere al merge senza approvazione del team di prodotto.

---

## 9. Allegati utili (da includere nel prompt quando rilevante)

* Estratti di `prd.md` relativi a IA e timing
* Estratti di `analisi_tecnica.md` (Game Loop, Fixed Timestep, struttura Maze)

---

## 10. Consegna

Questo documento funge da *single source of truth* per costruire prompt replicabili e sicuri per l'AI Companion. Copialo integralmente come contesto quando chiedi a un agente LLM di scrivere codice critico per il progetto Pac‑Man.

---

*Fine del documento.*