/** Completion fires once whether typing ends naturally or the reader skips it. */
export class Typewriter {
    constructor({ schedule = (fn, delay) => setTimeout(fn, delay), cancel = id => clearTimeout(id) } = {}) {
        this.schedule = schedule;
        this.cancel = cancel;
        this.timer = null;
        this.finish = null;
    }
    stop() {
        if (this.timer !== null) this.cancel(this.timer);
        this.timer = null;
        this.finish = null;
    }
    start(text, { delay = 30, render, complete, tick = () => {} }) {
        this.stop();
        const letters = Array.from(text);
        let index = 0;
        this.finish = () => {
            if (!this.finish) return;
            this.stop();
            render(text, false);
            complete();
        };
        if (delay === 0) { this.skip(); return; }
        const step = () => {
            if (!this.finish) return;
            if (index === letters.length) { this.skip(); return; }
            render(letters.slice(0, ++index).join(''), true);
            tick(index);
            this.timer = this.schedule(step, delay);
        };
        step();
    }
    skip() { this.finish?.(); }
}
