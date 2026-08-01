/* ==========================================
   FC HUB - SERVICIO DE AUTENTICACIÓN Y ROLES
   ========================================== */

const USERS_STORAGE_KEY = 'fc_hub_users_db_v1';
const CURRENT_USER_KEY  = 'fc_hub_current_user_v1';
const LOGIN_LOGS_KEY    = 'fc_hub_login_logs_v1';

// Cuentas por defecto si la base de datos está vacía
const DEFAULT_USERS = [
    {
        id: 1,
        username: 'admin',
        password: '112233445566',
        name: 'Directiva Giants',
        role: 'admin', // admin, player, fan
        roleLabel: '👑 Administrador',
        permissions: ['edit_news', 'edit_matches', 'edit_squad', 'edit_sponsors', 'manage_users']
    },
    {
        id: 2,
        username: 'miguel13',
        password: '123',
        name: 'Miguel (Portero #13)',
        role: 'player',
        roleLabel: '🏃 Jugador',
        permissions: ['create_lineup', 'customize_jersey']
    },
    {
        id: 3,
        username: 'aficionado',
        password: '123',
        name: 'Fan Rosinegro',
        role: 'fan',
        roleLabel: '⚽ Aficionado',
        permissions: ['create_lineup', 'customize_jersey']
    }
];

export const AuthService = {
    init() {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        } else {
            try {
                const users = JSON.parse(stored);
                const admin = users.find(u => u.username === 'admin');
                if (admin) {
                    admin.password = '112233445566';
                    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
                }
            } catch (e) {
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
            }
        }
    },

    getUsers() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || DEFAULT_USERS;
        } catch (e) {
            return DEFAULT_USERS;
        }
    },

    saveUsers(users) {
        try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        } catch (e) {
            console.error('[AuthService] Error guardando usuarios:', e);
        }
    },

    getLoginLogs() {
        try {
            return JSON.parse(localStorage.getItem(LOGIN_LOGS_KEY)) || [];
        } catch (e) {
            return [];
        }
    },

    addLoginLog(username, roleLabel, status) {
        const logs = this.getLoginLogs();
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-ES') + ' ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        logs.unshift({
            id: Date.now(),
            username: username,
            role: roleLabel || 'Desconocido',
            status: status, // 'Éxito' or 'Fallido'
            timestamp: dateStr
        });
        if (logs.length > 100) logs.length = 100;
        try {
            localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify(logs));
        } catch (e) {}
    },

    clearLoginLogs() {
        try {
            localStorage.removeItem(LOGIN_LOGS_KEY);
        } catch (e) {}
    },

    getCurrentUser() {
        try {
            const stored = localStorage.getItem(CURRENT_USER_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    },

    login(username, password) {
        const users = this.getUsers();
        const found = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password);
        
        if (found) {
            const userSession = {
                id: found.id,
                username: found.username,
                name: found.name,
                role: found.role,
                roleLabel: found.roleLabel,
                permissions: found.permissions
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
            this.addLoginLog(found.username, found.roleLabel, 'Éxito');
            return { success: true, user: userSession };
        } else {
            this.addLoginLog(username || 'Anonimo', 'Desconocido', 'Fallido');
            return { success: false, message: 'Usuario o contraseña incorrectos.' };
        }
    },

    logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    register(username, password, name) {
        const users = this.getUsers();
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase().trim())) {
            return { success: false, message: 'El nombre de usuario ya existe.' };
        }

        const newUser = {
            id: Date.now(),
            username: username.trim(),
            password: password,
            name: name.trim() || username.trim(),
            role: 'fan',
            roleLabel: '⚽ Aficionado',
            permissions: ['create_lineup', 'customize_jersey']
        };

        users.push(newUser);
        this.saveUsers(users);
        this.login(username, password);
        return { success: true, user: newUser };
    },

    updateUser(id, updatedFields) {
        const users = this.getUsers();
        const user = users.find(u => u.id === id);
        if (user) {
            Object.assign(user, updatedFields);
            this.saveUsers(users);
            return { success: true };
        }
        return { success: false, message: 'Usuario no encontrado.' };
    },

    deleteUser(id) {
        let users = this.getUsers();
        users = users.filter(u => u.id !== id);
        this.saveUsers(users);
        return { success: true };
    },

    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
};

AuthService.init();
