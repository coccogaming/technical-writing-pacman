import { Entity } from './entity.js';
import { DIRECTION, SPEEDS } from './constants.js';

export class PacMan extends Entity {
    constructor(x, y) {
        super(x, y, SPEEDS.PACMAN_NORMAL);
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
        this.animFrame = 0;
        this.animCounter = 0;
        this.powered = false;
        this.poweredTimer = 0;
    }

    update(maze, inputHandler) {
        const bufferedInput = inputHandler.getBufferedInput();
        
        if (bufferedInput !== DIRECTION.NONE) {
            this.nextDirection = bufferedInput;
        }

        if (this.isAtTileCenter()) {
            if (this.canMoveInDirection(maze, this.nextDirection)) {
                this.direction = this.nextDirection;
                this.nextDirection = DIRECTION.NONE;
                inputHandler.clearBuffer();
            } else if (!this.canMoveInDirection(maze, this.direction)) {
                this.direction = DIRECTION.NONE;
            }
        }

        this.move(maze);
        this.updateAnimation();

        if (this.powered && this.poweredTimer > 0) {
            this.poweredTimer--;
            if (this.poweredTimer === 0) {
                this.powered = false;
                this.speed = SPEEDS.PACMAN_NORMAL;
            }
        }
    }

    updateAnimation() {
        this.animCounter++;
        if (this.animCounter >= 4) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animCounter = 0;
        }
    }

    setPowered(duration) {
        this.powered = true;
        this.poweredTimer = duration;
        this.speed = SPEEDS.PACMAN_POWERED;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
        this.powered = false;
        this.poweredTimer = 0;
        this.speed = SPEEDS.PACMAN_NORMAL;
        this.updateTilePosition();
    }
}
