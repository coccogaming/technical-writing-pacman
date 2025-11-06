## 1. Introduction and Technical Objectives

This document outlines the technical architecture, specific technologies, and data structures required to implement a high-fidelity replica of Pac-Man, as defined in the PRD.

* Tile-based movement system
* Control via arrow keys in 4 directions: Up Arrow/W = Pac-Man moves upward; Down Arrow/S = Pac-Man moves downward; Left Arrow/A = Pac-Man moves left; Right Arrow/D = Pac-Man moves right.
* Mouth opening/closing animation
* Collision detection with dots, power pellets, and fruit
* Collision detection with ghosts (death or ghost consumption)
* Collision detection with walls

## 2. Detailed Technology Stack

### 2.1. HTML5 (index.html)

**Structure:** A minimal HTML5 document.

**Key Elements:**

* `<canvas id="game-canvas"></canvas>`: The primary rendering surface for the game. Fixed dimensions (e.g., 224x288 pixels) corresponding to the original arcade resolution.
* DOM elements for the HUD (Heads-Up Display):

  ```html
  <div id="hud-score">00</div>
  <div id="hud-high-score">00</div>
  <div id="hud-lives-display"></div>
  ```

### 2.2. CSS3 (style.css)

**Purpose:** Used exclusively for page layout and UI presentation, not for game rendering.

**Critical Rules:**

* Reset/Normalize CSS for cross-browser consistency.
* Center the canvas and set a black background:

  ```css
  body { background: #000; display: grid; place-items: center; min-height: 100vh; }
  ```
* Scaling and Pixel-Perfect Rendering:

  ```css
  canvas {
      width: 100%;
      max-width: 448px; /* Example: 2x scaling */
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
  }
  ```

### 2.3. JavaScript (ES6+ Modular)

**Approach:** Vanilla JavaScript (no frameworks).

**File and Module Structure:**

```
main.js
constants.js
game.js
renderer.js
input.js
audio.js
maze.js
entity.js
pacman.js
ghost.js
```

## 3. Code Architecture and Data Structures

The architecture is class-based, with a centralized state manager to preserve the deterministic behavior of the original game.

### 3.1. Core Data Structures

#### 3.1.1. Maze Data

Defined as a 2D matrix (`Array<Array<number>>`, e.g., 28x36) in `constants.js`.

Typical values:

```
0: Wall
1: Empty Space
2: Pac-Dot
3: Power Pellet
4: Ghost House Gate
5: Tunnel Tile
6: Inaccessible Area (outside map)
```

#### 3.1.2. Global Game State

Managed by the `Game` class.

```js
let gameState = {
    score: 0,
    highScore: 10000,
    lives: 3,
    level: 1,
    currentTick: 0,
    gameMode: 'PLAYING',
    ghostMode: 'SCATTER',
    ghostModeTimer: 0,
    frightenTimer: 0,
    pelletsRemaining: 244,
    eatenGhostCount: 0
};
```

#### 3.1.3. Entities (Pac-Man and Ghosts)

Based on the `Entity` class.

```js
class Entity {
    constructor(x, y, speed, direction) {
        this.x = x;
        this.y = y;
        this.tileX = Math.floor(x / TILE_SIZE);
        this.tileY = Math.floor(y / TILE_SIZE);
        this.speed = speed;
        this.direction = direction;
    }
}
```

Inheritance:

* `PacMan`: handles input and animation.
* `Ghost`: handles AI logic and target tile selection.

## 4. Core Engines

### 4.1. Game Loop (game.js)

Uses `requestAnimationFrame` with a fixed timestep:

```js
const FIXED_UPDATE_TIME = 1000 / 60;
function loop(currentTime) {
    // separated logic and rendering
}
```

### 4.2. Rendering Engine (renderer.js)

Uses the `CanvasRenderingContext2D`. The static maze is drawn on an off-screen canvas for performance optimization.

### 4.3. AI Engine (Ghost Logic)

Based on **Euclidean distance**, with no modern pathfinding algorithms.

* Each ghost calculates a target tile according to PRD rules.
* Possible movement directions are evaluated across three options (no reversal allowed).

### 4.4. Input Engine (input.js)

Implements **input buffering** to allow early direction changes (anticipation turns).

### 4.5. Collision Detection

* **Tile-based:** for walls and dots.
* **Pixel-based (AABB):** for entity interactions.

### 4.6. Audio Engine (audio.js)

Uses the **Web Audio API**, with preloaded `AudioBuffer` assets and loop management for siren sounds and frightened mode music.
