import { Ghost } from './ghost.js';

export class Blinky extends Ghost {
    constructor() {
        super(13.5, 14.5, 'red', { x: 25, y: 0 });
        this.name = 'Blinky';
    }

    calculateChaseTarget(pacman, ghosts) {
        return { x: pacman.tileX, y: pacman.tileY };
    }
}
