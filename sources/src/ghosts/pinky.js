import { Ghost } from './ghost.js';
import { DIRECTION } from '../constants.js';

export class Pinky extends Ghost {
    constructor() {
        super(13.5, 17.5, 'pink', { x: 2, y: 0 });
        this.name = 'Pinky';
    }

    calculateChaseTarget(pacman, ghosts) {
        let targetX = pacman.tileX;
        let targetY = pacman.tileY;

        if (pacman.direction === DIRECTION.UP) {
            targetX -= 4;
            targetY -= 4;
        } else if (pacman.direction === DIRECTION.DOWN) {
            targetY += 4;
        } else if (pacman.direction === DIRECTION.LEFT) {
            targetX -= 4;
        } else if (pacman.direction === DIRECTION.RIGHT) {
            targetX += 4;
        }

        return { x: targetX, y: targetY };
    }
}
