# Space Invaders - Epic Edition 🚀👾

An epic Space Invaders game built with HTML5 Canvas and vanilla JavaScript, featuring modern graphics, sound effects, and smooth gameplay.

## 🎮 Features

- **Smooth 60 FPS gameplay** with HTML5 Canvas
- **Retro-futuristic graphics** with glowing effects and particle explosions
- **Dynamic enemy AI** with different colored aliens and animations
- **Progressive difficulty** - enemies shoot faster each level
- **Sound effects** generated using Web Audio API
- **Responsive controls** with keyboard input
- **Pause functionality** and game state management
- **Comprehensive unit tests** for all game components
- **10 Progressive Levels**: Each level increases in difficulty with new enemy types and mechanics
- **Multiple Enemy Types**: Basic, Fast, Shooter, Tank, Kamikaze, Shielded, Boss, and Final Boss enemies
- **Special Weapons**: Super Laser for devastating attacks
- **Dynamic Backgrounds**: Different visual effects for each level type
- **Background Music**: Space-themed ambient music that plays throughout the game
- **Music Controls**: Toggle music on/off and adjust volume in real-time

## 🎯 Gameplay

- **Move**: Left/Right arrow keys
- **Shoot**: Spacebar
- **Pause**: P key
- **Start/Restart**: Spacebar
- **B**: Activate Super Laser (hold)
- **M**: Toggle background music on/off
- **+/-**: Increase/decrease background music volume
- **1-0**: Skip to specific level (debug feature)

Destroy all aliens to advance to the next level. Each level increases in difficulty with faster enemy shooting. Don't let the aliens reach you or get hit by their bullets!

## 🛠️ Tech Stack

- **HTML5 Canvas** - For smooth 2D graphics
- **Vanilla JavaScript (ES6+)** - No framework overhead
- **Webpack** - For bundling and development
- **Jest** - For comprehensive unit testing
- **Web Audio API** - For dynamic sound generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd space-invaders
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🧪 Testing

The game includes comprehensive unit tests for all major components:

- **Player** - Movement, bounds checking, collision detection
- **Enemy** - Movement, animation, scoring
- **Bullet** - Trajectory, collision detection
- **CollisionManager** - AABB collision detection, circle collision
- **Game Logic** - State management, scoring, level progression

Run tests with:
```bash
npm test
```

## 🎨 Game Architecture

The game follows a modular architecture with clear separation of concerns:

```
src/
├── entities/          # Game objects (Player, Enemy, Bullet, Explosion)
├── utils/             # Utility classes (Input, Collision, Sound)
├── test/              # Unit tests
├── Game.js            # Main game controller
└── index.js           # Entry point
```

### Key Classes

- **Game** - Main game loop and state management
- **Player** - Player spaceship with movement and shooting
- **Enemy** - Alien invaders with AI and animations
- **Bullet** - Projectiles for both player and enemies
- **Explosion** - Particle effects for destroyed entities
- **InputManager** - Keyboard input handling
- **CollisionManager** - Collision detection system
- **SoundManager** - Audio effects using Web Audio API

## 🌟 Epic Features

### Visual Effects
- **Glowing bullets** with shadow effects
- **Particle explosions** with gradient colors
- **Animated aliens** with different colors per row
- **Starfield background** for atmosphere
- **Retro-futuristic UI** with neon green styling

### Gameplay Mechanics
- **Progressive difficulty** - Each level increases enemy shooting speed
- **Smart enemy AI** - Random shooting patterns
- **Collision detection** - Precise AABB collision system
- **Score system** - Different points for different alien types
- **Lives system** - Multiple attempts to save Earth

### Technical Excellence
- **60 FPS performance** - Optimized game loop
- **Memory management** - Proper cleanup of destroyed objects
- **Error handling** - Graceful fallbacks for audio/visual features
- **Cross-browser compatibility** - Works on all modern browsers

## 🚀 Deployment

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Other Platforms

The built files in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Play Now!

Ready to save Earth from the alien invasion? Start the game and see how many levels you can survive!

**May the force be with you!** 🌟

## Background Music

The game features procedurally generated space ambient music that:
- Automatically starts when the game begins
- Loops seamlessly for continuous playback
- Can be toggled on/off with the 'M' key
- Volume can be adjusted with '+' and '-' keys
- Creates an immersive space atmosphere with multiple layered tones

## Game Mechanics

### Enemy Types
- **Basic**: Standard enemies
- **Fast**: Move faster than basic enemies
- **Shooter**: Fire bullets at the player
- **Tank**: Require multiple hits to destroy
- **Kamikaze**: Dive directly at the player
- **Shielded**: Protected by energy shields
- **Boss**: Mini-boss enemies with special patterns
- **Final Boss**: Ultimate challenge enemies

### Special Mechanics
- **Rapid Fire**: Enemies shoot more frequently
- **Multi Bullet**: Enemies fire multiple bullets
- **Kamikaze Dive**: Enemies dive at the player
- **Shields**: Some enemies are protected
- **Boss Patterns**: Special attack patterns for boss enemies

## Development

### Setup
```bash
npm install
npm start
```

The game will be available at `http://localhost:3000`

### Building
```bash
npm run build
```

## Technical Details

- Built with vanilla JavaScript and HTML5 Canvas
- Uses Web Audio API for sound generation and playback
- Modular architecture with separate managers for input, collision, and sound
- Responsive design that adapts to different screen sizes
- Progressive difficulty system with 10 unique levels

## Audio System

The game uses the Web Audio API to generate both sound effects and background music:

- **Sound Effects**: Procedurally generated for shooting, explosions, hits, and game events
- **Background Music**: Multi-layered space ambient sound with smooth looping
- **Volume Control**: Independent volume controls for sound effects and background music
- **Browser Compatibility**: Works with all modern browsers that support Web Audio API 