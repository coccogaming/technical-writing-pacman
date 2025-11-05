import { Clyde } from '../../src/ghosts/clyde.js';
import { PacMan } from '../../src/pacman.js';

describe('Clyde Ghost AI', () => {
    let clyde;
    let pacman;

    beforeEach(() => {
        clyde = new Clyde();
        pacman = new PacMan(10, 10);
    });

    test('should target Pac-Man when more than 8 tiles away', () => {
        clyde.tileX = 0;
        clyde.tileY = 0;
        pacman.tileX = 15;
        pacman.tileY = 15;

        const distance = Math.sqrt(
            Math.pow(clyde.tileX - pacman.tileX, 2) + 
            Math.pow(clyde.tileY - pacman.tileY, 2)
        );
        expect(distance).toBeGreaterThan(8);

        const target = clyde.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(15);
        expect(target.y).toBe(15);
    });

    test('should retreat to scatter corner when within 8 tiles', () => {
        clyde.tileX = 10;
        clyde.tileY = 10;
        pacman.tileX = 12;
        pacman.tileY = 12;

        const distance = Math.sqrt(
            Math.pow(clyde.tileX - pacman.tileX, 2) + 
            Math.pow(clyde.tileY - pacman.tileY, 2)
        );
        expect(distance).toBeLessThanOrEqual(8);

        const target = clyde.calculateChaseTarget(pacman, []);

        expect(target.x).toBe(clyde.scatterTarget.x);
        expect(target.y).toBe(clyde.scatterTarget.y);
    });

    test('should use exact 8-tile threshold', () => {
        clyde.tileX = 10;
        clyde.tileY = 10;
        pacman.tileX = 18;
        pacman.tileY = 10;

        const distance = clyde.distanceTo(pacman.tileX, pacman.tileY);
        expect(distance).toBe(8);

        const target = clyde.calculateChaseTarget(pacman, []);
        
        expect(target.x).toBe(clyde.scatterTarget.x);
        expect(target.y).toBe(clyde.scatterTarget.y);
    });

    test('should have correct scatter target (bottom-left corner)', () => {
        expect(clyde.scatterTarget.x).toBe(0);
        expect(clyde.scatterTarget.y).toBe(35);
    });

    test('should be orange colored', () => {
        expect(clyde.color).toBe('orange');
    });
});
