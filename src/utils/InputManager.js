export class InputManager {
    constructor() {
        this.keys = {};
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Prevent default behavior for game keys
        document.addEventListener('keydown', (e) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyB'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    isKeyJustPressed(keyCode) {
        // This could be enhanced to track just-pressed state
        return this.keys[keyCode] || false;
    }
    
    getPressedKeys() {
        return Object.keys(this.keys).filter(key => this.keys[key]);
    }
    
    clear() {
        this.keys = {};
    }
} 