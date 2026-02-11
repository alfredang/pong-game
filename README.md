# 🕹️ Neon Pong: A Futuristic Arcade Experience

[![Deploy static content to Pages](https://github.com/alfredang/pong-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/alfredang/pong-game/actions/workflows/deploy.yml)

**Live Demo:** [https://alfredang.github.io/pong-game/](https://alfredang.github.io/pong-game/)

![Neon Pong Screenshot](pong-game.png)

Neon Pong is a modern, sleek take on the classic arcade game. Built with a focus on minimalist aesthetics and high-performance gameplay, it combines the nostalgic feel of the 80s with futuristic design elements like neon glows, CRT scanlines, and synthesized audio.

---

## 🚀 Technical Stack & Architecture

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the new `@tailwindcss/vite` plugin)
- **Rendering**: HTML5 Canvas API (optimized for 60 FPS via `requestAnimationFrame`)
- **Audio**: Web Audio API (real-time sound synthesis)

The codebase follows a modular Object-Oriented approach:
- `Ball.js`: Handles physics, boundary detection, and dynamic speed scaling.
- `Paddle.js`: Manages position, movement smoothing, and difficulty-based styling.
- `Game.js`: The central engine managing the game loop, collision detection, AI logic, and UI states.

---

## ✨ Features

### 🧠 Intelligent AI Difficulty
The game features three distinct difficulty levels that go beyond simple speed adjustments:
- **Easy (Green)**: High reaction delay and significant prediction error. Perfect for beginners.
- **Normal (White)**: A balanced challenge for experienced players.
- **Hard (Magenta)**: Instant reactions, minimal error margins, and aggressive pursuit logic.
- **Dynamic Scaling**: The ball gains more speed per hit on higher difficulties.

### 🎵 Real-Time Synthesized Audio
No external MP3 files are used! All sound effects are synthesized on-the-fly:
- **Paddle Hits**: Square wave "clicks" for a digital feel.
- **Wall Bounces**: Soft sine wave "thumps."
- **Scoring**: Sawtooth wave frequency sweeps for a futuristic "pew" effect.

### 🎨 Premium Aesthetics
- **Neon Glows**: Deep box-shadows and CSS filters create a high-contrast glowing effect.
- **CRT Scanlines**: A subtle grid and scanline overlay provide an authentic retro-arcade texture.
- **Glassmorphism**: UI elements feature background blurs and semi-transparent borders for a professional look.
- **Responsive Layout**: Designed to adapt perfectly to mobile (touch) and desktop (keyboard/mouse).

---

## ⌨️ Controls

- **Desktop**: 
  - Mouse: Vertical movement tracks the paddle.
  - Keyboard: `W` / `S` or `Up` / `Down` arrows.
  - Pause: `P` or `Esc`.
- **Mobile**:
  - Touch: Drag vertically anywhere on the screen.

---

## 🐳 Docker

```bash
docker build -t pong-game .
docker run -p 8080:80 pong-game
```

Then open [http://localhost:8080](http://localhost:8080).

---

## 🛠️ Performance & Deployment

- **60 FPS Gameplay**: Physics updates are decoupled from frame rendering to ensure smooth motion.
- **GitHub Pages**: Automated CI/CD deployment via GitHub Actions.
- **Docker**: Multi-stage build with nginx for self-hosted deployment.
- **Zero Assets**: The entire game is self-contained in less than 50kb (gzipped), using no external images or audio files.

---

Developed by Alfred Ang.
