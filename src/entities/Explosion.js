export default class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.duration = 1000; // 1 second
        this.elapsed = 0;
        this.finished = false;
        
        // Create explosion particles
        this.createParticles();
    }
    
    createParticles() {
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 50 + Math.random() * 100;
            const size = 2 + Math.random() * 4;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx * (deltaTime / 1000);
            particle.y += particle.vy * (deltaTime / 1000);
            particle.life -= particle.decay * (deltaTime / 1000);
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
        
        // Check if explosion is finished
        if (this.elapsed >= this.duration || this.particles.length === 0) {
            this.finished = true;
        }
    }
    
    render(ctx) {
        // Draw particles
        this.particles.forEach(particle => {
            const alpha = particle.life;
            const size = particle.size * particle.life;
            
            // Create gradient for each particle
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, size
            );
            
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 0, ${alpha * 0.8})`);
            gradient.addColorStop(1, `rgba(255, 0, 0, ${alpha * 0.6})`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw central flash
        if (this.elapsed < 200) {
            const flashAlpha = 1 - (this.elapsed / 200);
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
        }
    }
} 