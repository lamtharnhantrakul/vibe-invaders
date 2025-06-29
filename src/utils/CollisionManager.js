export class CollisionManager {
    constructor() {
        // Collision detection methods
    }
    
    checkCollision(obj1, obj2) {
        // Get bounds of both objects
        const bounds1 = obj1.getBounds ? obj1.getBounds() : obj1;
        const bounds2 = obj2.getBounds ? obj2.getBounds() : obj2;
        
        // Check for collision using AABB (Axis-Aligned Bounding Box)
        return this.checkAABBCollision(bounds1, bounds2);
    }
    
    checkAABBCollision(bounds1, bounds2) {
        return (
            bounds1.x < bounds2.x + bounds2.width &&
            bounds1.x + bounds1.width > bounds2.x &&
            bounds1.y < bounds2.y + bounds2.height &&
            bounds1.y + bounds1.height > bounds2.y
        );
    }
    
    checkPointCollision(point, bounds) {
        return (
            point.x >= bounds.x &&
            point.x <= bounds.x + bounds.width &&
            point.y >= bounds.y &&
            point.y <= bounds.y + bounds.height
        );
    }
    
    checkCircleCollision(center1, radius1, center2, radius2) {
        const dx = center1.x - center2.x;
        const dy = center1.y - center2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < radius1 + radius2;
    }
    
    // Get collision side for more detailed collision response
    getCollisionSide(bounds1, bounds2) {
        const overlapX = Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width) - 
                        Math.max(bounds1.x, bounds2.x);
        const overlapY = Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height) - 
                        Math.max(bounds1.y, bounds2.y);
        
        if (overlapX < overlapY) {
            return bounds1.x < bounds2.x ? 'left' : 'right';
        } else {
            return bounds1.y < bounds2.y ? 'top' : 'bottom';
        }
    }
} 