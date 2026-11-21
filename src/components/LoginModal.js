/* ==========================================
   FC HUB - MODAL DE INICIO DE SESIÓN Y REGISTRO
   ========================================== */

import { AuthService } from '../services/authService.js';
import { state } from '../state.js';
import { I } from './Icons.js';
import { ModalHead, stripEmoji } from './ui.js';

export const LoginModal = {
    isOpen: false,
    errorMsg: '',

    open() {
        this.isOpen = true;
        this.errorMsg = '';
        state.notify();
    },

    close() {
        this.isOpen = false;
        this.errorMsg = '';
        state.notify();
    },

    render() {
        if (!this.isOpen) return '';
        const u = AuthService.getCurrentUser();

        if (u) {
            return `
                <div class="modal-overlay active" id="auth-modal-overlay">
                    <div class="pg-modal">
                        ${ModalHead({ kicker: stripEmoji(u.roleLabel), title: u.name, closeId: 'close-auth-modal' })}
                        <div class="pg-modal__body">
                            <dl class="auth-dl">
                                <div><dt class="pg-label">Usuario</dt><dd>@${u.username}</dd></div>
                                <div><dt class="pg-label">Permisos</dt><dd class="auth-perms">${u.permissions.map(p => `<span class="pg-badge pg-badge--mute">${p.replace(/_/g, ' ')}</span>`).join('')}</dd></div>
                            </dl>
                        </div>
                        <div class="pg-modal__foot">
                            <button type="button" class="pg-btn pg-btn--block" id="btn-logout">${I('logout')} Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="modal-overlay active" id="auth-modal-overlay">
                <div class="pg-modal auth-modal">
                    ${ModalHead({ kicker: 'Acceso · Directiva y jugadores', title: 'Iniciar sesión', closeId: 'close-auth-modal' })}
                    <form id="auth-form" class="pg-form pg-modal__body">
                        ${this.errorMsg ? `<div class="pg-alert" role="alert">${this.errorMsg}</div>` : ''}
                        <div class="pg-field">
                            <label class="pg-label" for="auth-username">Usuario</label>
                            <input type="text" id="auth-username" class="pg-input" autocomplete="username" required>
                        </div>
                        <div class="pg-field">
                            <label class="pg-label" for="auth-password">Contraseña</label>
                            <input type="password" id="auth-password" class="pg-input" autocomplete="current-password" required>
                        </div>
                        <button type="submit" class="pg-btn pg-btn--primary pg-btn--block">${I('key')} Entrar</button>
                    </form>
                </div>
            </div>
        `;
    },

    bindEvents() {
        if (!this.isOpen) return;

        const closeBtn = document.getElementById('close-auth-modal');
        const overlay = document.getElementById('auth-modal-overlay');

        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.close();
            });
        }

        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                AuthService.logout();
                this.close();
            });
        }

        const form = document.getElementById('auth-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const usernameEl = document.getElementById('auth-username');
                const passwordEl = document.getElementById('auth-password');

                const username = usernameEl ? usernameEl.value : '';
                const password = passwordEl ? passwordEl.value : '';

                const result = AuthService.login(username, password);
                if (result.success) {
                    this.close();
                } else {
                    this.errorMsg = result.message;
                    state.notify();
                }
            });
        }
    }
};
