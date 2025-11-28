export class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1'; // Above background, below UI
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -10,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.particles.length < 100) {
            this.particles.push(this.createParticle());
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.y += p.speedY;
            p.x += p.speedX;
            
            this.ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            if (p.y > this.canvas.height) {
                this.particles[i] = this.createParticle();
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

export class AudioManager {
    constructor() {
        this.context = null;
        this.oscillators = [];
        this.gainNode = null;
        this.isPlaying = false;
    }

    init() {
        if (this.context) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        this.gainNode.gain.value = 0.1; // Low volume
    }

    startAmbience() {
        if (this.isPlaying) return;
        this.init();
        
        // Create a low drone sound
        const osc1 = this.context.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 50; // Low frequency
        
        const osc2 = this.context.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = 55; // Slightly detuned

        // LFO for volume modulation (wind effect)
        const lfo = this.context.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow modulation
        const lfoGain = this.context.createGain();
        lfoGain.gain.value = 0.05;
        
        lfo.connect(lfoGain.gain);
        
        osc1.connect(this.gainNode);
        osc2.connect(this.gainNode);

        osc1.start();
        osc2.start();
        lfo.start();

        this.oscillators.push(osc1, osc2, lfo);
        this.isPlaying = true;
    }

    stop() {
        this.oscillators.forEach(osc => osc.stop());
        this.oscillators = [];
        this.isPlaying = false;
    }
}