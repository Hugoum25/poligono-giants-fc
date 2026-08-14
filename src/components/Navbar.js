/* ==========================================
   FC HUB - NAV SMART TV CON AUTENTICACIÓN Y MODO RETRO
   ========================================== */

import { state } from '../state.js';
import { ClubLogo } from './ClubLogo.js';
import { AuthService } from '../services/authService.js';
import { LoginModal } from './LoginModal.js';
import { UserManagementModal } from './UserManagementModal.js';

export const Navbar = {
    render() {
        const currentUser = AuthService.getCurrentUser();
        const isAdmin = AuthService.isAdmin();
        const navItems = [
            { id: 'news',       label: 'Noticias' },
            { id: 'squad',      label: 'Plantilla' },
            ...(isAdmin ? [{ id: 'lineup', label: 'IG' }] : []),
            { id: 'matches',    label: 'Temporada' },
            { id: 'sponsors',   label: 'Patrocinadores' },
            { id: 'multimedia', label: 'Media' },
            ...(isAdmin ? [{ id: 'games',      label: 'Juegos' }] : []),
            ...(isAdmin ? [{ id: 'palmares',   label: 'Historia del Club' }] : [])
        ];

        const navLinksHtml = navItems.map(item => {
            const activeClass = state.activePage === item.id ? 'active' : '';
            return `
                <li>
                    <span class="tv-nav-item ${activeClass}" data-page="${item.id}">
                        ${item.label}
                    </span>
                </li>
            `;
        }).join('');

        const userButtonHtml = currentUser ? `
            <button class="theme-toggle-btn" id="user-profile-btn" style="background:rgba(255,42,133,0.15); border-color:var(--club-primary);" title="Perfil de ${currentUser.name}">
                <span class="theme-icon">👤</span>
                <span class="theme-label" style="color:var(--club-primary);">${currentUser.name.split(' ')[0]}</span>
            </button>
        ` : `
            <button class="theme-toggle-btn" id="user-profile-btn" title="Iniciar Sesión">
                <span class="theme-icon">🔑</span>
                <span class="theme-label">Entrar</span>
            </button>
        `;

        const adminMgmtButtonHtml = isAdmin ? `
            <button class="theme-toggle-btn" id="btn-admin-manage-users" style="background:rgba(0,230,118,0.15); border-color:#00e676;" title="Logs de Acceso y Gestión de Usuarios">
                <span class="theme-icon">📜</span>
                <span class="theme-label" style="color:#00e676;">Logs & Usuarios</span>
            </button>
        ` : '';

        return `
            <div class="tv-navbar">
                <div class="tv-navbar-container">
                    <!-- Logo Oficial Polígono Giants F7 -->
                    <div class="tv-logo" data-page="home" title="Ir a Inicio - Polígono Giants">
                        <div class="logo-shield-badge">
                            ${ClubLogo.render(32)}
                        </div>
                        <div style="display:flex; flex-direction:column; line-height:1.1;">
                            <span class="tv-logo-badge" style="font-size:clamp(0.95rem, 4vw, 1.25rem); font-family:var(--font-heading); font-weight:800; color:var(--club-primary); letter-spacing:0.04em;">POLÍGONO GIANTS F7</span>
                            <span class="tv-logo-sub" style="font-size:0.68rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Official Club Hub</span>
                        </div>
                    </div>

                    <!-- Navegación sin cajas ni íconos -->
                    <ul class="tv-nav-links">
                        ${navLinksHtml}
                    </ul>

                    <!-- Controles: Usuario -->
                    <div class="tv-nav-actions" style="display:flex; gap:8px; align-items:center;">
                        ${adminMgmtButtonHtml}
                        ${userButtonHtml}
                    </div>
                </div>
            </div>
            ${LoginModal.render()}
            ${UserManagementModal.render()}
        `;
    },

    bindEvents() {
        LoginModal.bindEvents();
        UserManagementModal.bindEvents();

        // Evento clic en logo
        const logoEl = document.querySelector('.tv-logo');
        if (logoEl) {
            logoEl.addEventListener('click', () => {
                state.update({ activePage: 'home' });
            });
        }

        // Eventos clic en links de navegación
        document.querySelectorAll('.tv-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetPage = item.getAttribute('data-page');
                state.update({ activePage: targetPage });
            });
        });

        // Evento abrir modal de usuario / login
        const userBtn = document.getElementById('user-profile-btn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                LoginModal.open('login');
            });
        }

        // Evento abrir panel de administración de usuarios y logs
        const adminMgmtBtn = document.getElementById('btn-admin-manage-users');
        if (adminMgmtBtn) {
            adminMgmtBtn.addEventListener('click', () => {
                UserManagementModal.open();
            });
        }
    }
};
