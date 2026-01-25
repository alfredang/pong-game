export class Ball {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.radius = 8;
    this.speed = 5;
    this.baseSpeed = 5;

    // Random initial direction
    const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8); // -22.5 to 22.5 degrees
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.dx = direction * this.speed * Math.cos(angle);
    this.dy = this.speed * Math.sin(angle);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    let bounced = false;
    // Bounce off top and bottom walls
    if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
      this.dy *= -1;
      this.y = this.y - this.radius < 0 ? this.radius : this.canvas.height - this.radius;
      bounced = true;
    }
    return bounced;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f3ff';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
