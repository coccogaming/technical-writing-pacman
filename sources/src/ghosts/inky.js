import { Ghost } from './ghost.js';
import { DIRECTION } from '../constants.js';

export class Inky extends Ghost {
    constructor() {
        super(11.5, 17.5, 'cyan', { x: 27, y: 35 });
        this.name = 'Inky';
    }

    calculateChaseTarget(pacman, ghosts) {
        const blinky = ghosts.find(g => g.name === 'Blinky');
        if (!blinky) {
            return { x: pacman.tileX, y: pacman.tileY };
        }

        let pivotX = pacman.tileX;
        let pivotY = pacman.tileY;

        if (pacman.direction === DIRECTION.UP) {
            pivotX -= 2;
            pivotY -= 2;
        } else if (pacman.direction === DIRECTION.DOWN) {
            pivotY += 2;
        } else if (pacman.direction === DIRECTION.LEFT) {
            pivotX -= 2;
        } else if (pacman.direction === DIRECTION.RIGHT) {
            pivotX += 2;
        }

        const vectorX = pivotX - blinky.tileX;
        const vectorY = pivotY - blinky.tileY;

        const targetX = pivotX + vectorX;
        const targetY = pivotY + vectorY;

        return { x: targetX, y: targetY };
    }
}
