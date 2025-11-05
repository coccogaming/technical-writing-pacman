# 1. Requisiti Funzionali (Gameplay)

## 1.1. Pac-Man (Il Giocatore)

* Movimento basato su griglia (tile-based)
* Controllo tramite 4 direzioni (Su, Giù, Sinistra, Destra)
* L'input deve essere "bufferato" (se premo "su" prima di una svolta, Pac-Man svolta appena possibile)
* Animazione di apertura/chiusura bocca
* Collisione con i "dots", "power pellet" e frutta
* Collisione con i fantasmi (morte o consumo)

## 1.2. I Fantasmi (IA Originale)

Il gioco non deve usare una IA casuale. Deve implementare il targeting specifico di ogni fantasma, basato sul comportamento "modalità" (Scatter, Chase, Frightened).

**Blinky (Rosso):**

* **Chase Mode:** Insegue direttamente la posizione (tile) di Pac-Man

**Pinky (Rosa):**

* **Chase Mode:** Mira a 4 tile di fronte alla direzione attuale di Pac-Man (bug originale incluso: se Pac-Man è rivolto verso l'alto, mira 4 tile sopra e 4 a sinistra)

**Inky (Ciano):**

* **Chase Mode:** Complicato. Prende la posizione di Blinky e la posizione 2 tile davanti a Pac-Man, quindi traccia un vettore tra i due e lo raddoppia. È un'imboscata "a pinza".

**Clyde (Arancione):**

* **Chase Mode:** Se è a più di 8 tile da Pac-Man, si comporta come Blinky (insegue Pac-Man). Se è entro 8 tile, passa alla Scatter Mode e mira al suo angolo (in basso a sinistra).

## 1.3. Modalità dei Fantasmi (Timing)

I fantasmi non inseguono (Chase) costantemente. Alternano tra **Scatter** (vanno ai loro angoli designati) e **Chase** (inseguono). Questo timing è fondamentale e deve essere basato sul timer di livello, non su eventi casuali.

* **Scatter:** I fantasmi si disperdono nei loro angoli.
* **Chase:** I fantasmi inseguono Pac-Man secondo la loro IA (vedi 3.2).
* **Frightened:** Attivato dal consumo di una Power Pellet. I fantasmi diventano blu, invertono la direzione e fuggono (usando uno pseudo-random number generator per le decisioni agli incroci).

## 1.4. Oggetti e Punteggio

* **Pac-Dot:** 10 punti (240 totali)
* **Power Pellet:** 50 punti. Attiva la modalità "Frightened".
* **Fantasmi (consumati):** 200, 400, 800, 1600 punti (in sequenza)
* **Frutta:** Appare periodicamente al centro. Il tipo e il punteggio cambiano con il livello.
* **Vita Extra:** Assegnata a 10.000 punti