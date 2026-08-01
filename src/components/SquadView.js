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
                <div class="glass-card player-card-compact" data-player-id="${p.id}" style="padding:10px 8px; cursor:pointer; display:flex; flex-direction:column; gap:6px; border-radius:6px; background:rgba(0,0,0,0.35); border:1px solid var(--border-color); position:relative; transition:all 0.2s ease;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:36px; height:36px; border-radius:50%; background:rgba(255,42,133,0.15); border:1.5px solid var(--club-primary); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; overflow:hidden;">
                            ${p.photo ? `<img src="${p.photo}" style="width:100%; height:100%; object-fit:cover;" />` : (p.position.includes('Portero') ? '🧤' : '👤')}
                        </div>
                        <div style="flex:1; min-width:0; overflow:hidden;">
                            <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--club-primary); font-weight:800; display:flex; justify-content:space-between; align-items:center;">
                                <span>#${p.number}</span>
                                <span style="color:var(--text-muted); font-size:0.62rem; font-family:var(--font-heading); font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.position.split('/')[0]}</span>
                            </div>
                            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main); line-height:1.2; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                ${p.name}
                            </div>
                            ${p.nickname ? `<div style="font-size:0.68rem; color:var(--club-primary); font-weight:700; font-style:italic; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"${p.nickname}"</div>` : ''}
                        </div>
                        ${isAdmin ? `
                            <button class="btn-quick-edit-player" data-player-id="${p.id}" title="Editar Jugador y Stats" style="background:rgba(255,42,133,0.15); border:1px solid var(--club-primary); color:#ffffff; border-radius:4px; padding:3px 5px; font-size:0.7rem; cursor:pointer; flex-shrink:0;">
                                ✏️
                            </button>
                        ` : ''}
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:4px 6px; border-radius:4px; font-size:0.68rem; font-family:var(--font-mono); border:1px solid rgba(255,255,255,0.05); margin-top:2px;">
                        <span style="color:var(--text-muted);"><strong style="color:#fff;">${st.matches || 0}</strong> PJ</span>
                        <span style="color:#00e676;"><strong style="color:#00e676;">${st.goals || 0}</strong> G</span>
                        <span style="color:#00b0ff;"><strong style="color:#00b0ff;">${st.assists || 0}</strong> A</span>
                    </div>
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

            if (this.rankingTab === 'goles') {
                return (bStats.goals || 0) - (aStats.goals || 0) || (bStats.assists || 0) - (aStats.assists || 0);
            } else if (this.rankingTab === 'asistencias') {
                return (bStats.assists || 0) - (aStats.assists || 0) || (bStats.goals || 0) - (aStats.goals || 0);
            } else if (this.rankingTab === 'tarjetas') {
                return bCards - aCards;
            } else {
                return bTotal - aTotal || (bStats.goals || 0) - (aStats.goals || 0);
            }
        });

        const rankingRowsHtml = sortedPlayersForRanking.map((p, idx) => {
            const rank = idx + 1;
            const badge = `${rank}º`;
            const rankColor = rank === 1 ? '#ffb300' : rank === 2 ? '#e0e0e0' : rank === 3 ? '#cd7f32' : 'var(--text-muted)';
            const st = p.stats || { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0 };
            const totalGPlusA = (st.goals || 0) + (st.assists || 0);

            return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:8px 6px; text-align:center; font-weight:800; font-family:var(--font-mono); color:${rankColor};">
                        ${badge}
                    </td>
                    <td style="padding:8px 8px; font-weight:700;">
                        <span style="color:var(--text-main);">${p.name}</span>
                        <span style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-heading); margin-left:4px;">(${p.position.split('/')[0]})</span>
                    </td>
                    <td style="padding:8px 6px; text-align:center; font-family:var(--font-mono);">${st.matches || 0}</td>
                    <td style="padding:8px 6px; text-align:center; font-family:var(--font-mono); font-weight:800; color:#00e676;">${st.goals || 0}</td>
                    <td style="padding:8px 6px; text-align:center; font-family:var(--font-mono); font-weight:800; color:#00b0ff;">${st.assists || 0}</td>
                    <td style="padding:8px 6px; text-align:center; font-family:var(--font-mono); font-size:0.72rem;">
                        <span style="color:#ffb300; margin-right:4px;">🟨 ${st.yellowCards || 0}</span>
                        <span style="color:#ff4444; margin-right:4px;">🟥 ${st.redCards || 0}</span>
                        <span style="color:#00b0ff;">🟦 ${st.blueCards || 0}</span>
                    </td>
                    <td style="padding:8px 6px; text-align:center; font-family:var(--font-mono); font-weight:800; color:var(--club-primary); font-size:0.95rem;">
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
                const primaryStats = [
                    { key: 'matches', label: 'Partidos' },
                    { key: 'goals', label: 'Goles' },
                    { key: 'assists', label: 'Asistencias' },
                    { key: 'yellowCards', label: 'Amarillas' },
                    { key: 'redCards', label: 'Rojas' },
                    { key: 'blueCards', label: 'Azules' }
                ];

                const outcomeStats = [
                    { key: 'wins', label: 'Victorias' },
                    { key: 'draws', label: 'Empates' },
                    { key: 'losses', label: 'Derrotas' }
                ];

                let primaryBoxesHtml = '';
                primaryStats.forEach(item => {
                    const val = player.stats ? (player.stats[item.key] || 0) : 0;
                    primaryBoxesHtml += `
                        <div class="stat-box">
                            <div class="stat-val">${val}</div>
                            <div class="stat-label">${item.label}</div>
                        </div>
                    `;
                });

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

                modalHtml = `
                    <div class="modal-overlay active" id="player-modal-overlay">
                        <div class="glass-card player-modal">
                            <button class="modal-close" id="close-modal-btn">✕</button>
                            <div class="modal-grid">
                                <div class="modal-player-header">
                                    <div style="margin-bottom:10px;">
                                        <span style="font-size:4rem; filter:drop-shadow(0 0 14px rgba(var(--club-primary-rgb), 0.9)); display:inline-block;">👤</span>
                                    </div>
                                    <div class="modal-player-num">#${player.number}</div>
                                    <h2 style="font-size:2rem; margin-top:8px;">${player.name}</h2>
                                    ${player.nickname ? `<div style="font-size:1.05rem; color:var(--club-primary); font-weight:800; font-style:italic; margin-top:4px;">"${player.nickname}"</div>` : ''}
                                    <p style="color:var(--text-muted); font-family:var(--font-heading); text-transform:uppercase; margin-top:4px;">
                                        ${player.position}
                                    </p>

                                    ${isAdmin ? `
                                        <button class="btn btn-primary" id="btn-edit-player" data-player-id="${player.id}" style="margin-top:16px; width:100%; font-size:0.85rem; padding:8px 12px;">
                                            ✏️ Editar Ficha del Jugador
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="modal-player-stats">
                                    <div class="modal-section-title">Estadísticas de la Temporada</div>
                                    <div class="stats-grid">
                                        ${primaryBoxesHtml}
                                    </div>

                                    <div style="margin-top:16px; border-top:1px solid rgba(255,255,255,0.1); padding-top:14px;">
                                        <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.05em;">
                                            Resultados
                                        </div>
                                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
                                            ${outcomeBoxesHtml}
                                        </div>
                                    </div>
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

                <!-- SECCIÓN 2: Ranking de Jugadores (Clasificación Interna) -->
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                        <h2 style="font-size:1.15rem; font-family:var(--font-heading); font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-main); margin:0;">
                            Ranking de Jugadores (Clasificación Interna)
                        </h2>

                        <!-- Filtros de Criterio de Clasificación -->
                        <div class="squad-filters" style="margin:0;">
                            <button class="ranking-filter-btn filter-btn ${this.rankingTab === 'total' ? 'active' : ''}" data-ranking="total">Rendimiento (G+A)</button>
                            <button class="ranking-filter-btn filter-btn ${this.rankingTab === 'goles' ? 'active' : ''}" data-ranking="goles">Goleadores</button>
                            <button class="ranking-filter-btn filter-btn ${this.rankingTab === 'asistencias' ? 'active' : ''}" data-ranking="asistencias">Asistentes</button>
                            <button class="ranking-filter-btn filter-btn ${this.rankingTab === 'tarjetas' ? 'active' : ''}" data-ranking="tarjetas">Disciplina</button>
                        </div>
                    </div>

                    <!-- Tabla de Clasificación de la Plantilla -->
                    <div class="glass-card static-ranking-card" style="padding:16px; border:1px solid var(--border-color); overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
                            <thead>
                                <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); text-transform:uppercase; font-size:0.7rem; font-weight:800;">
                                    <th style="padding:8px 6px; text-align:center; width:60px;">Pos</th>
                                    <th style="padding:8px 8px; text-align:left;">Jugador</th>
                                    <th style="padding:8px 6px; text-align:center; width:50px;">PJ</th>
                                    <th style="padding:8px 6px; text-align:center; width:60px;">Goles</th>
                                    <th style="padding:8px 6px; text-align:center; width:60px;">Asis</th>
                                    <th style="padding:8px 6px; text-align:center; width:130px;">Tarjetas</th>
                                    <th style="padding:8px 6px; text-align:center; width:70px;">Total</th>
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

        // Eventos de botones de criterio de ranking (Rendimiento, Goleadores, Asistentes, Disciplina)
        document.querySelectorAll('.ranking-filter-btn[data-ranking]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.rankingTab = btn.getAttribute('data-ranking');
                state.notify();
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
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Foto del Jugador (URL imagen)</label>
                            <input type="text" id="edit-p-photo" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.photo || ''}" placeholder="./src/assets/... o URL de foto">
                        </div>

                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:4px;">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--text-main); display:block; margin-bottom:10px;">Estadísticas Acumuladas de la Temporada</span>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Partidos</label>
                                    <input type="number" id="edit-s-matches" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.matches || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#00e676; font-weight:700; display:block; margin-bottom:4px;">Victorias</label>
                                    <input type="number" id="edit-s-wins" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.wins || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#ffb300; font-weight:700; display:block; margin-bottom:4px;">Empates</label>
                                    <input type="number" id="edit-s-draws" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.draws || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#ff4444; font-weight:700; display:block; margin-bottom:4px;">Derrotas</label>
                                    <input type="number" id="edit-s-losses" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.losses || 0) : 0}">
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:#00e676; font-weight:700; display:block; margin-bottom:4px;">Goles Totales</label>
                                    <input type="number" id="edit-s-goals" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.goals || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#00b0ff; font-weight:700; display:block; margin-bottom:4px;">Asistencias</label>
                                    <input type="number" id="edit-s-assists" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.assists || 0) : 0}">
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                                <div>
                                    <label style="font-size:0.72rem; color:#ffb300; font-weight:700; display:block; margin-bottom:4px;">🟨 Amarillas</label>
                                    <input type="number" id="edit-s-yellows" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.yellowCards || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#ff4444; font-weight:700; display:block; margin-bottom:4px;">🟥 Rojas</label>
                                    <input type="number" id="edit-s-reds" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.redCards || 0) : 0}">
                                </div>
                                <div>
                                    <label style="font-size:0.72rem; color:#00b0ff; font-weight:700; display:block; margin-bottom:4px;">🟦 Azules</label>
                                    <input type="number" id="edit-s-blues" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${player.stats ? (player.stats.blueCards || 0) : 0}">
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
            const newPhoto = document.getElementById('edit-p-photo').value.trim();
            const newAge = parseInt(document.getElementById('edit-p-age').value) || 24;
            const newPosition = document.getElementById('edit-p-position').value.trim();
            const newCategory = document.getElementById('edit-p-category').value;

            const newMatches = parseInt(document.getElementById('edit-s-matches').value) || 0;
            const newWins = parseInt(document.getElementById('edit-s-wins').value) || 0;
            const newDraws = parseInt(document.getElementById('edit-s-draws').value) || 0;
            const newLosses = parseInt(document.getElementById('edit-s-losses').value) || 0;

            const newGoals = parseInt(document.getElementById('edit-s-goals').value) || 0;
            const newAssists = parseInt(document.getElementById('edit-s-assists').value) || 0;

            const newYellows = parseInt(document.getElementById('edit-s-yellows').value) || 0;
            const newReds = parseInt(document.getElementById('edit-s-reds').value) || 0;
            const newBlues = parseInt(document.getElementById('edit-s-blues').value) || 0;

            player.name = newName || player.name;
            player.number = newNumber;
            player.nickname = newNickname;
            player.photo = newPhoto;
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
            player.stats.yellowCards = newYellows;
            player.stats.redCards = newReds;
            player.stats.blueCards = newBlues;

            savePlayersToStorage();
            closeEditModal();
            state.notify();
        });
    }
};
