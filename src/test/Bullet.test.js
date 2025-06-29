import Bullet from '../entities/Bullet.js';

describe('Bullet', () => {
    let playerBullet;
    let enemyBullet;
    
    beforeEach(() => {
        playerBullet = new Bullet(100, 200, -10, 'player');
        enemyBullet = new Bullet(100, 200, 5, 'enemy');
    });
    
    test('should initialize with correct properties', () => {
        expect(playerBullet.x).toBe(100);
        expect(playerBullet.y).toBe(200);
        expect(playerBullet.width).toBe(4);
        expect(playerBullet.height).toBe(10);
        expect(playerBullet.speed).toBe(-10);
        expect(playerBullet.type).toBe('player');
        expect(playerBullet.active).toBe(true);
    });
    
    test('should move up when speed is negative (player bullet)', () => {
        const initialY = playerBullet.y;
        
        playerBullet.update(1000); // 1 second
        
        expect(playerBullet.y).toBeLessThan(initialY);
        expect(playerBullet.y).toBe(initialY - 10); // speed * time
    });
    
    test('should move down when speed is positive (enemy bullet)', () => {
        const initialY = enemyBullet.y;
        
        enemyBullet.update(1000); // 1 second
        
        expect(enemyBullet.y).toBeGreaterThan(initialY);
        expect(enemyBullet.y).toBe(initialY + 5); // speed * time
    });
    
    test('should handle partial movement correctly', () => {
        const initialY = playerBullet.y;
        
        playerBullet.update(500); // 0.5 seconds
        
        expect(playerBullet.y).toBe(initialY - 5); // speed * time * 0.5
    });
    
    test('should return correct bounds', () => {
        const bounds = playerBullet.getBounds();
        
        expect(bounds).toEqual({
            x: 98, // x - width/2
            y: 200,
            width: 4,
            height: 10
        });
    });
    
    test('should detect when bullet is off screen (top)', () => {
        playerBullet.y = -5;
        
        expect(playerBullet.isOffScreen(600)).toBe(true);
    });
    
    test('should detect when bullet is off screen (bottom)', () => {
        enemyBullet.y = 605;
        
        expect(enemyBullet.isOffScreen(600)).toBe(true);
    });
    
    test('should detect when bullet is on screen', () => {
        expect(playerBullet.isOffScreen(600)).toBe(false);
        expect(enemyBullet.isOffScreen(600)).toBe(false);
    });
    
    test('should handle zero speed', () => {
        const stationaryBullet = new Bullet(100, 200, 0, 'player');
        const initialY = stationaryBullet.y;
        
        stationaryBullet.update(1000);
        
        expect(stationaryBullet.y).toBe(initialY);
    });
    
    test('should handle very fast bullets', () => {
        const fastBullet = new Bullet(100, 200, 100, 'enemy');
        const initialY = fastBullet.y;
        
        fastBullet.update(1000);
        
        expect(fastBullet.y).toBe(initialY + 100);
    });
}); 