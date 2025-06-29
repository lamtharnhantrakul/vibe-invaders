import { CollisionManager } from '../utils/CollisionManager.js';

describe('CollisionManager', () => {
    let collisionManager;
    
    beforeEach(() => {
        collisionManager = new CollisionManager();
    });
    
    test('should detect collision between overlapping rectangles', () => {
        const obj1 = { x: 100, y: 100, width: 50, height: 50 };
        const obj2 = { x: 120, y: 120, width: 50, height: 50 };
        
        expect(collisionManager.checkCollision(obj1, obj2)).toBe(true);
    });
    
    test('should not detect collision between non-overlapping rectangles', () => {
        const obj1 = { x: 100, y: 100, width: 50, height: 50 };
        const obj2 = { x: 200, y: 200, width: 50, height: 50 };
        
        expect(collisionManager.checkCollision(obj1, obj2)).toBe(false);
    });
    
    test('should detect collision when objects are touching', () => {
        const obj1 = { x: 100, y: 100, width: 50, height: 50 };
        const obj2 = { x: 150, y: 100, width: 50, height: 50 };
        
        expect(collisionManager.checkCollision(obj1, obj2)).toBe(true);
    });
    
    test('should detect collision when one object is completely inside another', () => {
        const obj1 = { x: 100, y: 100, width: 100, height: 100 };
        const obj2 = { x: 120, y: 120, width: 50, height: 50 };
        
        expect(collisionManager.checkCollision(obj1, obj2)).toBe(true);
    });
    
    test('should work with objects that have getBounds method', () => {
        const obj1 = {
            getBounds: () => ({ x: 100, y: 100, width: 50, height: 50 })
        };
        const obj2 = {
            getBounds: () => ({ x: 120, y: 120, width: 50, height: 50 })
        };
        
        expect(collisionManager.checkCollision(obj1, obj2)).toBe(true);
    });
    
    test('should detect point collision correctly', () => {
        const point = { x: 125, y: 125 };
        const bounds = { x: 100, y: 100, width: 50, height: 50 };
        
        expect(collisionManager.checkPointCollision(point, bounds)).toBe(true);
    });
    
    test('should not detect point collision when point is outside bounds', () => {
        const point = { x: 200, y: 200 };
        const bounds = { x: 100, y: 100, width: 50, height: 50 };
        
        expect(collisionManager.checkPointCollision(point, bounds)).toBe(false);
    });
    
    test('should detect circle collision correctly', () => {
        const center1 = { x: 100, y: 100 };
        const center2 = { x: 120, y: 100 };
        const radius1 = 20;
        const radius2 = 20;
        
        expect(collisionManager.checkCircleCollision(center1, radius1, center2, radius2)).toBe(true);
    });
    
    test('should not detect circle collision when circles are far apart', () => {
        const center1 = { x: 100, y: 100 };
        const center2 = { x: 200, y: 200 };
        const radius1 = 20;
        const radius2 = 20;
        
        expect(collisionManager.checkCircleCollision(center1, radius1, center2, radius2)).toBe(false);
    });
    
    test('should detect circle collision when circles are touching', () => {
        const center1 = { x: 100, y: 100 };
        const center2 = { x: 140, y: 100 };
        const radius1 = 20;
        const radius2 = 20;
        
        expect(collisionManager.checkCircleCollision(center1, radius1, center2, radius2)).toBe(true);
    });
    
    test('should return correct collision side for horizontal collision', () => {
        const bounds1 = { x: 100, y: 100, width: 50, height: 50 };
        const bounds2 = { x: 150, y: 100, width: 50, height: 50 };
        
        expect(collisionManager.getCollisionSide(bounds1, bounds2)).toBe('right');
        expect(collisionManager.getCollisionSide(bounds2, bounds1)).toBe('left');
    });
    
    test('should return correct collision side for vertical collision', () => {
        const bounds1 = { x: 100, y: 100, width: 50, height: 50 };
        const bounds2 = { x: 100, y: 150, width: 50, height: 50 };
        
        expect(collisionManager.getCollisionSide(bounds1, bounds2)).toBe('bottom');
        expect(collisionManager.getCollisionSide(bounds2, bounds1)).toBe('top');
    });
    
    test('should handle edge cases with zero dimensions', () => {
        const obj1 = { x: 100, y: 100, width: 0, height: 0 };
        const obj2 = { x: 100, y: 100, width: 50, height: 50 };
        
        expect(collisionManager.checkCollision(obj1, obj2)).toBe(true);
    });
}); 