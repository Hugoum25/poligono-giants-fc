/* ==========================================================
   FOOTER — créditos de emisión + patrocinadores en marquee
   ========================================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';
import { SponsorLogo } from './ui.js';

export const Footer = {
    render() {
        // La herramienta de IG ocupa toda la pantalla: sin pie
        if (state.activePage === 'lineup' || state.activePage === 'alineacion') return '';

        const year = new Date().getFullYear();
        const sponsors = teamData.sponsors || [];
        const item = sp => `
            <button type="button" class="tv-footer__sponsor" data-page="sponsors" title="${sp.name}">
                ${SponsorLogo(sp, 'tv-footer__logo')}
            </button>`;
        const reel = sponsors.map(item).join('');

        return `
            <footer class="tv-footer">
                ${sponsors.length ? `
                    <div class="tv-footer__reel">
                        <span class="tv-footer__reel-label t-meta">Con el apoyo de</span>
                        <div class="pg-marquee">
                            <div class="pg-marquee__track">${reel}${reel}</div>
                        </div>
                    </div>` : ''}

                <div class="tv-footer__credits">
                    <span class="tv-footer__mark">Polígono Giants F7</span>
                    <span class="t-meta">Los Rosinegros · Liga F7 Gijón · Asturias</span>
                    <span class="t-meta tv-footer__copy">© ${year} Polígono Giants TV. Todos los derechos reservados.</span>
                </div>
            </footer>
        `;
    },

    bindEvents() {
        document.querySelectorAll('.tv-footer__sponsor').forEach(el => {
            el.addEventListener('click', () => {
                const screen = document.getElementById('main-tv-screen');
                if (screen) screen.scrollTop = 0;
                state.update({ activePage: 'sponsors' });
            });
        });
    }
};
