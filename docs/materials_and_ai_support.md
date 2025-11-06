# Guidelines for High-Quality Code Generated with AI Companion

## Objective

Provide an **operational prompt** and guidelines to help an LLM agent (AI Companion) write iterative, test-driven, and Git-tracked code for the **high-fidelity Pac-Man replica project** (Namco, 1980). All AI-generated code must be treated as a draft and undergo human review (Human-in-the-loop).

---

## 1. Rules of Engagement (Preconditions for the LLM Agent)

1. Always start by generating unit tests for the requested functionality (Test-First / TDD). Never write an implementation without first writing failing automated tests.
2. Always include relevant excerpts from `prd.md` and `technical_analysis.md` when working on critical behaviors (e.g., Pinky and Inky AI, ghost timing). For delicate requirements (like Pinky’s “original bug”), always include the exact requirement text.
3. Code must adhere to the stack: **HTML5 (<canvas>)**, **CSS3**, **JavaScript ES6+**, and must not use any external game frameworks.
4. Create and maintain a progress file named `TASKS.md` at the repository root using the following format:

```markdown
# TASKS
- [ ] ID-001 | short title | short description
- [ ] ID-002 | short title | short description
- [ ] ID-003 | short title | short description

# LEGEND
- [ ] = TODO
- [~] = DOING
- [x] = DONE
```

5. The agent must always work on a dedicated Git branch per task: `feature/<ID>-<short-desc>`, committing frequently with clear messages: `feat(ID-001): implement target calc for PINKY`.
6. Every PR/merge into `main` must include:

   * Passing automated tests
   * A clear description of changes
   * Completed quality control checklist
   * Human approval (human reviewer) before merge

---

## 2. Step-by-Step Operational Flow for the AI Companion (Prompt To-Do)

For each task:

1. **Read `TASKS.md`** and choose the highest-priority (first unstarted TODO) task.
2. **Create a Git branch:** `feature/ID-xxx-short`.
3. **Write unit tests** defining the exact expected behavior. Provide concrete examples (assertions on integer tile coordinates). Run tests — they must fail.
4. **Implement minimal code** to make tests pass. Run tests — they must pass.
5. **Add integration tests** if the component interacts with the Game Loop or other critical modules.
6. **Measure performance** where relevant (baseline: 60 updates/sec simulation for AI logic under Node/Jest). Document results in the commit.
7. **Write brief documentation** (feature README or JSDoc comment) explaining key technical decisions.
8. **Update `TASKS.md`**, marking subtasks as `[~]` during development and `[x]` upon completion.
9. **Create a PR** including description, test list, and checklist for the reviewer.

Example commit flow:

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
  |- package.json (devDependencies: jest, @babel if needed, esbuild for quick bundling)
```

**Note:** Use Jest (or another JS test runner supporting DOM via jsdom) for unit and pure-function tests (target calculation, tile distance, mode switching). For in-browser rendering or timing tests, use manual/visual or E2E tools (e.g., Playwright) in later stages.

---

## 4. Critical Test Guidelines (Concrete Examples)

*These examples must be included as test cases when prompting the AI to implement ghost AI logic.*

### 4.1. Pinky (Original Bug)

* Pac-Man at tile (14, 17), direction UP.
* Pinky must target tile (10, 13) (4 tiles ahead + 4 to the left, including the bug). The test should verify the target tile calculation.

### 4.2. Blinky

* Blinky target = Pac-Man’s current tile (e.g., Pac-Man tile (14, 17) => target (14, 17)).

### 4.3. Inky (Pinch Ambush)

* Given: Pac-Man tile (14, 17), dir RIGHT; Blinky tile (12, 16).
* Compute: find tile 2 ahead of Pac-Man (16,17), vector from Blinky (12,16) to that point => (4,1), double it => (8,2), target = Blinky + (8,2) = (20,18). Verify with assert.

### 4.4. Clyde

* If tile distance (Clyde, Pac-Man) > 8 => target = Pac-Man tile.
* If distance <= 8 => target = scatter target (e.g., bottom-left corner, e.g. (0, 35)).

### 4.5. Frightened Mode

* After consuming a Power Pellet, set `ghost.mode = 'FRIGHTENED'`. Ghosts must immediately reverse direction (test: direction inverted) and move pseudo-randomly at intersections.

---

## 5. Code Review Checklist (to include in PR)

* [ ] All tests pass locally and in CI
* [ ] Critical AI tests included: Pinky, Inky, Clyde
* [ ] Edge cases covered (map borders, tunnel, ghost house)
* [ ] No external game libraries used
* [ ] Performance: no blocking operations in main update loop
* [ ] Clear commit messages and updated TASKS.md
* [ ] Minimal feature documentation
* [ ] Human reviewer validated gameplay results (visual testing)

---

## 6. Operational Prompt for the AI Companion (To Send to the LLM Agent When Requesting Code)

> You are an AI Companion assigned to implement a single task for the Pac-Man project. Follow the TDD + Git + TASKS.md workflow described here. First, read `TASKS.md` and pick the highest-priority task. If the task involves AI or timing, always include relevant fragments from `prd.md` and `technical_analysis.md` in your prompt. Write Jest tests for the function you plan to implement and make them fail intentionally. Then implement the minimal code to make them pass. Commit frequently. Never merge to `main` without PR, tests, and human approval.

### Technical Requirements in the Prompt:

* Stack: HTML5 canvas, CSS3, ES6 JavaScript
* TDD required
* Git branching per task
* `TASKS.md` updated during development
* Unit tests for all critical logic (ghost AI, input buffering, collisions)

---

## 7. Example Tests (Jest Boilerplate)

```javascript
// tests/ghosts/pinky.spec.js
import { calcPinkyTarget } from '../../src/ghosts/pinky.js';

test('Pinky target calculation - Pac-Man UP (original bug)', () => {
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

* Treat AI-generated code as a draft: the final responsibility lies with the human developer.
* If the agent produces code that changes gameplay rules (e.g., balance or feature additions), flag it as `BREAKING_CHANGE` and do not merge without product team approval.

---

## 9. Useful Attachments (to Include in Prompts When Relevant)

* Excerpts from `prd.md` related to AI and timing
* Excerpts from `technical_analysis.md` (Game Loop, Fixed Timestep, Maze structure)

---

## 10. Delivery

This document serves as the *single source of truth* for building replicable and safe prompts for the AI Companion. Include it in full as context when asking an LLM agent to write critical code for the Pac-Man project.