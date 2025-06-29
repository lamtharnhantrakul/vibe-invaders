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
}); 