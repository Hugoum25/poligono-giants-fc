/* ==========================================
   FC HUB - VISTA DE PLANTILLA Y ALINEACIÓN FAVORITA (1-3-2-1 DRAG & DROP)
   ========================================== */

import { state } from '../state.js';
import { teamData, savePlayersToStorage } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { AuthService } from '../services/authService.js';

export const SquadView = {
    activeFilter: "todos", // todos, porteros, defensas, carrileros, medios, delanteros
    activeFormation: "3-2-1", // 3-2-1, 2-3-1, 2-2-2
    modalStatsTab: "temporada", // temporada, historico
    draggedPlayerId: null, // ID del jugador que se está arrastrando
    
    // Alineación táctica
    lineup: {
        por: 1,     // Miguel #13
        car_izq: 5, // Hugo Uría #2
        cen: 2,     // Javier Chimeno #12
        car_der: 6, // Enol #4
        mc_izq: 11, // Dario Álvarez #8
        mc_der: 12, // Rubén Montes #10
        del: 17     // Rodrigo Cuesta #9
    },

    getSlotsConfig() {
        if (this.activeFormation === '2-3-1') {
            return [
                { id: "por",     label: "POR",     name: "Portero",             gridPos: "grid-area: 4 / 2 / 5 / 3;" },
                { id: "def_izq", label: "DEF-IZQ", name: "Defensa Izquierdo",   gridPos: "grid-area: 3 / 1 / 4 / 2;" },
                { id: "def_der", label: "DEF-DER", name: "Defensa Derecho",     gridPos: "grid-area: 3 / 3 / 4 / 4;" },
                { id: "mc_izq",  label: "MI",      name: "Medio Izquierdo",     gridPos: "grid-area: 2 / 1 / 3 / 2;" },
                { id: "mc_cen",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 2 / 3 / 3;" },
                { id: "mc_der",  label: "MD",      name: "Medio Derecho",       gridPos: "grid-area: 2 / 3 / 3 / 4;" },
                { id: "del",     label: "DEL",     name: "Delantero Centro",    gridPos: "grid-area: 1 / 2 / 2 / 3;" }
            ];
        } else if (this.activeFormation === '2-2-2') {
            return [
                { id: "por",     label: "POR",     name: "Portero",             gridPos: "grid-area: 4 / 2 / 5 / 3;" },
                { id: "def_izq", label: "DEF-IZQ", name: "Defensa Izquierdo",   gridPos: "grid-area: 3 / 1 / 4 / 2;" },
                { id: "def_der", label: "DEF-DER", name: "Defensa Derecho",     gridPos: "grid-area: 3 / 3 / 4 / 4;" },
                { id: "mc_izq",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 1 / 3 / 2; transform: translateX(20px);" },
                { id: "mc_der",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 3 / 3 / 4; transform: translateX(-20px);" },
                { id: "del_izq", label: "DEL",     name: "Delantero",           gridPos: "grid-area: 1 / 1 / 2 / 2; transform: translateX(22px);" },
                { id: "del_der", label: "DEL",     name: "Delantero",           gridPos: "grid-area: 1 / 3 / 2 / 4; transform: translateX(-22px);" }
            ];
        } else {
            // Default: 3-2-1
            return [
                { id: "por",     label: "POR",     name: "Portero",             gridPos: "grid-area: 4 / 2 / 5 / 3;" },
                { id: "car_izq", label: "CAR-IZQ", name: "Carrilero Izquierdo", gridPos: "grid-area: 3 / 1 / 4 / 2;" },
                { id: "cen",     label: "CENTRAL", name: "Defensa Central",     gridPos: "grid-area: 3 / 2 / 4 / 3;" },
                { id: "car_der", label: "CAR-DER", name: "Carrilero Derecho",   gridPos: "grid-area: 3 / 3 / 4 / 4;" },
                { id: "mc_izq",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 1 / 3 / 2; transform: translateX(20px);" },
                { id: "mc_der",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 3 / 3 / 4; transform: translateX(-20px);" },
                { id: "del",     label: "DEL",     name: "Delantero Centro",    gridPos: "grid-area: 1 / 2 / 2 / 3;" }
            ];
        }
    },

    render() {
        const isAdmin = AuthService.isAdmin();

        // Ordenar todos los jugadores por dorsal
        const sortedAllPlayers = [...teamData.players].sort((a, b) => a.number - b.number);

        // Filtrar jugadores
        const filteredPlayers = sortedAllPlayers.filter(player => {
            if (this.activeFilter === "todos") return true;
            return player.category === this.activeFilter;
        });

        // HTML de tarjetas de jugadores amplias con estadísticas visibles
        const playersHtml = filteredPlayers.map(p => {
            const st = p.stats || { matches: 0, goals: 0, assists: 0 };
            return `
                <div class="glass-card player-card-compact" data-player-id="${p.id}" style="padding:10px 12px; cursor:pointer; display:flex; align-items:center; gap:10px; border-radius:6px; background:rgba(0,0,0,0.35); border:1px solid var(--border-color); position:relative; transition:all 0.2s ease;">
                    ${p.photo 
                        ? `<div style="width:44px; height:44px; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:visible;">
                             <img src="${p.photo}" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5));" />
                           </div>` 
                        : `<div style="width:38px; height:38px; border-radius:50%; background:rgba(255,42,133,0.15); border:1.5px solid var(--club-primary); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
                             ${p.position.includes('Portero') ? '🧤' : '👤'}
                           </div>`
                    }

                    <div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center;">
                        <div class="player-card-name" style="font-size:0.88rem; font-weight:800; color:var(--text-main); line-height:1.2;">
                            ${p.name}
                        </div>
                        ${p.nickname ? `<div class="player-card-nickname" style="font-size:0.7rem; color:var(--club-primary); font-weight:700; font-style:italic;">"${p.nickname}"</div>` : ''}
                    </div>

                    <div style="font-size:1.8rem; font-family:'VT323', var(--font-mono); font-weight:800; color:var(--club-primary); flex-shrink:0; line-height:1; letter-spacing:0.04em;">
                        ${p.number}
                    </div>

                    ${isAdmin ? `
                        <button class="btn-quick-edit-player" data-player-id="${p.id}" title="Editar Jugador y Stats" style="background:rgba(255,42,133,0.15); border:1px solid var(--club-primary); color:#ffffff; border-radius:4px; padding:3px 5px; font-size:0.7rem; cursor:pointer; flex-shrink:0;">
                            ✏️
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Lista de IDs asignados en el terreno de juego
        const assignedPlayerIds = Object.values(this.lineup);

        // HTML lista arrastrable a la izquierda
        const dragListHtml = sortedAllPlayers.map(p => {
            const isAssigned = assignedPlayerIds.includes(p.id);
            return `
                <div class="drag-player-item ${isAssigned ? 'assigned' : ''}" 
                     draggable="true" 
                     data-player-id="${p.id}"
                     title="Arrastra a ${p.name} ${p.nickname ? `("${p.nickname}")` : ''} al campo">
                    <span class="drag-player-num">#${p.number}</span>
                    <span class="drag-player-name">${p.name}</span>
                    ${isAssigned ? '<span class="drag-check-badge">✓</span>' : ''}
                </div>
            `;
        }).join('');

        // Slots dinámicos según formación elegida
        const slotsConfig = this.getSlotsConfig();

        // Construir slots del campo de fútbol (Solo Icono, Número y Nombre Centrado)
        const pitchSlotsHtml = slotsConfig.map(slot => {
            const assignedPlayerId = this.lineup[slot.id];
            const player = teamData.players.find(p => p.id === assignedPlayerId);

            return `
                <div class="pitch-slot ${player ? 'has-player' : 'empty'}" data-slot-id="${slot.id}" style="${slot.gridPos}">
                    <div class="pitch-player-badge">
                        <span class="pitch-user-icon">👤</span>
                        <span class="pitch-player-number">${player ? `#${player.number}` : '?'}</span>
                    </div>
                    <div class="pitch-player-name" style="text-align:center; width:100%; display:block; margin:2px auto 0 auto;">${player ? player.name : 'Arrastrar'}</div>
                </div>
            `;
        }).join('');

        // 5 Slots de Suplentes para el Banquillo (Solo Icono, Número y Nombre Suplente Centrado)
        const benchSlotsConfig = [
            { id: "supl_1" },
            { id: "supl_2" },
            { id: "supl_3" },
            { id: "supl_4" },
            { id: "supl_5" }
        ];

        const benchSlotsHtml = benchSlotsConfig.map(slot => {
            const assignedPlayerId = this.lineup[slot.id];
            const player = teamData.players.find(p => p.id === assignedPlayerId);

            return `
                <div class="pitch-slot ${player ? 'has-player' : 'empty'}" data-slot-id="${slot.id}" style="height:58px; padding:4px 2px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <div class="pitch-player-badge" style="transform:none; margin:0 auto; position:relative;">
                        <span class="pitch-user-icon" style="font-size:1.1rem;">👤</span>
                        <span class="pitch-player-number" style="font-size:0.6rem; bottom:-2px; right:-2px; padding:1px 3px;">${player ? `#${player.number}` : '?'}</span>
                    </div>
                    <div class="pitch-player-name" style="font-size:0.65rem; margin-top:2px; max-width:65px; text-align:center; margin-left:auto; margin-right:auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${player ? player.name : 'Suplente'}</div>
                </div>
            `;
        }).join('');

        // Estadísticas acumuladas ÚNICAMENTE del 7 Titular colocado en las posiciones del campo
        const starterPlayerIds = slotsConfig.map(slot => this.lineup[slot.id]).filter(Boolean);
        const starterPlayers = starterPlayerIds
            .map(id => teamData.players.find(p => p.id === id))
            .filter(Boolean);

        // Generar Clasificación / Ranking de Jugadores
        const sortedPlayersForRanking = [...teamData.players].sort((a, b) => {
            const aStats = a.stats || {};
            const bStats = b.stats || {};
            const aTotal = (aStats.goals || 0) + (aStats.assists || 0);
            const bTotal = (bStats.goals || 0) + (bStats.assists || 0);
            const aCards = (aStats.yellowCards || 0) + (aStats.redCards || 0) + (aStats.blueCards || 0);
            const bCards = (bStats.yellowCards || 0) + (bStats.redCards || 0) + (bStats.blueCards || 0);

            if (this.rankingTab === 'name') {
                return a.name.localeCompare(b.name);
            } else if (this.rankingTab === 'matches') {
                return (bStats.matches || 0) - (aStats.matches || 0);
            } else if (this.rankingTab === 'goles') {
                return (bStats.goals || 0) - (aStats.goals || 0) || (bStats.assists || 0) - (aStats.assists || 0);
            } else if (this.rankingTab === 'asistencias') {
                return (bStats.assists || 0) - (aStats.assists || 0) || (bStats.goals || 0) - (aStats.goals || 0);
            } else if (this.rankingTab === 'mvp') {
                return (bStats.mvp || 0) - (aStats.mvp || 0) || (bStats.goals || 0) - (aStats.goals || 0);
            } else if (this.rankingTab === 'tarjetas') {
                return bCards - aCards;
            } else if (this.rankingTab === 'pos') {
                return a.number - b.number;
            } else { // 'total'
                return bTotal - aTotal || (bStats.goals || 0) - (aStats.goals || 0);
            }
        });

        const rankingRowsHtml = sortedPlayersForRanking.map((p, idx) => {
            const rank = idx + 1;
            const badge = `${rank}`;
            const rankColor = rank === 1 ? '#ffb300' : rank === 2 ? '#e0e0e0' : rank === 3 ? '#cd7f32' : 'var(--text-muted)';
            const st = p.stats || { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0 };
            const totalGPlusA = (st.goals || 0) + (st.assists || 0);

            return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:8px 3px; text-align:center; font-weight:800; font-family:var(--font-mono); color:${rankColor}; width:36px;">
                        ${badge}
                    </td>
                    <td style="padding:8px 8px; font-weight:700; white-space:nowrap;">
                        <span style="color:var(--text-main); font-size:0.85rem;">${p.name}</span>
                    </td>
                    <td style="padding:8px 4px; text-align:center; font-family:var(--font-mono);">${st.matches || 0}</td>
                    <td style="padding:8px 4px; text-align:center; font-family:var(--font-mono); font-weight:800; color:#00e676;">${st.goals || 0}</td>
                    <td style="padding:8px 4px; text-align:center; font-family:var(--font-mono); font-weight:800; color:#00b0ff;">${st.assists || 0}</td>
                    <td style="padding:8px 4px; text-align:center; font-family:var(--font-mono); font-weight:800; color:#ffd700;">${st.mvp || 0}</td>
                    <td style="padding:8px 4px; text-align:center; font-family:var(--font-mono); font-size:0.78rem; font-weight:800;">
                        <span style="color:#ffb300; margin-right:5px;">${st.yellowCards || 0}</span>
                        <span style="color:#00b0ff; margin-right:5px;">${st.blueCards || 0}</span>
                        <span style="color:#ff4444;">${st.redCards || 0}</span>
                    </td>
                    <td style="padding:8px 4px; text-align:center; font-family:var(--font-mono); font-weight:800; color:var(--club-primary); font-size:0.95rem;">
                        ${totalGPlusA}
                    </td>
                </tr>
            `;
        }).join('');

        // Modal de jugador individual
        let modalHtml = '';
        if (state.selectedPlayerId !== null) {
            const player = teamData.players.find(p => p.id === state.selectedPlayerId);
            if (player) {
                const mainStats = [
                    { key: 'matches', label: 'Partidos' },
                    { key: 'goals', label: 'Goles' },
                    { key: 'assists', label: 'Asistencias' }
                ];

                const cardStats = [
                    { key: 'yellowCards', label: 'Amarillas' },
                    { key: 'redCards', label: 'Rojas' },
                    { key: 'blueCards', label: 'Azules' }
                ];

                const outcomeStats = [
                    { key: 'wins', label: 'Victorias' },
                    { key: 'draws', label: 'Empates' },
                    { key: 'losses', label: 'Derrotas' }
                ];

                let mainBoxesHtml = '';
                mainStats.forEach(item => {
                    const val = player.stats ? (player.stats[item.key] || 0) : 0;
                    mainBoxesHtml += `
                        <div class="stat-box">
                            <div class="stat-val">${val}</div>
                            <div class="stat-label">${item.label}</div>
                        </div>
                    `;
                });

                let cardBoxesHtml = '';
                cardStats.forEach(item => {
                    const val = player.stats ? (player.stats[item.key] || 0) : 0;
                    cardBoxesHtml += `
                        <div class="stat-box">
                            <div class="stat-val">${val}</div>
                            <div class="stat-label">${item.label}</div>
                        </div>
                    `;
                });

                const mvpVal = player.stats ? (player.stats.mvp || 0) : 0;
                const pMatches = player.stats ? (player.stats.matches || 0) : 0;
                const pGoals = player.stats ? (player.stats.goals || 0) : 0;
                const pAssists = player.stats ? (player.stats.assists || 0) : 0;
                const goalsPerMatch = pMatches > 0 ? (pGoals / pMatches).toFixed(2) : "0.00";
                const assistsPerMatch = pMatches > 0 ? (pAssists / pMatches).toFixed(2) : "0.00";

                let outcomeBoxesHtml = '';
                outcomeStats.forEach(item => {
                    const val = player.stats ? (player.stats[item.key] || 0) : 0;
                    outcomeBoxesHtml += `
                        <div class="stat-box">
                            <div class="stat-val">${val}</div>
                            <div class="stat-label">${item.label}</div>
                        </div>
                    `;
                });

                // Datos Históricos Acumulados
                const histStats = player.historicalStats || {
                    matches: (player.stats?.matches || 0) + 36,
                    goals: (player.stats?.goals || 0) + (player.number === 9 ? 42 : player.number === 10 ? 18 : Math.floor((player.stats?.goals || 0) * 3)),
                    assists: (player.stats?.assists || 0) + (player.number === 2 ? 31 : player.number === 10 ? 24 : Math.floor((player.stats?.assists || 0) * 3)),
                    mvp: (player.stats?.mvp || 0) + (player.number === 9 ? 8 : player.number === 10 ? 6 : 3),
                    seasons: player.info?.seasons || 3,
                    titles: player.number === 9 ? "Copa F7 + Bota Oro" : "Copa F7 Gijón"
                };

                const hMatches = histStats.matches || 0;
                const hGoalsPerMatch = hMatches > 0 ? ((histStats.goals || 0) / hMatches).toFixed(2) : "0.00";
                const hAssistsPerMatch = hMatches > 0 ? ((histStats.assists || 0) / hMatches).toFixed(2) : "0.00";

                const isTempActive = (this.modalStatsTab || 'temporada') === 'temporada';

                modalHtml = `
                    <div class="modal-overlay active" id="player-modal-overlay">
                        <div class="glass-card player-modal" style="max-width:680px; position:relative; overflow:hidden;">
                            <!-- NÚMERO GIGANTE OCUPANDO TODA LA TARJETA COMPLETA DE FONDO -->
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:32rem; font-family:'VT323', var(--font-mono); font-weight:900; color:rgba(255,42,133,0.15); user-select:none; pointer-events:none; z-index:0; line-height:0.7; white-space:nowrap; letter-spacing:-0.05em; text-align:center;">
                                ${player.number}
                            </div>

                            <button class="modal-close" id="close-modal-btn" style="z-index:10;">✕</button>
                            <div class="modal-grid" style="position:relative; z-index:1;">
                                
                                <!-- CABECERA: FOTO, NOMBRE, APODO Y POSICIÓN EN GRANDE -->
                                <div class="modal-player-header" style="text-align:center; padding:24px 14px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                    ${player.photo 
                                        ? `<div style="width:130px; height:130px; margin:0 auto 12px auto; display:flex; align-items:center; justify-content:center; overflow:visible;">
                                             <img src="${player.photo}" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 4px 15px rgba(0,0,0,0.6));" />
                                           </div>` 
                                        : `<div style="width:105px; height:105px; margin:0 auto 12px auto; border-radius:50%; background:rgba(255,42,133,0.15); border:3px solid var(--club-primary); display:flex; align-items:center; justify-content:center;">
                                             <span style="font-size:3.2rem;">${player.position.includes('Portero') ? '🧤' : '👤'}</span>
                                           </div>`
                                    }

                                    <h2 style="font-size:2rem; margin-top:4px; font-weight:800; color:var(--text-main); font-family:var(--font-heading);">${player.name}</h2>
                                    ${player.nickname ? `<div style="font-size:1.05rem; color:var(--club-primary); font-weight:800; font-style:italic; margin-top:2px;">"${player.nickname}"</div>` : ''}
                                    
                                    <!-- Posición en grande -->
                                    <p style="color:var(--text-main); font-family:var(--font-heading); text-transform:uppercase; margin-top:6px; font-size:1.2rem; font-weight:800; letter-spacing:0.06em;">
                                        ${player.position}
                                    </p>

                                    ${isAdmin ? `
                                        <button class="btn btn-primary" id="btn-edit-player" data-player-id="${player.id}" style="margin-top:16px; width:100%; font-size:0.85rem; padding:8px 12px;">
                                            ✏️ Editar Ficha del Jugador
                                        </button>
                                    ` : ''}
                                </div>

                                <!-- SECTOR ESTADÍSTICAS CON 2 OPCIONES: TEMPORADA | HISTÓRICO -->
                                <div class="modal-player-stats" style="display:flex; flex-direction:column; gap:16px;">
                                    
                                    <!-- Botones de 2 Opciones / Pestañas sencillas -->
                                    <div class="squad-filters" style="margin:0; justify-content:center; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                                        <button class="modal-tab-btn filter-btn ${isTempActive ? 'active' : ''}" data-modal-tab="temporada">
                                            Temporada
                                        </button>
                                        <button class="modal-tab-btn filter-btn ${!isTempActive ? 'active' : ''}" data-modal-tab="historico">
                                            Histórico
                                        </button>
                                    </div>

                                    ${isTempActive ? `
                                        <!-- OPCIÓN 1: STATS DE LA TEMPORADA -->
                                        <div style="animation:fadeIn 0.2s ease;">
                                            <!-- FILA 1: PARTIDOS | GOLES | ASISTENCIAS -->
                                            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                                                ${mainBoxesHtml}
                                            </div>

                                            <!-- FILA 2: GOLES/PJ | MVP | ASIS/PJ -->
                                            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:8px;">
                                                <div class="stat-box">
                                                    <div class="stat-val">${goalsPerMatch}</div>
                                                    <div class="stat-label">Goles / PJ</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val">${mvpVal}</div>
                                                    <div class="stat-label">MVP</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val">${assistsPerMatch}</div>
                                                    <div class="stat-label">Asis / PJ</div>
                                                </div>
                                            </div>

                                            <!-- FILA 3: AMARILLAS | ROJAS | AZULES -->
                                            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:8px;">
                                                ${cardBoxesHtml}
                                            </div>

                                            <div style="margin-top:12px;">
                                                <div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px; letter-spacing:0.05em;">
                                                    Partidos
                                                </div>
                                                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                                                    ${outcomeBoxesHtml}
                                                </div>
                                            </div>
                                        </div>
                                    ` : `
                                        <!-- OPCIÓN 2: STATS HISTÓRICAS -->
                                        <div style="animation:fadeIn 0.2s ease;">
                                            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                                                <div class="stat-box">
                                                    <div class="stat-val">${histStats.matches}</div>
                                                    <div class="stat-label">PJ Totales</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val">${histStats.goals}</div>
                                                    <div class="stat-label">Goles Totales</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val">${histStats.assists}</div>
                                                    <div class="stat-label">Asistencias</div>
                                                </div>
                                            </div>

                                            <!-- PROMEDIOS HISTÓRICOS Y MVP TOT -->
                                            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:8px;">
                                                <div class="stat-box">
                                                    <div class="stat-val">${hGoalsPerMatch}</div>
                                                    <div class="stat-label">Goles / PJ (Hist.)</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val">${histStats.mvp || 0}</div>
                                                    <div class="stat-label">MVP Totales</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val">${hAssistsPerMatch}</div>
                                                    <div class="stat-label">Asis / PJ (Hist.)</div>
                                                </div>
                                            </div>

                                            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-top:10px;">
                                                <div class="stat-box">
                                                    <div class="stat-val" style="font-size:1.1rem;">${histStats.seasons} Temporadas</div>
                                                    <div class="stat-label">Trayectoria</div>
                                                </div>
                                                <div class="stat-box">
                                                    <div class="stat-val" style="font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${histStats.titles}">${histStats.titles}</div>
                                                    <div class="stat-label">Palmarés</div>
                                                </div>
                                            </div>
                                        </div>
                                    `}

                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        return `
            <div class="container" style="padding-top:40px; padding-bottom:80px;">
                
                <!-- SECCIÓN 1: Plantilla Completa -->
                <div style="margin-bottom:36px;">
                    <h2 style="font-size:1.15rem; font-family:var(--font-heading); font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-main); margin:0 0 10px 0;">
                        Plantilla Oficial
                    </h2>
                    
                    <!-- Filtros de Posición -->
                    <div class="squad-filters">
                        <button class="filter-btn ${this.activeFilter === 'todos' ? 'active' : ''}" data-filter="todos">Todos</button>
                        <button class="filter-btn ${this.activeFilter === 'porteros' ? 'active' : ''}" data-filter="porteros">Porteros</button>
                        <button class="filter-btn ${this.activeFilter === 'defensas' ? 'active' : ''}" data-filter="defensas">Defensas</button>
                        <button class="filter-btn ${this.activeFilter === 'carrileros' ? 'active' : ''}" data-filter="carrileros">Carrileros</button>
                        <button class="filter-btn ${this.activeFilter === 'medios' ? 'active' : ''}" data-filter="medios">Medios</button>
                        <button class="filter-btn ${this.activeFilter === 'delanteros' ? 'active' : ''}" data-filter="delanteros">Delanteros</button>
                    </div>

                    <!-- Grilla Compacta de Jugadores -->
                    <div class="squad-grid">
                        ${playersHtml}
                    </div>
                </div>

                <!-- SECCIÓN 2: Ranking de Jugadores -->
                <div>
                    <h2 style="font-size:1.15rem; font-family:var(--font-heading); font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-main); margin:0 0 12px 0;">
                        Ranking de Jugadores
                    </h2>

                    <!-- Tabla de Clasificación de la Plantilla -->
                    <div class="glass-card static-ranking-card" style="padding:16px; border:1px solid var(--border-color); overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
                            <thead>
                                <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); text-transform:uppercase; font-size:0.7rem; font-weight:800; user-select:none;">
                                    <th class="sortable-th" data-sort="pos" style="padding:8px 3px; text-align:center; width:36px; cursor:pointer; ${this.rankingTab === 'pos' ? 'color:var(--club-primary);' : ''}">
                                        Pos
                                    </th>
                                    <th class="sortable-th" data-sort="name" style="padding:8px 8px; text-align:left; cursor:pointer; ${this.rankingTab === 'name' ? 'color:var(--club-primary);' : ''}">
                                        Jugador
                                    </th>
                                    <th class="sortable-th" data-sort="matches" style="padding:8px 4px; text-align:center; width:44px; cursor:pointer; ${this.rankingTab === 'matches' ? 'color:var(--club-primary);' : ''}">
                                        PJ
                                    </th>
                                    <th class="sortable-th" data-sort="goles" style="padding:8px 4px; text-align:center; width:48px; cursor:pointer; ${this.rankingTab === 'goles' ? 'color:var(--club-primary);' : ''}">
                                        Goles
                                    </th>
                                    <th class="sortable-th" data-sort="asistencias" style="padding:8px 4px; text-align:center; width:48px; cursor:pointer; ${this.rankingTab === 'asistencias' ? 'color:var(--club-primary);' : ''}">
                                        Asis
                                    </th>
                                    <th class="sortable-th" data-sort="mvp" style="padding:8px 4px; text-align:center; width:46px; cursor:pointer; ${this.rankingTab === 'mvp' ? 'color:var(--club-primary);' : ''}">
                                        MVP
                                    </th>
                                    <th class="sortable-th" data-sort="tarjetas" style="padding:8px 4px; text-align:center; width:85px; cursor:pointer; ${this.rankingTab === 'tarjetas' ? 'color:var(--club-primary);' : ''}">
                                        Tarjetas
                                    </th>
                                    <th class="sortable-th" data-sort="total" style="padding:8px 4px; text-align:center; width:58px; cursor:pointer; ${this.rankingTab === 'total' || !this.rankingTab ? 'color:var(--club-primary);' : ''}">
                                        G+A
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rankingRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
            <!-- Modal de Ficha de Jugador -->
            ${modalHtml}
        `;
    },

    bindEvents() {
        // Eventos de botones de filtrado de posición
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeFilter = btn.getAttribute('data-filter');
                state.notify();
            });
        });

        // Eventos de click en las cabeceras de la tabla para ordenar columnas
        document.querySelectorAll('.sortable-th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const sortKey = th.getAttribute('data-sort');
                if (sortKey) {
                    this.rankingTab = sortKey;
                    state.notify();
                }
            });
        });

        // Evento click en tarjetas para abrir ficha
        document.querySelectorAll('.player-card-compact').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.closest('.btn-quick-edit-player')) return;
                const playerId = parseInt(el.getAttribute('data-player-id'));
                if (playerId) state.update({ selectedPlayerId: playerId });
            });
        });

        // Evento click directo en botón de edición rápida (Admin)
        document.querySelectorAll('.btn-quick-edit-player').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const playerId = parseInt(btn.getAttribute('data-player-id'));
                if (playerId) this.openEditPlayerModal(playerId);
            });
        });

        // Evento de cambio de pestaña dentro del modal (Temporada vs Histórico)
        document.querySelectorAll('.modal-tab-btn').forEach(btn => {
            btn.onclick = () => {
                const targetTab = btn.getAttribute('data-modal-tab');
                if (targetTab && this.modalStatsTab !== targetTab) {
                    this.modalStatsTab = targetTab;
                    state.notify();
                }
            };
        });

        // Evento de cerrado del modal de jugador
        const closeBtn = document.getElementById('close-modal-btn');
        const overlay = document.getElementById('player-modal-overlay');
        const closeModal = () => state.update({ selectedPlayerId: null });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });
        }

        // Evento Editar Jugador desde Modal de Ficha (Admin)
        const btnEditPlayer = document.getElementById('btn-edit-player');
        if (btnEditPlayer) {
            btnEditPlayer.addEventListener('click', () => {
                const playerId = parseInt(btnEditPlayer.getAttribute('data-player-id'));
                closeModal();
                if (playerId) this.openEditPlayerModal(playerId);
            });
        }
    },

    openEditPlayerModal(playerId) {
        // Eliminar modales previos huérfanos del DOM
        document.querySelectorAll('#edit-player-modal-overlay').forEach(m => m.remove());

        const player = teamData.players.find(p => p.id === playerId);
        if (!player) return;

        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'modal-overlay active';
        modalWrapper.id = 'edit-player-modal-overlay';
        modalWrapper.style.zIndex = '9999';
        modalWrapper.innerHTML = `
            <div class="glass-card" style="max-width:560px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease; box-sizing:border-box; max-height:90vh; overflow-y:auto;">
                <button class="modal-close" id="close-edit-player-modal" style="position:absolute; top:14px; right:14px; background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer;">✕</button>
                
                <h3 style="font-size:1.3rem; margin-bottom:6px; display:flex; align-items:center; gap:8px; font-family:var(--font-heading);">
                    ✏️ Editar Jugador #${player.number} - ${player.name}
                </h3>
                <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                    Modifica los datos personales y estadísticas oficiales del jugador.
                </p>

                <form id="edit-player-form">
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Nombre Completo</label>
                                <input type="text" id="edit-p-name" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.name}" required>
                            </div>
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--club-primary); display:block; margin-bottom:4px;">Dorsal (#)</label>
                                <input type="number" id="edit-p-number" min="1" max="99" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.number}" required>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Apodo</label>
                                <input type="text" id="edit-p-nickname" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.nickname || ''}" placeholder="Ej: El Muro, El Mamba...">
                            </div>
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Edad</label>
                                <input type="number" id="edit-p-age" min="1" max="99" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.info ? player.info.age : 24}" required>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Posición en Ficha</label>
                                <input type="text" id="edit-p-position" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.position}" placeholder="Ej: Medio / Delantero" required>
                            </div>
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Categoría Filtro</label>
                                <select id="edit-p-category" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;">
                                    <option value="porteros" ${player.category === 'porteros' ? 'selected' : ''}>Porteros</option>
                                    <option value="defensas" ${player.category === 'defensas' ? 'selected' : ''}>Defensas</option>
                                    <option value="carrileros" ${player.category === 'carrileros' ? 'selected' : ''}>Carrileros</option>
                                    <option value="medios" ${player.category === 'medios' ? 'selected' : ''}>Medios</option>
                                    <option value="delanteros" ${player.category === 'delanteros' ? 'selected' : ''}>Delanteros</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Foto del Jugador (Archivo desde tu Dispositivo)</label>
                            <input type="file" id="edit-p-photo-file" accept="image/*" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;">
                            ${player.photo ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">Foto actual activa. Selecciona un archivo solo si deseas cambiarla.</div>` : ''}
                        </div>

                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:4px;">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-main); display:block; margin-bottom:10px;">Estadísticas de la Temporada Actual (2026/2027)</span>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Partidos</label>
                                    <input type="number" id="edit-s-matches" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.matches || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Victorias</label>
                                    <input type="number" id="edit-s-wins" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.wins || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Empates</label>
                                    <input type="number" id="edit-s-draws" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.draws || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Derrotas</label>
                                    <input type="number" id="edit-s-losses" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.losses || 0) : 0}">
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Goles Totales</label>
                                    <input type="number" id="edit-s-goals" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.goals || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Asistencias</label>
                                    <input type="number" id="edit-s-assists" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.assists || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#ffd700; font-weight:700; display:block; margin-bottom:4px;">MVP Temporada</label>
                                    <input type="number" id="edit-s-mvp" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.mvp || 0) : 0}">
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">🟨 Amarillas</label>
                                    <input type="number" id="edit-s-yellows" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.yellowCards || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">🟥 Rojas</label>
                                    <input type="number" id="edit-s-reds" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.redCards || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">🟦 Azules</label>
                                    <input type="number" id="edit-s-blues" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.blueCards || 0) : 0}">
                                </div>
                            </div>
                        </div>

                        <!-- EDICIÓN DE ESTADÍSTICAS HISTÓRICAS -->
                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:4px;">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-main); display:block; margin-bottom:10px;">Estadísticas Históricas del Club</span>
                            
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">PJ Históricos</label>
                                    <input type="number" id="edit-h-matches" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.historicalStats ? player.historicalStats.matches : (player.stats?.matches || 0) + 36}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Goles Históricos</label>
                                    <input type="number" id="edit-h-goals" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.historicalStats ? player.historicalStats.goals : (player.stats?.goals || 0) + 18}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Asist. Históricas</label>
                                    <input type="number" id="edit-h-assists" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.historicalStats ? player.historicalStats.assists : (player.stats?.assists || 0) + 22}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#ffd700; display:block; margin-bottom:4px;">MVP Históricos</label>
                                    <input type="number" id="edit-h-mvp" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.historicalStats ? (player.historicalStats.mvp || 0) : (player.stats?.mvp || 0) + 4}">
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Temporadas en Club</label>
                                    <input type="number" id="edit-h-seasons" min="1" max="50" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.historicalStats ? player.historicalStats.seasons : 3}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Palmarés / Títulos</label>
                                    <input type="text" id="edit-h-titles" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.historicalStats ? player.historicalStats.titles : 'Copa F7 Gijón'}" placeholder="Ej: 1 Copa F7 Gijón">
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
                            <button type="button" class="btn btn-secondary" id="cancel-edit-player-btn" style="padding:10px 18px;">Cancelar</button>
                            <button type="submit" class="btn btn-primary" style="padding:10px 22px;">Guardar Cambios</button>
                        </div>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modalWrapper);

        const closeEditModal = () => {
            if (document.body.contains(modalWrapper)) {
                document.body.removeChild(modalWrapper);
            }
        };

        modalWrapper.querySelector('#close-edit-player-modal').addEventListener('click', closeEditModal);
        modalWrapper.querySelector('#cancel-edit-player-btn').addEventListener('click', closeEditModal);
        modalWrapper.addEventListener('click', (e) => {
            if (e.target === modalWrapper) closeEditModal();
        });

        modalWrapper.querySelector('#edit-player-form').addEventListener('submit', (ev) => {
            ev.preventDefault();

            const newName = document.getElementById('edit-p-name').value.trim();
            const newNumber = parseInt(document.getElementById('edit-p-number').value) || player.number;
            const newNickname = document.getElementById('edit-p-nickname').value.trim();
            const newAge = parseInt(document.getElementById('edit-p-age').value) || 24;
            const newPosition = document.getElementById('edit-p-position').value.trim();
            const newCategory = document.getElementById('edit-p-category').value;

            const newMatches = parseInt(document.getElementById('edit-s-matches').value) || 0;
            const newWins = parseInt(document.getElementById('edit-s-wins').value) || 0;
            const newDraws = parseInt(document.getElementById('edit-s-draws').value) || 0;
            const newLosses = parseInt(document.getElementById('edit-s-losses').value) || 0;

            const newGoals = parseInt(document.getElementById('edit-s-goals').value) || 0;
            const newAssists = parseInt(document.getElementById('edit-s-assists').value) || 0;
            const newMvp = parseInt(document.getElementById('edit-s-mvp').value) || 0;

            const newYellows = parseInt(document.getElementById('edit-s-yellows').value) || 0;
            const newReds = parseInt(document.getElementById('edit-s-reds').value) || 0;
            const newBlues = parseInt(document.getElementById('edit-s-blues').value) || 0;

            // Guardar Stats Históricas
            player.historicalStats = {
                matches: parseInt(document.getElementById('edit-h-matches').value) || 0,
                goals: parseInt(document.getElementById('edit-h-goals').value) || 0,
                assists: parseInt(document.getElementById('edit-h-assists').value) || 0,
                mvp: parseInt(document.getElementById('edit-h-mvp').value) || 0,
                seasons: parseInt(document.getElementById('edit-h-seasons').value) || 1,
                titles: document.getElementById('edit-h-titles').value.trim() || 'Copa F7 Gijón'
            };

            const applyFormSave = () => {
                player.name = newName || player.name;
                player.number = newNumber;
                player.nickname = newNickname;
                player.position = newPosition || player.position;
                player.category = newCategory || player.category;

                player.info = player.info || {};
                player.info.age = newAge;

                player.stats = player.stats || {};
                player.stats.matches = newMatches;
                player.stats.wins = newWins;
                player.stats.draws = newDraws;
                player.stats.losses = newLosses;
                player.stats.goals = newGoals;
                player.stats.assists = newAssists;
                player.stats.mvp = newMvp;
                player.stats.yellowCards = newYellows;
                player.stats.redCards = newReds;
                player.stats.blueCards = newBlues;

                savePlayersToStorage();
                closeEditModal();
                state.notify();
            };

            const photoFile = document.getElementById('edit-p-photo-file');
            if (photoFile && photoFile.files && photoFile.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    player.photo = e.target.result;
                    applyFormSave();
                };
                reader.readAsDataURL(photoFile.files[0]);
            } else {
                applyFormSave();
            }
        });
    }
};
