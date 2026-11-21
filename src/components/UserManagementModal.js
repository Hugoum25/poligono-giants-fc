/* ==========================================
   FC HUB - PANEL DE GESTIÓN DE USUARIOS Y LOGS DE LOGIN (SOLO ADMINS)
   ========================================== */

import { state } from '../state.js';
import { AuthService } from '../services/authService.js';
import { GitHubSyncService } from '../services/githubSyncService.js';
import { teamData } from '../data/teamData.js';
import { PalmaresView } from './PalmaresView.js';
import { I } from './Icons.js';
import { ModalHead, stripEmoji } from './ui.js';

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
        const legends = teamData.legends || [];
        const hasGithubToken = GitHubSyncService.hasToken();

        const tabs = [
            ['logs', 'Historial', logs.length],
            ['legends', 'Leyendas', legends.length],
            ['users', 'Usuarios', users.length],
            ['create', 'Crear usuario', ''],
            ['github', 'GitHub sync', hasGithubToken ? '●' : '']
        ];
        const tabsHtml = tabs.map(([id, label, n]) => `
            <button type="button" class="pg-tab ${this.activeTab === id ? 'is-active' : ''}" id="um-tab-${id}">${label}${n !== '' ? ` <span class="${id === 'github' ? 't-signal' : 't-mute'}">${n}</span>` : ''}</button>
        `).join('');

        let body = '';
        if (this.activeTab === 'logs') {
            const rows = logs.length ? logs.map(l => {
                const ok = l.status === 'Éxito';
                return `<tr>
                    <td class="t-meta">${l.timestamp}</td>
                    <td><b>${l.username}</b></td>
                    <td class="t-mute">${stripEmoji(l.role)}</td>
                    <td><span class="pg-badge pg-badge--${ok ? 'win' : 'loss'}">${ok ? 'Éxito' : 'Fallido'}</span></td>
                </tr>`;
            }).join('') : `<tr><td colspan="4"><div class="pg-empty">Sin registros de acceso</div></td></tr>`;
            body = `
                <div class="pg-h"><span class="pg-h__meta">Últimos accesos registrados</span>
                    <button type="button" id="btn-clear-logs" class="pg-btn pg-btn--xs">${I('trash')} Limpiar</button></div>
                <div class="pg-table-wrap um-scroll">
                    <table class="pg-table"><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Rol</th><th>Resultado</th></tr></thead><tbody>${rows}</tbody></table>
                </div>`;
        } else if (this.activeTab === 'legends') {
            body = `
                <div class="pg-h"><span class="pg-h__meta">Leyendas del club</span>
                    <button type="button" id="btn-admin-add-legend" class="pg-btn pg-btn--primary pg-btn--xs">${I('plus')} Añadir</button></div>
                <div class="um-list um-scroll">
                    ${legends.map(l => {
                        const gk = (l.role || '').toLowerCase() === 'portero';
                        return `
                            <div class="um-item">
                                <div>
                                    <div class="um-item__title">${l.name} <span class="t-signal">#${l.number}</span></div>
                                    <div class="t-meta">${l.role} · ${l.matches || 0} PJ${gk ? '' : ` · ${l.goals || 0} goles`}</div>
                                </div>
                                <button type="button" class="pg-btn pg-btn--xs btn-admin-edit-legend" data-legend-id="${l.id}">${I('edit')} Editar</button>
                            </div>`;
                    }).join('') || '<div class="pg-empty">Sin leyendas</div>'}
                </div>`;
        } else if (this.activeTab === 'users') {
            body = `
                <div class="pg-table-wrap um-scroll">
                    <table class="pg-table">
                        <thead><tr><th>Nombre / usuario</th><th>Rol</th><th>Contraseña</th><th class="is-num">Acción</th></tr></thead>
                        <tbody>${users.map(u => `
                            <tr>
                                <td><b>${u.name}</b><div class="t-meta">@${u.username}</div></td>
                                <td class="t-signal">${stripEmoji(u.roleLabel || u.role)}</td>
                                <td class="t-meta">${u.password}</td>
                                <td class="is-num">${u.username !== 'admin'
                                    ? `<button type="button" class="pg-btn pg-btn--xs pg-btn--danger btn-delete-user" data-user-id="${u.id}">${I('trash')} Eliminar</button>`
                                    : '<span class="t-meta">Principal</span>'}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>`;
        } else if (this.activeTab === 'create') {
            body = `
                <form id="form-create-user-admin" class="pg-form">
                    <div class="pg-field"><label class="pg-label" for="um-new-name">Nombre completo *</label><input type="text" id="um-new-name" class="pg-input" placeholder="Carlos Ramírez #8" required></div>
                    <div class="pg-form__row">
                        <div class="pg-field"><label class="pg-label" for="um-new-username">Usuario (login) *</label><input type="text" id="um-new-username" class="pg-input" placeholder="carlos8" required></div>
                        <div class="pg-field"><label class="pg-label" for="um-new-password">Contraseña *</label><input type="text" id="um-new-password" class="pg-input" required></div>
                    </div>
                    <div class="pg-field"><label class="pg-label" for="um-new-role">Rol *</label>
                        <select id="um-new-role" class="pg-input">
                            <option value="fan">Aficionado</option>
                            <option value="player">Jugador</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" class="pg-btn pg-btn--primary pg-btn--block">${I('plus')} Crear cuenta</button>
                </form>`;
        } else if (this.activeTab === 'github') {
            body = `
                <div class="um-github">
                    <p class="t-mute">Con un token personal de GitHub guardado, cada edición de admin (goles, resultados, plantilla) hace un <b>commit automático</b> y Vercel publica la web en segundos.</p>
                    <form id="form-github-token-admin" class="pg-form">
                        <div class="pg-field"><label class="pg-label" for="um-github-token-input">Personal Access Token</label>
                            <input type="password" id="um-github-token-input" class="pg-input" value="${GitHubSyncService.getToken()}" placeholder="ghp_…" autocomplete="off"></div>
                        <div class="pg-row">
                            <button type="submit" class="pg-btn pg-btn--primary" style="flex:1">${I('github')} Guardar en este dispositivo</button>
                            ${hasGithubToken ? `<button type="button" id="btn-remove-github-token" class="pg-btn pg-btn--danger">${I('trash')} Quitar</button>` : ''}
                        </div>
                    </form>
                </div>`;
        }

        return `
            <div class="modal-overlay active" id="user-mgmt-modal-overlay">
                <div class="pg-modal pg-modal--md">
                    ${ModalHead({ kicker: 'Admin · Control', title: 'Usuarios y sincronización', closeId: 'close-user-mgmt-btn' })}
                    <div class="pg-tabs um-tabs">${tabsHtml}</div>
                    <div class="pg-modal__body">${body}</div>
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
                    state.update({ activePage: 'palmares' });
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
                state.update({ activePage: 'palmares' });
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
                    alert('Token de GitHub guardado. Ahora todas las ediciones que hagas en la web actualizarán GitHub y Vercel automáticamente.');
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

                let roleLabel = 'Aficionado';
                let permissions = ['create_lineup', 'customize_jersey'];
                if (role === 'admin') {
                    roleLabel = 'Administrador';
                    permissions = ['edit_news', 'edit_matches', 'edit_squad', 'edit_sponsors', 'manage_users'];
                } else if (role === 'player') {
                    roleLabel = 'Jugador';
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
