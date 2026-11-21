/* ==========================================================
   TV SHELL — carcasa, cristal CRT, capas de efecto y OSD
   ========================================================== */

import { state } from '../state.js';
import { Osd } from './Osd.js';
import { I } from './Icons.js';

export const TvShell = {
    render() {
        const ledClass = state.powerOn ? 'led-on' : 'led-off';
        const screenStateClass = state.powerOn ? 'screen-on' : 'screen-off';

        return `
            <div class="tv-wrapper">
                <div class="tv-bezel">
                    <div class="tv-glass">
                        <div class="tv-screen ${screenStateClass}" id="main-tv-screen">
                            <div class="tv-content-container" id="tv-screen-content"></div>
                        </div>

                        <!-- Capas de cristal: scanlines, grano, viñeta, reflejo -->
                        <div class="tv-fx" aria-hidden="true">
                            <div class="tv-fx__scan"></div>
                            <div class="tv-fx__grain"></div>
                            <div class="tv-fx__vignette"></div>
                            <div class="tv-fx__glare"></div>
                        </div>

                        ${Osd.render()}
                    </div>

                    <div class="tv-bezel-bottom">
                        <div class="tv-speakers" aria-hidden="true">
                            ${'<span></span>'.repeat(9)}
                        </div>

                        <div class="tv-brand-label">
                            <span>Polígono Giants</span><span class="tv-brand-label__model">TV · PG-F7</span>
                        </div>

                        <div class="tv-controls-panel">
                            <div class="tv-led-indicator ${ledClass}" id="tv-power-led"></div>
                            <button class="tv-physical-btn tv-power-btn" id="tv-physical-power" title="Encendido / Apagado" aria-label="Encendido / Apagado">
                                ${I('power')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const physicalPower = document.getElementById('tv-physical-power');
        if (physicalPower) {
            physicalPower.addEventListener('click', () => state.update({ powerOn: !state.powerOn }));
        }

        // Altura visible de la pantalla → variable CSS (la usan la guía de canales y los modales)
        const screen = document.getElementById('main-tv-screen');
        if (screen && 'ResizeObserver' in window) {
            const ro = new ResizeObserver(() => {
                screen.style.setProperty('--screen-h', screen.clientHeight + 'px');
            });
            ro.observe(screen);
        }

        Osd.start();
    }
};
