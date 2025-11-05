1. Introduzione e Obiettivi Tecnici
Questo documento dettaglia l'architettura tecnica, le tecnologie specifiche e le strutture dati necessarie per implementare la replica ad alta fedeltà di Pac-Man, come definito nel PRD.

L'obiettivo primario è garantire che l'architettura sia efficiente, manutenibile e, soprattutto, capace di replicare accuratamente il comportamento deterministico e il timing del gioco arcade originale del 1980, utilizzando esclusivamente Vanilla JavaScript e API HTML5.

2. Stack Tecnologico Dettagliato
2.1. HTML5 (index.html)
Struttura: Un documento HTML5 minimale.

Elementi Chiave:

<canvas id="game-canvas"></canvas>: L'elemento centrale per il rendering del gioco. Avrà dimensioni fisse (es. 224x288 pixel) corrispondenti alla risoluzione arcade.

Elementi DOM per l'HUD (Heads-Up Display):

<div id="hud-score">00</div>

<div id="hud-high-score">00</div>

<div id="hud-lives-display"></div> (conterrà immagini/sprite delle vite)

2.2. CSS3 (style.css)
Scopo: Esclusivamente per il layout della pagina e la presentazione dell'UI, non per il rendering del gioco.

Regole Critiche:

Reset/Normalize CSS per coerenza cross-browser.

Centratura del canvas e sfondo nero:

CSS

body { background: #000; display: grid; place-items: center; min-height: 100vh; }
Scalabilità e Pixel-Perfect Rendering:

CSS

canvas {
    width: 100%; /* O una larghezza fissa scalata, es. 448px */
    max-width: 448px; /* Esempio: 2x scaling */
    image-rendering: pixelated; /* Mantiene la grafica "a blocchi" */
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}
2.3. JavaScript (ES6+ Modulare)
Approccio: Vanilla JavaScript (Nessun Framework).

Moduli ES6: Il codice sarà suddiviso in moduli per separare le responsabilità (import/export).

Struttura dei File (Proposta):

main.js: Entry point. Inizializza il gioco e avvia il loop.

constants.js: Contiene tutte le costanti di gioco (velocità, punteggi, dimensioni griglia, timing IA).

game.js: Classe Game. Gestisce lo stato globale e il game loop.

renderer.js: Classe Renderer. Gestisce il disegno su canvas.

input.js: Modulo InputHandler. Gestisce l'input da tastiera.

audio.js: Modulo AudioHandler. Gestisce la riproduzione audio (Web Audio API).

maze.js: Classe Maze. Contiene i dati della mappa e la logica (es. controllo collisioni con muri).

entity.js: Classe base Entity (posizione, direzione).

pacman.js: Classe PacMan (eredita da Entity).

ghost.js: Classe Ghost (eredita da Entity).

3. Architettura del Codice e Strutture Dati
L'architettura sarà basata su classi e su un gestore di stato centrale per replicare la natura deterministica del gioco originale.

3.1. Strutture Dati Fondamentali
3.1.1. Il Labirinto (Maze Data)
La logica del gioco è basata su tile (griglia).

Struttura: Array<Array<number>> (Matrice 2D, es. 28x36).

Contenuto: Un array statico definito in constants.js che rappresenta il labirinto.

Valori (Esempio):

0: Muro (Wall)

1: Spazio Vuoto (Empty)

2: Pac-Dot (Dot)

3: Power Pellet (Pellet)

4: Cancello Casa Fantasmi (Gate)

5: Tunnel (Tunnel Tile)

6: Spazio Inaccessibile (fuori mappa o casa fantasmi)

3.1.2. Stato del Gioco (Global Game State)
Un singolo oggetto, gestito dalla classe Game, che rappresenta lo stato corrente.

Struttura: Object

Proprietà Esempio:

JavaScript

let gameState = {
    score: 0,
    highScore: 10000,
    lives: 3,
    level: 1,
    currentTick: 0, // Contatore frame per il timing
    gameMode: 'PLAYING', // 'DEMO', 'PLAYING', 'DYING', 'LEVEL_COMPLETE'

    ghostMode: 'SCATTER', // 'SCATTER', 'CHASE', 'FRIGHTENED'
    ghostModeTimer: 0, // Timer per il cambio modalità
    frightenTimer: 0, // Timer specifico per Frightened

    pelletsRemaining: 244,
    eatenGhostCount: 0 // Per punteggio 200, 400, 800...
};
3.1.3. Entità (Pac-Man e Fantasmi)
Le entità saranno istanze di classi (PacMan, Ghost).

Struttura (Classe Entity base):

JavaScript

class Entity {
    constructor(x, y, speed, direction) {
        this.x = x; // Posizione in pixel (float)
        this.y = y; // Posizione in pixel (float)

        this.tileX = Math.floor(x / TILE_SIZE); // Posizione griglia (int)
        this.tileY = Math.floor(y / TILE_SIZE); // Posizione griglia (int)

        this.speed = speed; // Velocità (pixel per update)
        this.direction = direction; // 'LEFT', 'RIGHT', 'UP', 'DOWN', 'STOPPED'
    }

    update(deltaTime) { /* Logica di movimento base */ }
    draw(renderer) { /* Logica di disegno */ }
}
Struttura (Classe Ghost estesa):

JavaScript

class Ghost extends Entity {
    constructor(config) {
        super(config.startX, config.startY, config.speed, config.startDir);
        this.name = config.name; // 'BLINKY', 'PINKY', ...
        this.mode = 'SCATTER'; // 'SCATTER', 'CHASE', 'FRIGHTENED', 'EATEN'
        this.targetTile = { x: 0, y: 0 }; // Tile obiettivo per l'IA
        this.scatterTarget = config.scatterTarget; // Angolo fisso
        // ...altre proprietà specifiche
    }

    updateAI(pacManState, blinkyState) {
        // Logica per settare this.targetTile
        // (basato su this.name, this.mode, pacManState, blinkyState)
    }

    findNextDirection() {
        // Logica di pathfinding (vedi Sezione 4.3)
    }
}
Struttura (Classe PacMan estesa):

JavaScript

class PacMan extends Entity {
    constructor(x, y, speed) {
        super(x, y, speed, 'STOPPED');
        this.nextDirection = 'STOPPED'; // Input bufferato
        this.animationFrame = 0;
        this.isAlive = true;
    }

    // ...logica per gestione input e animazione
}
4. Motori Principali (Core Engines)
4.1. Game Loop (Game.js)
Tecnologia: requestAnimationFrame(this.loop.bind(this))

Logica: Si userà un timestep fisso (Fixed Timestep) per disaccoppiare la logica di gioco (updates) dal rendering (FPS). Questo è fondamentale per replicare il timing dell'originale.

Implementazione (Pseudo-codice):

JavaScript

const FIXED_UPDATE_TIME = 1000 / 60; // Target 60 update al secondo
let lastTime = 0;
let accumulatedTime = 0;

function loop(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulatedTime += deltaTime;

    while (accumulatedTime >= FIXED_UPDATE_TIME) {
        game.update(FIXED_UPDATE_TIME); // Aggiorna logica (IA, fisica)
        accumulatedTime -= FIXED_UPDATE_TIME;
    }

    game.render(); // Disegna sul canvas
    requestAnimationFrame(loop);
}
4.2. Rendering Engine (Renderer.js)
Tecnologia: CanvasRenderingContext2D

Asset: Un unico Sprite Sheet (sprites.png) caricato all'avvio.

Ottimizzazione (Background Canvas): Il labirinto (muri) è statico. Verrà disegnato una volta sola su un <canvas> off-screen (background canvas) all'inizio del livello.

Ciclo di Rendering:

clear(): (Opzionale, se non si ridisegna tutto)

draw(backgroundCanvas): Copia il labirinto statico.

draw(maze.dots): Disegna i dots e i power pellets (che devono essere rimossi).

draw(pacMan): Disegna lo sprite di Pac-Man (gestendo l'animazione).

draw(ghosts): Disegna gli sprite dei fantasmi.

draw(hud): Aggiorna il testo/sprite nell'HUD.

4.3. AI Engine (Logica dei Fantasmi)
Questa è la parte più critica. L'IA non deve usare pathfinding moderno (come A*).

Tecnologia: Calcolo della Distanza Euclidea.

Logica (Ad ogni incrocio):

Un fantasma non può invertire la sua direzione (a meno che non cambi modalità).

Il fantasma determina la sua targetTile (come da PRD, Sezione 3.2).

Controlla le 3 direzioni possibili (avanti, sinistra, destra).

Per ogni direzione valida (non un muro), calcola la distanza Euclidea (sqrt(dx^2 + dy^2)) dalla tile successiva alla targetTile.

Sceglie la direzione che risulta nella distanza minore.

Gestione Modalità (in Game.js):

Il Game.js gestirà un timer globale (gameState.currentTick).

Un array di costanti (in constants.js) definirà i cambi SCATTER/CHASE per ogni livello (es. LEVEL_1_TIMING = [{ mode: 'SCATTER', ticks: 420 }, { mode: 'CHASE', ticks: 1200 }, ...]).

Il Game.js aggiornerà gameState.ghostMode e lo comunicherà ai fantasmi, che reagiranno (invertendo la rotta).

4.4. Input Engine (Input.js)
Tecnologia: window.addEventListener('keydown', ...)

Logica (Buffering): L'input dell'utente deve essere accodato (buffered) per permettere il "cornering" (svoltare prima dell'angolo).

Implementazione:

L'EventListener salva l'ultimo tasto premuto (es. Input.lastPressed = 'UP').

Nel PacMan.update():

Controlla se Input.lastPressed è una direzione valida (es. se vado a destra, UP è una direzione valida all'incrocio).

Se sì, PacMan.nextDirection = Input.lastPressed.

Quando Pac-Man raggiunge il centro di una tile, controlla se nextDirection è valida (non un muro). Se sì, PacMan.direction = PacMan.nextDirection.

4.5. Collision Detection
Approccio: Basato su griglia (Tile-based) per gli oggetti, e basato su coordinate (Pixel-based) per le entità.

Pac-Man vs Labirinto: maze.isWall(pacMan.tileX + dx, pacMan.tileY + dy) (controllo prima di muoversi).

Pac-Man vs Dots/Pellets:

Quando Pac-Man entra in una nuova tile: if (maze.getTile(pacMan.tileX, pacMan.tileY) === DOT) { ... }

Rimuove il dot dalla matrice mazeData e aggiorna il punteggio.

Pac-Man vs Fantasmi:

Poiché le entità si muovono "tra" le tile, un controllo basato su tile non è sufficiente.

Si userà un controllo AABB (Axis-Aligned Bounding Box) semplice basato sulle coordinate in pixel.

if (Math.abs(pacMan.x - ghost.x) < 8 && Math.abs(pacMan.y - ghost.y) < 8) (8 pixel è un esempio di "hitbox").

Se la collisione avviene, si controlla ghost.mode ('FRIGHTENED' o no) per determinare l'esito.

4.6. Audio Engine (Audio.js)
Tecnologia: Web Audio API (necessaria per il controllo preciso dei loop e la bassa latenza).

Implementazione:

AudioContext creato all'avvio.

Tutti i suoni (.wav o .mp3) vengono caricati in AudioBuffer prima che il gioco inizi.

Funzioni di utility: playSound(bufferName), loopSound(bufferName), stopSound(bufferName).

Wakka-Wakka: Questo è complesso. Non è un loop. È un suono corto (wakka.wav) che viene riprodotto ogni volta che Pac-Man mangia un "dot". Sarà necessario un "gate" per evitare che i suoni si sovrappongano troppo rapidamente.

Siren/Loop: I loop (sirena, modalità frightened) saranno gestiti con AudioBufferSourceNode impostato su loop = true.