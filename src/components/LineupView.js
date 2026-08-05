/* ==========================================
   FC HUB - GENERADOR DE CARTEL DE ALINEACIÓN PARA REDES SOCIALES (IG)
   SELECCIÓN MEDIANTE CHECKBOXES (EXCLUSIVO ADMINISTRADORES)
   ========================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';
import { ClubLogo } from './ClubLogo.js';
import { SponsorJaviFrey } from './SponsorJaviFrey.js';
import { SponsorMambaShaved } from './SponsorMambaShaved.js';
import { SponsorBambi } from './SponsorBambi.js';
import { SponsorLaBaseTattoo } from './SponsorLaBaseTattoo.js';
import { SponsorTrmSports } from './SponsorTrmSports.js';
import { SponsorSohoBar } from './SponsorSohoBar.js';
import { SponsorPastur } from './SponsorPastur.js';

export const LineupView = {
    activeFormation: "3-2-1", // 3-2-1, 2-3-1, 2-2-2, 3-1-2
    matchTitle: "vs. Sporting La Camocha F7",
    competitionTitle: "Liga F7 Gijón - Jornada 12",
    matchDateTime: "Sábado 18:00h | Campo Municipal La Camocha",

    lineup: {
        gk: 1,      // Miguel #13
        def1: 2,    // Javier Chimeno #12
        def2: 3,    // Hugo Uría #2
        def3: 4,    // Enol #4
        mid1: 5,    // Dario Álvarez #8
        mid2: 6,    // Rubén Montes #10
        fwd1: 7,    // Rodrigo Cuesta #9
        bench1: 8,
        bench2: 9,
        bench3: 10,
        bench4: 11,
        bench5: 12
    },

    getFormations() {
        return {
            "3-2-1": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "CARR.IZQ", row: 3, col: 1 },
                { id: "def2", label: "CENTRAL", row: 3, col: 2 },
                { id: "def3", label: "CARR.DER", row: 3, col: 3 },
                { id: "mid1", label: "MEDIO", row: 2, col: 1 },
                { id: "mid2", label: "MEDIO", row: 2, col: 3 },
                { id: "fwd1", label: "DELANTERO", row: 1, col: 2 }
            ],
            "2-3-1": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1 },
                { id: "def2", label: "DEF.DER", row: 3, col: 3 },
                { id: "mid1", label: "CARR.IZQ", row: 2, col: 1 },
                { id: "def3", label: "MEDIO", row: 2, col: 2 },
                { id: "mid2", label: "CARR.DER", row: 2, col: 3 },
                { id: "fwd1", label: "DELANTERO", row: 1, col: 2 }
            ],
            "2-2-2": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1 },
                { id: "def2", label: "DEF.DER", row: 3, col: 3 },
                { id: "mid1", label: "MED.IZQ", row: 2, col: 1 },
                { id: "mid2", label: "MED.DER", row: 2, col: 3 },
                { id: "def3", label: "DEL.IZQ", row: 1, col: 1 },
                { id: "fwd1", label: "DEL.DER", row: 1, col: 3 }
            ],
            "3-1-2": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1 },
                { id: "def2", label: "CENTRAL", row: 3, col: 2 },
                { id: "def3", label: "DEF.DER", row: 3, col: 3 },
                { id: "mid1", label: "PIVOTE", row: 2, col: 2 },
                { id: "mid2", label: "DEL.IZQ", row: 1, col: 1 },
                { id: "fwd1", label: "DEL.DER", row: 1, col: 3 }
            ]
        };
    },

    assignPlayer(playerId) {
        // Asigna un jugador al primer slot disponible
        const player = teamData.players.find(p => p.id === playerId);
        if (!player) return;

        // Lista de ranuras en orden de prioridad
        const starterSlots = ["gk", "def1", "def2", "def3", "mid1", "mid2", "fwd1"];
        const benchSlots = ["bench1", "bench2", "bench3", "bench4", "bench5"];

        // Si es portero y la portería está libre, va a la portería
        if (player.position.includes('Portero') && !this.lineup.gk) {
            this.lineup.gk = playerId;
            return;
        }

        // Buscar ranura libre en titulares
        for (const slot of starterSlots) {
            if (!this.lineup[slot]) {
                this.lineup[slot] = playerId;
                return;
            }
        }

        // Buscar ranura libre en suplentes
        for (const slot of benchSlots) {
            if (!this.lineup[slot]) {
                this.lineup[slot] = playerId;
                return;
            }
        }
    },

    unassignPlayer(playerId) {
        Object.keys(this.lineup).forEach(key => {
            if (this.lineup[key] === playerId) {
                this.lineup[key] = null;
            }
        });
    },

    autoFillStarter() {
        Object.keys(this.lineup).forEach(k => this.lineup[k] = null);
        const players = teamData.players;
        const slots = ["gk", "def1", "def2", "def3", "mid1", "mid2", "fwd1", "bench1", "bench2", "bench3", "bench4", "bench5"];
        slots.forEach((slot, idx) => {
            if (players[idx]) {
                this.lineup[slot] = players[idx].id;
            }
        });
    },

    render() {
        const isAdmin = AuthService.isAdmin();

        if (!isAdmin) {
            return `
                <div class="container" style="padding-top:60px; padding-bottom:80px; text-align:center;">
                    <div class="glass-card" style="max-width:500px; margin:0 auto; padding:32px; border:1px solid var(--border-color);">
                        <div style="font-size:3rem; margin-bottom:12px;">🔒</div>
                        <h3 style="font-size:1.4rem; color:var(--club-primary); margin-bottom:8px; font-family:var(--font-heading);">
                            Acceso Restringido a Administradores
                        </h3>
                        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5;">
                            El <strong>Generador de Carteles para IG</strong> es una herramienta exclusiva del cuerpo técnico y administradores del Polígono Giants FC.
                        </p>
                    </div>
                </div>
            `;
        }

        const currentSlots = this.getFormations()[this.activeFormation];
        const assignedPlayerIds = Object.values(this.lineup).filter(Boolean);

        // Lista de jugadores con Checkboxes
        const checkboxListHtml = teamData.players.map(p => {
            const assignedSlotKey = Object.keys(this.lineup).find(k => this.lineup[k] === p.id);
            const isChecked = !!assignedSlotKey;
            let slotBadge = '';
            if (assignedSlotKey) {
                slotBadge = assignedSlotKey.startsWith('bench') ? 'Suplente' : 'Titular';
            }

            return `
                <label class="player-checkbox-row" style="display:flex; align-items:center; gap:6px; padding:5px 6px; border-radius:4px; font-size:0.75rem; background:${isChecked ? 'rgba(255,42,133,0.15)' : 'rgba(255,255,255,0.02)'}; border:1px solid ${isChecked ? 'var(--club-primary)' : 'rgba(255,255,255,0.08)'}; cursor:pointer; user-select:none; transition:all 0.15s ease;">
                    <input type="checkbox" class="lineup-player-checkbox" data-player-id="${p.id}" ${isChecked ? 'checked' : ''} style="accent-color:var(--club-primary); width:14px; height:14px; cursor:pointer;" />
                    <span style="font-weight:800; font-family:var(--font-mono); color:${isChecked ? 'var(--club-primary)' : 'var(--text-muted)'}; min-width:16px;">#${p.number}</span>
                    <span style="font-weight:700; color:#fff; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</span>
                    ${isChecked ? `<span style="font-size:0.58rem; font-weight:800; padding:1px 4px; border-radius:3px; background:${slotBadge === 'Titular' ? 'var(--club-primary)' : 'rgba(255,255,255,0.2)'}; color:#fff;">${slotBadge === 'Titular' ? 'T' : 'S'}</span>` : ''}
                </label>
            `;
        }).join('');

        // Slots en el campo (7 Titulares)
        const pitchSlotsHtml = currentSlots.map(slot => {
            const assignedPlayerId = this.lineup[slot.id];
            const player = assignedPlayerId ? teamData.players.find(p => p.id === assignedPlayerId) : null;

            return `
                <div class="pitch-slot ${player ? 'occupied' : 'empty'}" 
                     draggable="${!!player}"
                     data-slot-id="${slot.id}"
                     style="grid-row:${slot.row}; grid-column:${slot.col}; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; cursor:pointer;">
                    
                    <div style="width:50px; height:50px; border-radius:50%; background:${player ? 'rgba(255,42,133,0.25)' : 'rgba(0,0,0,0.5)'}; border:2px solid ${player ? 'var(--club-primary)' : 'rgba(255,255,255,0.4)'}; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 0 15px rgba(0,0,0,0.6); position:relative;">
                        ${player 
                            ? (player.photo 
                                ? `<img src="${player.photo}" style="width:100%; height:100%; object-fit:cover;" />`
                                : `<span style="font-size:1.6rem;">${player.position.includes('Portero') ? '🧤' : '👤'}</span>`)
                            : `<span style="font-size:0.7rem; font-weight:800; color:rgba(255,255,255,0.6);">${slot.label}</span>`
                        }
                    </div>
                    
                    ${player ? `
                        <div style="background:var(--club-primary); color:#fff; font-family:var(--font-mono); font-weight:900; font-size:0.65rem; padding:1px 5px; border-radius:10px; margin-top:-6px; z-index:3; border:1px solid #fff; box-shadow:0 2px 4px rgba(0,0,0,0.5);">
                            ${player.number}
                        </div>
                        <div style="font-size:0.75rem; font-weight:800; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.9); margin-top:2px; text-transform:uppercase; max-width:85px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-family:var(--font-heading);">
                            ${player.name.split(' ')[0]}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Suplentes (Banquillo)
        const benchSlotsConfig = [
            { id: "bench1" }, { id: "bench2" }, { id: "bench3" }, { id: "bench4" }, { id: "bench5" }
        ];

        const benchSlotsHtml = benchSlotsConfig.map(bench => {
            const assignedPlayerId = this.lineup[bench.id];
            const player = assignedPlayerId ? teamData.players.find(p => p.id === assignedPlayerId) : null;

            return `
                <div class="bench-slot ${player ? 'occupied' : 'empty'}" 
                     draggable="${!!player}"
                     data-slot-id="${bench.id}"
                     style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; cursor:pointer;">
                    
                    <div style="width:38px; height:38px; border-radius:50%; background:${player ? 'rgba(255,42,133,0.2)' : 'rgba(0,0,0,0.4)'}; border:1.5px solid ${player ? 'var(--club-primary)' : 'rgba(255,255,255,0.3)'}; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative;">
                        ${player 
                            ? (player.photo 
                                ? `<img src="${player.photo}" style="width:100%; height:100%; object-fit:cover;" />`
                                : `<span style="font-size:1.1rem;">👤</span>`)
                            : `<span style="font-size:0.75rem; color:rgba(255,255,255,0.4);">+</span>`
                        }
                    </div>
                    <div style="font-size:0.65rem; font-weight:800; color:#fff; text-shadow:0 1px 3px #000; margin-top:2px; text-transform:uppercase; max-width:65px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${player ? `#${player.number} ${player.name.split(' ')[0]}` : 'Suplente'}
                    </div>
                </div>
            `;
        }).join('');

        // Obtener lista completa de equipos rivales de la liga
        const defaultTeams = [
            "Gijón United",
            "Desatascos Pelayo",
            "Aston Birra",
            "Mesón el Refugio",
            "Casa Toni",
            "Samara FC",
            "Puntolab",
            "Leyendas Retiradas",
            "El Equipo A",
            "Monos del Norte",
            "Monsters United",
            "Chatarrería Cebrián",
            "Sporting La Camocha F7"
        ];

        const allOpponents = Array.from(new Set([
            ...defaultTeams,
            ...(teamData.matches || []).map(m => m.opponent).filter(Boolean)
        ])).sort();

        const opponentOptionsHtml = allOpponents.map(team => {
            const isSelected = this.selectedOpponent ? (this.selectedOpponent === team) : (this.matchTitle.includes(team));
            return `<option value="${team}" ${isSelected ? 'selected' : ''}>vs. ${team}</option>`;
        }).join('');

        const jornadaList = Array.from({ length: 26 }, (_, i) => `Jornada ${i + 1}`);
        const currentJornadaVal = this.selectedJornada || (this.competitionTitle.replace(/^Liga\s*F7\s*Gijón\s*-\s*/i, '').trim()) || 'Jornada 12';

        const jornadaOptionsHtml = jornadaList.map(j => {
            const isSel = currentJornadaVal.toLowerCase() === j.toLowerCase();
            return `<option value="${j}" ${isSel ? 'selected' : ''}>${j}</option>`;
        }).join('');

        const opponentName = (this.selectedOpponent || this.matchTitle.replace(/^vs\.\s*/i, '')).trim();
        const jornadaText = currentJornadaVal;

        return `
            <div class="container" style="padding-top:24px; padding-bottom:80px;">
                
                <div class="social-lineup-layout">
                    
                    <!-- COLUMNA IZQUIERDA: CONTROLES Y LISTA CON CHECKBOXES -->
                    <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
                        
                        <!-- Panel de Datos del Partido -->
                        <div class="glass-card" style="padding:14px; border:1px solid var(--border-color);">
                            <div style="font-size:0.8rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; margin-bottom:10px; letter-spacing:0.05em;">
                                Datos del Partido
                            </div>

                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <div>
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">Rival (Equipo de la Liga)</label>
                                    <select id="select-opponent" class="form-input" style="width:100%; padding:6px 8px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;">
                                        ${opponentOptionsHtml}
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">Jornada de la Liga</label>
                                    <select id="select-jornada" class="form-input" style="width:100%; padding:6px 8px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;">
                                        ${jornadaOptionsHtml}
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">Fecha, Hora y Campo</label>
                                    <input type="text" id="input-datetime" class="form-input" style="width:100%; padding:6px 8px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${this.matchDateTime}">
                                </div>

                                <div style="margin-top:4px;">
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Formación Táctica</label>
                                    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:4px;">
                                        <button class="formation-btn ${this.activeFormation === '3-2-1' ? 'active' : ''}" data-formation="3-2-1" style="font-size:0.75rem; padding:4px;">3-2-1</button>
                                        <button class="formation-btn ${this.activeFormation === '2-3-1' ? 'active' : ''}" data-formation="2-3-1" style="font-size:0.75rem; padding:4px;">2-3-1</button>
                                        <button class="formation-btn ${this.activeFormation === '2-2-2' ? 'active' : ''}" data-formation="2-2-2" style="font-size:0.75rem; padding:4px;">2-2-2</button>
                                        <button class="formation-btn ${this.activeFormation === '3-1-2' ? 'active' : ''}" data-formation="3-1-2" style="font-size:0.75rem; padding:4px;">3-1-2</button>
                                    </div>
                                </div>

                                <div style="display:flex; gap:6px; margin-top:8px;">
                                    <button class="btn btn-secondary" id="btn-autofill-lineup" style="flex:1; font-size:0.72rem; padding:6px;">⚡ Seleccionar 12</button>
                                    <button class="btn btn-secondary" id="btn-reset-lineup" style="flex:1; font-size:0.72rem; padding:6px;">🗑️ Desmarcar Todo</button>
                                </div>
                            </div>
                        </div>

                        <!-- Panel de Selección de Jugadores con Checkboxes -->
                        <div class="glass-card" style="padding:12px; border:1px solid var(--border-color);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div style="font-size:0.78rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; letter-spacing:0.05em;">
                                    Convocatoria
                                </div>
                                <div style="font-size:0.72rem; font-weight:800; color:var(--text-main); font-family:var(--font-mono);">
                                    ${assignedPlayerIds.length}/12 Elegidos
                                </div>
                            </div>
                            
                            <!-- Lista de Jugadores con Checkboxes en 2 Columnas -->
                            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:6px; max-height:380px; overflow-y:auto; padding-right:2px;">
                                ${checkboxListHtml}
                            </div>
                        </div>
                    </div>

                    <!-- COLUMNA DERECHA: CARTEL OFICIAL DE REDES SOCIALES (EXPORTABLE A IMAGEN PNG) -->
                    <div style="display:flex; justify-content:center; width:100%;">
                        <div id="social-lineup-card" style="width:100%; max-width:540px; background:linear-gradient(135deg, #0d0e15 0%, #161824 100%); border:2px solid var(--club-primary); border-radius:12px; padding:18px; box-shadow:0 0 35px rgba(255,42,133,0.3); position:relative; overflow:hidden; font-family:var(--font-heading); box-sizing:border-box;">
                            
                            <!-- MARCA DE AGUA DE FONDO CON ESCUDO -->
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); opacity:0.04; user-select:none; pointer-events:none; z-index:0;">
                                ${ClubLogo.render(380)}
                            </div>

                            <!-- CABECERA DEL CARTEL SOCIAL -->
                            <div style="position:relative; z-index:2; border-bottom:2px solid rgba(255,42,133,0.3); padding-bottom:12px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; gap:8px;">
                                <!-- EQUIPO LOCAL: POLÍGONO GIANTS F7 -->
                                <div style="display:flex; align-items:center; gap:8px; flex:1;">
                                    ${ClubLogo.render(42)}
                                    <div style="text-align:left;">
                                        <div style="font-size:1.05rem; font-weight:900; color:var(--club-primary); letter-spacing:0.03em; line-height:1.1;">POLÍGONO GIANTS F7</div>
                                        <div style="font-size:0.7rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; margin-top:2px;">${jornadaText}</div>
                                    </div>
                                </div>

                                <!-- ELEMENTO VS CENTRADO -->
                                <div style="background:rgba(255,42,133,0.2); border:1.5px solid var(--club-primary); color:var(--club-primary); font-weight:900; font-size:0.85rem; font-style:italic; padding:3px 9px; border-radius:20px; text-shadow:0 0 10px rgba(255,42,133,0.8); user-select:none; flex-shrink:0;">
                                    VS
                                </div>

                                <!-- EQUIPO RIVAL + BADGE CONVOCATORIA -->
                                <div style="text-align:right; flex:1;">
                                    <div style="font-size:0.82rem; font-weight:900; color:#fff; text-transform:uppercase; background:var(--club-primary); padding:2px 8px; border-radius:4px; display:inline-block; letter-spacing:0.05em;">CONVOCATORIA</div>
                                    <div style="font-size:1.05rem; color:#ffffff; font-weight:900; text-transform:uppercase; margin-top:4px; letter-spacing:0.02em;">${opponentName}</div>
                                </div>
                            </div>

                            <!-- TERRENO DE JUEGO TÁCTICO CON JUGADORES TITULARES -->
                            <div style="position:relative; z-index:2; width:100%; height:380px; border-radius:8px; overflow:hidden; border:2px solid rgba(255,255,255,0.25); background:linear-gradient(180deg, #092e17 0%, #051a0d 50%, #092e17 100%); box-shadow:inset 0 0 25px rgba(0,0,0,0.8);">
                                <!-- LÍNEAS DEL CAMPO -->
                                <div style="position:absolute; top:50%; left:0; right:0; height:2px; background:rgba(255,255,255,0.25);"></div>
                                <div style="position:absolute; top:50%; left:50%; width:80px; height:80px; transform:translate(-50%, -50%); border:2px solid rgba(255,255,255,0.25); border-radius:50%;"></div>
                                <div style="position:absolute; top:0; left:50%; width:56%; height:16%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.25); border-top:none;"></div>
                                <div style="position:absolute; bottom:0; left:50%; width:56%; height:16%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.25); border-bottom:none;"></div>

                                <!-- RETÍCULA DE JUGADORES -->
                                <div style="display:grid; grid-template-rows:repeat(4, 1fr); grid-template-columns:repeat(3, 1fr); height:100%; padding:10px; box-sizing:border-box; position:relative; z-index:3;">
                                    ${pitchSlotsHtml}
                                </div>
                            </div>

                            <!-- BANQUILLO / SUPLENTES -->
                            <div style="position:relative; z-index:2; margin-top:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:8px 10px;">
                                <div style="font-size:0.68rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; text-align:center;">
                                    SUPLENTES / BANQUILLO
                                </div>
                                <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px;">
                                    ${benchSlotsHtml}
                                </div>
                            </div>

                            <!-- PIE DE PAGINA CON FECHA, HASHTAG Y LOGOS DE PATROCINADORES EN FILA -->
                            <div style="position:relative; z-index:2; margin-top:10px; border-top:1px solid rgba(255,42,133,0.25); padding-top:8px; display:flex; flex-direction:column; gap:6px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.65rem; color:var(--text-muted);">
                                    <span style="font-weight:700; color:var(--text-main);">${this.matchDateTime}</span>
                                    <span style="font-weight:900; color:var(--club-primary); letter-spacing:0.04em;">#PoligonoGiants</span>
                                </div>

                                <!-- TIRA DE PATROCINADORES OFICIALES EN FILA -->
                                <div style="display:flex; justify-content:space-around; align-items:center; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:6px 8px; gap:6px; flex-wrap:nowrap; overflow:hidden;">
                                    ${SponsorJaviFrey.render(18)}
                                    ${SponsorMambaShaved.render(18)}
                                    ${SponsorBambi.render(18)}
                                    ${SponsorLaBaseTattoo.render(18)}
                                    ${SponsorTrmSports.render(18)}
                                    ${SponsorSohoBar.render(18)}
                                    ${SponsorPastur.render(18)}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- BOTÓN GENERAR CONVOCATORIA (ABAJO DEL TODO, SIN ICONO) -->
                <div style="max-width:1080px; margin:24px auto 0 auto; text-align:center;">
                    <button class="btn btn-primary" id="btn-download-social-card" style="font-size:1rem; padding:12px 36px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; box-shadow:0 0 25px rgba(var(--club-primary-rgb),0.5);">
                        Generar Convocatoria
                    </button>
                </div>
            </div>
        `;
    },

    bindEvents() {
        if (!AuthService.isAdmin()) return;

        // Selector de Rival desde lista desplegable de la liga
        const selectOpponent = document.getElementById('select-opponent');
        if (selectOpponent) {
            selectOpponent.onchange = (e) => {
                this.selectedOpponent = e.target.value;
                this.matchTitle = "vs. " + e.target.value;
                state.notify();
            };
        }

        // Selector de Jornada de la Liga
        const selectJornada = document.getElementById('select-jornada');
        if (selectJornada) {
            selectJornada.onchange = (e) => {
                this.selectedJornada = e.target.value;
                this.competitionTitle = "Liga F7 Gijón - " + e.target.value;
                state.notify();
            };
        }

        const inputComp = document.getElementById('input-comp-title');
        if (inputComp) {
            inputComp.oninput = (e) => {
                this.competitionTitle = e.target.value;
                state.notify();
            };
        }

        const inputDateTime = document.getElementById('input-datetime');
        if (inputDateTime) {
            inputDateTime.oninput = (e) => {
                this.matchDateTime = e.target.value;
                state.notify();
            };
        }

        // Botón Seleccionar 12
        const btnAutoFill = document.getElementById('btn-autofill-lineup');
        if (btnAutoFill) {
            btnAutoFill.onclick = () => {
                this.autoFillStarter();
                state.notify();
            };
        }

        // Botón Desmarcar Todo
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

        // Evento cambio de Checkboxes de jugadores
        document.querySelectorAll('.lineup-player-checkbox').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const pid = parseInt(chk.getAttribute('data-player-id'));
                if (e.target.checked) {
                    this.assignPlayer(pid);
                } else {
                    this.unassignPlayer(pid);
                }
                state.notify();
            });
        });

        // Eventos Drag & Drop entre posiciones del campo y banquillo (Intercambiar / Sustituir posiciones)
        let draggedSourceSlotId = null;

        document.querySelectorAll('.pitch-slot, .bench-slot').forEach(slot => {
            const slotId = slot.getAttribute('data-slot-id');

            slot.addEventListener('dragstart', (e) => {
                if (this.lineup[slotId]) {
                    draggedSourceSlotId = slotId;
                    e.dataTransfer.setData('text/plain', slotId);
                    e.dataTransfer.effectAllowed = 'move';
                }
            });

            slot.addEventListener('dragover', (e) => {
                if (draggedSourceSlotId) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                }
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const sourceSlotId = draggedSourceSlotId || e.dataTransfer.getData('text/plain');
                const targetSlotId = slot.getAttribute('data-slot-id');

                if (sourceSlotId && targetSlotId && sourceSlotId !== targetSlotId) {
                    // Intercambiar jugadores entre ranuras
                    const temp = this.lineup[sourceSlotId];
                    this.lineup[sourceSlotId] = this.lineup[targetSlotId];
                    this.lineup[targetSlotId] = temp;

                    draggedSourceSlotId = null;
                    state.notify();
                }
            });
        });

        // Botón Descargar Imagen para Redes Sociales
        const btnDownload = document.getElementById('btn-download-social-card');
        if (btnDownload) {
            btnDownload.onclick = () => {
                const cardEl = document.getElementById('social-lineup-card');
                if (!cardEl) return;

                if (typeof window.html2canvas !== 'function') {
                    alert("La librería de exportación de imagen aún está cargando. Por favor, reintenta en un momento.");
                    return;
                }

                btnDownload.innerText = "Generando Convocatoria...";
                btnDownload.disabled = true;

                window.html2canvas(cardEl, {
                    scale: 2.5,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `Convocatoria_Poligono_Giants_${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    btnDownload.innerText = "Generar Convocatoria";
                    btnDownload.disabled = false;
                }).catch(err => {
                    console.error("Error al exportar imagen:", err);
                    alert("No se pudo generar la imagen. Intenta de nuevo.");
                    btnDownload.innerText = "Generar Convocatoria";
                    btnDownload.disabled = false;
                });
            };
        }
    }
};
