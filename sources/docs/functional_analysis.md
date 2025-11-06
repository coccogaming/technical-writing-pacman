# 1. Functional Requirements (Gameplay)

## 1.1. Pac-Man (The Player)

* Tile-based movement system
* Controlled using arrow keys in 4 directions: Up Arrow/W = move upward; Down Arrow/S = move downward; Left Arrow/A = move left; Right Arrow/D = move right.
* Input must be buffered (if the player presses a direction before a turn, Pac-Man should turn at the earliest possible moment)
* Animation for mouth opening and closing
* Collision detection with dots, power pellets, and fruits
* Collision detection with ghosts (death or ghost consumption)
* Collision detection with walls

## 1.2. Ghosts (Original AI)

The game must not use random AI. It must implement the original targeting behavior for each ghost, based on mode switching (Scatter, Chase, Frightened).

**Blinky (Red):**

* **Chase Mode:** Targets Pac-Man's current tile position directly.

**Pinky (Pink):**

* **Chase Mode:** Targets a position 4 tiles ahead of Pac-Man's current facing direction (including the original bug: if Pac-Man is facing upward, target 4 tiles up and 4 tiles left).

**Inky (Cyan):**

* **Chase Mode:** Uses a more complex targeting method. Takes Blinky's position and the position 2 tiles in front of Pac-Man, draws a vector between them, and doubles it. This creates an ambush effect.

**Clyde (Orange):**

* **Chase Mode:** If farther than 8 tiles from Pac-Man, behaves like Blinky (chasing Pac-Man). If within 8 tiles, switches to Scatter Mode and targets his corner (bottom-left).

## 1.3. Ghost Modes (Timing)

Ghosts do not constantly chase Pac-Man. They alternate between **Scatter** (moving toward their designated corners) and **Chase** (actively pursuing Pac-Man). This timing must be level-timer-based, not event-based or random.

* **Scatter:** Ghosts move toward their assigned corners.
* **Chase:** Ghosts pursue Pac-Man according to their individual AI logic (see 1.2).
* **Frightened:** Triggered by consuming a Power Pellet. Ghosts turn blue, reverse direction, and flee using a pseudo-random number generator for intersection decisions.

## 1.4. Items and Scoring

* **Pac-Dot:** 10 points (240 total)
* **Power Pellet:** 50 points. Activates "Frightened" mode.
* **Ghosts (consumed):** 200, 400, 800, 1600 points (in sequence)
* **Fruit:** Appears periodically at the maze center. Type and score value depend on level.
* **Extra Life:** Awarded at 10,000 points
