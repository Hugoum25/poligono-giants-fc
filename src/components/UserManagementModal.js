/* ==========================================
   FC HUB - PANEL DE GESTIÓN DE USUARIOS Y LOGS DE LOGIN (SOLO ADMINS)
   ========================================== */

import { state } from '../state.js';
import { AuthService } from '../services/authService.js';

export const UserManagementModal = {
    activeTab: 'logs', // 'logs', 'users', 'create'
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
                        📜 Control de Usuarios & Registro de Logins
                    </h3>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                        Supervisión de seguridad y gestión de cuentas registradas del club.
                    </p>

                    <!-- Pestañas del Panel -->
                    <div class="squad-filters" style="margin-bottom:20px;">
                        <button class="filter-btn ${this.activeTab === 'logs' ? 'active' : ''}" id="um-tab-logs">
                            📜 Historial de Logins (${logs.length})
                        </button>
                        <button class="filter-btn ${this.activeTab === 'users' ? 'active' : ''}" id="um-tab-users">
                            👥 Usuarios Registrados (${users.length})
                        </button>
                        <button class="filter-btn ${this.activeTab === 'create' ? 'active' : ''}" id="um-tab-create">
                            ➕ Crear Usuario
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
        const tabUsers = document.getElementById('um-tab-users');
        const tabCreate = document.getElementById('um-tab-create');

        if (tabLogs) {
            tabLogs.addEventListener('click', () => {
                this.activeTab = 'logs';
                state.notify();
            });
        }
        if (tabUsers) {
            tabUsers.addEventListener('click', () => {
                this.activeTab = 'users';
                state.notify();
            });
        }
        if (tabCreate) {
            tabCreate.addEventListener('click', () => {
                this.activeTab = 'create';
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
