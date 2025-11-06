# PROJECT OBJECTIVE - PAC-MAN

## 1. Introduction and Objective

### 1.1. Product Vision

The goal is to develop a high-fidelity replica of the original **Pac-Man** arcade video game (Namco, 1980). This project must accurately reproduce the gameplay, graphics, ghost AI, and behavioral patterns of the original, using only modern web technologies (**HTML5**, **CSS3**, **JavaScript**).

### 1.2. Scope

**In Scope:**

* Full gameplay of Level 1
* Original ghost AI (Scatter, Chase, Frightened)
* Scoring, lives, sounds, and intermissions ("cutscenes")

**Out of Scope:**

* Additional levels
* Multiplayer mode
* Online leaderboards
* Gameplay balancing changes

### 1.3. Reference Resources

* **Gameplay (Video):** [https://youtu.be/i_OjztdQ8iw](https://youtu.be/i_OjztdQ8iw)
* **Mechanics (Wiki):** [https://pacman.fandom.com/wiki/Pac-Man_(game)](https://pacman.fandom.com/wiki/Pac-Man_%28game%29)
* **Context (Wikipedia):** [https://en.wikipedia.org/wiki/Pac-Man](https://en.wikipedia.org/wiki/Pac-Man)

## 2. Technical Architecture

### 2.1. Technology Stack

* **Structure:** HTML5 (using the `<canvas>` element)
* **Style:** CSS3 (for page layout, HUD, and UI animations, but not for game rendering)
* **Logic:** JavaScript (ES6+). No external game frameworks (e.g., Phaser) will be used to maintain full control over logic and performance, ensuring faithful replication of the original behavior.

### 2.2. Key Components

**Game Loop Engine:**
A loop based on `requestAnimationFrame` to ensure smooth updates (target 60 FPS). It will be responsible for calling both update and render logic.

**Rendering Engine:**
Handles drawing of all sprites (Pac-Man, ghosts, maze, dots) on the `<canvas>`. It will use a sprite sheet for performance optimization.

**Input Handler:**
Captures keyboard input (arrow keys) and buffers commands. Pac-Man must respond to player input with the exact timing of the original (e.g., cornering).

**State Manager:**
A global JavaScript object (or class) to track the current game state: score, lives, current level, ghost states, and event timers.

**Audio Engine:**
Uses the Web Audio API (or HTML5 Audio) to reproduce iconic sound effects (Wakka-Wakka, death, level start, ghost consumption).

**AI Engine:**
The most critical component. Must replicate the deterministic behavior of all four ghosts (see Section 3.2).
