# Space Invaders - API Documentation

## Table of Contents
1. [Game Class](#game-class)
2. [Player Class](#player-class)
3. [Enemy Class](#enemy-class)
4. [Bullet Class](#bullet-class)
5. [Explosion Class](#explosion-class)
6. [SuperLaser Class](#superlaser-class)
7. [InputManager Class](#inputmanager-class)
8. [CollisionManager Class](#collisionmanager-class)
9. [SoundManager Class](#soundmanager-class)
10. [Level Configuration](#level-configuration)
11. [Game States](#game-states)
12. [Event System](#event-system)

## Game Class

The main game controller that orchestrates all game logic, rendering, and state management.

### Constructor
```javascript
new Game(canvas: HTMLCanvasElement)
```

**Parameters:**
- `canvas`: HTML5 Canvas element for rendering

**Properties:**
- `canvas`: HTMLCanvasElement - The game canvas
- `ctx`: CanvasRenderingContext2D - Canvas rendering context
- `width`: number - Canvas width (800)
- `height`: number - Canvas height (600)
- `gameState`: string - Current game state ('start', 'playing', 'paused', 'gameOver', 'levelComplete')
- `score`: number - Player's current score
- `lives`: number - Player's remaining lives
- `level`: number - Current level (1-10)
- `enemiesKilled`: number - Enemies destroyed in current level
- `enemiesPerLevel`: number - Total enemies per level (30)

### Methods

#### startGame()
Initializes the game and starts gameplay.
```javascript
startGame(): void
```

#### restartGame()
Resets all game state and starts a new game.
```javascript
restartGame(): void
```

#### togglePause()
Toggles between playing and paused states.
```javascript
togglePause(): void
```

#### update(deltaTime)
Updates all game logic for the current frame.
```javascript
update(deltaTime: number): void
```

**Parameters:**
- `deltaTime`: Time elapsed since last frame in milliseconds

#### render()
Renders all game objects to the canvas.
```javascript
render(): void
```

#### gameLoop(currentTime)
Main game loop using requestAnimationFrame.
```javascript
gameLoop(currentTime: number): void
```

**Parameters:**
- `currentTime`: Current timestamp from requestAnimationFrame

#### spawnEnemies()
Creates enemy formation based on current level configuration.
```javascript
spawnEnemies(): void
```

#### checkCollisions()
Detects and handles all collisions between game objects.
```javascript
checkCollisions(): void
```

#### completeLevel()
Handles level completion logic.
```javascript
completeLevel(): void
```

#### startNextLevel()
Advances to the next level and updates configuration.
```javascript
startNextLevel(): void
```

#### gameOver()
Handles game over state.
```javascript
gameOver(): void
```

#### skipToLevel(levelNumber)
Debug method to skip to a specific level.
```javascript
skipToLevel(levelNumber: number): void
```

**Parameters:**
- `levelNumber`: Level to skip to (1-10)

## Player Class

Represents the player's spaceship with movement and shooting capabilities.

### Constructor
```javascript
new Player(x: number, y: number)
```

**Parameters:**
- `x`: Initial X position
- `y`: Initial Y position

**Properties:**
- `x`: number - Current X position
- `y`: number - Current Y position
- `width`: number - Player width (40)
- `height`: number - Player height (30)
- `speed`: number - Movement speed in pixels per second (300)
- `originalX`: number - Initial X position
- `originalY`: number - Initial Y position

### Methods

#### update(deltaTime, inputManager, canvasWidth)
Updates player position based on input.
```javascript
update(deltaTime: number, inputManager: InputManager, canvasWidth: number): void
```

**Parameters:**
- `deltaTime`: Time elapsed since last frame
- `inputManager`: Input manager instance
- `canvasWidth`: Canvas width for boundary checking

#### render(ctx)
Renders the player spaceship.
```javascript
render(ctx: CanvasRenderingContext2D): void
```

**Parameters:**
- `ctx`: Canvas rendering context

#### reset(x, y)
Resets player to specified position.
```javascript
reset(x: number, y: number): void
```

**Parameters:**
- `x`: New X position
- `y`: New Y position

#### getBounds()
Returns collision bounds.
```javascript
getBounds(): {x: number, y: number, width: number, height: number}
```

**Returns:** Object with collision bounds

## Enemy Class

Represents enemy entities with various types and behaviors.

### Constructor
```javascript
new Enemy(x: number, y: number, points: number, row: number, type?: string, speed?: number)
```

**Parameters:**
- `x`: Initial X position
- `y`: Initial Y position
- `points`: Points awarded when destroyed
- `row`: Row in enemy formation
- `type`: Enemy type ('basic', 'fast', 'shooter', 'tank', 'kamikaze', 'shielded', 'boss', 'finalBoss')
- `speed`: Movement speed (default: 20)

**Properties:**
- `x`: number - Current X position
- `y`: number - Current Y position
- `width`: number - Enemy width (varies by type)
- `height`: number - Enemy height (varies by type)
- `points`: number - Points awarded when destroyed
- `row`: number - Row in formation
- `type`: string - Enemy type
- `speed`: number - Movement speed
- `direction`: number - Movement direction (1 = right, -1 = left)
- `dropDistance`: number - Distance to drop when hitting edge (20)
- `animationFrame`: number - Current animation frame
- `animationSpeed`: number - Animation speed (0.1)
- `hits`: number - Number of hits taken
- `maxHits`: number - Maximum hits before destruction
- `shieldActive`: boolean - Whether shield is active
- `shieldHealth`: number - Remaining shield health
- `isKamikazeDiving`: boolean - Whether performing kamikaze dive
- `kamikazeSpeed`: number - Speed during kamikaze dive
- `bossPattern`: number - Current boss movement pattern
- `bossPatternTimer`: number - Timer for boss pattern changes

### Methods

#### update(deltaTime)
Updates enemy position and behavior.
```javascript
update(deltaTime: number): void
```

#### updateKamikazeDive(deltaTime)
Updates kamikaze diving behavior.
```javascript
updateKamikazeDive(deltaTime: number): void
```

#### updateBossPattern(deltaTime)
Updates boss movement patterns.
```javascript
updateBossPattern(deltaTime: number): void
```

#### startKamikazeDive()
Initiates kamikaze dive attack.
```javascript
startKamikazeDive(): void
```

#### hit()
Handles enemy being hit by player.
```javascript
hit(): boolean
```

**Returns:** true if enemy should be destroyed, false if it survives

#### hitShield()
Handles shield being hit.
```javascript
hitShield(): boolean
```

**Returns:** true if shield is broken, false if still active

#### render(ctx)
Renders the enemy based on its type.
```javascript
render(ctx: CanvasRenderingContext2D): void
```

#### shouldDrop()
Checks if enemy should drop down.
```javascript
shouldDrop(): boolean
```

#### drop()
Moves enemy down and reverses direction.
```javascript
drop(): void
```

#### getBounds()
Returns collision bounds.
```javascript
getBounds(): {x: number, y: number, width: number, height: number}
```

#### isOffScreen(canvasHeight)
Checks if enemy has moved off screen.
```javascript
isOffScreen(canvasHeight: number): boolean
```

### Enemy Types

#### Basic Enemy
- **Points**: 10-50 (varies by row)
- **Size**: 40x30
- **Behavior**: Standard side-to-side movement
- **Colors**: Red, Orange, Yellow, Green, Blue

#### Fast Enemy
- **Points**: 20-100
- **Size**: 40x30
- **Behavior**: Faster movement speed
- **Colors**: Magenta, Cyan, Light Yellow, Light Red, Light Green

#### Shooter Enemy
- **Points**: 30-150
- **Size**: 40x30
- **Behavior**: Can shoot at player
- **Colors**: Dark Orange, Dark Magenta, Purple, Dark Blue, Dark Green

#### Tank Enemy
- **Points**: 50-250
- **Size**: 50x40
- **Behavior**: Takes 3 hits to destroy
- **Colors**: Gray scale

#### Kamikaze Enemy
- **Points**: 40-200
- **Size**: 40x30
- **Behavior**: Dives at player when triggered
- **Colors**: Red to Yellow gradient

#### Shielded Enemy
- **Points**: 60-300
- **Size**: 40x30
- **Behavior**: Has protective shield
- **Colors**: Cyan scale

#### Boss Enemy
- **Points**: 100-500
- **Size**: 60x50
- **Behavior**: Complex movement patterns, takes 5 hits
- **Colors**: Pink scale

#### Final Boss Enemy
- **Points**: 200-1000
- **Size**: 80x60
- **Behavior**: Ultimate challenge, takes 10 hits
- **Colors**: Red to Yellow gradient

## Bullet Class

Represents projectiles fired by player and enemies.

### Constructor
```javascript
new Bullet(x: number, y: number, speed: number, direction: number, isPlayerBullet: boolean)
```

**Parameters:**
- `x`: Initial X position
- `y`: Initial Y position
- `speed`: Bullet speed in pixels per second
- `direction`: Movement direction (1 = up, -1 = down)
- `isPlayerBullet`: Whether bullet was fired by player

**Properties:**
- `x`: number - Current X position
- `y`: number - Current Y position
- `width`: number - Bullet width (4)
- `height`: number - Bullet height (10)
- `speed`: number - Movement speed
- `direction`: number - Movement direction
- `isPlayerBullet`: boolean - Whether fired by player

### Methods

#### update(deltaTime)
Updates bullet position.
```javascript
update(deltaTime: number): void
```

#### render(ctx)
Renders the bullet with glow effect.
```javascript
render(ctx: CanvasRenderingContext2D): void
```

#### isOffScreen(canvasHeight)
Checks if bullet has moved off screen.
```javascript
isOffScreen(canvasHeight: number): boolean
```

#### getBounds()
Returns collision bounds.
```javascript
getBounds(): {x: number, y: number, width: number, height: number}
```

## Explosion Class

Represents particle explosion effects when entities are destroyed.

### Constructor
```javascript
new Explosion(x: number, y: number, size: number)
```

**Parameters:**
- `x`: Explosion center X position
- `y`: Explosion center Y position
- `size`: Explosion size multiplier

**Properties:**
- `x`: number - Center X position
- `y`: number - Center Y position
- `size`: number - Size multiplier
- `particles`: Array - Particle objects
- `duration`: number - Explosion duration (500ms)
- `timer`: number - Current timer

### Methods

#### update(deltaTime)
Updates explosion animation.
```javascript
update(deltaTime: number): boolean
```

**Returns:** true if explosion is finished, false if still active

#### render(ctx)
Renders explosion particles.
```javascript
render(ctx: CanvasRenderingContext2D): void
```

## SuperLaser Class

Represents the special super laser weapon.

### Constructor
```javascript
new SuperLaser(x: number, y: number)
```

**Parameters:**
- `x`: Initial X position
- `y`: Initial Y position

**Properties:**
- `x`: number - Current X position
- `y`: number - Current Y position
- `width`: number - Laser width (8)
- `height`: number - Laser height (600)
- `active`: boolean - Whether laser is active
- `duration`: number - Laser duration (200ms)
- `timer`: number - Current timer

### Methods

#### activate(x, y)
Activates the super laser.
```javascript
activate(x: number, y: number): void
```

#### update(deltaTime)
Updates laser state.
```javascript
update(deltaTime: number): boolean
```

**Returns:** true if laser is finished, false if still active

#### render(ctx)
Renders the super laser beam.
```javascript
render(ctx: CanvasRenderingContext2D): void
```

#### getBounds()
Returns collision bounds.
```javascript
getBounds(): {x: number, y: number, width: number, height: number}
```

## InputManager Class

Handles keyboard input for the game.

### Constructor
```javascript
new InputManager()
```

**Properties:**
- `keys`: Object - Map of key codes to pressed state

### Methods

#### bindEvents()
Binds keyboard event listeners.
```javascript
bindEvents(): void
```

#### isKeyPressed(keyCode)
Checks if a key is currently pressed.
```javascript
isKeyPressed(keyCode: string): boolean
```

**Parameters:**
- `keyCode`: Key code to check

**Returns:** true if key is pressed, false otherwise

#### isKeyJustPressed(keyCode)
Checks if a key was just pressed (could be enhanced).
```javascript
isKeyJustPressed(keyCode: string): boolean
```

#### getPressedKeys()
Returns array of currently pressed keys.
```javascript
getPressedKeys(): string[]
```

**Returns:** Array of pressed key codes

#### clear()
Clears all key states.
```javascript
clear(): void
```

### Supported Keys
- `ArrowLeft`: Move left
- `ArrowRight`: Move right
- `Space`: Shoot / Start / Restart
- `KeyP`: Pause
- `KeyB`: Super Laser
- `KeyM`: Toggle music
- `Equal`: Increase music volume
- `Minus`: Decrease music volume
- `Digit1`-`Digit0`: Skip to level 1-10

## CollisionManager Class

Handles collision detection between game objects.

### Constructor
```javascript
new CollisionManager()
```

### Methods

#### checkCollision(obj1, obj2)
Checks collision between two objects.
```javascript
checkCollision(obj1: Object, obj2: Object): boolean
```

**Parameters:**
- `obj1`: First object (must have getBounds() method or bounds object)
- `obj2`: Second object (must have getBounds() method or bounds object)

**Returns:** true if collision detected, false otherwise

#### checkAABBCollision(bounds1, bounds2)
Checks AABB collision between two bounding boxes.
```javascript
checkAABBCollision(bounds1: Object, bounds2: Object): boolean
```

**Parameters:**
- `bounds1`: First bounding box {x, y, width, height}
- `bounds2`: Second bounding box {x, y, width, height}

**Returns:** true if collision detected, false otherwise

#### checkPointCollision(point, bounds)
Checks if a point is within bounds.
```javascript
checkPointCollision(point: {x: number, y: number}, bounds: Object): boolean
```

**Parameters:**
- `point`: Point to check {x, y}
- `bounds`: Bounding box {x, y, width, height}

**Returns:** true if point is within bounds, false otherwise

#### checkCircleCollision(center1, radius1, center2, radius2)
Checks collision between two circles.
```javascript
checkCircleCollision(center1: {x: number, y: number}, radius1: number, center2: {x: number, y: number}, radius2: number): boolean
```

**Parameters:**
- `center1`: First circle center {x, y}
- `radius1`: First circle radius
- `center2`: Second circle center {x, y}
- `radius2`: Second circle radius

**Returns:** true if collision detected, false otherwise

#### getCollisionSide(bounds1, bounds2)
Determines which side of bounds1 collided with bounds2.
```javascript
getCollisionSide(bounds1: Object, bounds2: Object): string
```

**Parameters:**
- `bounds1`: First bounding box
- `bounds2`: Second bounding box

**Returns:** 'left', 'right', 'top', or 'bottom'

## SoundManager Class

Handles all audio including sound effects and background music.

### Constructor
```javascript
new SoundManager()
```

**Properties:**
- `sounds`: Object - Map of sound names to audio buffers
- `enabled`: boolean - Whether sound effects are enabled
- `volume`: number - Sound effect volume (0.3)
- `audioContext`: AudioContext - Web Audio API context
- `backgroundMusic`: Audio - Background music element
- `backgroundMusicEnabled`: boolean - Whether background music is enabled
- `backgroundMusicVolume`: number - Background music volume (0.2)
- `backgroundMusicBuffer`: AudioBuffer - Generated ambient music buffer
- `backgroundMusicSource`: AudioBufferSourceNode - Current music source
- `backgroundMusicGain`: GainNode - Music volume control

### Methods

#### initAudioContext()
Initializes Web Audio API context.
```javascript
initAudioContext(): void
```

#### initBackgroundMusic()
Initializes background music system.
```javascript
initBackgroundMusic(): void
```

#### createSpaceAmbientMusic()
Creates procedurally generated space ambient music.
```javascript
createSpaceAmbientMusic(): void
```

#### startBackgroundMusic()
Starts playing background music.
```javascript
startBackgroundMusic(): void
```

#### stopBackgroundMusic()
Stops background music.
```javascript
stopBackgroundMusic(): void
```

#### setBackgroundMusicVolume(volume)
Sets background music volume.
```javascript
setBackgroundMusicVolume(volume: number): void
```

**Parameters:**
- `volume`: Volume level (0-1)

#### toggleBackgroundMusic()
Toggles background music on/off.
```javascript
toggleBackgroundMusic(): void
```

#### isBackgroundMusicPlaying()
Checks if background music is currently playing.
```javascript
isBackgroundMusicPlaying(): boolean
```

**Returns:** true if music is playing, false otherwise

#### initSounds()
Initializes all sound effects.
```javascript
initSounds(): void
```

#### createSound(name, audioBuffer)
Creates a named sound effect.
```javascript
createSound(name: string, audioBuffer: AudioBuffer): void
```

**Parameters:**
- `name`: Sound effect name
- `audioBuffer`: Audio buffer data

#### playSound(name)
Plays a sound effect.
```javascript
playSound(name: string): void
```

**Parameters:**
- `name`: Sound effect name to play

#### generateShootSound()
Generates shoot sound effect.
```javascript
generateShootSound(): AudioBuffer
```

**Returns:** Generated audio buffer

#### generateExplosionSound()
Generates explosion sound effect.
```javascript
generateExplosionSound(): AudioBuffer
```

**Returns:** Generated audio buffer

#### generateHitSound()
Generates hit sound effect.
```javascript
generateHitSound(): AudioBuffer
```

**Returns:** Generated audio buffer

#### generateGameOverSound()
Generates game over sound effect.
```javascript
generateGameOverSound(): AudioBuffer
```

**Returns:** Generated audio buffer

#### generateLevelCompleteSound()
Generates level complete sound effect.
```javascript
generateLevelCompleteSound(): AudioBuffer
```

**Returns:** Generated audio buffer

#### generateVictorySound()
Generates victory sound effect.
```javascript
generateVictorySound(): AudioBuffer
```

**Returns:** Generated audio buffer

#### setVolume(volume)
Sets sound effect volume.
```javascript
setVolume(volume: number): void
```

**Parameters:**
- `volume`: Volume level (0-1)

#### toggleSound()
Toggles sound effects on/off.
```javascript
toggleSound(): void
```

#### isEnabled()
Checks if sound effects are enabled.
```javascript
isEnabled(): boolean
```

**Returns:** true if sound is enabled, false otherwise

## Level Configuration

Level configurations are defined in the `LEVEL_CONFIGS` array in `Game.js`.

### Level Configuration Object
```javascript
{
    name: string,              // Level display name
    enemySpeed: number,        // Enemy movement speed
    enemyShootInterval: number, // Time between enemy shots (ms)
    enemyBulletSpeed: number,  // Enemy bullet speed
    enemyRows: number,         // Number of enemy rows
    enemyCols: number,         // Number of enemy columns
    enemyTypes: string[],      // Array of enemy types to spawn
    specialMechanics: string[], // Array of special mechanics
    background: string         // Background type
}
```

### Level Types
1. **Tutorial**: Basic enemies, slow movement
2. **Speed Demon**: Faster enemies
3. **Shooting Frenzy**: More frequent enemy shots
4. **Bullet Hell**: Multiple bullets per shot
5. **Tank Battalion**: Enemies that take multiple hits
6. **Kamikaze Squadron**: Enemies that dive at player
7. **Shield Wall**: Enemies with shields
8. **Boss Wave**: Mini-boss enemies
9. **Ultimate Challenge**: Everything combined
10. **Final Boss**: Epic final level

### Special Mechanics
- `rapidFire`: Enemies shoot more frequently
- `multiBullet`: Enemies fire multiple bullets
- `tankEnemies`: Enemies take multiple hits
- `kamikazeDive`: Enemies perform kamikaze attacks
- `shields`: Enemies have protective shields
- `bossPatterns`: Boss enemies use complex patterns
- `ultimate`: Ultimate challenge mechanics
- `finalBoss`: Final boss special mechanics

### Background Types
- `normal`: Standard starfield
- `intense`: More stars and effects
- `chaos`: Chaotic visual effects
- `boss`: Boss-level background
- `ultimate`: Ultimate challenge background
- `final`: Final boss background

## Game States

The game uses a state machine pattern with the following states:

### State Values
- `'start'`: Initial game screen
- `'playing'`: Active gameplay
- `'paused'`: Game paused
- `'gameOver'`: Player lost
- `'levelComplete'`: Level finished

### State Transitions
1. **start** → **playing**: Press Space
2. **playing** → **paused**: Press P
3. **paused** → **playing**: Press P
4. **playing** → **levelComplete**: All enemies destroyed
5. **levelComplete** → **playing**: Press Space (next level)
6. **playing** → **gameOver**: Player lives = 0
7. **gameOver** → **start**: Press Space (restart)

## Event System

The game uses a simple event-driven architecture for input and game events.

### Input Events
- **Key Down**: Handled by InputManager
- **Key Up**: Handled by InputManager
- **Window Resize**: Handled in index.js
- **Visibility Change**: Auto-pause when tab is not active

### Game Events
- **Enemy Destroyed**: Updates score and enemy count
- **Player Hit**: Reduces lives, plays sound
- **Level Complete**: Shows completion screen
- **Game Over**: Shows game over screen
- **Music Toggle**: Toggles background music
- **Volume Change**: Adjusts music volume

### Event Handling Pattern
```javascript
// Input events
document.addEventListener('keydown', (e) => {
    // Handle key press
});

// Game state events
if (this.enemies.length === 0) {
    this.completeLevel();
}

// Audio events
this.soundManager.playSound('explosion');
```

This API documentation provides comprehensive details about all classes, methods, and interfaces in the Space Invaders codebase. Use this as a reference when extending or modifying the game. 