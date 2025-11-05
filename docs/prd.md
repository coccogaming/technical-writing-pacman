PRD — Gioco di inseguimento in labirinto (simulazione meccaniche classiche)

Ruolo: Senior Software Architect
Lunghezza stimata: 1–2 pagine — documento conciso

1. Obiettivo & target

Obiettivo prodotto: Realizzare una versione fedele nelle meccaniche di un classico gioco di inseguimento in labirinto, sviluppata con Pygame, focalizzata su gameplay arcade, responsività e chiarezza visiva. Non usare marchi o asset originali proprietari: solo simulazione delle meccaniche.
Target audience: giocatori casual e retro-gamer (età 10+), team indie di 1–3 sviluppatori per prototipo educativo, tempo di sessione breve (5–15 min).

2. Meccaniche di gioco

Core loop: muovi il giocatore nel labirinto, raccogli "pillole" per punti, evita nemici; raccogli power-up per invertire vantaggio temporaneo.

Movimento giocatore: 4 direzioni su griglia (tile-based). Input buffer di 200ms per smussare turn-in-flight. Velocità base configurabile; collision detection a livello di tile.

Raccolta pillole: due tipi: pillole normali (1 pt ciascuna), pillole grandi (power-up). Rimozione tile + effetto sonoro + incremento punteggio.

Logica nemici (AI):

Stati: caccia, patrulla/scatola, spaventato, ritorno base.

Pathfinding: A* su griglia con costo uniforme per movimenti; aggiornamento path ogni 8 frame o su cambio di nodo per performance.

Comportamenti differenziati per ciascun nemico (es. inseguitore diretto, ambush, patrol probabilistico).

Gestione collisione: perdita vita se nemico in stato caccia; se nemico spaventato il giocatore guadagna punti e nemico ritorna in ritorno base.

Power-up: power-up temporaneo (es. 8–10s) che mette i nemici in stato spaventato e permette la cattura per punti maggiorati; timer visibile UI.

Vite / livelli: 3 vite base, livelli con mappe progressive e difficoltà (velocità nemici, complessità labirinto).

UI & feedback: contatore punti, vite, timer power-up, stato nemici (indicatori visivi), suoni per eventi critici.

3. Requisiti tecnici

Linguaggio & librerie: Python 3.10+; Pygame 2.x.

Piattaforme target: desktop (Windows, macOS, Linux).

Risoluzioni: supporto windowed e fullscreen; layout scalabile per risoluzioni 800×600 fino a 1920×1080 (scaling basato su tile size).

Input: tastiera (freccie/WASD), gamepad (XInput/SDL gamepad); input remapping semplice.

Persistenza: salvataggio locale JSON per highscore e settings.

Dipendenze opzionali: pytest (test), mypy (type checking).

4. Architettura modulare

Principali entità: Player, Enemy, Tile, Level, PowerUp, HUD, AudioManager, InputManager, SaveManager.

Moduli consigliati:

core/engine.py — loop principale, timing, scena attiva.

core/scene.py — gestione delle scene (menu, gioco, gameover).

game/level.py — loader mappe, gestione tilemap.

game/entities.py — classi Player/Enemy/PowerUp.

game/ai.py — pathfinding, behavior trees/state machines.

io/input.py — astrazione input.

ui/hud.py — rendering HUD.

assets/loader.py — caricamento immagini/audio.

tests/ — test unitari/integrati.

Flow dati essenziale: Input -> InputManager -> Player/AI -> Physics/Collision -> GameState update -> Renderer -> AudioManager.

Comunicazione: eventi interni (pub/sub semplice) per raccolta pillole, morte, power-up attivato.

5. Assets richiesti

Tile set labirinto (sprite sheet, varie varianti) — PNG.

Sprite giocatore in 4 direzioni (animazioni 2–4 frame).

Sprite nemici (4 palette diverse + variante "spaventato" + animazioni).

Pillole normal/power-up (icona + anim).

Font bitmap/bitmap-like per HUD.

Effetti sonori: pillola raccolta, power-up, morte, nemico mangiato, level-up.

Musica loop opzionale (background).

6. Milestones principali & deliverable

MVP (2 settimane): core loop, movimento giocatore, tilemap, raccolta pillole, HUD minimo, 1 livello.
Deliverable: build eseguibile, codice documentato, file README.

Alpha (4 settimane): AI base dei nemici, power-up, 3 livelli, input gamepad, salvataggio punteggi.
Deliverable: pacchetto testabile, lista bug nota.

Beta (6 settimane): polishing grafico/audio, livelli aggiuntivi, opzioni, test regressione, ottimizzazione.
Deliverable: build beta, test report.

Release (8–10 settimane): bugfix, accessibilità, documentazione, packaging per piattaforme.
Deliverable: release build, changelog, guida installazione.

7. Criteri di accettazione & test

Gioco mantiene 60 FPS stabili su target hardware minimo (CPU dual-core, GPU integrata) con risoluzione 1280×720.

Input latency < 100ms misurato a livello di game loop.

Player non attraversa muri (collision detection tile-correct).

AI mostra i 4 comportamenti distinti e reazioni al power-up come specificato.

Test automatici unitari per: loader mappe, collision, salvataggio, transizioni stato nemico.

Playtest (10 sessioni) senza blocchi di livello o exploit di movement.

8. Requisiti di performance & accessibilità

Performance: target 60 FPS; fallback 30 FPS con physics timestep fisso; limitare ricalcolo pathfinding per frame.

Accessibilità: remapping input; modalità daltonica (palette alternative o pattern sui nemici); riduzione flash/animazioni; aumento dimensione UI; testo leggibile (contrasto WCAG AA).

9. Checklist implementativa per sviluppatore