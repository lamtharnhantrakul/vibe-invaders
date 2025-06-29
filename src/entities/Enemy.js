export default class Enemy {
    constructor(x, y, points, row, type = 'basic', speed = 20) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.points = points;
        this.row = row;
        this.type = type;
        this.speed = speed;
        this.direction = 1; // 1 for right, -1 for left
        this.dropDistance = 20; // how far to drop when hitting edge
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        
        // Enemy type specific properties
        this.hits = 0; // For tank enemies
        this.maxHits = this.getMaxHits();
        this.shieldActive = this.type === 'shielded';
        this.shieldHealth = this.shieldActive ? 3 : 0;
        this.isKamikazeDiving = false;
        this.kamikazeSpeed = 100;
        this.bossPattern = 0;
        this.bossPatternTimer = 0;
        
        // Visual properties
        this.colors = this.getColors();
        this.size = this.getSize();
    }
    
    getMaxHits() {
        switch (this.type) {
            case 'tank': return 3;
            case 'boss': return 5;
            case 'finalBoss': return 10;
            default: return 1;
        }
    }
    
    getColors() {
        switch (this.type) {
            case 'basic':
                return ['#ff0040', '#ff8000', '#ffff00', '#00ff00', '#0080ff'];
            case 'fast':
                return ['#ff00ff', '#00ffff', '#ffff80', '#ff8080', '#80ff80'];
            case 'shooter':
                return ['#ff4000', '#ff0080', '#8000ff', '#0080ff', '#80ff00'];
            case 'tank':
                return ['#808080', '#a0a0a0', '#c0c0c0', '#e0e0e0', '#ffffff'];
            case 'kamikaze':
                return ['#ff0000', '#ff4000', '#ff8000', '#ffc000', '#ffff00'];
            case 'shielded':
                return ['#00ffff', '#40ffff', '#80ffff', '#c0ffff', '#ffffff'];
            case 'boss':
                return ['#ff0080', '#ff4080', '#ff8080', '#ffc080', '#ffff80'];
            case 'finalBoss':
                return ['#ff0000', '#ff4000', '#ff8000', '#ffc000', '#ffff00'];
            default:
                return ['#ff0040', '#ff8000', '#ffff00', '#00ff00', '#0080ff'];
        }
    }
    
    getSize() {
        switch (this.type) {
            case 'tank':
                return { width: 50, height: 40 };
            case 'boss':
                return { width: 60, height: 50 };
            case 'finalBoss':
                return { width: 80, height: 60 };
            default:
                return { width: 40, height: 30 };
        }
    }
    
    update(deltaTime) {
        if (this.isKamikazeDiving) {
            this.updateKamikazeDive(deltaTime);
        } else if (this.type === 'boss' || this.type === 'finalBoss') {
            this.updateBossPattern(deltaTime);
        } else {
            // Normal side-to-side movement
            this.x += this.speed * this.direction * (deltaTime / 1000);
        }
        
        // Animate the enemy
        this.animationFrame += this.animationSpeed * (deltaTime / 1000);
        if (this.animationFrame > 2) {
            this.animationFrame = 0;
        }
    }
    
    updateKamikazeDive(deltaTime) {
        // Dive straight down towards the player
        this.y += this.kamikazeSpeed * (deltaTime / 1000);
        
        // Add some horizontal movement for unpredictability
        this.x += Math.sin(this.y * 0.01) * 30 * (deltaTime / 1000);
    }
    
    updateBossPattern(deltaTime) {
        this.bossPatternTimer += deltaTime;
        
        switch (this.bossPattern) {
            case 0: // Side to side with pauses
                if (this.bossPatternTimer < 2000) {
                    this.x += this.speed * this.direction * (deltaTime / 1000);
                } else if (this.bossPatternTimer < 3000) {
                    // Pause
                } else {
                    this.bossPatternTimer = 0;
                    this.direction *= -1;
                }
                break;
            case 1: // Figure 8 pattern
                const time = this.bossPatternTimer * 0.001;
                this.x = this.x + Math.sin(time) * 50 * (deltaTime / 1000);
                this.y = this.y + Math.cos(time * 2) * 20 * (deltaTime / 1000);
                break;
            case 2: // Zigzag
                this.x += this.speed * this.direction * (deltaTime / 1000);
                this.y += Math.sin(this.x * 0.01) * 30 * (deltaTime / 1000);
                break;
        }
        
        // Change pattern every 5 seconds
        if (this.bossPatternTimer > 5000) {
            this.bossPattern = (this.bossPattern + 1) % 3;
            this.bossPatternTimer = 0;
        }
    }
    
    startKamikazeDive() {
        if (!this.isKamikazeDiving) {
            this.isKamikazeDiving = true;
            this.kamikazeSpeed = 100 + Math.random() * 50;
        }
    }
    
    hit() {
        this.hits++;
        if (this.hits >= this.maxHits) {
            return true; // Enemy should be destroyed
        }
        return false; // Enemy survives
    }
    
    hitShield() {
        if (this.shieldActive) {
            this.shieldHealth--;
            if (this.shieldHealth <= 0) {
                this.shieldActive = false;
                return true; // Shield broken, can now hit enemy
            }
        }
        return false; // Shield still active
    }
    
    render(ctx) {
        // Get color based on row and type
        const color = this.colors[Math.min(this.row, this.colors.length - 1)];
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Draw enemy based on type
        switch (this.type) {
            case 'tank':
                this.drawTankEnemy(ctx);
                break;
            case 'boss':
            case 'finalBoss':
                this.drawBossEnemy(ctx);
                break;
            case 'shielded':
                this.drawShieldedEnemy(ctx);
                break;
            case 'kamikaze':
                this.drawKamikazeEnemy(ctx);
                break;
            default:
                this.drawBasicEnemy(ctx);
        }
        
        // Border for collision detection
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    drawBasicEnemy(ctx) {
        // Main body
        ctx.fillRect(this.x + 5, this.y + 10, 30, 20);
        
        // Head
        ctx.fillRect(this.x + 10, this.y + 5, 20, 10);
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 12, this.y + 7, 4, 4);
        ctx.fillRect(this.x + 24, this.y + 7, 4, 4);
        
        // Antennae
        ctx.fillStyle = '#ff0040';
        ctx.fillRect(this.x + 15, this.y, 2, 8);
        ctx.fillRect(this.x + 23, this.y, 2, 8);
        
        // Legs
        if (this.animationFrame < 1) {
            ctx.fillRect(this.x + 8, this.y + 30, 4, 5);
            ctx.fillRect(this.x + 28, this.y + 30, 4, 5);
        } else {
            ctx.fillRect(this.x + 10, this.y + 30, 4, 5);
            ctx.fillRect(this.x + 26, this.y + 30, 4, 5);
        }
    }
    
    drawTankEnemy(ctx) {
        // Tank body
        ctx.fillRect(this.x + 5, this.y + 15, 40, 25);
        
        // Tank turret
        ctx.fillRect(this.x + 15, this.y + 5, 20, 15);
        
        // Tank tracks
        ctx.fillRect(this.x + 2, this.y + 35, 46, 8);
        
        // Damage indicators
        for (let i = 0; i < this.hits; i++) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x + 8 + i * 8, this.y + 8, 4, 4);
        }
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 18, this.y + 8, 4, 4);
        ctx.fillRect(this.x + 28, this.y + 8, 4, 4);
    }
    
    drawBossEnemy(ctx) {
        // Boss body
        ctx.fillRect(this.x + 10, this.y + 20, 40, 30);
        
        // Boss head
        ctx.fillRect(this.x + 15, this.y + 10, 30, 15);
        
        // Boss crown
        ctx.fillRect(this.x + 20, this.y + 5, 20, 8);
        
        // Boss eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 20, this.y + 13, 6, 6);
        ctx.fillRect(this.x + 34, this.y + 13, 6, 6);
        
        // Boss weapon
        ctx.fillRect(this.x + 25, this.y + 45, 10, 8);
        
        // Health bar
        const healthPercent = (this.maxHits - this.hits) / this.maxHits;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y - 10, this.width * healthPercent, 5);
    }
    
    drawShieldedEnemy(ctx) {
        // Draw shield if active
        if (this.shieldActive) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 30, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw basic enemy inside shield
        this.drawBasicEnemy(ctx);
        
        // Shield health indicator
        if (this.shieldActive) {
            ctx.fillStyle = '#00ffff';
            for (let i = 0; i < this.shieldHealth; i++) {
                ctx.fillRect(this.x + 5 + i * 8, this.y - 5, 4, 4);
            }
        }
    }
    
    drawKamikazeEnemy(ctx) {
        // Kamikaze enemy with flame trail
        if (this.isKamikazeDiving) {
            // Draw flame trail
            ctx.fillStyle = '#ff8000';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(this.x + 15 + i * 5, this.y + this.height + i * 10, 10, 15);
            }
        }
        
        // Draw basic enemy
        this.drawBasicEnemy(ctx);
        
        // Add kamikaze indicators
        if (this.isKamikazeDiving) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x + 18, this.y + 12, 4, 6);
            ctx.fillRect(this.x + 22, this.y + 12, 4, 6);
        }
    }
    
    shouldDrop() {
        // This will be called by the game to check if enemies should drop
        return false;
    }
    
    drop() {
        // Prevent enemies from dropping too close to the player
        const maxDropY = 450; // Maximum Y position enemies can reach (leaving 150px for player)
        
        if (this.y + this.dropDistance < maxDropY) {
            this.y += this.dropDistance;
        } else {
            // If dropping would put enemy too close, just reverse direction without dropping
            this.y = maxDropY;
        }
        
        this.direction *= -1; // Reverse direction
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
} 