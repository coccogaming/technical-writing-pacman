import { Entity } from '../entity.js';
import { DIRECTION, SPEEDS, GHOST_MODE } from '../constants.js';

export class Ghost extends Entity {
    constructor(x, y, color, scatterTarget) {
        super(x, y, SPEEDS.GHOST_NORMAL);
        this.color = color;
        this.scatterTarget = scatterTarget;
        this.mode = GHOST_MODE.SCATTER;
        this.targetTile = { x: scatterTarget.x, y: scatterTarget.y };
        this.homeX = x;
        this.homeY = y;
        this.previousDirection = DIRECTION.RIGHT;
    }

    update(maze, pacman, ghosts) {
        if (this.isAtTileCenter()) {
            this.chooseDirection(maze, pacman, ghosts);
        }
        this.move(maze);
    }

    chooseDirection(maze, pacman, ghosts) {
        this.updateTargetTile(pacman, ghosts);

        const possibleDirections = this.getPossibleDirections(maze);
        if (possibleDirections.length === 0) return;

        let bestDirection = possibleDirections[0];
        let minDistance = Infinity;

        for (const dir of possibleDirections) {
            const nextX = this.tileX + dir.x;
            const nextY = this.tileY + dir.y;
            
            const distance = this.calculateDistance(nextX, nextY, this.targetTile.x, this.targetTile.y);
            
            if (distance < minDistance) {
                minDistance = distance;
                bestDirection = dir;
            }
        }

        this.direction = bestDirection;
        this.previousDirection = bestDirection;
    }

    getPossibleDirections(maze) {
        const directions = [DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT];
        const opposite = this.getOppositeDirection(this.previousDirection);
        
        return directions.filter(dir => {
            if (dir === opposite && !this.isAtTileCenter()) return false;
            
            const nextX = this.tileX + dir.x;
            const nextY = this.tileY + dir.y;
            
            return !maze.isWall(nextX, nextY) && !maze.isGhostGate(nextX, nextY);
        });
    }

    getOppositeDirection(direction) {
        if (direction === DIRECTION.UP) return DIRECTION.DOWN;
        if (direction === DIRECTION.DOWN) return DIRECTION.UP;
        if (direction === DIRECTION.LEFT) return DIRECTION.RIGHT;
        if (direction === DIRECTION.RIGHT) return DIRECTION.LEFT;
        return DIRECTION.NONE;
    }

    calculateDistance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateTargetTile(pacman, ghosts) {
        if (this.mode === GHOST_MODE.SCATTER) {
            this.targetTile = this.scatterTarget;
        } else if (this.mode === GHOST_MODE.CHASE) {
            this.targetTile = this.calculateChaseTarget(pacman, ghosts);
        }
    }

    calculateChaseTarget(pacman, ghosts) {
        return { x: pacman.tileX, y: pacman.tileY };
    }

    setMode(mode) {
        if (this.mode !== mode) {
            this.mode = mode;
            this.direction = this.getOppositeDirection(this.direction);
            this.previousDirection = this.direction;
        }
    }

    reset() {
        this.x = this.homeX;
        this.y = this.homeY;
        this.direction = DIRECTION.RIGHT;
        this.previousDirection = DIRECTION.RIGHT;
        this.mode = GHOST_MODE.SCATTER;
        this.speed = SPEEDS.GHOST_NORMAL;
        this.updateTilePosition();
    }
}
