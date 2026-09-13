import * as THREE from 'three';
import { Game } from './game';

// Initialize game
const game = new Game();
game.start();

// Handle window resize
window.addEventListener('resize', () => {
    game.onWindowResize();
});
