# Guidelines for High-Quality Code Generated with the AI Companion

## Objective

Provide an **operational prompt** and a set of guidelines to instruct an LLM agent (AI Companion) in performing iterative, test-driven, and git-tracked development for the **high-fidelity Pac‑Man replica project** (Namco, 1980). All code must be treated as a draft and remain under **human-in-the-loop review**.

---

## 1. Engagement Rules (Preconditions for the LLM Agent)

1. Always start by generating unit tests for the requested functionality (Test‑First / TDD). Never write an implementation without first writing failing automated tests.
2. Always include relevant excerpts from `prd.md` and `analisi_tecnica.md` in the working prompt when implementing critical behaviors (e.g., Pinky or Inky AI, ghost mode timing). For known edge cases (such as the *original Pinky bug*), include the exact requirement statement in the prompt.
3. The code must adhere to the defined stack: **HTML5 (<canvas>)**, **CSS3**, **JavaScript ES6+**, with **no external game frameworks**.
4. Maintain a progress file named `TASKS.md` at the repository root, following this format:

```markdown
# TASKS
- [ ] ID-001 | short title | brief description
- [ ] ID-002 | short title | brief description
- [ ] ID-003 | short title | brief description

# LEGEND
- [ ] = TODO
- [~] = DOING
- [x] = DONE
```

5. The AI agent must always work on a dedicated git branch per task: `feature/<ID>-<short-desc>`, and perform frequent commits with clear messages, e.g. `feat(ID-001): implement target calc for PINKY`.
6. Each PR/merge into `main` must include:

   * All tests passing (green)
   * A description of changes
   * A completed QA checklist
   * Human approval (reviewer validation) before merge

---

## 2. Step-by-Step Operational Flow for the AI Companion

For each task:

1. **Read `TASKS.md`** and select the highest-priority (first non-started TODO) item.
2. **Create a git branch**: `feature/ID-xxx-short`.
3. **Write unit tests** that define the exact expected behavior. Provide concrete examples (assert integer tile coordinates for target positions). Run the tests – they must fail.
4. **Implement the minimal code** required to make the tests pass. Run the tests again – they must pass.
5. **Add integration tests** if the component interacts with the Game Loop or other core modules.
6. **Measure performance** if applicable (baseline: 60 updates/sec for AI logic simulation in node/jest). Document results in the commit message.
7. **Write concise documentation** (feature README or JSDoc comment) explaining key technical decisions.
8. **Update `TASKS.md`** marking the subtask as `[~]` while in progress and `[x]` upon completion.
9. **Create a Pull Request (PR)** with a detailed description, test summary, and review checklist.

Example commit workflow:

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

## 3. Minimum Repository Structure and Conventions

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
  |- package.json (devDependencies: jest, @babel if needed, esbuild for fast bundling)
```

**Note:** Use Jest (or another JS test runner supporting DOM via jsdom) for unit and pure-function tests (e.g., target calculation, tile distance, mode transitions). For rendering or timing validation, use manual/visual tests or E2E tools (e.g., Playwright) in later development stages.

---

## 4. Critical Test Guidelines (Concrete Examples)

*These examples must be included as test cases in the prompt when implementing ghost AI.*

### 4.1. Pinky (Original Bug)

* Pac-Man at tile (14, 17), direction UP.
* Pinky must target tile (10, 13) (4 tiles ahead + 4 tiles left, including the bug). Test should assert exact targetTile.

### 4.2. Blinky

* Target = Pac-Man’s current tile (e.g., Pac-Man tile (14, 17) → target (14, 17)).

### 4.3. Inky (Ambush Logic)

* Given: Pac-Man tile (14, 17), dir RIGHT; Blinky tile (12, 16).
* Compute tile 2 ahead of Pac-Man (16,17), draw vector from Blinky (12,16) to that point → (4,1), double it → (8,2), target = Blinky + (8,2) = (20,18). Verify via assert.

### 4.4. Clyde

* If distance (Clyde, Pac-Man) > 8 → target = Pac-Man tile.
* If distance ≤ 8 → target = scatter corner (bottom-left, e.g., (0, 35)).

### 4.5. Frightened Mode

* After consuming a Power Pellet, set `ghost.mode = 'FRIGHTENED'`. Ghosts must immediately reverse direction (test: direction inverted) and move using pseudo-random choices at intersections.

---

## 5. Code Review Checklist (for PRs)

* [ ] All tests pass locally and in CI
* [ ] Critical AI tests (Pinky, Inky, Clyde) included
* [ ] Edge cases covered (map borders, tunnel, ghost house)
* [ ] No use of external game libraries
* [ ] Performance: no blocking operations in main update loop
* [ ] Clear commit messages and updated TASKS.md
* [ ] Minimal feature documentation provided
* [ ] Human reviewer verified gameplay results (visual testing)

---

## 6. Operational Prompt for the AI Companion (to use for each coding session)

> You are an AI Companion tasked with implementing a single feature for the Pac‑Man project. Strictly follow the TDD + git + TASKS.md process described here. Start by reading TASKS.md and select the highest-priority task. If the task involves AI or timing, always include relevant excerpts from `prd.md` and `analisi_tecnica.md` in your prompt. Write Jest tests first (they must fail). Then implement the minimal code to make them pass. Commit frequently. Never merge to `main` without a PR, passing tests, and human approval.

### Technical Requirements in the Prompt:

* Stack: HTML5 canvas, CSS3, ES6 JavaScript
* TDD required
* Git branching per task
* TASKS.md must be updated during progress
* Unit tests for all critical logic (ghost AI, input buffering, collision detection)

---

## 7. Example Jest Test Boilerplate

```javascript
// tests/ghosts/pinky.spec.js
import { calcPinkyTarget } from '../../src/ghosts/pinky.js';

test('Pinky target calculation - PacMan UP (original bug)', () => {
  const pac = { tileX: 14, tileY: 17, dir: 'UP' };
  const result = calcPinkyTarget(pac);
  expect(result).toEqual({ x: 10, y: 13 });
});
```

```javascript
// tests/ghosts/inky.spec.js
import { calcInkyTarget } from '../../src/ghosts/inky.js';

test('Inky target calculation example', () => {
  const pac = { tileX: 14, tileY: 17, dir: 'RIGHT' };
  const blinky = { tileX: 12, tileY: 16 };
  const result = calcInkyTarget(pac, blinky);
  expect(result).toEqual({ x: 20, y: 18 });
});
```

---

## 8. Safety and Quality Notes

* Treat AI-generated code as a draft: final responsibility lies with the human developer.
* If the AI produces code that modifies core gameplay rules (e.g., balance or new features), flag it as `BREAKING_CHANGE` and do not merge without product team approval.

---

## 9. Useful Attachments (Include in Prompt When Relevant)

* Excerpts from `prd.md` related to AI and mode timing
* Excerpts from `analisi_tecnica.md` (Game Loop, Fixed Timestep, Maze structure)

---

## 10. Delivery

This document serves as the **single source of truth** for creating safe, repeatable prompts for the AI Companion. Copy it entirely as context whenever instructing an LLM to write critical code for the Pac‑Man project.
