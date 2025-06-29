export default class SuperLaser {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 0; // Will be set to canvas height
        this.active = false;
        this.particles = [];
        this.maxParticles = 50;
        this.particleLifetime = 1000; // ms
        this.lastParticleTime = 0;
        this.particleInterval = 50; // ms between particles
        
        // Animation properties
        this.animationDuration = 300; // ms for full extension
        this.animationTime = 0;
        this.isAnimating = false;
        this.startY = 0; // Starting Y position (ship position)
        this.targetHeight = 0; // Target height (canvas height)
    }
    
    activate(x, y, canvasHeight) {
        this.x = x;
        this.startY = y; // Start from ship position
        this.targetHeight = canvasHeight; // Target is full canvas height
        this.height = 0; // Start with 0 height
        this.y = this.startY; // Start from ship position
        this.active = true;
        this.isAnimating = true;
        this.animationTime = 0;
        this.particles = [];
    }
    
    deactivate() {
        this.active = false;
        this.isAnimating = false;
        this.particles = [];
    }
    
    update(deltaTime, playerX, playerY, canvasHeight) {
        if (!this.active) return;
        
        // Update position to follow player
        this.x = playerX + 20; // Center on player
        this.startY = playerY; // Update start position to follow player
        
        // Handle animation
        if (this.isAnimating) {
            this.animationTime += deltaTime;
            const progress = Math.min(this.animationTime / this.animationDuration, 1);
            
            // Animate height from 0 to target height
            this.height = this.targetHeight * progress;
            
            // Animate Y position from ship to top of screen
            this.y = this.startY - (this.startY * progress);
            
            // When animation is complete
            if (progress >= 1) {
                this.isAnimating = false;
                this.y = 0; // Final position at top of screen
                this.height = this.targetHeight; // Final height
            }
        } else {
            // After animation, keep laser at full height
            this.y = 0;
            this.height = this.targetHeight;
        }
        
        // Create fire particles
        this.lastParticleTime += deltaTime;
        if (this.lastParticleTime >= this.particleInterval) {
            this.createParticle();
            this.lastParticleTime = 0;
        }
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.life += deltaTime;
            particle.y += particle.vy * (deltaTime / 1000);
            particle.x += particle.vx * (deltaTime / 1000);
            particle.size *= 0.98; // Shrink over time
            return particle.life < this.particleLifetime && particle.size > 0.5;
        });
    }
    
    createParticle() {
        if (this.particles.length >= this.maxParticles) return;
        
        // Create particles at the bottom of the laser (near the ship)
        const particle = {
            x: this.x + Math.random() * this.width,
            y: this.y + this.height - Math.random() * 50, // Start near the player end of the laser
            vx: (Math.random() - 0.5) * 100, // Random horizontal movement
            vy: -Math.random() * 200 - 50, // Move upward
            size: Math.random() * 8 + 4,
            life: 0,
            color: this.getRandomFireColor()
        };
        
        this.particles.push(particle);
    }
    
    getRandomFireColor() {
        const colors = [
            '#ff0000', // Red
            '#ff4400', // Orange-red
            '#ff8800', // Orange
            '#ffcc00', // Yellow-orange
            '#ffff00', // Yellow
            '#ff6600'  // Dark orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    render(ctx) {
        if (!this.active) return;
        
        // Draw main laser beam
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
        gradient.addColorStop(0.3, 'rgba(255, 100, 0, 0.8)');
        gradient.addColorStop(0.6, 'rgba(255, 200, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw inner core
        const coreGradient = ctx.createLinearGradient(this.x + 2, this.y, this.x + 2, this.y + this.height);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        coreGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.7)');
        coreGradient.addColorStop(1, 'rgba(255, 255, 0, 0.5)');
        
        ctx.fillStyle = coreGradient;
        ctx.fillRect(this.x + 2, this.y, this.width - 4, this.height);
        
        // Draw fire particles
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = 1 - (particle.life / this.particleLifetime);
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw glow effect
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 5, this.y, this.width + 10, this.height);
        ctx.restore();
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