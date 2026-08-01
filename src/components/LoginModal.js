/* ==========================================
   FC HUB - MODAL DE INICIO DE SESIÓN Y REGISTRO
   ========================================== */

import { AuthService } from '../services/authService.js';
import { state } from '../state.js';
import { Icon3D } from './Icon3D.js';

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

        const currentUser = AuthService.getCurrentUser();

        if (currentUser) {
            return `
                <div class="modal-overlay active" id="auth-modal-overlay">
                    <div class="glass-card" style="max-width:440px; width:100%; padding:28px; text-align:center; position:relative; animation:slideUp 0.3s ease;">
                        <button class="modal-close" id="close-auth-modal">✕</button>
                        
                        <div style="font-size:3rem; margin-bottom:10px;">👤</div>
                        <h3 style="font-size:1.5rem; margin-bottom:4px;">${currentUser.name}</h3>
                        <span style="display:inline-block; font-size:0.8rem; background:rgba(255,42,133,0.15); color:var(--club-primary); padding:3px 12px; border-radius:2px; font-weight:800; margin-bottom:20px;">
                            ${currentUser.roleLabel}
                        </span>

                        <div style="border-top:1px solid var(--border-color); padding-top:20px; font-size:0.88rem; color:var(--text-muted); text-align:left; margin-bottom:24px;">
                            <p style="margin-bottom:6px;"><strong>Usuario:</strong> @${currentUser.username}</p>
                            <p style="margin-bottom:6px;"><strong>Permisos:</strong> ${currentUser.permissions.join(', ')}</p>
                        </div>

                        <button class="btn btn-secondary" id="btn-logout" style="width:100%;">
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="modal-overlay active" id="auth-modal-overlay">
                <div class="glass-card" style="max-width:440px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease;">
                    <button class="modal-close" id="close-auth-modal">✕</button>
                    
                    <h3 style="font-size:1.4rem; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                        ${Icon3D.render('🔑', 'sm')} Iniciar Sesión
                    </h3>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                        Accede con tus credenciales para administrar el contenido del equipo.
                    </p>

                    ${this.errorMsg ? `<div style="background:rgba(255,0,85,0.15); border:1px solid #ff0055; color:#ff0055; padding:8px 12px; border-radius:3px; font-size:0.85rem; margin-bottom:14px; text-align:center;">${this.errorMsg}</div>` : ''}

                    <form id="auth-form">
                        <div class="form-group" style="margin-bottom:14px;">
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Usuario</label>
                            <input type="text" id="auth-username" class="form-input" style="width:100%; padding:10px; border-radius:3px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" placeholder="Ej: admin" required>
                        </div>

                        <div class="form-group" style="margin-bottom:20px;">
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Contraseña</label>
                            <input type="password" id="auth-password" class="form-input" style="width:100%; padding:10px; border-radius:3px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" placeholder="••••••••" required>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">
                            🔑 Entrar
                        </button>
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
