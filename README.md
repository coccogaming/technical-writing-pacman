# Pac‑Man — Replica ad alta fedeltà (HTML5 + JS)

**Questo repository** contiene la progettazione e le linee guida per la replica ad alta fedeltà del classico arcade **Pac‑Man** (Namco, 1980), implementata con tecnologie web moderne: **HTML5 (<canvas>)**, **CSS3**, **JavaScript (ES6+)**.

> Nota: il codice generato da strumenti AI deve essere trattato come bozza. Ogni modifica funzionale richiede revisione umana e test (Human‑in‑the‑loop).

---

## Sommario

* [Obiettivo](#obiettivo)
* [Caratteristiche principali](#caratteristiche-principali)
* [Prerequisiti](#prerequisiti)
* [Getting started (sviluppo locale)](#getting-started-sviluppo-locale)
* [Test e TDD](#test-e-tdd)
* [Flusso di lavoro Git / Branching](#flusso-di-lavoro-git--branching)
* [TASKS.md e tracciamento delle attività](#tasksmd-e-tracciamento-delle-attivit%C3%A0)
* [Struttura del repository](#struttura-del-repository)
* [Linee guida di sviluppo e qualità del codice](#linee-guida-di-sviluppo-e-qualit%C3%A0-del-codice)
* [AI Companion: prompt operativo (sintesi)](#ai-companion-prompt-operativo-sintesi)
* [Checklist PR / Code Review](#checklist-pr--code-review)
* [Contribuire](#contribuire)
* [Licenza](#licenza)

---

## Obiettivo

Creare una replica fedele del gameplay, della grafica, del timing e dell'IA dei fantasmi dell'originale Pac‑Man (1980). Importante: riprodurre fedelmente i comportamenti critici (es. bug originale di Pinky, logica di Inky, timing Scatter/Chase, comportamento di Clyde).

## Caratteristiche principali

* Rendering su `<canvas>` con sprite sheet
* Game loop a timestep fisso (target 60 update/sec)
* IA dei fantasmi conforme al comportamento arcade originale (Blinky, Pinky, Inky, Clyde)
* Input buffering per il "cornering" di Pac‑Man
* Collisioni tile‑based e controlli pixel‑based per entità
* Sistema di audio tramite Web Audio API
* Test Driven Development obbligatorio per logiche critiche

## Prerequisiti

* Node.js (per eseguire test e strumenti di sviluppo)
* npm o yarn
* (opzionale) `npx serve` o `http-server` per servire i file statici in locale

## Getting started (sviluppo locale)

1. Clona il repository:

```bash
git clone <repo-url>
cd <repo>
```

2. Installa dipendenze di sviluppo (test runner, bundler opzionale):

```bash
npm install
# oppure
yarn
```

3. Avvia un server statico per sviluppare (es. npx serve):

```bash
npx serve .
# o
npx http-server . -c-1
```

Apri il browser su `http://localhost:5000` (porta di default di serve) e testa il canvas.

> Nota: il progetto è strutturato per lavorare con moduli ES6. In fase iniziale è possibile aprire `index.html` direttamente, ma alcuni browser richiedono un server locale per import di moduli.

## Test e TDD

Il flusso di sviluppo richiede TDD: scrivere test Jest prima di implementare le funzioni critiche.

Script utili (esempio `package.json`):

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "lint": "eslint ."
  }
}
```

Esempi di test critici da includere:

* Pinky: calcolo target (incluso il bug originale quando Pac‑Man è rivolto verso l'alto)
* Blinky: target = tile di Pac‑Man
* Inky: calcolo vettore (Blinky → tile 2 avanti PacMan) * 2
* Clyde: comportamento a differenza di distanza (soglia 8 tile)
* Modalità Frightened: inversione direzione e pseudo‑random alle intersezioni

Eseguire i test frequentemente e non unire le modifiche in `main` senza test verdi.

## Flusso di lavoro Git / Branching

Conservare rigore nel flusso git:

* Ogni task ha un ID in `TASKS.md` (es. `ID-042`).
* Branch naming: `feature/<ID>-short-desc` (es. `feature/ID-042-pinky-target`).
* Commit frequenti con messaggi formattati: `feat(ID-042): implement PINKY target calc`.
* PR → revisione umana obbligatoria prima del merge su `main`.

## TASKS.md e tracciamento delle attività

`TASKS.md` è il singolo file di verità per le attività. Formato minimo:

```markdown
# TASKS
- [ ] ID-001 | init repo | inizializzazione progetto
- [ ] ID-042 | pinky target | test + implementazione pinky

# LEGEND
- [ ] = TODO
- [~] = DOING
- [x] = DONE
```

Durante lo sviluppo aggiornare lo stato dell'attività in `TASKS.md` e includere lo stato nella descrizione della PR.

## Struttura del repository (consigliata)

```
/ (repo root)
  |- index.html
  |- README.md
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
     |- /ghosts
         |- ghost.js
         |- blinky.js
         |- pinky.js
         |- inky.js
         |- clyde.js
  |- /tests
     |- ghosts/
         |- pinky.spec.js
         |- inky.spec.js
  |- /assets
     |- sprites.png
     |- /sounds
  |- TASKS.md
  |- package.json
```

## Linee guida di sviluppo e qualità del codice

* Trattare sempre il codice generato dall'AI come bozza. La responsabilità finale è dello sviluppatore.
* Chiarezza: commenti significativi, JSDoc dove necessario.
* Modulare: separare responsabilità (AI, rendering, input, audio, stato globale).
* Performance: evitare calcoli costosi nel ciclo di rendering principale; usare canvas off‑screen per elementi statici (labirinto).
* Determinismo: usare fixed timestep per la logica di gioco per riproducibilità.

## AI Companion: prompt operativo (sintesi)

Quando si usa un agente LLM per generare codice:

1. Fornire estratti rilevanti di `prd.md` e dell'`analisi_tecnica.md`.
2. TDD obbligatorio: scrivere i test che falliscono prima di implementare.
3. Aggiornare `TASKS.md` e lavorare su branch `feature/ID-...`.
4. Commit frequenti e PR con descrizione, checklist e approvazione umana.

Il documento completo delle linee guida dell'AI Companion è incluso nel repository come `docs/ai_companion_guidelines.md`.

## Checklist PR / Code Review (da includere nella PR)

* [ ] Tutti i test passano
* [ ] Tests critici per IA incluse (Pinky, Inky, Clyde)
* [ ] TASKS.md aggiornato
* [ ] Messaggi di commit coerenti
* [ ] Nessuna libreria di gioco esterna utilizzata
* [ ] Performance controllata (profiling base) se rilevante
* [ ] Reviewer umano conferma il comportamento visivo/di gioco

## Contribuire

1. Apri un issue o scegli una task su `TASKS.md`.
2. Assegna l'ID e crea il branch seguendo le convenzioni.
3. Scrivi test TDD, implementa, aggiorna TASKS.md e crea PR.

Per modifiche architetturali importanti, aggiungere una breve RFC in `docs/` e ottenere consenso del team.

## Licenza

Il repository non include una licenza di default. Aggiungere `LICENSE` con la licenza preferita (es. MIT) prima di rilasciare il codice pubblicamente.

---

Se desideri, posso:

* generare un `package.json` di esempio con gli script necessari;
* creare i file di test di esempio (`tests/ghosts/*.spec.js`) e i moduli base (`src/ghosts/*.js`) per iniziare;
* o aggiornare il README con informazioni specifiche sul deploy o su CI (GitHub Actions).

Dimmi quale opzione preferisci e procedo.
