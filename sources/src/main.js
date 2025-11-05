import { Game } from './game.js';
import { FIXED_UPDATE_TIME } from './constants.js';

const canvas = document.getElementById('game-canvas');
const game = new Game(canvas);

let lastTime = 0;
let accumulator = 0;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    accumulator += deltaTime;

    while (accumulator >= FIXED_UPDATE_TIME) {
        game.update();
        accumulator -= FIXED_UPDATE_TIME;
    }

    game.render();
    
    requestAnimationFrame(gameLoop);
}

console.log('🎮 PAC-MAN game initialized');
console.log('📋 Controls: Arrow Keys or WASD');
console.log('🚀 Press SPACE to start');

requestAnimationFrame(gameLoop);
