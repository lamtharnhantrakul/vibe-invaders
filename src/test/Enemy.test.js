import Enemy from '../entities/Enemy.js';

describe('Enemy', () => {
    let enemy;
    
    beforeEach(() => {
        enemy = new Enemy(100, 50, 30, 2);
    });
    
    test('should initialize with correct properties', () => {
        expect(enemy.x).toBe(100);
        expect(enemy.y).toBe(50);
        expect(enemy.width).toBe(40);
        expect(enemy.height).toBe(30);
        expect(enemy.points).toBe(30);
        expect(enemy.row).toBe(2);
        expect(enemy.speed).toBe(20);
        expect(enemy.direction).toBe(1);
    });
    
    test('should move right when direction is 1', () => {
        const initialX = enemy.x;
        
        enemy.update(1000); // 1 second
        
        expect(enemy.x).toBeGreaterThan(initialX);
        expect(enemy.x).toBe(initialX + 20); // speed * time
    });
    
    test('should move left when direction is -1', () => {
        enemy.direction = -1;
        const initialX = enemy.x;
        
        enemy.update(1000); // 1 second
        
        expect(enemy.x).toBeLessThan(initialX);
        expect(enemy.x).toBe(initialX - 20); // speed * time
    });
    
    test('should animate correctly', () => {
        const initialFrame = enemy.animationFrame;
        
        enemy.update(1000); // 1 second
        
        expect(enemy.animationFrame).toBeGreaterThan(initialFrame);
    });
    
    test('should reset animation frame when it exceeds 2', () => {
        enemy.animationFrame = 2.5;
        
        enemy.update(1000);
        
        expect(enemy.animationFrame).toBeLessThan(2);
    });
    
    test('should drop correctly', () => {
        const initialY = enemy.y;
        const initialDirection = enemy.direction;
        
        enemy.drop();
        
        expect(enemy.y).toBe(initialY + enemy.dropDistance);
        expect(enemy.direction).toBe(-initialDirection);
    });
    
    test('should return correct bounds', () => {
        const bounds = enemy.getBounds();
        
        expect(bounds).toEqual({
            x: 100,
            y: 50,
            width: 40,
            height: 30
        });
    });
    
    test('should handle partial movement correctly', () => {
        const initialX = enemy.x;
        
        enemy.update(500); // 0.5 seconds
        
        expect(enemy.x).toBe(initialX + 10); // speed * time * 0.5
    });
    
    test('should not drop by default', () => {
        expect(enemy.shouldDrop()).toBe(false);
    });
    
    test('should drop and reverse direction', () => {
        const initialY = enemy.y;
        const initialDirection = enemy.direction;
        
        enemy.drop();
        
        expect(enemy.y).toBe(initialY + enemy.dropDistance);
        expect(enemy.direction).toBe(-initialDirection);
    });
    
    test('should detect when enemy is off screen', () => {
        enemy.y = 605;
        
        expect(enemy.isOffScreen(600)).toBe(true);
    });
    
    test('should detect when enemy is on screen', () => {
        expect(enemy.isOffScreen(600)).toBe(false);
    });
}); 