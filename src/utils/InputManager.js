export class InputManager {
    constructor() {
        this.keys = {};
        this.isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry/i.test(navigator.userAgent);
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            // Only track movement and super laser keys
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyB"].includes(e.code)) {
                this.keys[e.code] = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyB"].includes(e.code)) {
                this.keys[e.code] = false;
            }
        });
        
        // Prevent default behavior for game keys only on mobile
        if (this.isMobile) {
            document.addEventListener('keydown', (e) => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyB"].includes(e.code)) {
                    e.preventDefault();
                }
            });
        }
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