export class Paddle {
    constructor(canvas, side) {
        this.canvas = canvas;
        this.side = side; // 'left' or 'right'
        this.width = 12;
        this.height = 100;
        this.margin = 30;
        this.speed = 8;
        this.score = 0;
        this.color = side === 'left' ? '#00f3ff' : '#ffffff';
        this.reset();
    }

    reset() {
        this.y = this.canvas.height / 2 - this.height / 2;
        this.x = this.side === 'left' ? this.margin : this.canvas.width - this.margin - this.width;
    }

    update(targetY) {
        // Smooth movement towards targetY
        const centerY = this.y + this.height / 2;
        const diff = targetY - centerY;

        if (Math.abs(diff) > this.speed) {
            this.y += Math.sign(diff) * this.speed;
        } else {
            this.y += diff;
        }

        // Boundary checks
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.canvas.height) this.y = this.canvas.height - this.height;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // Rounded paddle
        const radius = 6;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, radius);
        ctx.fill();
        ctx.restore();
    }
}
