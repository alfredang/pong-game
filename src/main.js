import './index.css';
import { Game } from './game/Game';

const uiElements = {
    p1Score: document.getElementById('p1-score'),
    p2Score: document.getElementById('p2-score'),
    menu: document.getElementById('menu'),
    startBtn: document.getElementById('start-btn'),
    diffBtn: document.getElementById('difficulty-btn'),
    audioBtn: document.getElementById('audio-btn'),
};

const canvas = document.getElementById('game-canvas');
const game = new Game(canvas, uiElements);

game.loop();
