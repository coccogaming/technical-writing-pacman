import { TILE_SIZE, DIRECTION } from './constants.js';

export class Entity {
    constructor(x, y, speed = 0.8) {
        this.x = x;
        this.y = y;
        this.tileX = Math.floor(x);
        this.tileY = Math.floor(y);
        this.speed = speed;
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
    }

    updateTilePosition() {
        this.tileX = Math.floor(this.x);
        this.tileY = Math.floor(this.y);
    }

    isAtTileCenter() {
        const offsetX = this.x - Math.floor(this.x);
        const offsetY = this.y - Math.floor(this.y);
        return Math.abs(offsetX - 0.5) < 0.1 && Math.abs(offsetY - 0.5) < 0.1;
    }

    snapToTileCenter() {
        this.x = Math.floor(this.x) + 0.5;
        this.y = Math.floor(this.y) + 0.5;
        this.updateTilePosition();
    }

    canMoveInDirection(maze, direction) {
        const nextX = Math.floor(this.x + direction.x);
        const nextY = Math.floor(this.y + direction.y);
        
        return !maze.isWall(nextX, nextY);
    }

    move(maze) {
        if (this.direction === DIRECTION.NONE) {
            return;
        }

        const newX = this.x + this.direction.x * this.speed * 0.1;
        const newY = this.y + this.direction.y * this.speed * 0.1;

        const targetTileX = Math.floor(newX + this.direction.x * 0.5);
        const targetTileY = Math.floor(newY + this.direction.y * 0.5);

        if (!maze.isWall(targetTileX, targetTileY)) {
            this.x = newX;
            this.y = newY;

            if (this.x < -1) this.x = 27.5;
            if (this.x > 28) this.x = 0.5;

            this.updateTilePosition();
        }
    }

    getPixelPosition() {
        return {
            x: Math.floor(this.x * TILE_SIZE),
            y: Math.floor(this.y * TILE_SIZE)
        };
    }

    distanceTo(targetX, targetY) {
        const dx = this.tileX - targetX;
        const dy = this.tileY - targetY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
