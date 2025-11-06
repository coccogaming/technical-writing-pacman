# Pac-Man — High-Fidelity Replica (HTML5 + JS)

**This repository** contains the design and development guidelines for a high-fidelity replica of the classic arcade **Pac-Man** (Namco, 1980), implemented using modern web technologies: **HTML5 (<canvas>)**, **CSS3**, **JavaScript (ES6+)**.

> Note: AI-generated code should be treated as a draft. All functional changes require human review and testing (Human-in-the-loop).

---

## Table of Contents

* [Goal](#goal)
* [Main Features](#main-features)
* [Prerequisites](#prerequisites)
* [Getting Started (Local Development)](#getting-started-local-development)
* [Testing and TDD](#testing-and-tdd)
* [Git Workflow / Branching](#git-workflow--branching)
* [TASKS.md and Activity Tracking](#tasksmd-and-activity-tracking)
* [Repository Structure](#repository-structure)
* [Development and Code Quality Guidelines](#development-and-code-quality-guidelines)
* [AI Companion: Operational Prompt (Summary)](#ai-companion-operational-prompt-summary)
* [PR / Code Review Checklist](#pr--code-review-checklist)
* [Contributing](#contributing)
* [License](#license)

---

## Goal

Recreate a faithful replica of the gameplay, graphics, timing, and ghost AI of the original Pac-Man (1980). It is essential to accurately reproduce critical behaviors (e.g., Pinky's original bug, Inky's logic, Scatter/Chase timing, Clyde's distance-based behavior).

## Main Features

* Canvas-based rendering using sprite sheets
* Fixed timestep game loop (target: 60 updates/sec)
* Ghost AI consistent with original arcade behavior (Blinky, Pinky, Inky, Clyde)
* Input buffering for Pac-Man's cornering
* Tile-based collision with pixel-level control for entities
* Audio via Web Audio API
* Test Driven Development required for critical logic

## Prerequisites

* Node.js (for testing and development tooling)
* npm or yarn
* (optional) `npx serve` or `http-server` for local static file serving

## Getting Started (Local Development)

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo>
```

2. Install development dependencies (test runner, optional bundler):

```bash
npm install
# or
yarn
```

3. Start a local static server for development (e.g. npx serve):

```bash
npx serve .
# or
npx http-server . -c-1
```

Open your browser at `http://localhost:5000` (default serve port) to test the canvas.

> Note: The project uses ES6 modules. While `index.html` can be opened directly, some browsers require a local server for module imports.

## Testing and TDD

Development follows a TDD workflow: write Jest tests before implementing critical functions.

Example scripts (`package.json`):

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "lint": "eslint ."
  }
}
```

Example of critical tests to include:

* Pinky: target calculation (including the original bug when Pac-Man faces upward)
* Blinky: target = Pac-Man tile
* Inky: vector calculation (Blinky → tile 2 ahead of Pac-Man) * 2
* Clyde: distance-based behavior (threshold: 8 tiles)
* Frightened Mode: direction reversal and pseudo-random intersection logic

Run tests frequently and never merge to `main` unless all tests pass.

## Git Workflow / Branching

Maintain a disciplined Git workflow:

* Each task has an ID in `TASKS.md` (e.g. `ID-042`).
* Branch naming: `feature/<ID>-short-desc` (e.g. `feature/ID-042-pinky-target`).
* Frequent commits with formatted messages: `feat(ID-042): implement PINKY target calc`.
* PR → mandatory human review before merging to `main`.

## TASKS.md and Activity Tracking

`TASKS.md` is the single source of truth for tasks. Minimal format:

```markdown
# TASKS
- [ ] ID-001 | init repo | project initialization
- [ ] ID-042 | pinky target | test + implementation

# LEGEND
- [ ] = TODO
- [~] = DOING
- [x] = DONE
```

Update the task status in `TASKS.md` during development and include it in the PR description.

## Repository Structure (Suggested)

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

## Development and Code Quality Guidelines

* Always treat AI-generated code as a draft. The developer holds final responsibility.
* Clarity: meaningful comments, use JSDoc where needed.
* Modularity: separate responsibilities (AI, rendering, input, audio, global state).
* Performance: avoid costly operations in the main render loop; use off-screen canvas for static maze elements.
* Determinism: use fixed timestep logic for reproducibility.

## AI Companion: Operational Prompt (Summary)

When using an LLM agent to generate code:

1. Provide relevant excerpts from `prd.md` and `technical_analysis.md`.
2. Follow TDD: write failing tests before implementation.
3. Update `TASKS.md` and work on a `feature/ID-...` branch.
4. Commit frequently and submit PRs with description, checklist, and human approval.

The full AI Companion guideline document is included as `docs/ai_companion_guidelines.md`.

## PR / Code Review Checklist

* [ ] All tests pass
* [ ] Critical AI tests included (Pinky, Inky, Clyde)
* [ ] TASKS.md updated
* [ ] Commit messages consistent
* [ ] No external game libraries used
* [ ] Performance checked (basic profiling) if relevant
* [ ] Human reviewer confirms visual/gameplay behavior

## Contributing

1. Open an issue or pick a task from `TASKS.md`.
2. Assign an ID and create a branch following naming conventions.
3. Write TDD tests, implement, update TASKS.md, and open a PR.

For major architectural changes, add a short RFC in `docs/` and obtain team consensus.

## License

This repository is licensed under the **MIT License**. See the `LICENSE` file for details.
