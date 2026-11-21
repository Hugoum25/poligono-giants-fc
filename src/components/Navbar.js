/* ==========================================================
   NAVBAR — barra de emisión + guía de canales (móvil)
   ========================================================== */

import { state } from '../state.js';
import { ClubLogo } from './ClubLogo.js';
import { AuthService } from '../services/authService.js';
import { LoginModal } from './LoginModal.js';
import { UserManagementModal } from './UserManagementModal.js';
import { CHANNELS, getChannel } from './ui.js';
import { I } from './Icons.js';

export const Navbar = {
    guideOpen: false,

    render() {
        const currentUser = AuthService.getCurrentUser();
        const isAdmin = AuthService.isAdmin();
        const active = getChannel(state.activePage).id;
        const items = CHANNELS.filter(c => c.id !== 'home' && (!c.admin || isAdmin));

        const linksHtml = items.map(c => `
            <li>
                <button type="button" class="tv-nav-item ${active === c.id ? 'active' : ''}" data-page="${c.id}" ${active === c.id ? 'aria-current="page"' : ''}>
                    <span class="tv-nav-item__ch">${c.ch}</span>${c.short}
                </button>
            </li>
        `).join('');

        const guideHtml = items.map(c => `
            <li>
                <button type="button" class="pg-guide__item tv-nav-item ${active === c.id ? 'active' : ''}" data-page="${c.id}">
                    <span class="pg-guide__ch">CH ${c.ch}</span>
                    <span class="pg-guide__label">${c.label}</span>
                    ${I('arrowR')}
                </button>
            </li>
        `).join('');

        const userBtn = currentUser
            ? `<button type="button" class="pg-btn pg-btn--sm pg-btn--ghost tv-nav-user is-logged" id="user-profile-btn" title="Perfil de ${currentUser.name}">
                   <span class="pg-dot t-signal"></span>${I('user')}<span class="tv-nav-user__name">${currentUser.name.split(' ')[0]}</span>
               </button>`
            : `<button type="button" class="pg-btn pg-btn--sm pg-btn--ghost tv-nav-user" id="user-profile-btn" title="Iniciar sesión">
                   ${I('key')}<span class="tv-nav-user__name">Entrar</span>
               </button>`;

        const adminBtn = isAdmin
            ? `<button type="button" class="pg-btn pg-btn--sm pg-btn--ghost" id="btn-admin-manage-users" title="Logs de acceso y gestión de usuarios">
                   ${I('logs')}<span class="tv-nav-user__name">Logs</span>
               </button>`
            : '';

        return `
            <nav class="tv-navbar ${this.guideOpen ? 'is-guide-open' : ''}" aria-label="Canales">
                <div class="tv-navbar-container">
                    <button type="button" class="tv-logo" data-page="home" title="Inicio · Polígono Giants">
                        ${ClubLogo.render(30)}
                        <span class="tv-logo__word">Polígono Giants</span>
                        <span class="tv-logo__sub">F7 · Gijón</span>
                    </button>

                    <ul class="tv-nav-links">${linksHtml}</ul>

                    <div class="tv-nav-actions">
                        ${adminBtn}
                        ${userBtn}
                        <button type="button" class="pg-btn pg-btn--sm tv-guide-toggle" id="btn-guide-toggle" aria-expanded="${this.guideOpen}" aria-controls="pg-guide">
                            ${this.guideOpen ? I('close') : I('menu')}<span>${this.guideOpen ? 'Cerrar' : 'Guía'}</span>
                        </button>
                    </div>
                </div>

                <div class="pg-guide" id="pg-guide" ${this.guideOpen ? '' : 'hidden'}>
                    <div class="pg-guide__head t-meta">Guía de canales · ${items.length} en emisión</div>
                    <ul>${guideHtml}</ul>
                </div>
            </nav>
            ${LoginModal.render()}
            ${UserManagementModal.render()}
        `;
    },

    bindEvents() {
        LoginModal.bindEvents();
        UserManagementModal.bindEvents();

        const go = (page) => {
            this.guideOpen = false;
            const screen = document.getElementById('main-tv-screen');
            if (screen) screen.scrollTop = 0;
            state.update({ activePage: page });
        };

        document.querySelectorAll('.tv-logo, .tv-nav-item').forEach(el => {
            el.addEventListener('click', () => go(el.getAttribute('data-page')));
        });

        const guideBtn = document.getElementById('btn-guide-toggle');
        if (guideBtn) {
            guideBtn.addEventListener('click', () => {
                this.guideOpen = !this.guideOpen;
                state.notify();
            });
        }

        const userBtn = document.getElementById('user-profile-btn');
        if (userBtn) userBtn.addEventListener('click', () => LoginModal.open('login'));

        const adminMgmtBtn = document.getElementById('btn-admin-manage-users');
        if (adminMgmtBtn) adminMgmtBtn.addEventListener('click', () => UserManagementModal.open());
    }
};
