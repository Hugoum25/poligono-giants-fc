/* ==========================================
   FC HUB - GENERADOR DE IMÁGENES PARA REDES SOCIALES (IG)
   PESTAÑAS: CONVOCATORIA & RESULTADO (EXCLUSIVO ADMINISTRADORES)
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
    activeIgTab: "convocatoria", // "convocatoria" | "resultado"
    activeFormation: "3-2-1", // 3-2-1, 2-3-1, 2-2-2, 3-1-2
    matchTitle: "vs. Sporting La Camocha F7",
    competitionTitle: "Liga F7 Gijón - Jornada 12",
    matchDateTime: "Sábado 18:00h | Campo Municipal La Camocha",
    selectedSlotForSwap: null,

    // Estado del resultado
    resultScoreLocal: 3,
    resultScoreVisitor: 1,
    resultScorers: {
        6: 2, // Rubén Montes 2 goles
        7: 1  // Rodrigo Cuesta 1 gol
    },

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
                { id: "mid1", label: "BANDA.IZQ", row: 2, col: 1 },
                { id: "def3", label: "PIVOTE", row: 2, col: 2 },
                { id: "mid2", label: "BANDA.DER", row: 2, col: 3 },
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
                { id: "def1", label: "CARR.IZQ", row: 3, col: 1 },
                { id: "def2", label: "CENTRAL", row: 3, col: 2 },
                { id: "def3", label: "CARR.DER", row: 3, col: 3 },
                { id: "mid1", label: "MEDIO", row: 2, col: 2 },
                { id: "mid2", label: "DEL.IZQ", row: 1, col: 1 },
                { id: "fwd1", label: "DEL.DER", row: 1, col: 3 }
            ]
        };
    },

    autoFillStarter() {
        const available = [...teamData.players];
        const assigned = new Set();

        const findByPos = (keyword) => {
            const found = available.find(p => !assigned.has(p.id) && p.position && p.position.toLowerCase().includes(keyword.toLowerCase()));
            if (found) assigned.add(found.id);
            return found ? found.id : null;
        };

        this.lineup.gk = findByPos('Portero') || available[0]?.id || null;
        this.lineup.def1 = findByPos('Defensa') || findByPos('Cierre') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.def1) assigned.add(this.lineup.def1);

        this.lineup.def2 = findByPos('Defensa') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.def2) assigned.add(this.lineup.def2);

        this.lineup.def3 = findByPos('Defensa') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.def3) assigned.add(this.lineup.def3);

        this.lineup.mid1 = findByPos('Medio') || findByPos('Ala') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.mid1) assigned.add(this.lineup.mid1);

        this.lineup.mid2 = findByPos('Medio') || findByPos('Ala') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.mid2) assigned.add(this.lineup.mid2);

        this.lineup.fwd1 = findByPos('Delantero') || findByPos('Pívot') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.fwd1) assigned.add(this.lineup.fwd1);

        // Suplentes
        const benchKeys = ['bench1', 'bench2', 'bench3', 'bench4', 'bench5'];
        benchKeys.forEach(k => {
            const nextP = available.find(p => !assigned.has(p.id));
            if (nextP) {
                this.lineup[k] = nextP.id;
                assigned.add(nextP.id);
            } else {
                this.lineup[k] = null;
            }
        });
    },

    assignPlayer(playerId) {
        if (Object.values(this.lineup).includes(playerId)) return;
        const keys = ['gk', 'def1', 'def2', 'def3', 'mid1', 'mid2', 'fwd1', 'bench1', 'bench2', 'bench3', 'bench4', 'bench5'];
        const emptyKey = keys.find(k => !this.lineup[k]);
        if (emptyKey) {
            this.lineup[emptyKey] = playerId;
        }
    },

    unassignPlayer(playerId) {
        Object.keys(this.lineup).forEach(k => {
            if (this.lineup[k] === playerId) {
                this.lineup[k] = null;
            }
        });
    },

    render() {
        if (!AuthService.isAdmin()) {
            return `
                <div class="container" style="padding-top:60px; padding-bottom:60px; text-align:center;">
                    <div class="glass-card" style="max-width:480px; margin:0 auto; padding:40px 24px; border:1px solid rgba(255,68,68,0.3);">
                        <div style="font-size:3rem; margin-bottom:12px;">🔒</div>
                        <h2 style="font-size:1.4rem; color:#ff4444; margin-bottom:8px; font-family:var(--font-heading);">Acceso Restringido</h2>
                        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">
                            Esta sección de generación de carteles para redes sociales (IG) está reservada para administradores del club.
                        </p>
                    </div>
                </div>
            `;
        }

        // Obtener lista completa de equipos rivales de la liga
        const defaultTeams = [
            "Gijón United",
            "Desatascos Pelayo",
            "Aston Birra",
            "Mesón el Refugio",
            "Casa Toni",
            "Galácticos F7",
            "Sporting La Camocha F7",
            "La Calzada F7",
            "Inter Gijón",
            "Rayo Gijonés",
            "Atlético Cimavilla"
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

        // Renderizado del contenido según la pestaña activa (CONVOCATORIA o RESULTADO)
        let tabContentHtml = '';

        if (this.activeIgTab === 'convocatoria') {
            const assignedPlayerIds = Object.values(this.lineup).filter(Boolean);
            const currentSlots = this.getFormations()[this.activeFormation] || this.getFormations()["3-2-1"];

            const sortedPlayers = [...teamData.players].sort((a, b) => a.number - b.number);
            const checkboxListHtml = sortedPlayers.map(p => {
                const isChecked = assignedPlayerIds.includes(p.id);
                let slotBadge = '';
                if (isChecked) {
                    const slotKey = Object.keys(this.lineup).find(k => this.lineup[k] === p.id);
                    if (slotKey && slotKey.startsWith('bench')) {
                        slotBadge = 'Suplente';
                    } else {
                        slotBadge = 'Titular';
                    }
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

            const pitchSlotsHtml = currentSlots.map(slot => {
                const assignedPlayerId = this.lineup[slot.id];
                const player = assignedPlayerId ? teamData.players.find(p => p.id === assignedPlayerId) : null;
                const isSelectedForSwap = this.selectedSlotForSwap === slot.id;

                return `
                    <div class="pitch-slot ${player ? 'occupied' : 'empty'}" 
                         draggable="${!!player}"
                         data-slot-id="${slot.id}"
                         style="grid-row:${slot.row}; grid-column:${slot.col}; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; cursor:pointer;">
                        
                        <div style="width:50px; height:50px; border-radius:50%; background:${isSelectedForSwap ? 'rgba(255,42,133,0.6)' : (player ? 'rgba(255,42,133,0.25)' : 'rgba(0,0,0,0.5)')}; border:3px solid ${isSelectedForSwap ? '#ffffff' : (player ? 'var(--club-primary)' : 'rgba(255,255,255,0.4)')}; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:${isSelectedForSwap ? '0 0 10px rgba(255,255,255,0.6)' : '0 0 10px rgba(0,0,0,0.5)'}; position:relative; transform:${isSelectedForSwap ? 'scale(1.15)' : 'scale(1)'}; transition:all 0.2s ease;">
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

            const benchSlotsConfig = [
                { id: "bench1" }, { id: "bench2" }, { id: "bench3" }, { id: "bench4" }, { id: "bench5" }
            ];

            const benchSlotsHtml = benchSlotsConfig.map(bench => {
                const assignedPlayerId = this.lineup[bench.id];
                const player = assignedPlayerId ? teamData.players.find(p => p.id === assignedPlayerId) : null;
                const isSelectedForSwap = this.selectedSlotForSwap === bench.id;

                return `
                    <div class="bench-slot ${player ? 'occupied' : 'empty'}" 
                         draggable="${!!player}"
                         data-slot-id="${bench.id}"
                         style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; cursor:pointer;">
                        
                        <div style="width:38px; height:38px; border-radius:50%; background:${isSelectedForSwap ? 'rgba(255,42,133,0.6)' : (player ? 'rgba(255,42,133,0.2)' : 'rgba(0,0,0,0.4)')}; border:${isSelectedForSwap ? '2px solid #ffffff' : (player ? '1.5px solid var(--club-primary)' : 'rgba(255,255,255,0.3)')}; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; transform:${isSelectedForSwap ? 'scale(1.15)' : 'scale(1)'}; box-shadow:${isSelectedForSwap ? '0 0 10px rgba(255,255,255,0.6)' : 'none'}; transition:all 0.2s ease;">
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

            tabContentHtml = `
                <div class="social-lineup-layout">
                    <!-- COLUMNA IZQUIERDA: CONTROLES Y CHECKBOXES -->
                    <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
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

                        <div class="glass-card" style="padding:12px; border:1px solid var(--border-color);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div style="font-size:0.78rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; letter-spacing:0.05em;">
                                    Convocatoria
                                </div>
                                <div style="font-size:0.72rem; font-weight:800; color:var(--text-main); font-family:var(--font-mono);">
                                    ${assignedPlayerIds.length}/12 Elegidos
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:6px; max-height:380px; overflow-y:auto; padding-right:2px;">
                                ${checkboxListHtml}
                            </div>
                        </div>
                    </div>

                    <!-- COLUMNA DERECHA: CARTEL CONVOCATORIA -->
                    <div style="display:flex; justify-content:center; width:100%;">
                        <div id="social-lineup-card" style="width:100%; max-width:540px; background:linear-gradient(135deg, #0d0e15 0%, #161824 100%); border:2px solid var(--club-primary); border-radius:12px; padding:18px; box-shadow:none; position:relative; overflow:hidden; font-family:var(--font-heading); box-sizing:border-box;">
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); opacity:0.04; user-select:none; pointer-events:none; z-index:0;">
                                ${ClubLogo.render(380)}
                            </div>

                            <div style="position:relative; z-index:2; border-bottom:2px solid rgba(255,42,133,0.3); padding-bottom:12px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; gap:12px;">
                                <div style="display:flex; align-items:center; gap:8px; flex:1;">
                                    ${ClubLogo.render(42)}
                                    <div style="text-align:left;">
                                        <div style="font-size:1.05rem; font-weight:900; color:var(--club-primary); letter-spacing:0.03em; line-height:1.1;">POLÍGONO GIANTS F7</div>
                                        <div style="font-size:0.7rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; margin-top:2px;">${jornadaText}</div>
                                    </div>
                                </div>

                                <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end;">
                                    <div style="font-size:0.82rem; font-weight:900; color:#fff; text-transform:uppercase; background:var(--club-primary); padding:2px 8px; border-radius:4px; display:inline-block; letter-spacing:0.05em;">CONVOCATORIA</div>
                                    <div style="font-size:1.05rem; color:#ffffff; font-weight:900; text-transform:uppercase; margin-top:4px; letter-spacing:0.02em; display:flex; align-items:center; gap:6px;">
                                        <span style="background:rgba(255,42,133,0.2); border:1.5px solid var(--club-primary); color:var(--club-primary); font-weight:900; font-size:0.75rem; font-style:italic; padding:1px 6px; border-radius:12px; display:inline-block; flex-shrink:0;">VS</span>
                                        <span>${opponentName}</span>
                                    </div>
                                </div>
                            </div>

                            <div style="position:relative; z-index:2; width:100%; height:380px; border-radius:8px; overflow:hidden; border:2px solid rgba(255,255,255,0.25); background:linear-gradient(180deg, #092e17 0%, #051a0d 50%, #092e17 100%); box-shadow:inset 0 0 25px rgba(0,0,0,0.8);">
                                <div style="position:absolute; top:50%; left:0; right:0; height:2px; background:rgba(255,255,255,0.25);"></div>
                                <div style="position:absolute; top:50%; left:50%; width:80px; height:80px; transform:translate(-50%, -50%); border:2px solid rgba(255,255,255,0.25); border-radius:50%;"></div>
                                <div style="position:absolute; top:0; left:50%; width:56%; height:16%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.25); border-top:none;"></div>
                                <div style="position:absolute; bottom:0; left:50%; width:56%; height:16%; transform:translateX(-50%); border:2px solid rgba(255,255,255,0.25); border-bottom:none;"></div>

                                <div style="display:grid; grid-template-rows:repeat(4, 1fr); grid-template-columns:repeat(3, 1fr); height:100%; padding:10px; box-sizing:border-box; position:relative; z-index:3;">
                                    ${pitchSlotsHtml}
                                </div>
                            </div>

                            <div style="position:relative; z-index:2; margin-top:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:8px 10px;">
                                <div style="font-size:0.68rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; text-align:center;">
                                    SUPLENTES / BANQUILLO
                                </div>
                                <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px;">
                                    ${benchSlotsHtml}
                                </div>
                            </div>

                            <div style="position:relative; z-index:2; margin-top:10px; border-top:1px solid rgba(255,42,133,0.25); padding-top:8px; display:flex; flex-direction:column; gap:6px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.65rem; color:var(--text-muted);">
                                    <span style="font-weight:700; color:var(--text-main);">${this.matchDateTime}</span>
                                    <span style="font-weight:900; color:var(--club-primary); letter-spacing:0.04em;">#PoligonoGiants</span>
                                </div>

                                <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 2px; gap:8px; flex-wrap:nowrap; overflow:hidden;">
                                    ${SponsorJaviFrey.render(22)}
                                    ${SponsorMambaShaved.render(22)}
                                    ${SponsorBambi.render(22)}
                                    ${SponsorLaBaseTattoo.render(22)}
                                    ${SponsorTrmSports.render(22)}
                                    ${SponsorSohoBar.render(22)}
                                    ${SponsorPastur.render(22)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="max-width:1080px; margin:24px auto 0 auto; text-align:center;">
                    <button class="btn btn-primary" id="btn-download-social-card" style="font-size:1rem; padding:12px 36px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; box-shadow:none;">
                        Generar Convocatoria
                    </button>
                </div>
            `;
        } else {
            // Pestaña RESULTADO
            const resultStatus = this.resultScoreLocal > this.resultScoreVisitor 
                ? { label: 'VICTORIA 🟢', color: '#00e676' }
                : (this.resultScoreLocal === this.resultScoreVisitor 
                    ? { label: 'EMPATE 🟡', color: '#ffb300' }
                    : { label: 'DERROTA 🔴', color: '#ff1744' });

            const sortedPlayers = [...teamData.players].sort((a, b) => a.number - b.number);
            const scorersControlHtml = sortedPlayers.map(p => {
                const goalsCount = this.resultScorers[p.id] || 0;
                return `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:4px 6px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:4px; font-size:0.75rem;">
                        <span style="font-weight:700; color:#fff;">#${p.number} ${p.name}</span>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <button class="btn-scorer-minus btn btn-secondary" data-player-id="${p.id}" style="padding:1px 6px; font-size:0.7rem; font-weight:800;">-</button>
                            <span style="font-weight:900; font-family:var(--font-mono); color:${goalsCount > 0 ? 'var(--club-primary)' : 'var(--text-muted)'}; min-width:14px; text-align:center;">${goalsCount}</span>
                            <button class="btn-scorer-plus btn btn-secondary" data-player-id="${p.id}" style="padding:1px 6px; font-size:0.7rem; font-weight:800;">+</button>
                        </div>
                    </div>
                `;
            }).join('');

            // Lista formateada de goleadores para la tarjeta
            const scorersListForCard = Object.keys(this.resultScorers).filter(id => this.resultScorers[id] > 0).map(id => {
                const player = teamData.players.find(p => p.id === parseInt(id));
                const goals = this.resultScorers[id];
                if (!player) return null;
                return `
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.85rem; color:#ffffff; font-weight:800;">
                        <span>⚽</span>
                        <span style="color:var(--club-primary); font-family:var(--font-mono);">#${player.number}</span>
                        <span>${player.name}</span>
                        ${goals > 1 ? `<span style="background:rgba(255,42,133,0.3); border:1px solid var(--club-primary); color:#fff; font-size:0.7rem; padding:1px 6px; border-radius:10px;">(${goals})</span>` : ''}
                    </div>
                `;
            }).filter(Boolean);

            tabContentHtml = `
                <div class="social-lineup-layout">
                    <!-- COLUMNA IZQUIERDA: CONTROLES DEL RESULTADO -->
                    <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
                        <div class="glass-card" style="padding:14px; border:1px solid var(--border-color);">
                            <div style="font-size:0.8rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; margin-bottom:10px; letter-spacing:0.05em;">
                                Configuración del Resultado
                            </div>

                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <div>
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">Rival (Equipo de la Liga)</label>
                                    <select id="select-result-opponent" class="form-input" style="width:100%; padding:6px 8px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;">
                                        ${opponentOptionsHtml}
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">Jornada de la Liga</label>
                                    <select id="select-result-jornada" class="form-input" style="width:100%; padding:6px 8px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;">
                                        ${jornadaOptionsHtml}
                                    </select>
                                </div>

                                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-top:4px;">
                                    <div>
                                        <label style="font-size:0.7rem; color:var(--club-primary); font-weight:800; display:block; margin-bottom:2px;">Goles Polígono Giants</label>
                                        <input type="number" id="input-result-score-local" class="form-input" min="0" max="99" style="width:100%; padding:8px; font-size:1.1rem; font-weight:900; text-align:center; background:var(--bg-dark); border:1px solid var(--club-primary); color:#fff; border-radius:4px; box-sizing:border-box;" value="${this.resultScoreLocal}">
                                    </div>
                                    <div>
                                        <label style="font-size:0.7rem; color:var(--text-muted); font-weight:800; display:block; margin-bottom:2px;">Goles Rival</label>
                                        <input type="number" id="input-result-score-visitor" class="form-input" min="0" max="99" style="width:100%; padding:8px; font-size:1.1rem; font-weight:900; text-align:center; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; border-radius:4px; box-sizing:border-box;" value="${this.resultScoreVisitor}">
                                    </div>
                                </div>

                                <div style="margin-top:4px;">
                                    <label style="font-size:0.7rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:2px;">Fecha, Hora y Campo</label>
                                    <input type="text" id="input-result-datetime" class="form-input" style="width:100%; padding:6px 8px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${this.matchDateTime}">
                                </div>
                            </div>
                        </div>

                        <!-- Panel Goleadores del Partido -->
                        <div class="glass-card" style="padding:12px; border:1px solid var(--border-color);">
                            <div style="font-size:0.78rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">
                                Goleadores del Partido
                            </div>
                            <div style="display:flex; flex-direction:column; gap:4px; max-height:280px; overflow-y:auto; padding-right:2px;">
                                ${scorersControlHtml}
                            </div>
                        </div>
                    </div>

                    <!-- COLUMNA DERECHA: CARTEL OFICIAL DE RESULTADO -->
                    <div style="display:flex; justify-content:center; width:100%;">
                        <div id="social-result-card" style="width:100%; max-width:540px; background:linear-gradient(135deg, #0d0e15 0%, #161824 100%); border:2px solid var(--club-primary); border-radius:12px; padding:22px; position:relative; overflow:hidden; font-family:var(--font-heading); box-sizing:border-box; min-height:480px; display:flex; flex-direction:column; justify-space-between;">
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); opacity:0.05; user-select:none; pointer-events:none; z-index:0;">
                                ${ClubLogo.render(380)}
                            </div>

                            <!-- CABECERA -->
                            <div style="position:relative; z-index:2; border-bottom:2px solid rgba(255,42,133,0.3); padding-bottom:12px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; gap:12px;">
                                <div style="display:flex; align-items:center; gap:8px; flex:1;">
                                    ${ClubLogo.render(42)}
                                    <div style="text-align:left;">
                                        <div style="font-size:1.05rem; font-weight:900; color:var(--club-primary); letter-spacing:0.03em; line-height:1.1;">POLÍGONO GIANTS F7</div>
                                        <div style="font-size:0.7rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; margin-top:2px;">${jornadaText}</div>
                                    </div>
                                </div>

                                <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end;">
                                    <div style="font-size:0.82rem; font-weight:900; color:#fff; text-transform:uppercase; background:var(--club-primary); padding:2px 8px; border-radius:4px; display:inline-block; letter-spacing:0.05em;">RESULTADO</div>
                                    <div style="font-size:1.05rem; color:#ffffff; font-weight:900; text-transform:uppercase; margin-top:4px; letter-spacing:0.02em; display:flex; align-items:center; gap:6px;">
                                        <span style="background:rgba(255,42,133,0.2); border:1.5px solid var(--club-primary); color:var(--club-primary); font-weight:900; font-size:0.75rem; font-style:italic; padding:1px 6px; border-radius:12px; display:inline-block; flex-shrink:0;">VS</span>
                                        <span>${opponentName}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- MARCADOR PRINCIPAL GIGANTE -->
                            <div style="position:relative; z-index:2; background:rgba(0,0,0,0.5); border:1.5px solid var(--border-color); border-radius:10px; padding:24px 16px; margin-bottom:18px; text-align:center;">
                                <div style="display:inline-block; padding:3px 12px; border-radius:12px; background:rgba(255,255,255,0.06); font-size:0.75rem; font-weight:900; color:${resultStatus.color}; letter-spacing:0.06em; margin-bottom:12px; border:1px solid ${resultStatus.color};">
                                    ${resultStatus.label}
                                </div>

                                <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
                                    <div style="flex:1; text-align:right;">
                                        <div style="font-size:0.95rem; font-weight:900; color:var(--club-primary); text-transform:uppercase;">POLÍGONO GIANTS</div>
                                    </div>
                                    <div style="font-size:3.2rem; font-weight:900; font-family:var(--font-mono); color:#ffffff; line-height:1; display:flex; align-items:center; gap:10px; background:rgba(255,42,133,0.15); padding:6px 20px; border-radius:8px; border:1px solid var(--club-primary);">
                                        <span>${this.resultScoreLocal}</span>
                                        <span style="color:var(--club-primary); font-size:2.4rem;">:</span>
                                        <span>${this.resultScoreVisitor}</span>
                                    </div>
                                    <div style="flex:1; text-align:left;">
                                        <div style="font-size:0.95rem; font-weight:900; color:#ffffff; text-transform:uppercase;">${opponentName}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- SECCIÓN DE GOLEADORES DEL PARTIDO -->
                            <div style="position:relative; z-index:2; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:14px; margin-bottom:16px; flex-grow:1;">
                                <div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:4px;">
                                    ⚽ GOLEADORES DE POLÍGONO GIANTS F7
                                </div>
                                <div style="display:flex; flex-direction:column; gap:6px;">
                                    ${scorersListForCard.length > 0 
                                        ? scorersListForCard.join('')
                                        : `<div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">Sin goles registrados para este encuentro.</div>`
                                    }
                                </div>
                            </div>

                            <!-- PIE DE PÁGINA Y PATROCINADORES -->
                            <div style="position:relative; z-index:2; border-top:1px solid rgba(255,42,133,0.25); padding-top:8px; display:flex; flex-direction:column; gap:6px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.65rem; color:var(--text-muted);">
                                    <span style="font-weight:700; color:var(--text-main);">${this.matchDateTime}</span>
                                    <span style="font-weight:900; color:var(--club-primary); letter-spacing:0.04em;">#PoligonoGiants</span>
                                </div>

                                <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 2px; gap:8px; flex-wrap:nowrap; overflow:hidden;">
                                    ${SponsorJaviFrey.render(22)}
                                    ${SponsorMambaShaved.render(22)}
                                    ${SponsorBambi.render(22)}
                                    ${SponsorLaBaseTattoo.render(22)}
                                    ${SponsorTrmSports.render(22)}
                                    ${SponsorSohoBar.render(22)}
                                    ${SponsorPastur.render(22)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="max-width:1080px; margin:24px auto 0 auto; text-align:center;">
                    <button class="btn btn-primary" id="btn-download-social-card" style="font-size:1rem; padding:12px 36px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; box-shadow:none;">
                        Generar Resultado
                    </button>
                </div>
            `;
        }

        return `
            <div class="container" style="padding-top:24px; padding-bottom:80px;">
                
                <!-- SELECTOR DE SUB-PESTAÑAS: CONVOCATORIA vs RESULTADO -->
                <div class="squad-filters" style="margin-bottom:24px; display:flex; justify-content:center; gap:12px;">
                    <button class="filter-btn ${this.activeIgTab === 'convocatoria' ? 'active' : ''}" id="ig-subtab-convocatoria" style="font-size:0.9rem; padding:8px 20px; font-weight:800;">
                        📋 CONVOCATORIA
                    </button>
                    <button class="filter-btn ${this.activeIgTab === 'resultado' ? 'active' : ''}" id="ig-subtab-resultado" style="font-size:0.9rem; padding:8px 20px; font-weight:800;">
                        ⚽ RESULTADO
                    </button>
                </div>

                ${tabContentHtml}
            </div>
        `;
    },

    bindEvents() {
        if (!AuthService.isAdmin()) return;

        // Eventos de Pestañas Superiores (CONVOCATORIA / RESULTADO)
        const btnTabConvocatoria = document.getElementById('ig-subtab-convocatoria');
        const btnTabResultado = document.getElementById('ig-subtab-resultado');

        if (btnTabConvocatoria) {
            btnTabConvocatoria.onclick = () => {
                this.activeIgTab = "convocatoria";
                state.notify();
            };
        }
        if (btnTabResultado) {
            btnTabResultado.onclick = () => {
                this.activeIgTab = "resultado";
                state.notify();
            };
        }

        // --- EVENTOS PESTAÑA CONVOCATORIA ---
        if (this.activeIgTab === 'convocatoria') {
            const selectOpponent = document.getElementById('select-opponent');
            if (selectOpponent) {
                selectOpponent.onchange = (e) => {
                    this.selectedOpponent = e.target.value;
                    this.matchTitle = "vs. " + e.target.value;
                    state.notify();
                };
            }

            const selectJornada = document.getElementById('select-jornada');
            if (selectJornada) {
                selectJornada.onchange = (e) => {
                    this.selectedJornada = e.target.value;
                    this.competitionTitle = "Liga F7 Gijón - " + e.target.value;
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

            const btnAutoFill = document.getElementById('btn-autofill-lineup');
            if (btnAutoFill) {
                btnAutoFill.onclick = () => {
                    this.autoFillStarter();
                    state.notify();
                };
            }

            const btnReset = document.getElementById('btn-reset-lineup');
            if (btnReset) {
                btnReset.onclick = () => {
                    Object.keys(this.lineup).forEach(k => this.lineup[k] = null);
                    state.notify();
                };
            }

            document.querySelectorAll('.formation-btn[data-formation]').forEach(btn => {
                btn.onclick = () => {
                    this.activeFormation = btn.getAttribute('data-formation');
                    state.notify();
                };
            });

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

            // Sustitución por Clic (Click-to-Swap) y Drag & Drop
            let draggedSourceSlotId = null;

            document.querySelectorAll('.pitch-slot, .bench-slot').forEach(slot => {
                const slotId = slot.getAttribute('data-slot-id');

                slot.addEventListener('click', (e) => {
                    if (!this.selectedSlotForSwap) {
                        if (this.lineup[slotId]) {
                            this.selectedSlotForSwap = slotId;
                            state.notify();
                        }
                    } else if (this.selectedSlotForSwap === slotId) {
                        this.selectedSlotForSwap = null;
                        state.notify();
                    } else {
                        const sourceSlot = this.selectedSlotForSwap;
                        const targetSlot = slotId;

                        const temp = this.lineup[sourceSlot];
                        this.lineup[sourceSlot] = this.lineup[targetSlot];
                        this.lineup[targetSlot] = temp;

                        this.selectedSlotForSwap = null;
                        state.notify();
                    }
                });

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
                        const temp = this.lineup[sourceSlotId];
                        this.lineup[sourceSlotId] = this.lineup[targetSlotId];
                        this.lineup[targetSlotId] = temp;

                        draggedSourceSlotId = null;
                        this.selectedSlotForSwap = null;
                        state.notify();
                    }
                });
            });
        }

        // --- EVENTOS PESTAÑA RESULTADO ---
        if (this.activeIgTab === 'resultado') {
            const selectResOpponent = document.getElementById('select-result-opponent');
            if (selectResOpponent) {
                selectResOpponent.onchange = (e) => {
                    this.selectedOpponent = e.target.value;
                    this.matchTitle = "vs. " + e.target.value;
                    state.notify();
                };
            }

            const selectResJornada = document.getElementById('select-result-jornada');
            if (selectResJornada) {
                selectResJornada.onchange = (e) => {
                    this.selectedJornada = e.target.value;
                    this.competitionTitle = "Liga F7 Gijón - " + e.target.value;
                    state.notify();
                };
            }

            const inputResLocal = document.getElementById('input-result-score-local');
            if (inputResLocal) {
                inputResLocal.oninput = (e) => {
                    this.resultScoreLocal = Math.max(0, parseInt(e.target.value) || 0);
                    state.notify();
                };
            }

            const inputResVisitor = document.getElementById('input-result-score-visitor');
            if (inputResVisitor) {
                inputResVisitor.oninput = (e) => {
                    this.resultScoreVisitor = Math.max(0, parseInt(e.target.value) || 0);
                    state.notify();
                };
            }

            const inputResDateTime = document.getElementById('input-result-datetime');
            if (inputResDateTime) {
                inputResDateTime.oninput = (e) => {
                    this.matchDateTime = e.target.value;
                    state.notify();
                };
            }

            // Goleadores (+ / -)
            document.querySelectorAll('.btn-scorer-plus').forEach(btn => {
                btn.onclick = () => {
                    const pid = parseInt(btn.getAttribute('data-player-id'));
                    this.resultScorers[pid] = (this.resultScorers[pid] || 0) + 1;
                    state.notify();
                };
            });

            document.querySelectorAll('.btn-scorer-minus').forEach(btn => {
                btn.onclick = () => {
                    const pid = parseInt(btn.getAttribute('data-player-id'));
                    if (this.resultScorers[pid] > 0) {
                        this.resultScorers[pid]--;
                        if (this.resultScorers[pid] === 0) delete this.resultScorers[pid];
                        state.notify();
                    }
                };
            });
        }

        // --- BOTÓN COMÚN DESCARGAR IMAGEN HD ---
        const btnDownload = document.getElementById('btn-download-social-card');
        if (btnDownload) {
            btnDownload.onclick = () => {
                const targetCardId = this.activeIgTab === 'resultado' ? 'social-result-card' : 'social-lineup-card';
                const cardEl = document.getElementById(targetCardId);
                if (!cardEl) return;

                if (typeof window.html2canvas !== 'function') {
                    alert("La librería de exportación de imagen aún está cargando. Por favor, reintenta en un momento.");
                    return;
                }

                const actionLabel = this.activeIgTab === 'resultado' ? 'Resultado' : 'Convocatoria';
                btnDownload.innerText = `Generando ${actionLabel}...`;
                btnDownload.disabled = true;

                window.html2canvas(cardEl, {
                    scale: 2.5,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `${actionLabel}_Poligono_Giants_${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    btnDownload.innerText = `Generar ${actionLabel}`;
                    btnDownload.disabled = false;
                }).catch(err => {
                    console.error("Error al exportar imagen:", err);
                    alert("No se pudo generar la imagen. Intenta de nuevo.");
                    btnDownload.innerText = `Generar ${actionLabel}`;
                    btnDownload.disabled = false;
                });
            };
        }
    }
};
