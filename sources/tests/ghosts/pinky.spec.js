import { Pinky } from '../../src/ghosts/pinky.js';
import { PacMan } from '../../src/pacman.js';
import { DIRECTION } from '../../src/constants.js';

describe('Pinky Ghost AI', () => {
    let pinky;
    let pacman;

    beforeEach(() => {
        pinky = new Pinky();
        pacman = new PacMan(10, 10);
    });

    test('should target 4 tiles ahead when Pac-Man facing right', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.RIGHT;

        const target = pinky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(14);
        expect(target.y).toBe(10);
    });

    test('should target 4 tiles ahead when Pac-Man facing down', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.DOWN;

        const target = pinky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(10);
        expect(target.y).toBe(14);
    });

    test('should target 4 tiles ahead when Pac-Man facing left', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.LEFT;

        const target = pinky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(6);
        expect(target.y).toBe(10);
    });

    test('should implement Pinky bug: target 4 up AND 4 left when facing up', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.UP;

        const target = pinky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(6);
        expect(target.y).toBe(6);
    });

    test('should have correct scatter target (top-left corner)', () => {
        expect(pinky.scatterTarget.x).toBe(2);
        expect(pinky.scatterTarget.y).toBe(0);
    });

    test('should be pink colored', () => {
        expect(pinky.color).toBe('pink');
    });
});
