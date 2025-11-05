import { DIRECTION } from './constants.js';

export class InputHandler {
    constructor() {
        this.currentInput = DIRECTION.NONE;
        this.bufferedInput = DIRECTION.NONE;
        this.setupKeyListeners();
    }

    setupKeyListeners() {
        document.addEventListener('keydown', (e) => {
            const direction = this.keyToDirection(e.key);
            if (direction) {
                e.preventDefault();
                this.bufferedInput = direction;
            }
        });
    }

    keyToDirection(key) {
        switch(key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                return DIRECTION.UP;
            case 'arrowdown':
            case 's':
                return DIRECTION.DOWN;
            case 'arrowleft':
            case 'a':
                return DIRECTION.LEFT;
            case 'arrowright':
            case 'd':
                return DIRECTION.RIGHT;
            default:
                return null;
        }
    }

    getBufferedInput() {
        return this.bufferedInput;
    }

    clearBuffer() {
        this.bufferedInput = DIRECTION.NONE;
    }
}
