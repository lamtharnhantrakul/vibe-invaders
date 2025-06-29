export default class Bullet {
    constructor(x, y, speed, type) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = speed; // positive for down, negative for up
        this.type = type; // 'player' or 'enemy'
        this.active = true;
    }
    
    update(deltaTime) {
        this.y += this.speed * (deltaTime / 1000);
    }
    
    render(ctx) {
        if (!this.active) return;
        
        // Different colors for player and enemy bullets
        if (this.type === 'player') {
            ctx.fillStyle = '#00ff41';
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#ff0040';
            ctx.strokeStyle = '#ffffff';
        }
        
        ctx.lineWidth = 1;
        
        // Draw bullet with glow effect
        ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height);
        ctx.strokeRect(this.x - this.width/2, this.y, this.width, this.height);
        
        // Add glow effect
        ctx.shadowColor = this.type === 'player' ? '#00ff41' : '#ff0040';
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
    
    getBounds() {
        return {
            x: this.x - this.width/2,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen(canvasHeight) {
        return this.y < 0 || this.y > canvasHeight;
    }
} 