import { Maze } from './maze.js';
import { PacMan } from './pacman.js';
import { Blinky } from './ghosts/blinky.js';
import { Pinky } from './ghosts/pinky.js';
import { Inky } from './ghosts/inky.js';
import { Clyde } from './ghosts/clyde.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { GAME_MODE, GHOST_MODE, SCATTER_CHASE_PATTERN, TILE_TYPE, POINTS, FRIGHTENED_DURATION, FPS } from './constants.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.inputHandler = new InputHandler();
        this.maze = new Maze();
        
        this.pacman = new PacMan(13.5, 23.5);
        this.ghosts = [
            new Blinky(),
            new Pinky(),
            new Inky(),
            new Clyde()
        ];

        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('pacman-highscore') || '10000');
        this.lives = 3;
        this.level = 1;
        this.gameMode = GAME_MODE.READY;
        this.tick = 0;
        this.modeTick = 0;
        this.currentPattern = 0;
        this.frightenedTimer = 0;
        this.ghostsEaten = 0;

        this.setupEventListeners();
        this.updateHUD();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.gameMode === GAME_MODE.READY) {
                this.gameMode = GAME_MODE.PLAYING;
            }
        });
    }

    update() {
        if (this.gameMode !== GAME_MODE.PLAYING) {
            return;
        }

        this.tick++;
        this.modeTick++;

        this.updateGhostModes();
        this.pacman.update(this.maze, this.inputHandler);
        
        for (const ghost of this.ghosts) {
            ghost.update(this.maze, this.pacman, this.ghosts);
        }

        this.checkCollisions();
        this.checkDotCollection();
        
        if (this.maze.dotsRemaining === 0) {
            this.levelComplete();
        }
    }

    updateGhostModes() {
        if (this.frightenedTimer > 0) {
            this.frightenedTimer--;
            if (this.frightenedTimer === 0) {
                for (const ghost of this.ghosts) {
                    ghost.setMode(SCATTER_CHASE_PATTERN[this.currentPattern].mode);
                }
            }
            return;
        }

        if (this.currentPattern < SCATTER_CHASE_PATTERN.length) {
            const pattern = SCATTER_CHASE_PATTERN[this.currentPattern];
            
            if (this.modeTick >= pattern.duration) {
                this.modeTick = 0;
                this.currentPattern++;
                
                if (this.currentPattern < SCATTER_CHASE_PATTERN.length) {
                    const newPattern = SCATTER_CHASE_PATTERN[this.currentPattern];
                    for (const ghost of this.ghosts) {
                        ghost.setMode(newPattern.mode);
                    }
                }
            }
        }
    }

    checkCollisions() {
        for (const ghost of this.ghosts) {
            const distance = Math.sqrt(
                Math.pow(this.pacman.x - ghost.x, 2) + 
                Math.pow(this.pacman.y - ghost.y, 2)
            );

            if (distance < 0.7) {
                if (this.pacman.powered && ghost.mode !== GHOST_MODE.EATEN) {
                    this.eatGhost(ghost);
                } else if (ghost.mode !== GHOST_MODE.EATEN) {
                    this.pacmanDies();
                    return;
                }
            }
        }
    }

    checkDotCollection() {
        const tile = this.maze.getTile(this.pacman.tileX, this.pacman.tileY);
        
        if (tile === TILE_TYPE.DOT) {
            this.maze.setTile(this.pacman.tileX, this.pacman.tileY, TILE_TYPE.EMPTY);
            this.maze.dotsRemaining--;
            this.addScore(POINTS.DOT);
        } else if (tile === TILE_TYPE.POWER_PELLET) {
            this.maze.setTile(this.pacman.tileX, this.pacman.tileY, TILE_TYPE.EMPTY);
            this.maze.dotsRemaining--;
            this.addScore(POINTS.POWER_PELLET);
            this.activatePowerMode();
        }
    }

    activatePowerMode() {
        this.pacman.setPowered(FRIGHTENED_DURATION);
        this.frightenedTimer = FRIGHTENED_DURATION;
        this.ghostsEaten = 0;
        
        for (const ghost of this.ghosts) {
            ghost.setMode(GHOST_MODE.FRIGHTENED);
        }
    }

    eatGhost(ghost) {
        this.ghostsEaten++;
        const points = [POINTS.GHOST_1, POINTS.GHOST_2, POINTS.GHOST_3, POINTS.GHOST_4];
        this.addScore(points[Math.min(this.ghostsEaten - 1, 3)]);
        ghost.reset();
    }

    pacmanDies() {
        this.lives--;
        this.updateHUD();
        
        if (this.lives === 0) {
            this.gameOver();
        } else {
            this.resetPositions();
        }
    }

    resetPositions() {
        this.pacman.reset(13.5, 23.5);
        for (const ghost of this.ghosts) {
            ghost.reset();
        }
        this.gameMode = GAME_MODE.READY;
    }

    levelComplete() {
        this.level++;
        this.maze.reset();
        this.renderer.resetMazeCache();
        this.resetPositions();
        this.modeTick = 0;
        this.currentPattern = 0;
    }

    gameOver() {
        this.gameMode = GAME_MODE.GAME_OVER;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacman-highscore', this.highScore.toString());
        }
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('hud-score').textContent = this.score.toString().padStart(2, '0');
        document.getElementById('hud-high-score').textContent = this.highScore.toString().padStart(5, '0');
        document.getElementById('hud-lives-display').textContent = `Lives: ${this.lives}`;
    }

    render() {
        this.renderer.clear();
        this.renderer.renderMaze(this.maze);
        this.renderer.renderPacMan(this.pacman);
        
        for (const ghost of this.ghosts) {
            this.renderer.renderGhost(ghost);
        }

        if (this.gameMode === GAME_MODE.READY) {
            this.renderer.ctx.fillStyle = '#ffff00';
            this.renderer.ctx.font = '8px "Courier New"';
            this.renderer.ctx.textAlign = 'center';
            this.renderer.ctx.fillText('READY!', this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.gameMode === GAME_MODE.GAME_OVER) {
            this.renderer.ctx.fillStyle = '#ff0000';
            this.renderer.ctx.font = '8px "Courier New"';
            this.renderer.ctx.textAlign = 'center';
            this.renderer.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
}
