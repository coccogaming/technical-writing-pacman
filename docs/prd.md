#OBIETTIVO DI PROGETTO-PACMAN
1. Introduzione e Obiettivo
1.1. Visione del Prodotto
L'obiettivo è sviluppare una replica ad alta fedeltà del videogioco arcade originale Pac-Man (Namco, 1980). Questo progetto deve replicare esattamente il gameplay, la grafica, l'IA dei fantasmi e i pattern di comportamento dell'originale, utilizzando esclusivamente tecnologie web moderne (HTML5, CSS3, JavaScript).

1.2. Scopo (Scope)
In Scope: Gameplay completo del Livello 1, IA originale dei fantasmi (Scatter, Chase, Frightened), punteggi, vite, suoni e intermezzi ("cutscene").

Out of Scope: Nuovi livelli, modalità multiplayer, leaderboard online, modifiche al bilanciamento del gioco.

1.3. Risorse di Riferimento
Gameplay (Video): https://youtu.be/i_OjztdQ8iw

Meccaniche (Wiki): https://pacman.fandom.com/wiki/Pac-Man_(game)

Contesto (Wikipedia): https://it.wikipedia.org/wiki/Pac-Man

2. Architettura Tecnica
2.1. Stack Tecnologico
Struttura: HTML5 (utilizzando l'elemento <canvas>).

Stile: CSS3 (per il layout della pagina, HUD, e animazioni UI, ma non per il rendering del gioco).

Logica: JavaScript (ES6+). Nessun framework di gioco (es. Phaser) per mantenere il controllo totale sulla logica e sulle prestazioni, replicando il comportamento originale.

2.2. Componenti Chiave
Game Loop Engine: Un loop basato su requestAnimationFrame per garantire aggiornamenti fluidi (target 60 FPS). Sarà responsabile di chiamare la logica di update e la logica di rendering.

Rendering Engine: Gestirà il disegno di tutti gli sprite (Pac-Man, fantasmi, labirinto, "dots") sul <canvas>. Utilizzerà uno sprite sheet per efficienza.

Input Handler: Catturerà gli input da tastiera (Tasti Freccia) e li accoderà. Pac-Man deve rispondere ai comandi con il timing esatto dell'originale (es. "cornering").

State Manager: Un oggetto JS globale (o classe) per tracciare lo stato del gioco: punteggio, vite, livello attuale, stato dei fantasmi, timer degli eventi.

Audio Engine: Utilizzerà l'API Web Audio (o HTML5 Audio) per gestire gli effetti sonori iconici (Wakka-Wakka, morte, inizio livello, consumo fantasmi).

AI Engine: Il componente più critico. Deve replicare il comportamento deterministico dei quattro fantasmi (vedi Sezione 3.2).