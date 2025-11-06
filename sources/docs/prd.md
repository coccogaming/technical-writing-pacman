# PROJECT OBJECTIVE - PAC-MAN

## 1. Introduction and Objective

### 1.1. Product Vision

The goal is to develop a **high-fidelity replica** of the original arcade video game **Pac-Man** (Namco, 1980). This project must precisely reproduce the original gameplay, graphics, ghost AI, and behavioral patterns using modern web technologies (**HTML5**, **CSS3**, **JavaScript**).

### 1.2. Scope

**In Scope:**

* Full gameplay for Level 1
* Original ghost AI (Scatter, Chase, Frightened modes)
* Scoring system, lives, sound effects, and intermissions ("cutscenes")

**Out of Scope:**

* Additional levels
* Multiplayer mode
* Online leaderboards
* Any gameplay balancing or mechanics modifications

### 1.3. Reference Resources

* **Gameplay (Video):** [https://youtu.be/i_OjztdQ8iw](https://youtu.be/i_OjztdQ8iw)
* **Mechanics (Wiki):** [https://pacman.fandom.com/wiki/Pac-Man_(game)](https://pacman.fandom.com/wiki/Pac-Man_%28game%29)
* **Context (Wikipedia):** [https://en.wikipedia.org/wiki/Pac-Man](https://en.wikipedia.org/wiki/Pac-Man)

## 2. Technical Architecture

### 2.1. Technology Stack

* **Structure:** HTML5 (using the `<canvas>` element)
* **Style:** CSS3 (for page layout, HUD, and UI animations, but not for in-game rendering)
* **Logic:** JavaScript (ES6+). No external game frameworks (e.g., Phaser) are permitted, ensuring full control over logic, timing, and performance to replicate the original behavior.

### 2.2. Core Components

**Game Loop Engine:**
A loop based on `requestAnimationFrame` to ensure smooth updates (target: 60 FPS). Responsible for invoking both update and render logic at each cycle.

**Rendering Engine:**
Handles drawing of all sprites (Pac-Man, ghosts, maze, pellets) on the `<canvas>`. Uses a sprite sheet for optimized performance and authentic visual output.

**Input Handler:**
Captures keyboard inputs (arrow keys) and manages an input buffer. Pac-Man must respond with the exact timing and responsiveness of the original arcade version (e.g., cornering precision).

**State Manager:**
A global JavaScript object (or class) responsible for tracking game state: score, lives, current level, ghost states, and event timers.

**Audio Engine:**
Uses the Web Audio API (or HTML5 Audio) to manage iconic sound effects (Wakka-Wakka, death, level start, ghost eaten).

**AI Engine:**
The most critical component. Must accurately replicate the deterministic behavior of all four ghosts, adhering to their unique targeting logic and timing patterns (see Section 3.2).
