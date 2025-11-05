import { Blinky } from '../../src/ghosts/blinky.js';
import { PacMan } from '../../src/pacman.js';

describe('Blinky Ghost AI', () => {
    let blinky;
    let pacman;

    beforeEach(() => {
        blinky = new Blinky();
        pacman = new PacMan(10, 10);
    });

    test('should target Pac-Man directly in chase mode', () => {
        pacman.tileX = 15;
        pacman.tileY = 20;

        const target = blinky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(15);
        expect(target.y).toBe(20);
    });

    test('should always target exact Pac-Man position', () => {
        pacman.tileX = 5;
        pacman.tileY = 5;

        const target = blinky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(pacman.tileX);
        expect(target.y).toBe(pacman.tileY);
    });

    test('should have correct scatter target (top-right corner)', () => {
        expect(blinky.scatterTarget.x).toBe(25);
        expect(blinky.scatterTarget.y).toBe(0);
    });

    test('should be red colored', () => {
        expect(blinky.color).toBe('red');
    });
});
