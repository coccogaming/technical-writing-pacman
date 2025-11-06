# 1. Functional Requirements (Gameplay)

## 1.1. Pac-Man (The Player)

* Grid-based movement (tile-based)
* Controlled via 4 directions (Up, Down, Left, Right)
* Input must be **buffered** (if the player presses "up" before a turn, Pac-Man turns as soon as possible)
* Mouth opening/closing animation
* Collision with "dots," "power pellets," and fruit
* Collision with ghosts (death or consumption)

## 1.2. Ghosts (Original AI)

The game must not use random AI. It must implement each ghost's specific targeting behavior, based on mode behavior (**Scatter**, **Chase**, **Frightened**).

**Blinky (Red):**

* **Chase Mode:** Directly targets Pac-Man's current tile position.

**Pinky (Pink):**

* **Chase Mode:** Aims for the tile four spaces ahead of Pac-Man's current direction (including the original bug: if Pac-Man is facing up, target four tiles up and four tiles left).

**Inky (Cyan):**

* **Chase Mode:** More complex. Uses Blinky's position and the tile two spaces ahead of Pac-Man, draws a vector between the two, and doubles it. This creates a pincer ambush effect.

**Clyde (Orange):**

* **Chase Mode:** If farther than eight tiles from Pac-Man, behaves like Blinky (chases Pac-Man). If within eight tiles, switches to Scatter Mode and targets his corner (bottom-left).

## 1.3. Ghost Modes (Timing)

Ghosts do not constantly chase Pac-Man. They alternate between **Scatter** (move toward their designated corners) and **Chase** (actively pursue). This timing is crucial and must be based on a level timer, not random events.

* **Scatter:** Ghosts disperse to their corners.
* **Chase:** Ghosts pursue Pac-Man based on their AI (see section 3.2).
* **Frightened:** Triggered by consuming a Power Pellet. Ghosts turn blue, reverse direction, and flee (using a pseudo-random number generator for intersection decisions).

## 1.4. Items and Scoring

* **Pac-Dot:** 10 points (240 total)
* **Power Pellet:** 50 points. Activates the "Frightened" mode.
* **Ghosts (eaten):** 200, 400, 800, 1600 points (in sequence)
* **Fruit:** Appears periodically at the center. Type and score vary by level.
* **Extra Life:** Granted at 10,000 points.
