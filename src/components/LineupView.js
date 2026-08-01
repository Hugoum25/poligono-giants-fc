/* ==========================================
   FC HUB - VISTA ALINEACIÓN TÁCTICA (EXCLUSIVA ADMINISTRADORES)
   ========================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';

export const LineupView = {
    activeFormation: "3-2-1", // 3-2-1, 2-3-1, 2-2-2

    lineup: {
        gk: null,
        def1: null,
        def2: null,
        def3: null,
        mid1: null,
        mid2: null,
        fwd1: null,
        bench1: null,
        bench2: null,
        bench3: null,
        bench4: null,
        bench5: null
    },

    draggedPlayerId: null,

    getFormations() {
        return {
            "3-2-1": [
                { id: "gk", label: "POR", row: 4, col: 2, icon: "🧤" },
                { id: "def1", label: "CARR.IZQ", row: 3, col: 1, icon: "🏃" },
                { id: "def2", label: "CENTRAL", row: 3, col: 2, icon: "🛡️" },
                { id: "def3", label: "CARR.DER", row: 3, col: 3, icon: "🏃" },
                { id: "mid1", label: "MEDIO", row: 2, col: 1, icon: "⚙️" },
                { id: "mid2", label: "MEDIO", row: 2, col: 3, icon: "⚙️" },
                { id: "fwd1", label: "DELANTERO", row: 1, col: 2, icon: "🔥" }
            ],
            "2-3-1": [
                { id: "gk", label: "POR", row: 4, col: 2, icon: "🧤" },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1, icon: "🛡️" },
                { id: "def2", label: "DEF.DER", row: 3, col: 3, icon: "🛡️" },
                { id: "mid1", label: "CARR.IZQ", row: 2, col: 1, icon: "🏃" },
                { id: "def3", label: "MEDIO", row: 2, col: 2, icon: "⚙️" },
                { id: "mid2", label: "CARR.DER", row: 2, col: 3, icon: "🏃" },
                { id: "fwd1", label: "DELANTERO", row: 1, col: 2, icon: "🔥" }
            ],
            "2-2-2": [
                { id: "gk", label: "POR", row: 4, col: 2, icon: "🧤" },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1, icon: "🛡️" },
                { id: "def2", label: "DEF.DER", row: 3, col: 3, icon: "🛡️" },
                { id: "mid1", label: "MEDIO.IZQ", row: 2, col: 1, icon: "⚙️" },
                { id: "mid2", label: "MEDIO.DER", row: 2, col: 3, icon: "⚙️" },
                { id: "def3", label: "DEL.IZQ", row: 1, col: 1, icon: "🔥" },
                { id: "fwd1", label: "DEL.DER", row: 1, col: 3, icon: "🔥" }
            ]
        };
    },

    render() {
        const isAdmin = AuthService.isAdmin();

        if (!isAdmin) {
            return `
                <div class="container" style="padding-top:60px; padding-bottom:80px; text-align:center;">
                    <div class="glass-card" style="max-width:500px; margin:0 auto; padding:32px; border:1px solid var(--border-color);">
                        <div style="font-size:3rem; margin-bottom:12px;">🔒</div>
                        <h3 style="font-size:1.4rem; color:var(--club-primary); margin-bottom:8px; font-family:var(--font-heading);">
                            Acceso Restringido
                        </h3>
                        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5;">
                            La sección de <strong>Alineación Táctica</strong> es exclusiva para los administradores y cuerpo técnico del club. Por favor, inicia sesión con cuenta de administrador para acceder.
                        </p>
                    </div>
                </div>
            `;
        }

        const currentSlots = this.getFormations()[this.activeFormation];

        // Obtener jugadores asignados al campo o al banquillo
        const usedPlayerIds = Object.values(this.lineup).filter(Boolean);

        // Lista de selección para arrastrar
        const dragListHtml = teamData.players.map(p => {
            const isUsed = usedPlayerIds.includes(p.id);
            return `
                <div class="drag-player-card ${isUsed ? 'assigned' : ''}" 
                     draggable="${!isUsed}" 
                     data-player-id="${p.id}"
                     style="padding:5px 8px; border-radius:4px; font-size:0.75rem; background:${isUsed ? 'rgba(255,255,255,0.02)' : 'rgba(255,42,133,0.1)'}; border:1px solid ${isUsed ? 'rgba(255,255,255,0.06)' : 'var(--club-primary)'}; color:${isUsed ? 'var(--text-muted)' : '#ffffff'}; opacity:${isUsed ? 0.4 : 1}; cursor:${isUsed ? 'default' : 'grab'}; display:flex; align-items:center; gap:6px; user-select:none;">
                    <span style="font-weight:800; font-family:var(--font-mono); color:${isUsed ? 'var(--text-muted)' : 'var(--club-primary)'}; width:16px;">#${p.number}</span>
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; font-weight:700;">${p.name}</span>
                </div>
            `;
        }).join('');

        // Generar Posiciones Tácticas del Campo (7 Titulares)
        const pitchSlotsHtml = currentSlots.map(slot => {
            const assignedPlayerId = this.lineup[slot.id];
            const player = assignedPlayerId ? teamData.players.find(p => p.id === assignedPlayerId) : null;

            return `
                <div class="pitch-slot ${player ? 'occupied' : 'empty'}" 
                     data-slot-id="${slot.id}"
                     style="grid-row:${slot.row}; grid-column:${slot.col}; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;">
                    
                    <div class="pitch-slot-circle" style="width:40px; height:40px; border-radius:50%; background:${player ? 'rgba(255,42,133,0.25)' : 'rgba(0,0,0,0.4)'}; border:2px solid ${player ? 'var(--club-primary)' : 'rgba(255,255,255,0.3)'}; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; transition:all 0.2s ease;">
                        <span style="font-size:1.2rem;">${player ? (player.position.includes('Portero') ? '🧤' : '👤') : slot.icon}</span>
                        <span class="pitch-player-number" style="font-size:0.6rem; bottom:-2px; right:-2px; padding:1px 3px;">${player ? `#${player.number}` : ''}</span>
                    </div>
                    <div class="pitch-player-name" style="font-size:0.65rem; margin-top:2px; max-width:65px; text-align:center; margin-left:auto; margin-right:auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${player ? player.name : ''}</div>
                </div>
            `;
        }).join('');

        // Generar Slots del Banquillo (5 Suplentes)
        const benchSlotsConfig = [
            { id: "bench1", label: "Suplente 1" },
            { id: "bench2", label: "Suplente 2" },
            { id: "bench3", label: "Suplente 3" },
            { id: "bench4", label: "Suplente 4" },
            { id: "bench5", label: "Suplente 5" }
        ];

        const benchSlotsHtml = benchSlotsConfig.map(bench => {
            const assignedPlayerId = this.lineup[bench.id];
            const player = assignedPlayerId ? teamData.players.find(p => p.id === assignedPlayerId) : null;

            return `
                <div class="bench-slot ${player ? 'occupied' : 'empty'}" 
                     data-slot-id="${bench.id}"
                     style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                    
                    <div class="pitch-slot-circle" style="width:34px; height:34px; border-radius:50%; background:${player ? 'rgba(255,42,133,0.2)' : 'rgba(0,0,0,0.3)'}; border:2px solid ${player ? 'var(--club-primary)' : 'rgba(255,255,255,0.2)'}; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative;">
                        <span style="font-size:1rem;">👤</span>
                        <span class="pitch-player-number" style="font-size:0.6rem; bottom:-2px; right:-2px; padding:1px 3px;">${player ? `#${player.number}` : '?'}</span>
                    </div>
                    <div class="pitch-player-name" style="font-size:0.65rem; margin-top:2px; max-width:65px; text-align:center; margin-left:auto; margin-right:auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${player ? player.name : 'Suplente'}</div>
                </div>
            `;
        }).join('');

        // Estadísticas acumuladas ÚNICAMENTE del 7 Titular
        const starterPlayerIds = currentSlots.map(slot => this.lineup[slot.id]).filter(Boolean);
        const starterPlayers = starterPlayerIds
            .map(id => teamData.players.find(p => p.id === id))
            .filter(Boolean);

        const starterCount = starterPlayers.length;
        const totalStarterGoals = starterPlayers.reduce((acc, p) => acc + (p.stats?.goals || 0), 0);
        const totalStarterAssists = starterPlayers.reduce((acc, p) => acc + (p.stats?.assists || 0), 0);
        const totalStarterYellows = starterPlayers.reduce((acc, p) => acc + (p.stats?.yellowCards || 0), 0);
        const totalStarterReds = starterPlayers.reduce((acc, p) => acc + (p.stats?.redCards || 0), 0);
        const totalStarterBlues = starterPlayers.reduce((acc, p) => acc + (p.stats?.blueCards || 0), 0);
        const avgStarterAge = starterCount > 0 ? (starterPlayers.reduce((acc, p) => acc + (p.info?.age || 24), 0) / starterCount).toFixed(1) : 0;

        return `
            <div class="container" style="padding-top:36px; padding-bottom:80px;">
                <!-- Barra Superior de Controles -->
                <div style="max-width:960px; margin:0 auto 16px auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <h2 style="font-size:1.15rem; font-family:var(--font-heading); font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-main); margin:0;">
                        Crea tu alineación
                    </h2>

                    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                        <!-- Selector de Formaciones -->
                        <div style="display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); padding:4px 8px; border-radius:4px; border:1px solid var(--border-color);">
                            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Formación:</span>
                            <button class="formation-btn ${this.activeFormation === '3-2-1' ? 'active' : ''}" data-formation="3-2-1">3-2-1</button>
                            <button class="formation-btn ${this.activeFormation === '2-3-1' ? 'active' : ''}" data-formation="2-3-1">2-3-1</button>
                            <button class="formation-btn ${this.activeFormation === '2-2-2' ? 'active' : ''}" data-formation="2-2-2">2-2-2</button>
                        </div>

                        <!-- Botón Vaciar Posiciones -->
                        <button class="formation-btn" id="btn-reset-lineup" style="font-size:0.75rem; padding:5px 10px; text-transform:uppercase; background:rgba(255,255,255,0.04); border:1px solid var(--border-color); color:var(--text-main);" title="Vaciar todas las posiciones del campo">
                            Vaciar Posiciones
                        </button>
                    </div>
                </div>

                <!-- Layout 3 Columnas: Lista Izquierda + Campo Centro + Panel Stats Derecha -->
                <div class="lineup-drag-wrapper" style="display:grid; grid-template-columns: minmax(310px, auto) 380px 220px; justify-content:center; gap:20px; align-items:start; margin:0 auto;">
                    
                    <!-- Panel 1: Lista de Nombres en 2 Columnas -->
                    <div class="glass-card" style="padding:12px;">
                        <div style="font-size:0.78rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.05em;">
                            Arrastrar Jugador
                        </div>
                        <div class="drag-players-container" style="display:grid; grid-template-columns: repeat(2, minmax(130px, 1fr)); gap:4px; width:100%; box-sizing:border-box;">
                            ${dragListHtml}
                        </div>
                    </div>

                    <!-- Panel 2: Campo Táctico + Banquillo -->
                    <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
                        <div class="tactical-pitch-container" style="width:100%; height:460px; position:relative; overflow:hidden; border:3px solid rgba(255,255,255,0.4); border-radius:8px; background:linear-gradient(180deg, #0a331a 0%, #062211 50%, #0a331a 100%); box-shadow:0 0 20px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.5);">
                            <div class="tactical-pitch-grass" style="position:absolute; inset:0;">
                                <div class="pitch-line center-line" style="position:absolute; top:50%; left:0; right:0; height:2px; background:rgba(255,255,255,0.35);"></div>
                                <div class="pitch-line center-circle" style="position:absolute; top:50%; left:50%; width:80px; height:80px; transform:translate(-50%, -50%); border:2px solid rgba(255,255,255,0.35); border-radius:50%;"></div>
                                <div class="pitch-line penalty-area-top" style="position:absolute; top:0; left:50%; width:56%; height:16%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.35); border-top:none;"></div>
                                <div class="pitch-line penalty-area-bottom" style="position:absolute; bottom:0; left:50%; width:56%; height:16%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.35); border-bottom:none;"></div>
                                <div class="pitch-line goal-top" style="position:absolute; top:0; left:50%; width:26%; height:6%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.35); border-top:none;"></div>
                                <div class="pitch-line goal-bottom" style="position:absolute; bottom:0; left:50%; width:26%; height:6%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.35); border-bottom:none;"></div>
                                
                                <div class="pitch-slots-grid" style="display:grid; grid-template-rows:repeat(4, 1fr); grid-template-columns:repeat(3, 1fr); height:100%; padding:10px; box-sizing:border-box; position:relative; z-index:2;">
                                    ${pitchSlotsHtml}
                                </div>
                            </div>
                        </div>

                        <!-- Banquillo -->
                        <div class="glass-card" style="padding:10px; border:1px solid var(--border-color); background:rgba(0,0,0,0.3);">
                            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.05em; text-align:center;">
                                Banquillo
                            </div>
                            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px;">
                                ${benchSlotsHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Panel 3: Stats Acumuladas del 7 Titular -->
                    <div class="glass-card" style="padding:14px; border:1px solid var(--border-color);">
                        <div style="font-size:0.82rem; font-weight:800; color:var(--text-main); text-transform:uppercase; margin-bottom:12px; letter-spacing:0.05em; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                            Stats 7 Titular (${starterCount}/7)
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div class="stat-box" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:8px; text-align:center; border-radius:4px;">
                                <div style="font-size:1.5rem; font-weight:800; color:#ffffff; font-family:var(--font-mono);">${totalStarterGoals}</div>
                                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Goles Totales</div>
                            </div>

                            <div class="stat-box" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:8px; text-align:center; border-radius:4px;">
                                <div style="font-size:1.3rem; font-weight:800; color:#ffffff; font-family:var(--font-mono);">${totalStarterAssists}</div>
                                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Asistencias</div>
                            </div>

                            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px;">
                                <div class="stat-box" style="background:rgba(255,179,0,0.08); border:1px solid #ffb300; padding:10px 2px; text-align:center; border-radius:4px;">
                                    <div style="font-size:1.25rem; font-weight:800; color:#ffb300; font-family:var(--font-mono);">${totalStarterYellows}</div>
                                </div>

                                <div class="stat-box" style="background:rgba(255,68,68,0.08); border:1px solid #ff4444; padding:10px 2px; text-align:center; border-radius:4px;">
                                    <div style="font-size:1.25rem; font-weight:800; color:#ff4444; font-family:var(--font-mono);">${totalStarterReds}</div>
                                </div>

                                <div class="stat-box" style="background:rgba(0,176,255,0.08); border:1px solid #00b0ff; padding:10px 2px; text-align:center; border-radius:4px;">
                                    <div style="font-size:1.25rem; font-weight:800; color:#00b0ff; font-family:var(--font-mono);">${totalStarterBlues}</div>
                                </div>
                            </div>

                            <div class="stat-box" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:8px; text-align:center; border-radius:4px;">
                                <div style="font-size:1.2rem; font-weight:800; color:#ffffff; font-family:var(--font-mono);">${avgStarterAge > 0 ? avgStarterAge + ' años' : '-'}</div>
                                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Edad Media</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    bindEvents() {
        if (!AuthService.isAdmin()) return;

        // Botón Vaciar Posiciones
        const btnReset = document.getElementById('btn-reset-lineup');
        if (btnReset) {
            btnReset.onclick = () => {
                Object.keys(this.lineup).forEach(k => this.lineup[k] = null);
                state.notify();
            };
        }

        // Selección de Formación
        document.querySelectorAll('.formation-btn[data-formation]').forEach(btn => {
            btn.onclick = () => {
                this.activeFormation = btn.getAttribute('data-formation');
                state.notify();
            };
        });

        // Eventos Drag & Drop de jugadores
        document.querySelectorAll('.drag-player-card[draggable="true"]').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                const pid = parseInt(card.getAttribute('data-player-id'));
                this.draggedPlayerId = pid;
                e.dataTransfer.setData('text/plain', pid);
            });
        });

        // Eventos Drop en slots del campo y banquillo
        document.querySelectorAll('.pitch-slot, .bench-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const slotId = slot.getAttribute('data-slot-id');
                const pid = this.draggedPlayerId || parseInt(e.dataTransfer.getData('text/plain'));

                if (slotId && pid) {
                    // Remover de cualquier otra posición previa
                    Object.keys(this.lineup).forEach(k => {
                        if (this.lineup[k] === pid) this.lineup[k] = null;
                    });
                    this.lineup[slotId] = pid;
                    this.draggedPlayerId = null;
                    state.notify();
                }
            });

            // Clic directo para remover o interactuar
            slot.addEventListener('click', () => {
                const slotId = slot.getAttribute('data-slot-id');
                if (slotId && this.lineup[slotId]) {
                    this.lineup[slotId] = null;
                    state.notify();
                }
            });
        });
    }
};
