import { Ghost } from './ghost.js';

export class Clyde extends Ghost {
    constructor() {
        super(15.5, 17.5, 'orange', { x: 0, y: 35 });
        this.name = 'Clyde';
    }

    calculateChaseTarget(pacman, ghosts) {
        const distance = this.distanceTo(pacman.tileX, pacman.tileY);

        if (distance > 8) {
            return { x: pacman.tileX, y: pacman.tileY };
        } else {
            return this.scatterTarget;
        }
    }
}
