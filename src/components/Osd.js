/* ==========================================================
   OSD — rótulos en pantalla (canal, directo, timecode) y
   transición de cambio de canal con estática.
   ========================================================== */

import { getChannel } from './ui.js';

const pad = (n, l = 2) => String(n).padStart(l, '0');
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Osd = {
    clockId: null,
    staticRaf: null,
    hideTimer: null,
    currentPage: null,

    render() {
        return `
            <div class="tv-osd" aria-hidden="true">
                <div class="tv-osd__bl">
                    <span class="tv-osd__ch" id="osd-ch">CH 00</span>
                    <span class="tv-osd__label" id="osd-label">Inicio</span>
                </div>
                <div class="tv-osd__br">
                    <span class="tv-osd__live"><span class="pg-dot pg-dot--live"></span>En directo</span>
                    <span class="tv-osd__tc t-num" id="osd-tc">00:00:00:00</span>
                </div>
            </div>
            <div class="tv-static" id="tv-static" aria-hidden="true">
                <canvas id="tv-static-canvas" width="160" height="96"></canvas>
                <div class="tv-static__ch" id="tv-static-ch">CH 00</div>
            </div>
        `;
    },

    start() {
        const tc = document.getElementById('osd-tc');
        if (!tc || this.clockId) return;
        const t0 = performance.now();
        const tick = () => {
            const now = new Date();
            const frames = Math.floor(((performance.now() - t0) % 1000) / 40); // 25 fps PAL
            tc.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(frames)}`;
        };
        tick();
        this.clockId = setInterval(tick, 40);
    },

    /** Actualiza el rótulo y, si el canal cambió, lanza la transición. */
    update(pageId, { animate = true } = {}) {
        const ch = getChannel(pageId);
        const chEl = document.getElementById('osd-ch');
        const labelEl = document.getElementById('osd-label');
        if (chEl) chEl.textContent = `CH ${ch.ch}`;
        if (labelEl) labelEl.textContent = ch.label;

        const changed = this.currentPage !== null && this.currentPage !== ch.id;
        this.currentPage = ch.id;
        if (changed && animate) this.channelSwitch(ch);
    },

    channelSwitch(ch) {
        const wrap = document.getElementById('tv-static');
        const canvas = document.getElementById('tv-static-canvas');
        const label = document.getElementById('tv-static-ch');
        if (!wrap || !canvas || reduceMotion()) return;

        if (label) label.textContent = `CH ${ch.ch}`;
        wrap.classList.remove('is-on');
        void wrap.offsetWidth; // reinicia la animación CSS
        wrap.classList.add('is-on');

        const ctx = canvas.getContext('2d');
        const img = ctx.createImageData(canvas.width, canvas.height);
        const buf = new Uint32Array(img.data.buffer);
        const start = performance.now();

        cancelAnimationFrame(this.staticRaf);
        const draw = (t) => {
            for (let i = 0; i < buf.length; i++) {
                const v = (Math.random() * 255) | 0;
                buf[i] = (255 << 24) | (v << 16) | (v << 8) | v;
            }
            ctx.putImageData(img, 0, 0);
            if (t - start < 380) this.staticRaf = requestAnimationFrame(draw);
        };
        this.staticRaf = requestAnimationFrame(draw);

        clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(() => wrap.classList.remove('is-on'), 900);
    }
};
