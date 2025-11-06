# 1. Introduction and Technical Objectives

This document details the technical architecture, specific technologies, and data structures required to implement a high-fidelity replica of Pac-Man, as defined in the PRD.

The primary objective is to ensure that the architecture is efficient, maintainable, and—most importantly—capable of accurately replicating the deterministic behavior and timing of the original 1980 arcade game, using only Vanilla JavaScript and HTML5 APIs.

# 2. Detailed Technology Stack

## 2.1. HTML5 (index.html)

Structure: A minimal HTML5 document.

Key Elements:

```html
<canvas id="game-canvas"></canvas>
```

The central element for rendering the game. It will have fixed dimensions (e.g., 224x288 pixels) corresponding to the arcade resolution.

HUD (Heads-Up Display) DOM elements:

```html
<div id="hud-score">00</div>
<div id="hud-high-score">00</div>
<div id="hud-lives-display"></div> <!-- contains life sprites -->
```

## 2.2. CSS3 (style.css)

Purpose: Exclusively for page layout and UI presentation, not for game rendering.

Critical Rules:

* Reset/Normalize CSS for cross-browser consistency.
* Center the canvas and use a black background:

```css
body {
  background: #000;
  display: grid;
  place-items: center;
  min-height: 100vh;
}
```

* Scalability and Pixel-Perfect Rendering:

```css
canvas {
  width: 100%; /* or a fixed scaled width, e.g. 448px */
  max-width: 448px; /* Example: 2x scaling */
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

## 2.3. JavaScript (ES6+ Modular)

Approach: Vanilla JavaScript (no frameworks).

ES6 Modules: The codebase will be divided into modules for clear separation of concerns (import/export).

### Proposed File Structure

* **main.js:** Entry point. Initializes the game and starts the loop.
* **constants.js:** Contains all game constants (speed, scores, grid size, AI timings).
* **game.js:** Game class. Manages global state and the game loop.
* **renderer.js:** Renderer class. Handles all canvas drawing.
* **input.js:** InputHandler module. Manages keyboard input.
* **audio.js:** AudioHandler module. Handles audio playback (Web Audio API).
* **maze.js:** Maze class. Stores map data and logic (e.g., wall collisions).
* **entity.js:** Base Entity class (position, direction).
* **pacman.js:** PacMan class (extends Entity).
* **ghost.js:** Ghost class (extends Entity).

# 3. Code Architecture and Data Structures

The architecture will be class-based, with a centralized state manager to replicate the deterministic nature of the original game.

## 3.1. Core Data Structures

### 3.1.1. The Maze (Maze Data)

The game logic is grid-based (tile-based).

Structure: `Array<Array<number>>` (2D matrix, e.g., 28x36)

Content: A static array defined in `constants.js` representing the maze.

Example values:

* 0: Wall
* 1: Empty space
* 2: Pac-Dot
* 3: Power Pellet
* 4: Ghost Gate
* 5: Tunnel Tile
* 6: Inaccessible area (ghost house interior)

### 3.1.2. Game State (Global Game State)

A single object, managed by the Game class, represents the current state.

Example Structure:

```js
let gameState = {
  score: 0,
  highScore: 10000,
  lives: 3,
  level: 1,
  currentTick: 0, // frame counter for timing
  gameMode: 'PLAYING', // 'DEMO', 'PLAYING', 'DYING', 'LEVEL_COMPLETE'

  ghostMode: 'SCATTER', // 'SCATTER', 'CHASE', 'FRIGHTENED'
  ghostModeTimer: 0, // mode switch timer
  frightenTimer: 0, // specific timer for frightened mode

  pelletsRemaining: 244,
  eatenGhostCount: 0 // for score sequence 200, 400, 800...
};
```

### 3.1.3. Entities (Pac-Man and Ghosts)

Entities will be instances of classes (`PacMan`, `Ghost`).

#### Base Entity Class

```js
class Entity {
  constructor(x, y, speed, direction) {
    this.x = x; // pixel position (float)
    this.y = y;
    this.tileX = Math.floor(x / TILE_SIZE);
    this.tileY = Math.floor(y / TILE_SIZE);
    this.speed = speed;
    this.direction = direction; // 'LEFT', 'RIGHT', 'UP', 'DOWN', 'STOPPED'
  }
  update(deltaTime) {}
  draw(renderer) {}
}
```

#### Ghost Class (Extended)

```js
class Ghost extends Entity {
  constructor(config) {
    super(config.startX, config.startY, config.speed, config.startDir);
    this.name = config.name; // 'BLINKY', 'PINKY', etc.
    this.mode = 'SCATTER'; // 'SCATTER', 'CHASE', 'FRIGHTENED', 'EATEN'
    this.targetTile = { x: 0, y: 0 };
    this.scatterTarget = config.scatterTarget; // fixed corner
  }

  updateAI(pacManState, blinkyState) {
    // Sets this.targetTile based on name, mode, and game state
  }

  findNextDirection() {
    // Direction logic (see Section 4.3)
  }
}
```

#### Pac-Man Class (Extended)

```js
class PacMan extends Entity {
  constructor(x, y, speed) {
    super(x, y, speed, 'STOPPED');
    this.nextDirection = 'STOPPED'; // buffered input
    this.animationFrame = 0;
    this.isAlive = true;
  }
}
```

# 4. Core Engines

## 4.1. Game Loop (game.js)

Technology: `requestAnimationFrame(this.loop.bind(this))`

Logic: A fixed timestep will be used to decouple game updates from rendering (FPS). This ensures timing accuracy matching the original.

Example Implementation:

```js
const FIXED_UPDATE_TIME = 1000 / 60;
let lastTime = 0;
let accumulatedTime = 0;

function loop(currentTime) {
  let deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulatedTime += deltaTime;

  while (accumulatedTime >= FIXED_UPDATE_TIME) {
    game.update(FIXED_UPDATE_TIME);
    accumulatedTime -= FIXED_UPDATE_TIME;
  }

  game.render();
  requestAnimationFrame(loop);
}
```

## 4.2. Rendering Engine (renderer.js)

Technology: `CanvasRenderingContext2D`

Asset: A single sprite sheet (`sprites.png`) loaded at startup.

Optimization: The maze background is static and will be drawn once on an off-screen background canvas.

Rendering Cycle:

* draw background (static maze)
* draw dots and power pellets (removed when eaten)
* draw Pac-Man (animated)
* draw ghosts
* update HUD

## 4.3. AI Engine (Ghost Logic)

The most critical part. The AI must not use modern pathfinding (e.g., A*).

Technology: Euclidean Distance Calculation.

At each intersection:

1. A ghost cannot reverse direction (unless its mode changes).
2. The ghost determines its target tile (as per PRD logic).
3. It evaluates the 3 possible directions (forward, left, right).
4. For each valid direction, calculate Euclidean distance (`sqrt(dx² + dy²)`) from the next tile to the target tile.
5. Choose the direction with the smallest distance.

Mode Management (in `game.js`):
A global timer (`gameState.currentTick`) controls mode switching.
An array of constants (`LEVEL_1_TIMING`) defines SCATTER/CHASE sequences per level.

```js
LEVEL_1_TIMING = [
  { mode: 'SCATTER', ticks: 420 },
  { mode: 'CHASE', ticks: 1200 },
  ...
];
```

## 4.4. Input Engine (input.js)

Technology: `window.addEventListener('keydown', ...)`

Buffered Input Logic:

* The last key pressed is stored (`Input.lastPressed = 'UP'`).
* During Pac-Man’s update:

  * If `nextDirection` is valid (no wall), it becomes active at the next tile center.

## 4.5. Collision Detection

Approach: Tile-based for objects, pixel-based for entities.

* **Pac-Man vs Maze:** `maze.isWall(pacMan.tileX + dx, pacMan.tileY + dy)`
* **Pac-Man vs Dots/Pellets:** remove dots when entering a tile.
* **Pac-Man vs Ghosts:** simple AABB pixel collision check.

```js
if (Math.abs(pacMan.x - ghost.x) < 8 && Math.abs(pacMan.y - ghost.y) < 8)
```

Outcome depends on ghost mode (`FRIGHTENED` or not).

## 4.6. Audio Engine (audio.js)

Technology: Web Audio API.

Implementation:

* Create an `AudioContext` at startup.
* Preload all sounds into `AudioBuffer`s.
* Utility functions: `playSound()`, `loopSound()`, `stopSound()`.

### Example Behaviors:

* **Wakka-Wakka:** short sound triggered per dot; needs a playback gate to prevent overlap.
* **Siren Loop:** background loop using `AudioBufferSourceNode` with `loop = true`.
