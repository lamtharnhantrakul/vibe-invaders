export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.speed = 300; // pixels per second
        this.originalX = x;
        this.originalY = y;
    }
    
    update(deltaTime, inputManager, canvasWidth) {
        // Handle movement
        if (inputManager.isKeyPressed('ArrowLeft')) {
            this.x -= this.speed * (deltaTime / 1000);
        }
        if (inputManager.isKeyPressed('ArrowRight')) {
            this.x += this.speed * (deltaTime / 1000);
        }
        
        // Keep player within canvas bounds
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
    }
    
    render(ctx) {
        // Draw player spaceship
        ctx.fillStyle = '#00ff41';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        
        // Main body
        ctx.fillRect(this.x + 5, this.y + 10, 30, 20);
        
        // Cockpit
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 12, this.y + 5, 16, 8);
        
        // Wings
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(this.x, this.y + 15, 8, 10);
        ctx.fillRect(this.x + 32, this.y + 15, 8, 10);
        
        // Engine glow
        ctx.fillStyle = '#ff0040';
        ctx.fillRect(this.x + 15, this.y + 30, 10, 5);
        
        // Border
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
} 