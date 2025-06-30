import { Game } from './Game.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Initialize the game
    const game = new Game(canvas);
    
    // Add some debugging info
    console.log('Space Invaders game initialized!');
    console.log('Controls:');
    console.log('- Arrow keys: Move');
    console.log('- Space: Shoot / Start / Restart');
    console.log('- P: Pause');
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Could implement responsive canvas here
        console.log('Window resized');
    });
    
    // Handle page visibility changes (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.gameState === 'playing') {
            game.togglePause();
        }
    });

    // --- Mobile Controls Support ---
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry/i.test(navigator.userAgent);
    }

    const isMobile = isMobileDevice();

    if (isMobile) {
        const mobileControls = document.getElementById('mobileControls');
        mobileControls.style.display = 'flex';

        // Helper to simulate key events for InputManager
        const keyMap = {
            'btn-left': 'ArrowLeft',
            'btn-right': 'ArrowRight',
            'btn-super': 'KeyB',
        };
        Object.keys(keyMap).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            // Touch start = keydown, Touch end = keyup
            btn.addEventListener('touchstart', e => {
                e.preventDefault();
                game.inputManager.keys[keyMap[btnId]] = true;
            });
            btn.addEventListener('touchend', e => {
                e.preventDefault();
                game.inputManager.keys[keyMap[btnId]] = false;
            });
            // Also support mouse for testing on desktop (only if isMobile)
            btn.addEventListener('mousedown', e => {
                e.preventDefault();
                game.inputManager.keys[keyMap[btnId]] = true;
            });
            btn.addEventListener('mouseup', e => {
                e.preventDefault();
                game.inputManager.keys[keyMap[btnId]] = false;
            });
            btn.addEventListener('mouseleave', e => {
                game.inputManager.keys[keyMap[btnId]] = false;
            });
        });
        // Special handling for shoot button
        const shootBtn = document.getElementById('btn-shoot');
        if (shootBtn) {
            const shootHandler = e => {
                e.preventDefault();
                if (game.gameState === 'playing') {
                    game.playerShoot();
                } else if (game.gameState === 'start') {
                    game.startGame();
                } else if (game.gameState === 'gameOver') {
                    game.restartGame();
                } else if (game.gameState === 'levelComplete') {
                    game.startNextLevel();
                }
            };
            shootBtn.addEventListener('touchstart', shootHandler);
            shootBtn.addEventListener('mousedown', shootHandler);
        }
    } else {
        // Hide mobile controls on desktop just in case
        const mobileControls = document.getElementById('mobileControls');
        if (mobileControls) mobileControls.style.display = 'none';
    }
    // --- End Mobile Controls ---

    // Update start screen instruction for mobile
    const startInstruction = document.getElementById('startInstruction');
    if (startInstruction) {
        if (isMobile) {
            startInstruction.textContent = 'Hit SHOOT to start';
        } else {
            startInstruction.textContent = 'Press SPACE to start';
        }
    }
}); 