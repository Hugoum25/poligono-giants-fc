/* ==========================================
   FC HUB - PANEL DE GESTIÓN DE USUARIOS Y LOGS DE LOGIN (SOLO ADMINS)
   ========================================== */

import { state } from '../state.js';
import { AuthService } from '../services/authService.js';
import { GitHubSyncService } from '../services/githubSyncService.js';
import { teamData } from '../data/teamData.js';
import { PalmaresView } from './PalmaresView.js';

export const UserManagementModal = {
    activeTab: 'logs', // 'logs', 'users', 'create', 'github', 'legends'
    isOpen: false,

    open() {
        this.isOpen = true;
        this.activeTab = 'logs';
        state.notify();
    },

    close() {
        this.isOpen = false;
        state.notify();
    },

    render() {
        if (!this.isOpen) return '';

        const logs = AuthService.getLoginLogs();
        const users = AuthService.getUsers();
        const hasGithubToken = GitHubSyncService.hasToken();

        const logsRowsHtml = logs.length > 0 ? logs.map(l => {
            const isSuccess = l.status === 'Éxito';
            const statusBadge = isSuccess ? 
                `<span style="color:#00e676; font-weight:700;">✅ Éxito</span>` : 
                `<span style="color:#ff4444; font-weight:700;">❌ Fallido</span>`;

            return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:10px; font-size:0.8rem; font-family:var(--font-mono); color:var(--text-muted);">${l.timestamp}</td>
                    <td style="padding:10px; font-weight:700; color:#fff;">${l.username}</td>
                    <td style="padding:10px; font-size:0.8rem; color:var(--club-primary);">${l.role}</td>
                    <td style="padding:10px; font-size:0.85rem;">${statusBadge}</td>
                </tr>
            `;
        }).join('') : `
            <tr>
                <td colspan="4" style="text-align:center; padding:24px; color:var(--text-muted);">
                    No hay registros de inicio de sesión acumulados.
                </td>
            </tr>
        `;

        const usersRowsHtml = users.map(u => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:10px; font-weight:700;">
                    <div style="color:#fff;">${u.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">@${u.username}</div>
                </td>
                <td style="padding:10px; font-size:0.82rem; color:var(--club-primary); font-weight:700;">${u.roleLabel || u.role}</td>
                <td style="padding:10px; font-family:var(--font-mono); font-size:0.82rem; color:var(--text-muted);">${u.password}</td>
                <td style="padding:10px; text-align:right;">
                    ${u.username !== 'admin' ? `
                        <button class="btn-delete-user" data-user-id="${u.id}" style="background:rgba(255,68,68,0.2); border:1px solid #ff4444; color:#ff4444; border-radius:4px; padding:4px 8px; font-size:0.75rem; cursor:pointer;">
                            🗑️ Eliminar
                        </button>
                    ` : '<span style="font-size:0.72rem; color:var(--text-muted);">Principal</span>'}
                </td>
            </tr>
        `).join('');

        return `
            <div class="modal-overlay active" id="user-mgmt-modal-overlay">
                <div class="glass-card" style="max-width:680px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease; max-height:90vh; overflow-y:auto;">
                    <button class="modal-close" id="close-user-mgmt-btn">✕</button>
                    
                    <h3 style="font-size:1.5rem; margin-bottom:4px; display:flex; align-items:center; gap:10px; font-family:var(--font-heading);">
                        📜 Control de Usuarios & Sincronización
                    </h3>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                        Supervisión de seguridad, cuentas registradas, leyendas del club y sincronización con GitHub/Vercel.
                    </p>

                    <!-- Pestañas del Panel -->
                    <div class="squad-filters" style="margin-bottom:20px; display:flex; flex-wrap:wrap; gap:8px;">
                        <button class="filter-btn ${this.activeTab === 'logs' ? 'active' : ''}" id="um-tab-logs">
                            📜 Historial (${logs.length})
                        </button>
                        <button class="filter-btn ${this.activeTab === 'legends' ? 'active' : ''}" id="um-tab-legends">
                            ⭐ Leyendas (${(teamData.legends || []).length})
                        </button>
                        <button class="filter-btn ${this.activeTab === 'users' ? 'active' : ''}" id="um-tab-users">
                            👥 Usuarios (${users.length})
                        </button>
                        <button class="filter-btn ${this.activeTab === 'create' ? 'active' : ''}" id="um-tab-create">
                            ➕ Crear Usuario
                        </button>
                        <button class="filter-btn ${this.activeTab === 'github' ? 'active' : ''}" id="um-tab-github">
                            🐙 GitHub Sync ${hasGithubToken ? '✅' : '⚙️'}
                        </button>
                    </div>

                    <!-- PESTAÑA 1: LOGS DE ACCESO -->
                    ${this.activeTab === 'logs' ? `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Últimos accesos registrados en el sistema</span>
                            <button id="btn-clear-logs" class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem;">
                                🗑️ Limpiar Historial
                            </button>
                        </div>
                        <div style="background:var(--bg-dark); border:1px solid var(--border-color); border-radius:4px; max-height:340px; overflow-y:auto;">
                            <table style="width:100%; border-collapse:collapse; text-align:left;">
                                <thead>
                                    <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">
                                        <th style="padding:10px;">Fecha y Hora</th>
                                        <th style="padding:10px;">Usuario</th>
                                        <th style="padding:10px;">Rol</th>
                                        <th style="padding:10px;">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${logsRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}

                    <!-- PESTAÑA LEYENDAS DEL CLUB -->
                    ${this.activeTab === 'legends' ? `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Gestión de Leyendas del Club (Diego Mon, Víctor Álvarez, Hamza)</span>
                            <button id="btn-admin-add-legend" class="btn btn-primary" style="padding:5px 12px; font-size:0.75rem; font-weight:800;">
                                Añadir Leyenda
                            </button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px; max-height:340px; overflow-y:auto;">
                            ${(teamData.legends || []).map(l => {
                                const isPortero = (l.role || '').toLowerCase() === 'portero';
                                const statsText = isPortero ? `${l.matches || 0} Partidos Totales` : `${l.matches || 0} Partidos Totales • ${l.goals || 0} Goles Totales`;
                                return `
                                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; background:var(--bg-dark); border:1px solid var(--border-color); border-radius:6px;">
                                        <div>
                                            <div style="font-weight:800; color:#fff; font-size:0.95rem;">${l.name} <span style="color:var(--club-primary);">#${l.number}</span></div>
                                            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${l.role}</div>
                                            <div style="font-size:0.75rem; color:var(--club-primary); font-family:var(--font-mono); font-weight:800; margin-top:2px;">${statsText}</div>
                                        </div>
                                        <button class="btn-admin-edit-legend btn btn-secondary" data-legend-id="${l.id}" style="padding:6px 14px; font-size:0.75rem; font-weight:800; color:var(--club-primary);">
                                            Editar
                                        </button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}

                    <!-- PESTAÑA 2: USUARIOS REGISTRADOS -->
                    ${this.activeTab === 'users' ? `
                        <div style="background:var(--bg-dark); border:1px solid var(--border-color); border-radius:4px; max-height:340px; overflow-y:auto;">
                            <table style="width:100%; border-collapse:collapse; text-align:left;">
                                <thead>
                                    <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">
                                        <th style="padding:10px;">Nombre / Usuario</th>
                                        <th style="padding:10px;">Rol de Sistema</th>
                                        <th style="padding:10px;">Contraseña</th>
                                        <th style="padding:10px; text-align:right;">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${usersRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}

                    <!-- PESTAÑA 3: CREAR USUARIO -->
                    ${this.activeTab === 'create' ? `
                        <form id="form-create-user-admin" style="background:var(--bg-dark); padding:20px; border-radius:4px; border:1px solid var(--border-color);">
                            <div class="form-group" style="margin-bottom:14px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Nombre Completo / Título *</label>
                                <input type="text" id="um-new-name" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:#0b0d18; border:1px solid var(--border-color); color:#fff;" placeholder="Ej: Carlos Ramírez #8" required>
                            </div>

                            <div class="form-group" style="margin-bottom:14px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Nombre de Usuario (Login) *</label>
                                <input type="text" id="um-new-username" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:#0b0d18; border:1px solid var(--border-color); color:#fff;" placeholder="Ej: carlos8" required>
                            </div>

                            <div class="form-group" style="margin-bottom:14px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Contraseña *</label>
                                <input type="text" id="um-new-password" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:#0b0d18; border:1px solid var(--border-color); color:#fff;" placeholder="Ej: 123456" required>
                            </div>

                            <div class="form-group" style="margin-bottom:20px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Rol de Permisos *</label>
                                <select id="um-new-role" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:#0b0d18; border:1px solid var(--border-color); color:#fff;">
                                    <option value="fan">⚽ Aficionado</option>
                                    <option value="player">🏃 Jugador</option>
                                    <option value="admin">👑 Administrador</option>
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-weight:700;">
                                ➕ Crear Cuenta de Usuario
                            </button>
                        </form>
                    ` : ''}

                    <!-- PESTAÑA 4: CONFIGURACIÓN DE GITHUB API SYNC -->
                    ${this.activeTab === 'github' ? `
                        <div style="background:var(--bg-dark); padding:20px; border-radius:4px; border:1px solid var(--border-color);">
                            <h4 style="font-size:1.1rem; color:var(--club-primary); margin-bottom:8px; font-family:var(--font-heading);">
                                🐙 Sincronización Automática vía GitHub API
                            </h4>
                            <p style="font-size:0.85rem; color:var(--text-main); line-height:1.5; margin-bottom:16px;">
                                Al guardar un Token Personal de GitHub, cualquier edición que realice un Admin desde su móvil (goles, resultados o plantilla) hará un <strong>commit automático a GitHub</strong> y Vercel actualizará la web global (<code>www.poligonogiants.com</code>) en 10 segundos.
                            </p>

                            <form id="form-github-token-admin">
                                <div class="form-group" style="margin-bottom:14px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">GitHub Personal Access Token (PAT)</label>
                                    <input type="password" id="um-github-token-input" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:#0b0d18; border:1px solid var(--border-color); color:#fff;" value="${GitHubSyncService.getToken()}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
                                </div>

                                <div style="display:flex; gap:10px;">
                                    <button type="submit" class="btn btn-primary" style="flex:1; padding:10px; font-weight:700;">
                                        💾 Guardar Token en este Dispositivo
                                    </button>
                                    ${hasGithubToken ? `
                                        <button type="button" id="btn-remove-github-token" class="btn btn-secondary" style="padding:10px 14px; background:rgba(255,68,68,0.2); border-color:#ff4444; color:#ff4444;">
                                            🗑️ Quitar
                                        </button>
                                    ` : ''}
                                </div>
                            </form>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    bindEvents() {
        if (!this.isOpen) return;

        // Cerrar modal
        const closeBtn = document.getElementById('close-user-mgmt-btn');
        const overlay = document.getElementById('user-mgmt-modal-overlay');

        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.close();
            });
        }

        // Pestañas
        const tabLogs = document.getElementById('um-tab-logs');
        const tabLegends = document.getElementById('um-tab-legends');
        const tabUsers = document.getElementById('um-tab-users');
        const tabCreate = document.getElementById('um-tab-create');
        const tabGithub = document.getElementById('um-tab-github');

        if (tabLogs) tabLogs.addEventListener('click', () => { this.activeTab = 'logs'; state.notify(); });
        if (tabLegends) tabLegends.addEventListener('click', () => { this.activeTab = 'legends'; state.notify(); });
        if (tabUsers) tabUsers.addEventListener('click', () => { this.activeTab = 'users'; state.notify(); });
        if (tabCreate) tabCreate.addEventListener('click', () => { this.activeTab = 'create'; state.notify(); });
        if (tabGithub) tabGithub.addEventListener('click', () => { this.activeTab = 'github'; state.notify(); });

        document.querySelectorAll('.btn-admin-edit-legend').forEach(btn => {
            btn.addEventListener('click', () => {
                const lId = parseInt(btn.getAttribute('data-legend-id'));
                const legend = (teamData.legends || []).find(l => l.id === lId);
                if (legend) {
                    this.close();
                    PalmaresView.activeTab = 'leyendas';
                    PalmaresView.editingLegend = { ...legend };
                    state.notify();
                }
            });
        });

        const btnAdminAddLegend = document.getElementById('btn-admin-add-legend');
        if (btnAdminAddLegend) {
            btnAdminAddLegend.addEventListener('click', () => {
                this.close();
                PalmaresView.activeTab = 'leyendas';
                PalmaresView.editingLegend = {
                    id: 0,
                    name: '',
                    number: 1,
                    role: '',
                    stats: '',
                    desc: '',
                    photo: ''
                };
                state.notify();
            });
        }

        // Guardar Token de GitHub
        const githubForm = document.getElementById('form-github-token-admin');
        if (githubForm) {
            githubForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const tokenInput = document.getElementById('um-github-token-input');
                if (tokenInput) {
                    GitHubSyncService.setToken(tokenInput.value);
                    alert('✅ Token de GitHub guardado con éxito. Ahora todas las ediciones que hagas en la web actualizarán GitHub y Vercel automáticamente.');
                    state.notify();
                }
            });
        }

        const btnRemoveToken = document.getElementById('btn-remove-github-token');
        if (btnRemoveToken) {
            btnRemoveToken.addEventListener('click', () => {
                GitHubSyncService.setToken('');
                alert('Token de GitHub eliminado.');
                state.notify();
            });
        }

        // Limpiar Historial de Logins
        const btnClear = document.getElementById('btn-clear-logs');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (confirm('¿Deseas vaciar el historial de inicios de sesión?')) {
                    AuthService.clearLoginLogs();
                    state.notify();
                }
            });
        }

        // Eliminar usuario
        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const uId = parseInt(btn.getAttribute('data-user-id'));
                if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                    AuthService.deleteUser(uId);
                    state.notify();
                }
            });
        });

        // Crear usuario desde admin
        const formCreateAdmin = document.getElementById('form-create-user-admin');
        if (formCreateAdmin) {
            formCreateAdmin.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('um-new-name').value.trim();
                const username = document.getElementById('um-new-username').value.trim();
                const password = document.getElementById('um-new-password').value.trim();
                const role = document.getElementById('um-new-role').value;

                let roleLabel = '⚽ Aficionado';
                let permissions = ['create_lineup', 'customize_jersey'];
                if (role === 'admin') {
                    roleLabel = '👑 Administrador';
                    permissions = ['edit_news', 'edit_matches', 'edit_squad', 'edit_sponsors', 'manage_users'];
                } else if (role === 'player') {
                    roleLabel = '🏃 Jugador';
                }

                const users = AuthService.getUsers();
                if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                    alert('El nombre de usuario ya existe.');
                    return;
                }

                users.push({
                    id: Date.now(),
                    username: username,
                    password: password,
                    name: name,
                    role: role,
                    roleLabel: roleLabel,
                    permissions: permissions
                });

                AuthService.saveUsers(users);
                this.activeTab = 'users';
                state.notify();
            });
        }
    }
};
