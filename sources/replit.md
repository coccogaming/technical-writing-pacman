# Pac-Man Arcade Replica - Replit Project

## Overview
This is a high-fidelity replica of the classic Pac-Man arcade game (Namco, 1980) built with HTML5 Canvas, CSS3, and vanilla JavaScript (ES6+ modules). The project emphasizes arcade-accurate ghost AI, deterministic gameplay, and test-driven development.

## Current State
**Status**: MVP Complete and Playable ✅

### Implemented Features
- ✅ Full game loop with fixed 60 FPS timestep
- ✅ Pac-Man movement with input buffering for smooth cornering
- ✅ Four ghosts with authentic AI:
  - **Blinky** (red): Direct chase
  - **Pinky** (pink): 4 tiles ahead (includes original "up bug")
  - **Inky** (cyan): Ambush based on Blinky position
  - **Clyde** (orange): 8-tile distance threshold behavior
- ✅ Scatter/Chase mode alternation
- ✅ Power pellet system (frightened mode)
- ✅ Collision detection and scoring
- ✅ Lives system and game over
- ✅ HUD with score, high score, and lives display
- ✅ Level completion and reset
- ✅ Jest test suite (21 tests) for ghost AI validation

### Not Yet Implemented
- Audio/sound effects
- Sprite sheet graphics (currently using geometric shapes)
- Cutscenes/intermissions
- Fruit bonus system
- Fine-tuned timing and difficulty progression

### Known Limitations (Gameplay Accuracy)
- **Frightened Mode**: Ghosts currently use scatter/chase targeting in frightened mode instead of random wandering
- **Eaten State**: Ghosts reset immediately instead of returning to ghost house with increased speed
- **Tunnel Speed**: No speed reduction for ghosts in tunnel tiles
- **Tie-breaking**: Ghost direction choice uses simple Euclidean distance without arcade's tile-priority rules

These limitations do not prevent the game from being playable but mean it's not 100% arcade-accurate. Future PRs should address these to achieve true high-fidelity replication as specified in the documentation.

## Recent Changes
**2024-11-05**: Initial implementation completed
- Set up project structure with ES6 modules
- Implemented core game engine with fixed timestep
- Created ghost AI with arcade-accurate targeting algorithms
- Added comprehensive Jest tests for ghost behavior
- Configured Express server for Replit deployment

## Project Architecture

### Technology Stack
- **Frontend**: HTML5 Canvas, CSS3, Vanilla JavaScript (ES6+)
- **Server**: Express.js (static file serving)
- **Testing**: Jest with ES modules support
- **Build**: None (direct ES6 module execution)

### File Structure
```
/
├── index.html          - Main HTML with canvas element
├── style.css           - Styling and layout
├── server.js           - Express server (port 5000)
├── src/
│   ├── main.js         - Entry point and game loop
│   ├── game.js         - Game state and logic
│   ├── constants.js    - Game constants and configurations
│   ├── maze.js         - Maze data and tile management
│   ├── entity.js       - Base entity class
│   ├── pacman.js       - Pac-Man player logic
│   ├── input.js        - Keyboard input handler
│   ├── renderer.js     - Canvas rendering engine
│   └── ghosts/
│       ├── ghost.js    - Base ghost AI class
│       ├── blinky.js   - Red ghost (chase)
│       ├── pinky.js    - Pink ghost (ambush)
│       ├── inky.js     - Cyan ghost (patrol)
│       └── clyde.js    - Orange ghost (random)
├── tests/
│   └── ghosts/
│       ├── blinky.spec.js
│       ├── pinky.spec.js
│       ├── inky.spec.js
│       └── clyde.spec.js
└── assets/             - For future sprite/audio assets
```

### Key Design Decisions
1. **Fixed Timestep**: 60 updates/second for deterministic gameplay
2. **Tile-based Movement**: 28x36 tile grid (8x8 pixel tiles)
3. **ES6 Modules**: Clean, maintainable code structure
4. **Test-Driven**: Critical ghost AI logic validated with Jest
5. **No Framework**: Full control over game loop and rendering

## Development Workflow

### Running Locally
```bash
npm run dev        # Start development server on port 5000
npm test           # Run Jest test suite
npm run test:watch # Run tests in watch mode
```

### Testing
All ghost AI targeting logic is covered by unit tests. Tests validate:
- Blinky's direct chase behavior
- Pinky's 4-tile ahead targeting (including the "up bug")
- Inky's complex ambush calculation
- Clyde's distance-based behavior switch

### Replit Configuration
- **Workflow**: Express server bound to `0.0.0.0:5000`
- **Deployment**: Autoscale mode with `node server.js`
- **Cache Control**: No caching to ensure updates are visible immediately

## User Preferences
- Code style: Vanilla JavaScript, no external game frameworks
- Testing: TDD approach for critical game logic
- Documentation: Comprehensive inline comments and README
- Git workflow: Feature branches with task IDs

## References
- [Original Game Documentation](docs/prd.md)
- [Technical Analysis](docs/analisi_tecnica.md)
- [Functional Requirements](docs/analisi_funzionale.md)
- [Pac-Man Wiki](https://pacman.fandom.com/wiki/Pac-Man_(game))

## Controls
- **Arrow Keys** or **WASD**: Move Pac-Man
- **Space**: Start game when in READY mode

## Known Issues
None currently - all core features working as expected!

## Future Roadmap
See [TASKS.md](TASKS.md) for detailed task breakdown and future enhancements.
