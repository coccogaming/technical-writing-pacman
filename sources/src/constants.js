export const TILE_SIZE = 8;
export const MAZE_WIDTH = 28;
export const MAZE_HEIGHT = 36;
export const CANVAS_WIDTH = MAZE_WIDTH * TILE_SIZE;
export const CANVAS_HEIGHT = MAZE_HEIGHT * TILE_SIZE;

export const FPS = 60;
export const FIXED_UPDATE_TIME = 1000 / FPS;

export const DIRECTION = {
    UP: { x: 0, y: -1, name: 'UP' },
    DOWN: { x: 0, y: 1, name: 'DOWN' },
    LEFT: { x: -1, y: 0, name: 'LEFT' },
    RIGHT: { x: 1, y: 0, name: 'RIGHT' },
    NONE: { x: 0, y: 0, name: 'NONE' }
};

export const GAME_MODE = {
    READY: 'READY',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    DYING: 'DYING',
    GAME_OVER: 'GAME_OVER'
};

export const GHOST_MODE = {
    SCATTER: 'SCATTER',
    CHASE: 'CHASE',
    FRIGHTENED: 'FRIGHTENED',
    EATEN: 'EATEN'
};

export const SPEEDS = {
    PACMAN_NORMAL: 0.8,
    PACMAN_POWERED: 0.9,
    GHOST_NORMAL: 0.75,
    GHOST_FRIGHTENED: 0.5,
    GHOST_TUNNEL: 0.4,
    GHOST_EATEN: 1.5
};

export const TILE_TYPE = {
    WALL: 0,
    EMPTY: 1,
    DOT: 2,
    POWER_PELLET: 3,
    GHOST_GATE: 4,
    TUNNEL: 5
};

export const POINTS = {
    DOT: 10,
    POWER_PELLET: 50,
    GHOST_1: 200,
    GHOST_2: 400,
    GHOST_3: 800,
    GHOST_4: 1600,
    EXTRA_LIFE: 10000
};

export const SCATTER_CHASE_PATTERN = [
    { mode: GHOST_MODE.SCATTER, duration: 7 * FPS },
    { mode: GHOST_MODE.CHASE, duration: 20 * FPS },
    { mode: GHOST_MODE.SCATTER, duration: 7 * FPS },
    { mode: GHOST_MODE.CHASE, duration: 20 * FPS },
    { mode: GHOST_MODE.SCATTER, duration: 5 * FPS },
    { mode: GHOST_MODE.CHASE, duration: 20 * FPS },
    { mode: GHOST_MODE.SCATTER, duration: 5 * FPS },
    { mode: GHOST_MODE.CHASE, duration: Infinity }
];

export const FRIGHTENED_DURATION = 6 * FPS;
