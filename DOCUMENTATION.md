# Space Invaders - Epic Edition - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Development Guide](#development-guide)
5. [Code Structure](#code-structure)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

## Project Overview

**Space Invaders - Epic Edition** is a modern HTML5 Canvas-based game built with vanilla JavaScript. It features 10 progressive levels with increasing difficulty, multiple enemy types, special weapons, dynamic backgrounds, and procedurally generated audio.

### Key Features
- **10 Progressive Levels**: Each level introduces new enemy types and mechanics
- **Multiple Enemy Types**: Basic, Fast, Shooter, Tank, Kamikaze, Shielded, Boss, and Final Boss
- **Special Weapons**: Super Laser for devastating attacks
- **Dynamic Backgrounds**: Different visual effects for each level type
- **Procedural Audio**: Space-themed ambient music using Web Audio API
- **Comprehensive Testing**: Full unit test coverage for all game components
- **Modern Build System**: Webpack with hot reloading and production optimization

### Tech Stack
- **Frontend**: HTML5 Canvas, Vanilla JavaScript (ES6+)
- **Build Tool**: Webpack 5
- **Testing**: Jest with jsdom
- **Audio**: Web Audio API
- **Deployment**: GitHub Pages

## Architecture

### Core Architecture Pattern
The game follows a **Component-Based Architecture** with clear separation of concerns:

```
Game (Main Controller)
├── Entities (Game Objects)
│   ├── Player
│   ├── Enemy (Multiple Types)
│   ├── Bullet
│   ├── Explosion
│   └── SuperLaser
├── Utils (Services)
│   ├── InputManager
│   ├── CollisionManager
│   └── SoundManager
└── Game Loop
    ├── Update (Logic)
    ├── Render (Graphics)
    └── Audio
```

### Design Principles
1. **Single Responsibility**: Each class has one clear purpose
2. **Dependency Injection**: Managers are injected into entities
3. **Event-Driven**: Input and game events drive state changes
4. **Performance-First**: 60 FPS target with optimized rendering
5. **Testable**: All components are unit testable

### Game Loop Architecture
```javascript
// Main game loop in Game.js
gameLoop(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (this.gameState === 'playing') {
        this.update(deltaTime);
    }
    
    this.render();
    requestAnimationFrame(this.gameLoop.bind(this));
}
```

## Setup & Installation

### Prerequisites
- **Node.js**: v14 or higher (tested with v22.17.0)
- **npm**: v6 or higher
- **Modern Browser**: Chrome, Firefox, Safari, Edge

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd space-invaders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The game will be available at `http://localhost:3000`

### Port Conflicts
If port 3000 is already in use, you can modify the port in `webpack.config.js`:
```javascript
devServer: {
    port: 3001, // Change to available port
    // ... other config
}
```

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
npm run deploy     # Deploy to GitHub Pages
```

## Development Guide

### Project Structure
```
space-invaders/
├── src/
│   ├── entities/          # Game objects
│   │   ├── Player.js      # Player spaceship
│   │   ├── Enemy.js       # Enemy AI and rendering
│   │   ├── Bullet.js      # Projectile system
│   │   ├── Explosion.js   # Particle effects
│   │   └── SuperLaser.js  # Special weapon
│   ├── utils/             # Utility services
│   │   ├── InputManager.js    # Keyboard input handling
│   │   ├── CollisionManager.js # Collision detection
│   │   └── SoundManager.js     # Audio system
│   ├── test/              # Unit tests
│   │   ├── setup.js       # Test environment setup
│   │   ├── Player.test.js
│   │   ├── Enemy.test.js
│   │   ├── Bullet.test.js
│   │   └── CollisionManager.test.js
│   ├── Game.js            # Main game controller
│   ├── index.js           # Application entry point
│   └── index.html         # Game HTML template
├── webpack.config.js      # Build configuration
├── package.json           # Dependencies and scripts
└── README.md             # User documentation
```

### Key Classes and Their Responsibilities

#### Game.js (Main Controller)
- **Purpose**: Orchestrates the entire game
- **Key Methods**:
  - `startGame()`: Initialize game state
  - `update(deltaTime)`: Update game logic
  - `render()`: Render all game objects
  - `gameLoop()`: Main game loop
- **State Management**: Handles game states (start, playing, paused, gameOver)

#### Player.js
- **Purpose**: Player spaceship with movement and shooting
- **Key Properties**:
  - `x, y`: Position
  - `speed`: Movement speed (300 pixels/second)
  - `width, height`: Collision bounds
- **Key Methods**:
  - `update(deltaTime, inputManager, canvasWidth)`: Handle movement
  - `render(ctx)`: Draw spaceship
  - `getBounds()`: Return collision rectangle

#### Enemy.js
- **Purpose**: Enemy AI with multiple types and behaviors
- **Enemy Types**:
  - `basic`: Standard enemies
  - `fast`: Faster movement
  - `shooter`: Can shoot at player
  - `tank`: Takes multiple hits
  - `kamikaze`: Dives at player
  - `shielded`: Has protective shield
  - `boss`: Mini-boss with patterns
  - `finalBoss`: Ultimate challenge
- **Key Methods**:
  - `update(deltaTime)`: Update position and behavior
  - `hit()`: Handle damage
  - `startKamikazeDive()`: Begin kamikaze attack

#### InputManager.js
- **Purpose**: Handle keyboard input
- **Key Methods**:
  - `isKeyPressed(keyCode)`: Check if key is held
  - `getPressedKeys()`: Get all currently pressed keys
- **Supported Keys**: Arrow keys, Space, P, B, M, +/-

#### CollisionManager.js
- **Purpose**: Detect collisions between game objects
- **Collision Types**:
  - AABB (Axis-Aligned Bounding Box)
  - Point collision
  - Circle collision
- **Key Methods**:
  - `checkCollision(obj1, obj2)`: Main collision detection
  - `getCollisionSide()`: Determine collision direction

#### SoundManager.js
- **Purpose**: Handle all audio (effects and background music)
- **Features**:
  - Procedurally generated sounds
  - Background ambient music
  - Volume control
  - Audio context management
- **Key Methods**:
  - `playSound(name)`: Play sound effect
  - `startBackgroundMusic()`: Start ambient music
  - `toggleBackgroundMusic()`: Toggle music on/off

### Level System

The game features 10 progressively difficult levels defined in `LEVEL_CONFIGS`:

```javascript
const LEVEL_CONFIGS = [
    {
        name: "Tutorial",
        enemySpeed: 15,
        enemyShootInterval: 3000,
        enemyBulletSpeed: 80,
        enemyRows: 3,
        enemyCols: 8,
        enemyTypes: ['basic'],
        specialMechanics: [],
        background: 'normal'
    },
    // ... 9 more levels with increasing difficulty
];
```

Each level configuration includes:
- **Enemy Properties**: Speed, shooting frequency, bullet speed
- **Formation**: Number of rows and columns
- **Enemy Types**: Which enemy types appear
- **Special Mechanics**: Level-specific features
- **Background**: Visual theme

### Adding New Features

#### Adding a New Enemy Type
1. **Update Enemy.js**:
   ```javascript
   // Add to getColors() method
   case 'newEnemy':
       return ['#color1', '#color2', '#color3'];
   
   // Add to getSize() method
   case 'newEnemy':
       return { width: 45, height: 35 };
   
   // Add rendering method
   drawNewEnemy(ctx) {
       // Custom rendering logic
   }
   ```

2. **Update Game.js**:
   ```javascript
   // Add to spawnEnemies() method
   case 'newEnemy':
       // Spawn logic
   ```

3. **Add to level configurations**:
   ```javascript
   enemyTypes: ['basic', 'newEnemy']
   ```

#### Adding New Sound Effects
1. **Update SoundManager.js**:
   ```javascript
   // Add to initSounds()
   this.createSound('newSound', this.generateNewSound());
   
   // Add generation method
   generateNewSound() {
       // Sound generation logic
   }
   ```

2. **Use in game**:
   ```javascript
   this.soundManager.playSound('newSound');
   ```

## Code Structure

### Entry Point (src/index.js)
```javascript
import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Handle window events
    window.addEventListener('resize', () => {
        // Responsive canvas logic
    });
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.gameState === 'playing') {
            game.togglePause();
        }
    });
});
```

### Game State Management
The game uses a state machine pattern:
- **start**: Initial screen
- **playing**: Active gameplay
- **paused**: Game paused
- **gameOver**: Player lost
- **levelComplete**: Level finished

### Entity-Component System
Each game entity follows a consistent pattern:
```javascript
class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    update(deltaTime) {
        // Update logic
    }
    
    render(ctx) {
        // Rendering logic
    }
    
    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
```

### Manager Pattern
Utility classes provide services to entities:
```javascript
class Manager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize resources
    }
    
    // Service methods
}
```

## Testing

### Test Structure
Tests are located in `src/test/` and follow Jest conventions:
- **Setup**: `setup.js` provides mocks for Canvas and Audio APIs
- **Unit Tests**: Each entity has corresponding test file
- **Coverage**: Tests cover all major functionality

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- Player.test.js
```

### Test Examples

#### Player Movement Test
```javascript
test('player moves left when left arrow pressed', () => {
    const player = new Player(400, 550);
    const inputManager = new InputManager();
    inputManager.keys['ArrowLeft'] = true;
    
    const initialX = player.x;
    player.update(16, inputManager, 800); // 16ms = 60fps
    
    expect(player.x).toBeLessThan(initialX);
});
```

#### Collision Detection Test
```javascript
test('detects collision between two objects', () => {
    const obj1 = { x: 0, y: 0, width: 10, height: 10 };
    const obj2 = { x: 5, y: 5, width: 10, height: 10 };
    
    const collisionManager = new CollisionManager();
    const result = collisionManager.checkCollision(obj1, obj2);
    
    expect(result).toBe(true);
});
```

### Mocking Strategy
The test setup provides mocks for:
- **Canvas API**: Mocked rendering methods
- **Audio API**: Mocked audio context and sources
- **DOM API**: Mocked document and window objects

## Deployment

### Production Build
```bash
npm run build
```
This creates optimized files in the `dist/` directory.

### GitHub Pages Deployment
```bash
npm run deploy
```
This builds the project and deploys to GitHub Pages.

### Manual Deployment
The `dist/` folder contains static files that can be deployed to:
- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect repository and set build command
- **AWS S3**: Upload `dist/` contents
- **Firebase Hosting**: Use Firebase CLI

### Build Configuration
Webpack configuration (`webpack.config.js`):
- **Entry**: `src/index.js`
- **Output**: `dist/bundle.js`
- **Loaders**: Babel for ES6+ support
- **Plugins**: HTML webpack plugin for template
- **Dev Server**: Hot reloading on port 3000

## Troubleshooting

### Common Issues

#### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`
**Solution**: 
1. Kill process using port 3000: `lsof -ti:3000 | xargs kill -9`
2. Or change port in `webpack.config.js`

#### Audio Not Working
**Issue**: No sound effects or background music
**Solutions**:
1. Check browser autoplay policies
2. Ensure user interaction before audio
3. Check console for AudioContext errors

#### Canvas Not Rendering
**Issue**: Black screen or no graphics
**Solutions**:
1. Check browser console for errors
2. Verify canvas element exists in DOM
3. Check WebGL support

#### Performance Issues
**Issue**: Low frame rate or lag
**Solutions**:
1. Reduce number of entities
2. Optimize rendering loops
3. Use `requestAnimationFrame` properly
4. Profile with browser dev tools

### Debug Features
The game includes debug features accessible via keyboard:
- **1-0 keys**: Skip to specific level
- **Console logging**: Detailed game state information
- **Performance monitoring**: Frame rate tracking

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Limited (touch controls not implemented)

## Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Make** changes following the coding standards
4. **Test** your changes: `npm test`
5. **Commit** with descriptive messages
6. **Push** to your fork
7. **Submit** a pull request

### Coding Standards
- **ES6+**: Use modern JavaScript features
- **Consistent Naming**: camelCase for variables, PascalCase for classes
- **Comments**: Document complex logic
- **Testing**: Write tests for new features
- **Performance**: Consider impact on 60fps target

### Code Review Checklist
- [ ] Code follows project structure
- [ ] Tests pass
- [ ] No console errors
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Browser compatibility verified

### Feature Development Guidelines
1. **Plan**: Design the feature before coding
2. **Implement**: Follow existing patterns
3. **Test**: Add unit tests for new functionality
4. **Document**: Update relevant documentation
5. **Review**: Self-review before submitting

---

## Additional Resources

### Performance Optimization
- Use `requestAnimationFrame` for smooth animation
- Minimize DOM queries in render loops
- Batch canvas operations
- Use object pooling for frequently created objects

### Audio Best Practices
- Initialize AudioContext on user interaction
- Handle audio context suspension
- Provide volume controls
- Graceful fallbacks for unsupported features

### Game Development Patterns
- Entity-Component-System (ECS) architecture
- State machine for game states
- Observer pattern for events
- Factory pattern for object creation

This documentation provides a comprehensive guide for understanding, developing, and maintaining the Space Invaders codebase. For specific questions or issues, refer to the code comments and test files for additional context. 