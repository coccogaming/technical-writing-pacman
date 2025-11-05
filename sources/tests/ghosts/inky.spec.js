import { Inky } from '../../src/ghosts/inky.js';
import { Blinky } from '../../src/ghosts/blinky.js';
import { PacMan } from '../../src/pacman.js';
import { DIRECTION } from '../../src/constants.js';

describe('Inky Ghost AI', () => {
    let inky;
    let blinky;
    let pacman;

    beforeEach(() => {
        inky = new Inky();
        blinky = new Blinky();
        pacman = new PacMan(10, 10);
    });

    test('should calculate ambush target using Blinky position', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.RIGHT;
        
        blinky.tileX = 8;
        blinky.tileY = 8;

        const target = inky.calculateChaseTarget(pacman, [blinky]);

        const pivotX = 12;
        const pivotY = 10;
        const vectorX = pivotX - blinky.tileX;
        const vectorY = pivotY - blinky.tileY;
        const expectedX = pivotX + vectorX;
        const expectedY = pivotY + vectorY;

        expect(target.x).toBe(expectedX);
        expect(target.y).toBe(expectedY);
    });

    test('should target 2 tiles ahead of Pac-Man as pivot', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.DOWN;
        
        blinky.tileX = 8;
        blinky.tileY = 8;

        const target = inky.calculateChaseTarget(pacman, [blinky]);

        const pivotX = 10;
        const pivotY = 12;
        const vectorX = pivotX - blinky.tileX;
        const vectorY = pivotY - blinky.tileY;
        const expectedX = pivotX + vectorX;
        const expectedY = pivotY + vectorY;

        expect(target.x).toBe(expectedX);
        expect(target.y).toBe(expectedY);
    });

    test('should handle Pinky bug (UP direction) in pivot calculation', () => {
        pacman.tileX = 10;
        pacman.tileY = 10;
        pacman.direction = DIRECTION.UP;
        
        blinky.tileX = 8;
        blinky.tileY = 8;

        const target = inky.calculateChaseTarget(pacman, [blinky]);

        const pivotX = 8;
        const pivotY = 8;
        
        expect(target.x).toBe(pivotX + (pivotX - blinky.tileX));
        expect(target.y).toBe(pivotY + (pivotY - blinky.tileY));
    });

    test('should fallback to Pac-Man position if Blinky not found', () => {
        pacman.tileX = 15;
        pacman.tileY = 20;

        const target = inky.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(15);
        expect(target.y).toBe(20);
    });

    test('should have correct scatter target (bottom-right corner)', () => {
        expect(inky.scatterTarget.x).toBe(27);
        expect(inky.scatterTarget.y).toBe(35);
    });

    test('should be cyan colored', () => {
        expect(inky.color).toBe('cyan');
    });
});
