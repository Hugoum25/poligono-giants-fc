/* ==========================================================
   HOME — parrilla de canales 3D + ticker de emisión
   ========================================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { AuthService } from '../services/authService.js';
import { CHANNELS } from './ui.js';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function fmtDate(str) {
    const d = new Date(str);
    if (!str || isNaN(d)) return 'Fecha por confirmar';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${hh}:${mm}`;
}

function jornada(m, i) {
    const c = m.competition || '';
    const hit = c.match(/Jornada\s*(\d+)/i);
    if (hit) return `J${hit[1]}`;
    if (m.jornada) return `J${m.jornada}`;
    return `J${i + 1}`;
}

const hasScore = m => m.ourScore !== undefined && m.ourScore !== null && m.opponentScore !== undefined && m.opponentScore !== null;

export const HomeView = {
    render() {
        const isAdmin = AuthService.isAdmin();
        const matches = teamData.matches || [];
        const club = teamData.clubName || 'Polígono Giants';

        const now = Date.now();
        const next = matches.find(m => !hasScore(m) && new Date(m.date).getTime() > now)
            || matches.find(m => !hasScore(m));
        const played = matches.filter(hasScore);
        const last = played[played.length - 1];

        const channels = CHANNELS.filter(c => c.id !== 'home' && c.id !== 'lineup' && c.id !== 'palmares' && (!c.admin || isAdmin));

        const channelsHtml = channels.map(ch => `
            <button type="button" class="tv-channel-card" data-page="${ch.id}">
                <span class="tv-channel-card__ch">CH ${ch.ch}</span>
                <span class="tv-channel-icon-wrapper">${Icon3D.render(ch.id, 'md')}</span>
                <span class="tv-channel-card__title">${ch.label}</span>
            </button>
        `).join('');

        // Ticker: próximo partido + último resultado
        const tickerItems = [];
        if (next) {
            tickerItems.push(`<span class="home-ticker__tag">Próximo</span><span>${jornada(next, matches.indexOf(next))} · ${club} vs ${next.opponent}</span><span class="t-mute">${fmtDate(next.date)}${next.stadium ? ' · ' + next.stadium : ''}</span>`);
        }
        if (last) {
            const r = last.ourScore > last.opponentScore ? 'win' : last.ourScore < last.opponentScore ? 'loss' : 'draw';
            const rl = { win: 'Victoria', loss: 'Derrota', draw: 'Empate' }[r];
            tickerItems.push(`<span class="home-ticker__tag home-ticker__tag--ghost">Último</span><span>${club} <b class="t-num">${last.ourScore}–${last.opponentScore}</b> ${last.opponent}</span><span class="pg-badge pg-badge--${r}">${rl}</span>`);
        }
        tickerItems.push(`<span class="home-ticker__tag home-ticker__tag--ghost">Emisión</span><span>Los Rosinegros · Liga F7 Gijón</span>`);
        const tickerRow = tickerItems.map(t => `<span class="home-ticker__item">${t}</span>`).join('<span class="home-ticker__sep">/</span>');

        return `
            <section class="home">
                <header class="home-head">
                    <div class="home-head__meta t-meta">
                        <span>Señal oficial</span>
                        <span>Gijón · Asturias</span>
                        <span>Fútbol 7</span>
                    </div>
                    <p class="home-head__hint t-meta">Elige canal</p>
                </header>

                <div class="home-channels-grid">${channelsHtml}</div>

                <div class="home-ticker" ${next ? 'data-page="matches" role="button" tabindex="0"' : ''}>
                    <div class="pg-marquee">
                        <div class="pg-marquee__track">
                            <span class="home-ticker__row">${tickerRow}<span class="home-ticker__sep">/</span></span>
                            <span class="home-ticker__row" aria-hidden="true">${tickerRow}<span class="home-ticker__sep">/</span></span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    bindEvents() {
        const go = page => {
            const screen = document.getElementById('main-tv-screen');
            if (screen) screen.scrollTop = 0;
            state.update({ activePage: page });
        };

        document.querySelectorAll('.tv-channel-card').forEach(card => {
            const page = card.getAttribute('data-page');
            card.addEventListener('click', () => go(page));

            // El objeto 3D acelera mientras el canal tiene el foco
            const obj = card.querySelector('.obj-3d-canvas-container');
            const on = () => { if (obj) obj._boost = 3.2; };
            const off = () => { if (obj) obj._boost = 1; };
            card.addEventListener('pointerenter', on);
            card.addEventListener('pointerleave', off);
            card.addEventListener('focus', on);
            card.addEventListener('blur', off);
        });

        const ticker = document.querySelector('.home-ticker[data-page]');
        if (ticker) {
            ticker.addEventListener('click', () => go('matches'));
            ticker.addEventListener('keydown', e => { if (e.key === 'Enter') go('matches'); });
        }
    },

    destroy() {}
};
