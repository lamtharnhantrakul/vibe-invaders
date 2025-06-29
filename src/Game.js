import Player from './entities/Player.js';
import Enemy from './entities/Enemy.js';
import Bullet from './entities/Bullet.js';
import Explosion from './entities/Explosion.js';
import SuperLaser from './entities/SuperLaser.js';
import { InputManager } from './utils/InputManager.js';
import { CollisionManager } from './utils/CollisionManager.js';
import { SoundManager } from './utils/SoundManager.js';

// Level configurations for 10 increasingly difficult levels
const LEVEL_CONFIGS = [
    // Level 1: Tutorial - Basic enemies, slow movement
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
    // Level 2: Speed Increase - Faster enemies
    {
        name: "Speed Demon",
        enemySpeed: 25,
        enemyShootInterval: 2500,
        enemyBulletSpeed: 100,
        enemyRows: 4,
        enemyCols: 9,
        enemyTypes: ['basic', 'fast'],
        specialMechanics: [],
        background: 'normal'
    },
    // Level 3: Shooting Frenzy - More frequent enemy shots
    {
        name: "Shooting Frenzy",
        enemySpeed: 30,
        enemyShootInterval: 1800,
        enemyBulletSpeed: 120,
        enemyRows: 4,
        enemyCols: 10,
        enemyTypes: ['basic', 'fast', 'shooter'],
        specialMechanics: ['rapidFire'],
        background: 'normal'
    },
    // Level 4: Bullet Hell - Multiple bullets per shot
    {
        name: "Bullet Hell",
        enemySpeed: 35,
        enemyShootInterval: 2000,
        enemyBulletSpeed: 140,
        enemyRows: 5,
        enemyCols: 10,
        enemyTypes: ['basic', 'fast', 'shooter', 'multiShooter'],
        specialMechanics: ['rapidFire', 'multiBullet'],
        background: 'intense'
    },
    // Level 5: Tank Enemies - Enemies that take multiple hits
    {
        name: "Tank Battalion",
        enemySpeed: 20,
        enemyShootInterval: 2200,
        enemyBulletSpeed: 160,
        enemyRows: 5,
        enemyCols: 11,
        enemyTypes: ['basic', 'fast', 'shooter', 'tank'],
        specialMechanics: ['rapidFire', 'multiBullet', 'tankEnemies'],
        background: 'intense'
    },
    // Level 6: Kamikaze - Enemies that dive at the player
    {
        name: "Kamikaze Squadron",
        enemySpeed: 40,
        enemyShootInterval: 1500,
        enemyBulletSpeed: 180,
        enemyRows: 5,
        enemyCols: 12,
        enemyTypes: ['basic', 'fast', 'shooter', 'kamikaze'],
        specialMechanics: ['rapidFire', 'multiBullet', 'kamikazeDive'],
        background: 'chaos'
    },
    // Level 7: Shield Wall - Enemies with shields
    {
        name: "Shield Wall",
        enemySpeed: 25,
        enemyShootInterval: 1200,
        enemyBulletSpeed: 200,
        enemyRows: 6,
        enemyCols: 12,
        enemyTypes: ['basic', 'fast', 'shooter', 'shielded'],
        specialMechanics: ['rapidFire', 'multiBullet', 'shields'],
        background: 'chaos'
    },
    // Level 8: Boss Wave - Mini-boss enemies
    {
        name: "Boss Wave",
        enemySpeed: 30,
        enemyShootInterval: 1000,
        enemyBulletSpeed: 220,
        enemyRows: 6,
        enemyCols: 13,
        enemyTypes: ['basic', 'fast', 'shooter', 'boss'],
        specialMechanics: ['rapidFire', 'multiBullet', 'bossPatterns'],
        background: 'boss'
    },
    // Level 9: Ultimate Challenge - Everything combined
    {
        name: "Ultimate Challenge",
        enemySpeed: 45,
        enemyShootInterval: 800,
        enemyBulletSpeed: 240,
        enemyRows: 7,
        enemyCols: 14,
        enemyTypes: ['basic', 'fast', 'shooter', 'tank', 'kamikaze', 'shielded'],
        specialMechanics: ['rapidFire', 'multiBullet', 'kamikazeDive', 'shields', 'ultimate'],
        background: 'ultimate'
    },
    // Level 10: Final Boss - Epic final level
    {
        name: "Final Boss",
        enemySpeed: 50,
        enemyShootInterval: 600,
        enemyBulletSpeed: 260,
        enemyRows: 8,
        enemyCols: 15,
        enemyTypes: ['basic', 'fast', 'shooter', 'tank', 'kamikaze', 'shielded', 'boss', 'finalBoss'],
        specialMechanics: ['rapidFire', 'multiBullet', 'kamikazeDive', 'shields', 'bossPatterns', 'finalBoss'],
        background: 'final'
    }
];

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver', 'levelComplete'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemiesKilled = 0;
        this.enemiesPerLevel = 30;
        
        // Level system
        this.currentLevelConfig = LEVEL_CONFIGS[0];
        this.levelCompleteTimer = 0;
        this.levelCompleteDuration = 2000; // 2 seconds to show level complete
        
        // Managers
        this.inputManager = new InputManager();
        this.collisionManager = new CollisionManager();
        this.soundManager = new SoundManager();
        
        // Game entities
        this.player = new Player(this.width / 2, this.height - 50);
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.superLaser = new SuperLaser(this.player.x + 20, this.player.y);
        
        // Game timing
        this.lastTime = 0;
        this.enemyShootTimer = 0;
        this.enemyShootInterval = 2000; // ms
        
        // Special mechanics
        this.kamikazeEnemies = [];
        this.shieldedEnemies = [];
        this.bossEnemies = [];
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.levelNameElement = document.getElementById('levelName');
        this.musicStatusElement = document.getElementById('musicStatus');
        this.gameOverElement = document.getElementById('gameOver');
        this.startScreenElement = document.getElementById('startScreen');
        this.levelCompleteElement = document.getElementById('levelComplete');
        
        this.init();
    }
    
    init() {
        this.spawnEnemies();
        this.bindEvents();
        this.updateUI();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.code, 'Game state:', this.gameState); // Debug logging
            
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'start') {
                    this.startGame();
                } else if (this.gameState === 'gameOver') {
                    this.restartGame();
                } else if (this.gameState === 'levelComplete') {
                    this.startNextLevel();
                } else if (this.gameState === 'playing') {
                    this.playerShoot();
                }
            } else if (e.code === 'KeyP' && this.gameState === 'playing') {
                this.togglePause();
            } else if (e.code === 'KeyM') {
                // Toggle background music
                this.soundManager.toggleBackgroundMusic();
                this.updateUI(); // Update UI to reflect music status
                console.log('Background music toggled');
            } else if (e.code === 'Equal' || e.code === 'NumpadAdd') {
                // Increase background music volume
                const currentVolume = this.soundManager.backgroundMusicVolume;
                this.soundManager.setBackgroundMusicVolume(Math.min(1, currentVolume + 0.1));
                console.log('Background music volume increased to:', this.soundManager.backgroundMusicVolume);
            } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
                // Decrease background music volume
                const currentVolume = this.soundManager.backgroundMusicVolume;
                this.soundManager.setBackgroundMusicVolume(Math.max(0, currentVolume - 0.1));
                console.log('Background music volume decreased to:', this.soundManager.backgroundMusicVolume);
            } else if ((e.code >= 'Digit1' && e.code <= 'Digit9') || e.code === 'Digit0') {
                // Debug: Skip to specific level (1-10) - works in any game state except 'start'
                if (this.gameState !== 'start') {
                    e.preventDefault();
                    const levelNumber = e.code === 'Digit0' ? 10 : parseInt(e.code.replace('Digit', ''));
                    console.log('Attempting to skip to level:', levelNumber); // Debug logging
                    this.skipToLevel(levelNumber);
                }
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.startScreenElement.style.display = 'none';
        this.soundManager.startBackgroundMusic();
        this.gameLoop();
    }
    
    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemiesKilled = 0;
        this.currentLevelConfig = LEVEL_CONFIGS[0];
        this.gameState = 'playing';
        
        this.player.reset(this.width / 2, this.height - 50);
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.superLaser = new SuperLaser(this.player.x + 20, this.player.y);
        
        // Reset special mechanics
        this.kamikazeEnemies = [];
        this.shieldedEnemies = [];
        this.bossEnemies = [];
        
        this.spawnEnemies();
        this.updateUI();
        this.gameOverElement.style.display = 'none';
        this.soundManager.startBackgroundMusic();
        this.gameLoop();
    }
    
    togglePause() {
        this.gameState = this.gameState === 'playing' ? 'paused' : 'playing';
        if (this.gameState === 'playing') {
            this.gameLoop();
        }
    }
    
    spawnEnemies() {
        const config = this.currentLevelConfig;
        const rows = config.enemyRows;
        const cols = config.enemyCols;
        const enemyWidth = 40;
        const enemyHeight = 30;
        const spacing = 60;
        const startX = (this.width - (cols - 1) * spacing) / 2;
        
        // Ensure enemies don't spawn too close to the player
        // Calculate maximum safe Y position to maintain distance from player
        const playerY = this.height - 50; // Player position
        const minDistanceFromPlayer = 150; // Minimum distance between enemies and player
        const maxEnemyY = playerY - minDistanceFromPlayer;
        
        // Calculate how much space we need for all enemy rows
        const totalEnemyHeight = (rows - 1) * spacing + enemyHeight;
        
        // If enemies would be too close to player, reduce the starting Y position
        let startY = 50;
        if (startY + totalEnemyHeight > maxEnemyY) {
            startY = Math.max(20, maxEnemyY - totalEnemyHeight);
        }
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * spacing;
                const y = startY + row * spacing;
                const points = (rows - row) * 10 * this.level; // More points in higher levels
                
                // Determine enemy type based on row and level
                const enemyType = this.getEnemyTypeForPosition(row, col, config.enemyTypes);
                
                const enemy = new Enemy(x, y, points, row, enemyType, config.enemySpeed);
                
                // Adjust drop distance for higher levels to prevent enemies from reaching player too quickly
                if (this.level >= 6) {
                    enemy.dropDistance = Math.max(10, 20 - (this.level - 5) * 2);
                }
                
                this.enemies.push(enemy);
                
                // Track special enemy types
                if (enemyType === 'kamikaze') {
                    this.kamikazeEnemies.push(enemy);
                } else if (enemyType === 'shielded') {
                    this.shieldedEnemies.push(enemy);
                } else if (enemyType === 'boss' || enemyType === 'finalBoss') {
                    this.bossEnemies.push(enemy);
                }
            }
        }
    }
    
    getEnemyTypeForPosition(row, col, availableTypes) {
        // Distribute enemy types based on row and level
        if (this.level >= 10 && row === 0) {
            return 'finalBoss';
        } else if (this.level >= 8 && row <= 1) {
            return 'boss';
        } else if (this.level >= 7 && row <= 2) {
            return 'shielded';
        } else if (this.level >= 6 && row >= 3) {
            return 'kamikaze';
        } else if (this.level >= 5 && row >= 2) {
            return 'tank';
        } else if (this.level >= 3 && row >= 1) {
            return 'shooter';
        } else if (this.level >= 2 && row >= 0) {
            return 'fast';
        } else {
            return 'basic';
        }
    }
    
    playerShoot() {
        const bullet = new Bullet(
            this.player.x + this.player.width / 2,
            this.player.y,
            -80, // Moving up (increased from -60)
            'player'
        );
        this.playerBullets.push(bullet);
        this.soundManager.playSound('shoot');
    }
    
    enemyShoot() {
        if (this.enemies.length === 0) return;
        
        const config = this.currentLevelConfig;
        const shootCount = config.specialMechanics.includes('multiBullet') ? 
            Math.min(3, Math.floor(this.level / 3) + 1) : 1;
        
        for (let i = 0; i < shootCount; i++) {
            const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            const bullet = new Bullet(
                randomEnemy.x + randomEnemy.width / 2,
                randomEnemy.y + randomEnemy.height,
                config.enemyBulletSpeed,
                'enemy'
            );
            this.enemyBullets.push(bullet);
        }
    }
    
    update(deltaTime) {
        if (this.gameState === 'levelComplete') {
            this.levelCompleteTimer += deltaTime;
            if (this.levelCompleteTimer >= this.levelCompleteDuration) {
                this.startNextLevel();
            }
            return;
        }
        
        if (this.gameState !== 'playing') return;
        
        // Update player
        this.player.update(deltaTime, this.inputManager, this.width);
        
        // Update super laser
        if (this.inputManager.isKeyPressed('KeyB')) {
            if (!this.superLaser.active) {
                this.superLaser.activate(this.player.x + 20, this.player.y, this.height);
                this.soundManager.playSound('shoot');
            }
            this.superLaser.update(deltaTime, this.player.x, this.player.y, this.height);
        } else {
            if (this.superLaser.active) {
                this.superLaser.deactivate();
            }
        }
        
        // Update special mechanics
        this.updateSpecialMechanics(deltaTime);
        
        // Check if any enemy hits the edge
        let hitEdge = false;
        this.enemies.forEach(enemy => {
            if ((enemy.x <= 0 && enemy.direction === -1) || (enemy.x + enemy.width >= this.width && enemy.direction === 1)) {
                hitEdge = true;
            }
        });
        // If any enemy hits the edge, drop all enemies and reverse direction
        if (hitEdge) {
            this.enemies.forEach(enemy => enemy.drop());
        }
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        
        // Safety check: prevent enemies from getting too close to the player
        const playerY = this.height - 50;
        const dangerZone = 100; // Distance from player where enemies are considered dangerous
        this.enemies.forEach(enemy => {
            if (enemy.y + enemy.height > playerY - dangerZone) {
                // Slow down enemies that are getting too close
                enemy.speed = Math.min(enemy.speed, 15);
            }
            
            // Prevent enemies from getting too close to the player
            const maxEnemyY = playerY - 120; // Keep enemies at least 120px from player
            if (enemy.y + enemy.height > maxEnemyY) {
                enemy.y = maxEnemyY - enemy.height;
            }
        });
        
        // Filter out enemies that have gone offscreen (kamikaze enemies that dive below the canvas)
        this.enemies = this.enemies.filter(enemy => {
            // Remove enemies that have gone below the canvas height
            if (enemy.isOffScreen(this.height)) {
                // Remove from special arrays if they exist there
                const kamikazeIndex = this.kamikazeEnemies.indexOf(enemy);
                if (kamikazeIndex > -1) this.kamikazeEnemies.splice(kamikazeIndex, 1);
                
                const shieldedIndex = this.shieldedEnemies.indexOf(enemy);
                if (shieldedIndex > -1) this.shieldedEnemies.splice(shieldedIndex, 1);
                
                const bossIndex = this.bossEnemies.indexOf(enemy);
                if (bossIndex > -1) this.bossEnemies.splice(bossIndex, 1);
                
                return false; // Remove from main enemies array
            }
            return true; // Keep enemy in main array
        });
        
        // Update bullets
        this.playerBullets = this.playerBullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.y > 0;
        });
        
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.y < this.height;
        });
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.update(deltaTime);
            return !explosion.finished;
        });
        
        // Enemy shooting
        this.enemyShootTimer += deltaTime;
        if (this.enemyShootTimer >= this.enemyShootInterval) {
            this.enemyShoot();
            this.enemyShootTimer = 0;
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Check level completion
        if (this.enemies.length === 0) {
            this.completeLevel();
        }
        
        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    updateSpecialMechanics(deltaTime) {
        const config = this.currentLevelConfig;
        
        // Kamikaze dive mechanics
        if (config.specialMechanics.includes('kamikazeDive')) {
            this.kamikazeEnemies.forEach(enemy => {
                if (Math.random() < 0.001 * this.level) { // Higher chance in higher levels
                    enemy.startKamikazeDive();
                }
            });
        }
        
        // Boss patterns
        if (config.specialMechanics.includes('bossPatterns')) {
            this.bossEnemies.forEach(enemy => {
                enemy.updateBossPattern(deltaTime);
            });
        }
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        this.playerBullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.collisionManager.checkCollision(bullet, enemy)) {
                    // Handle different enemy types
                    if (enemy.type === 'tank' && enemy.hits < 3) {
                        enemy.hit();
                        this.playerBullets.splice(bulletIndex, 1);
                        this.soundManager.playSound('hit');
                    } else if (enemy.type === 'shielded' && enemy.shieldActive) {
                        enemy.hitShield();
                        this.playerBullets.splice(bulletIndex, 1);
                        this.soundManager.playSound('hit');
                    } else {
                        this.score += enemy.points;
                        this.enemiesKilled++;
                        
                        // Create explosion
                        this.explosions.push(new Explosion(enemy.x, enemy.y));
                        
                        // Remove bullet and enemy
                        this.playerBullets.splice(bulletIndex, 1);
                        this.enemies.splice(enemyIndex, 1);
                        
                        // Remove from special arrays
                        const specialIndex = this.kamikazeEnemies.indexOf(enemy);
                        if (specialIndex > -1) this.kamikazeEnemies.splice(specialIndex, 1);
                        
                        const shieldedIndex = this.shieldedEnemies.indexOf(enemy);
                        if (shieldedIndex > -1) this.shieldedEnemies.splice(shieldedIndex, 1);
                        
                        const bossIndex = this.bossEnemies.indexOf(enemy);
                        if (bossIndex > -1) this.bossEnemies.splice(bossIndex, 1);
                        
                        this.soundManager.playSound('explosion');
                        this.updateUI();
                    }
                }
            });
        });
        
        // Enemy bullets vs player
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.collisionManager.checkCollision(bullet, this.player)) {
                this.lives--;
                this.explosions.push(new Explosion(this.player.x, this.player.y));
                this.enemyBullets.splice(bulletIndex, 1);
                this.soundManager.playSound('hit');
                this.updateUI();
            }
        });
        
        // Enemies vs player
        this.enemies.forEach(enemy => {
            if (this.collisionManager.checkCollision(enemy, this.player)) {
                this.gameOver();
            }
        });
        
        // Super laser vs enemies
        if (this.superLaser.active) {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.collisionManager.checkCollision(this.superLaser, enemy)) {
                    this.score += enemy.points;
                    this.enemiesKilled++;
                    
                    // Create explosion
                    this.explosions.push(new Explosion(enemy.x, enemy.y));
                    
                    // Remove enemy
                    this.enemies.splice(enemyIndex, 1);
                    
                    // Remove from special arrays
                    const specialIndex = this.kamikazeEnemies.indexOf(enemy);
                    if (specialIndex > -1) this.kamikazeEnemies.splice(specialIndex, 1);
                    
                    const shieldedIndex = this.shieldedEnemies.indexOf(enemy);
                    if (shieldedIndex > -1) this.shieldedEnemies.splice(shieldedIndex, 1);
                    
                    const bossIndex = this.bossEnemies.indexOf(enemy);
                    if (bossIndex > -1) this.bossEnemies.splice(bossIndex, 1);
                    
                    this.soundManager.playSound('explosion');
                    this.updateUI();
                }
            });
        }
    }
    
    completeLevel() {
        this.gameState = 'levelComplete';
        this.levelCompleteTimer = 0;
        
        // Update the level complete text with current level info
        const nextLevel = this.level + 1;
        if (nextLevel <= 10) {
            const nextLevelConfig = LEVEL_CONFIGS[nextLevel - 1];
            this.levelCompleteElement.innerHTML = `LEVEL ${this.level} COMPLETE!<br><span style="font-size: 24px;">Next: ${nextLevelConfig.name}</span><br><span style="font-size: 18px;">Press SPACE to continue</span>`;
        } else {
            this.levelCompleteElement.innerHTML = `LEVEL ${this.level} COMPLETE!<br><span style="font-size: 24px;">Final Level!</span><br><span style="font-size: 18px;">Press SPACE to continue</span>`;
        }
        
        this.levelCompleteElement.style.display = 'block';
        this.soundManager.playSound('levelComplete');
    }
    
    startNextLevel() {
        this.level++;
        this.levelCompleteElement.style.display = 'none';
        
        if (this.level <= 10) {
            this.currentLevelConfig = LEVEL_CONFIGS[this.level - 1];
            this.enemyShootInterval = this.currentLevelConfig.enemyShootInterval;
            this.enemiesKilled = 0;
            
            // Clear all entities
            this.enemies = [];
            this.playerBullets = [];
            this.enemyBullets = [];
            this.explosions = [];
            this.kamikazeEnemies = [];
            this.shieldedEnemies = [];
            this.bossEnemies = [];
            
            this.spawnEnemies();
            this.updateUI();
            this.gameState = 'playing';
        } else {
            // Game completed!
            this.gameState = 'gameOver';
            this.gameOverElement.innerHTML = 'YOU WIN!<br><span style="font-size: 24px;">Press SPACE to restart</span>';
            this.gameOverElement.style.display = 'block';
            this.soundManager.playSound('victory');
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.gameOverElement.innerHTML = 'GAME OVER<br><span style="font-size: 24px;">Press SPACE to restart</span>';
        this.gameOverElement.style.display = 'block';
        this.soundManager.playSound('gameOver');
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw background based on level
        this.drawBackground();
        
        // Draw game entities
        this.player.render(this.ctx);
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.playerBullets.forEach(bullet => bullet.render(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        this.superLaser.render(this.ctx);
        
        // Draw danger warning if enemies are too close
        const playerY = this.height - 50;
        const dangerZone = 100;
        const enemiesInDangerZone = this.enemies.some(enemy => enemy.y + enemy.height > playerY - dangerZone);
        
        if (enemiesInDangerZone) {
            // Draw red warning border
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(0, 0, this.width, this.height);
            
            // Draw warning text
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '24px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('WARNING: ENEMIES APPROACHING!', this.width / 2, 30);
        }
        
        // Draw pause screen
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#00ff41';
            this.ctx.font = '48px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        }
        
        // Note: Level complete text is handled by HTML overlay, not canvas rendering
    }
    
    drawBackground() {
        const config = this.currentLevelConfig;
        
        switch (config.background) {
            case 'normal':
                this.drawStars();
                break;
            case 'intense':
                this.drawIntenseStars();
                break;
            case 'chaos':
                this.drawChaosBackground();
                break;
            case 'boss':
                this.drawBossBackground();
                break;
            case 'ultimate':
                this.drawUltimateBackground();
                break;
            case 'final':
                this.drawFinalBackground();
                break;
            default:
                this.drawStars();
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 37) % this.width;
            const y = (i * 73) % this.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    drawIntenseStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 150; i++) {
            const x = (i * 37) % this.width;
            const y = (i * 73) % this.height;
            const size = (i % 4) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
        
        // Add some colored stars
        this.ctx.fillStyle = '#00ff41';
        for (let i = 0; i < 20; i++) {
            const x = (i * 123) % this.width;
            const y = (i * 456) % this.height;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    drawChaosBackground() {
        this.drawIntenseStars();
        
        // Add nebula effects
        this.ctx.fillStyle = 'rgba(255, 0, 64, 0.1)';
        for (let i = 0; i < 5; i++) {
            const x = (i * 200) % this.width;
            const y = (i * 150) % this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 50 + i * 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawBossBackground() {
        this.drawChaosBackground();
        
        // Add boss arena effects
        this.ctx.strokeStyle = '#ff8000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, 50, this.width - 100, this.height - 100);
    }
    
    drawUltimateBackground() {
        this.drawBossBackground();
        
        // Add energy field effects
        this.ctx.fillStyle = 'rgba(0, 255, 65, 0.05)';
        for (let i = 0; i < 10; i++) {
            const x = (i * 80) % this.width;
            const y = (i * 60) % this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawFinalBackground() {
        this.drawUltimateBackground();
        
        // Add final boss effects
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, 200, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
        this.levelNameElement.textContent = this.currentLevelConfig.name;
        this.musicStatusElement.textContent = this.soundManager.isBackgroundMusicPlaying() ? 'ON' : 'OFF';
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing' && this.gameState !== 'levelComplete') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    skipToLevel(levelNumber) {
        console.log('skipToLevel called with levelNumber:', levelNumber); // Debug logging
        
        if (levelNumber < 1 || levelNumber > 10) {
            console.log('Invalid level number:', levelNumber);
            return;
        }
        
        console.log('Current level before skip:', this.level);
        console.log('Current game state before skip:', this.gameState);
        
        // Update level and configuration
        this.level = levelNumber;
        this.currentLevelConfig = LEVEL_CONFIGS[levelNumber - 1];
        this.enemyShootInterval = this.currentLevelConfig.enemyShootInterval;
        this.enemiesKilled = 0;
        
        // Clear all entities
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.kamikazeEnemies = [];
        this.shieldedEnemies = [];
        this.bossEnemies = [];
        
        // Reset player position
        this.player.reset(this.width / 2, this.height - 50);
        
        // Ensure game is in playing state
        this.gameState = 'playing';
        
        // Spawn new enemies for the selected level
        this.spawnEnemies();
        this.updateUI();
        
        // Show debug message
        console.log(`Debug: Skipped to Level ${levelNumber} - ${this.currentLevelConfig.name}`);
        
        // Optional: Show a brief on-screen message
        this.showDebugMessage(`Level ${levelNumber}: ${this.currentLevelConfig.name}`);
        
        console.log('Level skip completed. New level:', this.level);
    }
    
    showDebugMessage(message) {
        // Create a temporary debug message element
        const debugMsg = document.createElement('div');
        debugMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #00ff41;
            padding: 20px;
            border: 2px solid #00ff41;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            z-index: 1000;
            pointer-events: none;
        `;
        debugMsg.textContent = message;
        document.body.appendChild(debugMsg);
        
        // Remove the message after 2 seconds
        setTimeout(() => {
            if (debugMsg.parentNode) {
                debugMsg.parentNode.removeChild(debugMsg);
            }
        }, 2000);
    }
} 