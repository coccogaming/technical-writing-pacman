import { TILE_SIZE, TILE_TYPE, MAZE_WIDTH, MAZE_HEIGHT } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = canvas.width;
        this.offscreenCanvas.height = canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.mazeRendered = false;
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderMaze(maze) {
        if (!this.mazeRendered) {
            this.offscreenCtx.fillStyle = '#000';
            this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

            for (let y = 0; y < MAZE_HEIGHT; y++) {
                for (let x = 0; x < MAZE_WIDTH; x++) {
                    const tile = maze.getTile(x, y);
                    const pixelX = x * TILE_SIZE;
                    const pixelY = y * TILE_SIZE;

                    if (tile === TILE_TYPE.WALL) {
                        this.offscreenCtx.fillStyle = '#2121ff';
                        this.offscreenCtx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
                    } else if (tile === TILE_TYPE.GHOST_GATE) {
                        this.offscreenCtx.fillStyle = '#ffb8ff';
                        this.offscreenCtx.fillRect(pixelX, pixelY + TILE_SIZE / 2 - 1, TILE_SIZE, 2);
                    }
                }
            }
            this.mazeRendered = true;
        }

        this.ctx.drawImage(this.offscreenCanvas, 0, 0);

        for (let y = 0; y < MAZE_HEIGHT; y++) {
            for (let x = 0; x < MAZE_WIDTH; x++) {
                const tile = maze.getTile(x, y);
                const pixelX = x * TILE_SIZE + TILE_SIZE / 2;
                const pixelY = y * TILE_SIZE + TILE_SIZE / 2;

                if (tile === TILE_TYPE.DOT) {
                    this.ctx.fillStyle = '#ffb897';
                    this.ctx.beginPath();
                    this.ctx.arc(pixelX, pixelY, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (tile === TILE_TYPE.POWER_PELLET) {
                    this.ctx.fillStyle = '#ffb897';
                    this.ctx.beginPath();
                    this.ctx.arc(pixelX, pixelY, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    renderPacMan(pacman) {
        const pos = pacman.getPixelPosition();
        const centerX = pos.x + TILE_SIZE / 2;
        const centerY = pos.y + TILE_SIZE / 2;
        const radius = TILE_SIZE / 2 - 1;

        let startAngle = 0.2;
        let endAngle = 2 * Math.PI - 0.2;

        if (pacman.direction.name === 'RIGHT') {
            startAngle = 0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3;
            endAngle = 2 * Math.PI - (0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3);
        } else if (pacman.direction.name === 'LEFT') {
            startAngle = Math.PI + 0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3;
            endAngle = Math.PI - (0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3);
        } else if (pacman.direction.name === 'UP') {
            startAngle = -Math.PI / 2 + 0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3;
            endAngle = -Math.PI / 2 + Math.PI * 2 - (0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3);
        } else if (pacman.direction.name === 'DOWN') {
            startAngle = Math.PI / 2 + 0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3;
            endAngle = Math.PI / 2 - (0.2 + Math.sin(pacman.animFrame * 0.5) * 0.3);
        }

        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.fill();
    }

    renderGhost(ghost) {
        const pos = ghost.getPixelPosition();
        const centerX = pos.x + TILE_SIZE / 2;
        const centerY = pos.y + TILE_SIZE / 2;
        const radius = TILE_SIZE / 2 - 1;

        const colors = {
            'red': '#ff0000',
            'pink': '#ffb8ff',
            'cyan': '#00ffff',
            'orange': '#ffb851'
        };

        this.ctx.fillStyle = colors[ghost.color] || '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 1, radius, Math.PI, 0, false);
        this.ctx.lineTo(centerX + radius, centerY + radius);
        this.ctx.lineTo(centerX + radius / 2, centerY + radius / 2);
        this.ctx.lineTo(centerX, centerY + radius);
        this.ctx.lineTo(centerX - radius / 2, centerY + radius / 2);
        this.ctx.lineTo(centerX - radius, centerY + radius);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2, centerY - 1, 2, 0, Math.PI * 2);
        this.ctx.arc(centerX + 2, centerY - 1, 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2, centerY - 1, 1, 0, Math.PI * 2);
        this.ctx.arc(centerX + 2, centerY - 1, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }

    resetMazeCache() {
        this.mazeRendered = false;
    }
}
