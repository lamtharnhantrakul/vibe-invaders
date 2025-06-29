import Player from '../entities/Player.js';
import { InputManager } from '../utils/InputManager.js';

describe('Player', () => {
    let player;
    let inputManager;
    
    beforeEach(() => {
        player = new Player(400, 550);
        inputManager = new InputManager();
    });
    
    test('should initialize with correct properties', () => {
        expect(player.x).toBe(400);
        expect(player.y).toBe(550);
        expect(player.width).toBe(40);
        expect(player.height).toBe(30);
        expect(player.speed).toBe(300);
    });
    
    test('should move left when left arrow is pressed', () => {
        const initialX = player.x;
        inputManager.keys['ArrowLeft'] = true;
        
        player.update(1000, inputManager, 800); // 1 second
        
        expect(player.x).toBeLessThan(initialX);
        expect(player.x).toBe(initialX - 300); // speed * time
    });
    
    test('should move right when right arrow is pressed', () => {
        const initialX = player.x;
        inputManager.keys['ArrowRight'] = true;
        
        player.update(1000, inputManager, 800); // 1 second
        
        expect(player.x).toBeGreaterThan(initialX);
        expect(player.x).toBe(initialX + 300); // speed * time
    });
    
    test('should not move when no keys are pressed', () => {
        const initialX = player.x;
        
        player.update(1000, inputManager, 800);
        
        expect(player.x).toBe(initialX);
    });
    
    test('should stay within canvas bounds on left edge', () => {
        player.x = 0;
        inputManager.keys['ArrowLeft'] = true;
        
        player.update(1000, inputManager, 800);
        
        expect(player.x).toBe(0);
    });
    
    test('should stay within canvas bounds on right edge', () => {
        player.x = 760; // canvas width - player width
        inputManager.keys['ArrowRight'] = true;
        
        player.update(1000, inputManager, 800);
        
        expect(player.x).toBe(760);
    });
    
    test('should reset to specified position', () => {
        player.reset(200, 300);
        
        expect(player.x).toBe(200);
        expect(player.y).toBe(300);
    });
    
    test('should return correct bounds', () => {
        const bounds = player.getBounds();
        
        expect(bounds).toEqual({
            x: 400,
            y: 550,
            width: 40,
            height: 30
        });
    });
    
    test('should handle partial movement correctly', () => {
        const initialX = player.x;
        inputManager.keys['ArrowRight'] = true;
        
        player.update(500, inputManager, 800); // 0.5 seconds
        
        expect(player.x).toBe(initialX + 150); // speed * time * 0.5
    });
}); 