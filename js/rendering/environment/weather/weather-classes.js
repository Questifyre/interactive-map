import { CLOUD_SPRITE_PATHS } from '../../../config/config-manager.js';

// ==============================
// Classes
// ==============================

export class Cloud {
    constructor(spawnTime) {
        this.x = Math.random() * window.innerWidth; // Use window dimensions for initial placement
        this.y = Math.random() * window.innerHeight;
        const speed = 1 + Math.random() * 5;
        const angle = Math.random() * 2 * Math.PI;
        this.dx = speed * Math.cos(angle);
        this.dy = speed * Math.sin(angle);
        this.fadeInDuration = 1;
        this.lifetime = 10 + Math.random() * 20;
        this.fadeDuration = 1;
        this.spawnTime = spawnTime;
        this.sprite = new Image();
        this.sprite.src = CLOUD_SPRITE_PATHS[Math.floor(Math.random() * CLOUD_SPRITE_PATHS.length)];
        this.spriteWidth = 60;
        this.spriteHeight = 60;
    }

    update(dt) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;

        // Basic wrapping to keep clouds within bounds (you might need more sophisticated logic)
        if (this.x < -this.spriteWidth / 2) this.x = window.innerWidth + this.spriteWidth / 2;
        if (this.x > window.innerWidth + this.spriteWidth / 2) this.x = -this.spriteWidth / 2;
        if (this.y < -this.spriteHeight / 2) this.y = window.innerHeight + this.spriteHeight / 2;
        if (this.y > window.innerHeight + this.spriteHeight / 2) this.y = -this.spriteHeight / 2;
    }

    getAlpha(currentTime) {
        const elapsed = (currentTime - this.spawnTime) / 1000;
        if (elapsed < this.fadeInDuration) return (elapsed / this.fadeInDuration) * 0.8;
        if (elapsed < this.fadeInDuration + this.lifetime) return 0.8;
        if (elapsed < this.fadeInDuration + this.lifetime + this.fadeDuration) {
            return 0.8 * (1 - (elapsed - (this.fadeInDuration + this.lifetime)) / this.fadeDuration);
        }
        return 0;
    }

    isExpired(currentTime) {
        return (currentTime - this.spawnTime) / 1000 >= this.fadeInDuration + this.lifetime + this.fadeDuration;
    }

    draw(ctx, currentTime) {
        const alpha = this.getAlpha(currentTime);
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(this.sprite, this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
        ctx.restore();
    }
}

export class Raindrop {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.speed = 300 + Math.random() * 200;
        this.alpha = 0.5 + Math.random() * 0.3;
    }

    update(dt) {
        this.y += this.speed * dt;
        this.x += dt * 50;
        if (this.y > window.innerHeight) {
            this.y = -10;
            this.x = Math.random() * window.innerWidth;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(90, 110, 127, ${this.alpha})`;
        ctx.fillRect(this.x, this.y, 2, 10);
        ctx.restore();
    }
}