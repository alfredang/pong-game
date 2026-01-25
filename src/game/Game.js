import { Ball } from './Ball';
import { Paddle } from './Paddle';

export class Game {
    constructor(canvas, uiElements) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ui = uiElements;

        this.p1 = new Paddle(canvas, 'left');
        this.p2 = new Paddle(canvas, 'right');
        this.ball = new Ball(canvas);

        this.gameState = 'menu'; // 'menu', 'playing', 'paused'
        this.difficulty = 'normal'; // 'easy', 'normal', 'hard'
        this.audioEnabled = true;
        this.mouseY = canvas.height / 2;
        this.keys = {};
        this.lastTime = 0;
        this.speedTimer = 0;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.initControls();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.p1.reset();
        this.p2.reset();
        this.ball.reset();
    }

    initControls() {
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseY = e.clientY - rect.top;
        });

        window.addEventListener('touchmove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseY = e.touches[0].clientY - rect.top;
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        this.ui.startBtn.onmousedown = () => this.start();

        this.ui.diffBtn.onclick = () => {
            const diffs = ['easy', 'normal', 'hard'];
            const currentIndex = diffs.indexOf(this.difficulty);
            this.difficulty = diffs[(currentIndex + 1) % diffs.length];
            this.ui.diffBtn.innerText = `DIFF: ${this.difficulty.toUpperCase()}`;

            // Visual feedback - change paddle colors based on difficulty
            this.p2.color = this.difficulty === 'hard' ? '#ff00ff' :
                this.difficulty === 'normal' ? '#ffffff' : '#00ff66';
        };

        this.ui.audioBtn.onclick = () => {
            this.audioEnabled = !this.audioEnabled;
            this.ui.audioBtn.innerText = `AUDIO: ${this.audioEnabled ? 'ON' : 'OFF'}`;
        };
    }

    togglePause() {
        if (this.gameState === 'menu') return;

        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.ui.menu.style.opacity = '1';
            this.ui.menu.style.pointerEvents = 'auto';
            this.ui.menu.querySelector('h1').innerText = 'PAUSED';
            this.ui.startBtn.innerText = 'RESUME';
        } else {
            this.gameState = 'playing';
            this.ui.menu.style.opacity = '0';
            this.ui.menu.style.pointerEvents = 'none';
        }
    }

    playToggleSound(freq, duration = 0.1, type = 'square') {
        if (!this.audioEnabled) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Frequency sweep for neon "pew" effect
        if (duration > 0.2) {
            osc.frequency.exponentialRampToValueAtTime(freq / 2, this.audioCtx.currentTime + duration);
        }

        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    start() {
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        if (this.gameState === 'paused') {
            this.togglePause();
            return;
        }

        this.gameState = 'playing';
        this.ui.menu.style.opacity = '0';
        this.ui.menu.style.pointerEvents = 'none';
        this.ui.menu.querySelector('h1').innerText = 'NEON PONG';
        this.p1.score = 0;
        this.p2.score = 0;
        this.ball.reset();
        this.updateScore();
    }

    resetMenu() {
        this.gameState = 'menu';
        this.ui.menu.style.opacity = '1';
        this.ui.menu.style.pointerEvents = 'auto';
        this.ui.startBtn.innerText = 'RESTART GAME';
    }

    updateScore() {
        this.ui.p1Score.innerText = this.p1.score.toString().padStart(2, '0');
        this.ui.p2Score.innerText = this.p2.score.toString().padStart(2, '0');

        if (this.p1.score >= 10 || this.p2.score >= 10) {
            this.resetMenu();
            const winner = this.p1.score >= 10 ? 'PLAYER 1' : 'AI';
            this.ui.menu.querySelector('h1').innerText = `${winner} WINS!`;
        }
    }

    handleCollisions() {
        const ball = this.ball;

        // Paddle collision check
        const checkPaddle = (paddle) => {
            if (ball.x + ball.radius > paddle.x &&
                ball.x - ball.radius < paddle.x + paddle.width &&
                ball.y > paddle.y &&
                ball.y < paddle.y + paddle.height) {

                // Reflect and add spin
                let speedBoost = 1.05;
                if (this.difficulty === 'hard') speedBoost = 1.12;
                if (this.difficulty === 'easy') speedBoost = 1.02;

                ball.dx *= -speedBoost;
                const impact = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
                ball.dy = impact * (this.difficulty === 'hard' ? 8 : 5);

                this.playToggleSound(paddle.side === 'left' ? 440 : 330);

                // Move ball out of paddle to prevent sticking
                ball.x = paddle.side === 'left' ? paddle.x + paddle.width + ball.radius : paddle.x - ball.radius;
            }
        };

        checkPaddle(this.p1);
        checkPaddle(this.p2);

        // Scoring
        if (ball.x < 0) {
            this.p2.score++;
            this.playToggleSound(150, 0.4, 'sawtooth');
            this.ball.reset();
            this.updateScore();
        } else if (ball.x > this.canvas.width) {
            this.p1.score++;
            this.playToggleSound(600, 0.4, 'sawtooth');
            this.ball.reset();
            this.updateScore();
        }
    }

    updateAI() {
        let aiSpeed, reactionDelay, errorMargin;

        switch (this.difficulty) {
            case 'easy':
                aiSpeed = 3;
                reactionDelay = 0.15; // Significant delay
                errorMargin = 50;     // AI can miss by quite a bit
                break;
            case 'hard':
                aiSpeed = 12;
                reactionDelay = 0.02; // Near instant
                errorMargin = 5;      // Very precise
                break;
            case 'normal':
            default:
                aiSpeed = 6.5;
                reactionDelay = 0.08;
                errorMargin = 25;
                break;
        }

        this.p2.speed = aiSpeed;

        // Add some jitter/error to the target
        if (!this.aiTargetY || Math.random() < reactionDelay) {
            const offset = (Math.random() - 0.5) * errorMargin;
            this.aiTargetY = this.ball.y + offset;
        }

        this.p2.update(this.aiTargetY);
    }

    update(deltaTime) {
        if (this.gameState !== 'playing') return;

        // Keyboard movement
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            this.p1.y -= this.p1.speed;
            this.mouseY = this.p1.y + this.p1.height / 2; // Sync mouse tracking
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            this.p1.y += this.p1.speed;
            this.mouseY = this.p1.y + this.p1.height / 2; // Sync mouse tracking
        }

        // Mouse/Touch movement
        this.p1.update(this.mouseY);

        // Increase ball speed over time
        this.speedTimer += deltaTime;
        if (this.speedTimer > 5000) { // Every 5 seconds
            this.ball.dx *= 1.05;
            this.ball.dy *= 1.05;
            this.speedTimer = 0;
        }

        this.updateAI();
        if (this.ball.update()) {
            this.playToggleSound(220, 0.05, 'sine');
        }
        this.handleCollisions();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw subtle grid
        const gridSize = 40;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();

        // Draw center line
        this.ctx.setLineDash([10, 15]);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.p1.draw(this.ctx);
        this.p2.draw(this.ctx);
        this.ball.draw(this.ctx);
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }
}
