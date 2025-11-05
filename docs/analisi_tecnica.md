## 1. Introduzione e Obiettivi Tecnici

Questo documento dettaglia l'architettura tecnica, le tecnologie specifiche e le strutture dati necessarie per implementare la replica ad alta fedeltà di Pac-Man, come definito nel PRD.

<<<<<<< HEAD
L'obiettivo primario è garantire che l'architettura sia efficiente, manutenibile e, soprattutto, capace di replicare accuratamente il comportamento deterministico e il timing del gioco arcade originale del 1980, utilizzando esclusivamente Vanilla JavaScript e API HTML5.
=======
* Movimento basato su griglia (tile-based)
* Controllo tramite freccette in 4 direzioni: freccia in su/w = pacman si muove verso l'alto; freccia in giù/s = pacman si muove verso il basso; freccia sinistra/a = pacman si muove verso sinistra; freccia destra/d = pacman si muove verso destra.
* Animazione di apertura/chiusura bocca
* Collisione con i "dots", "power pellet" e frutta
* Collisione con i fantasmi (morte o consumo)
* Collisione coi muri
>>>>>>> df043e521a6ccf311a673ac2fff5427171f829ad

## 2. Stack Tecnologico Dettagliato

### 2.1. HTML5 (index.html)

**Struttura:** Un documento HTML5 minimale.

**Elementi Chiave:**

* `<canvas id="game-canvas"></canvas>`: L'elemento centrale per il rendering del gioco. Avrà dimensioni fisse (es. 224x288 pixel) corrispondenti alla risoluzione arcade.
* Elementi DOM per l'HUD (Heads-Up Display):

  ```html
  <div id="hud-score">00</div>
  <div id="hud-high-score">00</div>
  <div id="hud-lives-display"></div>
  ```

### 2.2. CSS3 (style.css)

**Scopo:** Esclusivamente per il layout della pagina e la presentazione dell'UI, non per il rendering del gioco.

**Regole Critiche:**

* Reset/Normalize CSS per coerenza cross-browser.
* Centratura del canvas e sfondo nero:

  ```css
  body { background: #000; display: grid; place-items: center; min-height: 100vh; }
  ```
* Scalabilità e Pixel-Perfect Rendering:

  ```css
  canvas {
      width: 100%;
      max-width: 448px; /* Esempio: 2x scaling */
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
  }
  ```

### 2.3. JavaScript (ES6+ Modulare)

**Approccio:** Vanilla JavaScript (Nessun Framework).

**Moduli e Struttura dei File:**

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

## 3. Architettura del Codice e Strutture Dati

### 3.1. Strutture Dati Fondamentali

#### 3.1.1. Il Labirinto (Maze Data)

Basato su una matrice 2D (`Array<Array<number>>`, es. 28x36) definita in `constants.js`.

Valori tipici:

```
0: Muro (Wall)
1: Spazio Vuoto (Empty)
2: Pac-Dot (Dot)
3: Power Pellet (Pellet)
4: Cancello Casa Fantasmi (Gate)
5: Tunnel (Tunnel Tile)
6: Spazio Inaccessibile (fuori mappa)
```

#### 3.1.2. Stato del Gioco (Global Game State)

Gestito dalla classe `Game`.

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

#### 3.1.3. Entità (Pac-Man e Fantasmi)

Basate sulla classe `Entity`.

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

Ereditarietà:

* `PacMan` con gestione input e animazione.
* `Ghost` con gestione AI e targetTile.

## 4. Motori Principali (Core Engines)

### 4.1. Game Loop (Game.js)

Usa `requestAnimationFrame` con timestep fisso:

```js
const FIXED_UPDATE_TIME = 1000 / 60;
function loop(currentTime) {
    // logica e rendering separati
}
```

### 4.2. Rendering Engine (Renderer.js)

Utilizza `CanvasRenderingContext2D`. Il labirinto statico è disegnato su un canvas off-screen per ottimizzare le prestazioni.

### 4.3. AI Engine (Logica dei Fantasmi)

Basato su **distanza euclidea**, nessun pathfinding moderno.

* Ogni fantasma ha un targetTile calcolato secondo le regole del PRD.
* Direzioni possibili valutate su 3 direzioni (no reverse).

### 4.4. Input Engine (Input.js)

Sistema di **input buffering** per permettere la sterzata anticipata.

### 4.5. Collision Detection

* **Tile-based** per muri e dots.
* **Pixel-based (AABB)** per entità.

### 4.6. Audio Engine (Audio.js)

Basato su **Web Audio API**, con suoni pre-caricati in `AudioBuffer` e gestione dei loop per sirene e modalità frightened.
