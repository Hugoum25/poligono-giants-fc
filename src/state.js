/* ==========================================
   FC HUB - GESTIÓN DE ESTADO REACTIVO (TV)
   ========================================== */

export const state = {
    powerOn: true,          // Estado de encendido de la TV
    activePage: "home",     // home, news, squad, matches, sponsors, multimedia, fanzone
    jerseyName: "GIANTS",
    jerseyNumber: "10",
    jerseyRotated: false,
    selectedPlayerId: null, // Jugador para modal de plantilla
    activeVideoId: null,    // Video en reproducción
    isLightMode: false,
    isRetroMode: false,     // Modo retro TV (desactivado por defecto)

    // Sistema de suscripción reactivo
    listeners: [],

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    },

    notify() {
        this.listeners.forEach(cb => cb());
    },

    update(newState) {
        Object.assign(this, newState);

        // Aplicar clase de Modo Claro/Oscuro en el body
        if (newState.isLightMode !== undefined) {
            if (this.isLightMode) {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        }

        // Aplicar clase de Modo Retro TV en el body
        if (newState.isRetroMode !== undefined) {
            if (this.isRetroMode) {
                document.body.classList.add('retro-mode-active');
            } else {
                document.body.classList.remove('retro-mode-active');
            }
        }

        this.notify();
    }
};
