/* ==========================================
   FC HUB - VISTA DE PATROCINADORES OFICIALES
   (EDICIÓN Y ADMINISTRACIÓN CON PERSISTENCIA DISCO/LOCALSTORAGE)
   ========================================== */

import { teamData, saveSponsorsToStorage } from '../data/teamData.js';
import { state } from '../state.js';
import { AuthService } from '../services/authService.js';
import { Icon3D } from './Icon3D.js';
import { SponsorJaviFrey } from './SponsorJaviFrey.js';
import { SponsorMambaShaved } from './SponsorMambaShaved.js';
import { SponsorBambi } from './SponsorBambi.js';
import { SponsorLaBaseTattoo } from './SponsorLaBaseTattoo.js';
import { SponsorTrmSports } from './SponsorTrmSports.js';
import { SponsorSohoBar } from './SponsorSohoBar.js';
import { SponsorPastur } from './SponsorPastur.js';

export const SponsorsView = {
    editingSponsorId: null,
    isModalOpen: false,

    render() {
        const isAdmin = AuthService.isAdmin();

        const sponsorsHtml = teamData.sponsors.map(sp => {
            let logoHtml = Icon3D.render(sp.logo || '🤝', 'md');
            let logoContainerStyle = 'height:80px; display:flex; align-items:center; justify-content:center; margin-bottom:16px;';

            if (sp.isJaviFrey) {
                logoHtml = SponsorJaviFrey.render(56);
            } else if (sp.isMambaShaved) {
                logoHtml = SponsorMambaShaved.render(56);
            } else if (sp.isBambi) {
                logoHtml = SponsorBambi.render(56);
            } else if (sp.isLaBase) {
                logoHtml = SponsorLaBaseTattoo.render(56);
            } else if (sp.isTrmSports) {
                logoHtml = SponsorTrmSports.render(56);
            } else if (sp.isSohoBar) {
                logoHtml = SponsorSohoBar.render(56);
            } else if (sp.isPastur) {
                logoHtml = SponsorPastur.render(56);
            }

            return `
                <div class="glass-card sponsor-detail-card" style="padding:28px 20px; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:space-between; min-height:220px; position:relative;">
                    
                    ${isAdmin ? `
                        <div style="position:absolute; top:8px; right:8px; display:flex; gap:4px; z-index:4;">
                            <button class="btn btn-secondary btn-edit-sponsor" data-id="${sp.id}" style="padding:2px 6px; font-size:0.75rem;" title="Editar Patrocinador">✏️</button>
                            <button class="btn btn-secondary btn-delete-sponsor" data-id="${sp.id}" style="padding:2px 6px; font-size:0.75rem; color:#ff4444;" title="Eliminar Patrocinador">🗑️</button>
                        </div>
                    ` : ''}

                    <div style="${logoContainerStyle}">
                        ${logoHtml}
                    </div>
                    <div class="sponsor-detail-info">
                        <h3 style="font-size:1.3rem; margin-bottom:8px; color:var(--text-main); font-family:var(--font-heading);">${sp.name}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">${sp.desc}</p>
                    </div>
                </div>
            `;
        }).join('');

        // Modal de Edición / Creación para Administradores
        let modalHtml = '';
        if (this.isModalOpen && isAdmin) {
            const sp = this.editingSponsorId ? teamData.sponsors.find(s => s.id === this.editingSponsorId) : { name: '', logo: '🤝', desc: '' };
            
            modalHtml = `
                <div class="modal-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;">
                    <div class="glass-card" style="width:100%; max-width:440px; padding:24px; border:2px solid var(--club-primary); border-radius:12px; position:relative; box-shadow:0 0 30px rgba(255,42,133,0.3);">
                        <h3 style="font-size:1.2rem; font-family:var(--font-heading); color:var(--club-primary); margin-top:0; margin-bottom:16px; text-transform:uppercase;">
                            ${this.editingSponsorId ? 'Editar Patrocinador' : 'Añadir Patrocinador'}
                        </h3>

                        <form id="form-sponsor-admin" style="display:flex; flex-direction:column; gap:12px;">
                            <div>
                                <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Nombre del Patrocinador</label>
                                <input type="text" id="sponsor-input-name" class="form-input" required style="width:100%; padding:8px; font-size:0.85rem; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; border-radius:4px; box-sizing:border-box;" value="${sp.name || ''}" placeholder="Ej: La Base Tattoo" />
                            </div>

                            <div>
                                <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Icono / Emoji (o Iniciales)</label>
                                <input type="text" id="sponsor-input-logo" class="form-input" style="width:100%; padding:8px; font-size:0.85rem; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; border-radius:4px; box-sizing:border-box;" value="${sp.logo || '🤝'}" placeholder="Ej: 🎨" />
                            </div>

                            <div>
                                <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Descripción / Eslogan</label>
                                <textarea id="sponsor-input-desc" class="form-input" rows="3" required style="width:100%; padding:8px; font-size:0.85rem; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; border-radius:4px; box-sizing:border-box; resize:vertical;" placeholder="Descripción de los servicios de la empresa...">${sp.desc || ''}</textarea>
                            </div>

                            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                                <button type="button" id="btn-cancel-sponsor-modal" class="btn btn-secondary" style="padding:8px 14px; font-size:0.85rem;">Cancelar</button>
                                <button type="submit" class="btn btn-primary" style="padding:8px 18px; font-size:0.85rem; font-weight:800;">Guardar Patrocinador</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        return `
            <div class="container" style="padding-top:16px; padding-bottom:60px;">
                
                <!-- Encabezado de la sección sin descripción -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                    <h2 class="section-title" style="margin:0; font-size:1.8rem; line-height:1.1;">
                        PATROCINADORES
                    </h2>

                    ${isAdmin ? `
                        <button id="btn-add-sponsor" class="btn btn-primary" style="font-size:0.85rem; padding:8px 14px; font-weight:800;">
                            ➕ Añadir Patrocinador
                        </button>
                    ` : ''}
                </div>

                <!-- Grilla Igualitaria de Patrocinadores -->
                <div class="sponsors-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:22px;">
                    ${sponsorsHtml}
                </div>

                ${modalHtml}
            </div>
        `;
    },

    bindEvents() {
        const isAdmin = AuthService.isAdmin();
        if (!isAdmin) return;

        // Botón Añadir Patrocinador
        const btnAdd = document.getElementById('btn-add-sponsor');
        if (btnAdd) {
            btnAdd.onclick = () => {
                this.editingSponsorId = null;
                this.isModalOpen = true;
                state.notify();
            };
        }

        // Botones Editar Patrocinador
        document.querySelectorAll('.btn-edit-sponsor').forEach(btn => {
            btn.onclick = () => {
                const spId = parseInt(btn.getAttribute('data-id'));
                this.editingSponsorId = spId;
                this.isModalOpen = true;
                state.notify();
            };
        });

        // Botones Eliminar Patrocinador
        document.querySelectorAll('.btn-delete-sponsor').forEach(btn => {
            btn.onclick = () => {
                const spId = parseInt(btn.getAttribute('data-id'));
                const sp = teamData.sponsors.find(s => s.id === spId);
                if (confirm(`¿Estás seguro de eliminar el patrocinador "${sp ? sp.name : ''}"?`)) {
                    teamData.sponsors = teamData.sponsors.filter(s => s.id !== spId);
                    saveSponsorsToStorage();
                    state.notify();
                }
            };
        });

        // Cancelar Modal
        const btnCancel = document.getElementById('btn-cancel-sponsor-modal');
        if (btnCancel) {
            btnCancel.onclick = () => {
                this.isModalOpen = false;
                this.editingSponsorId = null;
                state.notify();
            };
        }

        // Formulario Guardar Patrocinador
        const formSponsor = document.getElementById('form-sponsor-admin');
        if (formSponsor) {
            formSponsor.onsubmit = (e) => {
                e.preventDefault();
                const name = document.getElementById('sponsor-input-name').value.trim();
                const logo = document.getElementById('sponsor-input-logo').value.trim() || '🤝';
                const desc = document.getElementById('sponsor-input-desc').value.trim();

                if (!name || !desc) return;

                if (this.editingSponsorId) {
                    // Actualizar existente
                    const sp = teamData.sponsors.find(s => s.id === this.editingSponsorId);
                    if (sp) {
                        sp.name = name;
                        sp.logo = logo;
                        sp.desc = desc;
                    }
                } else {
                    // Crear nuevo patrocinador
                    const newId = Date.now();
                    teamData.sponsors.push({
                        id: newId,
                        name: name,
                        logo: logo,
                        desc: desc
                    });
                }

                saveSponsorsToStorage();
                this.isModalOpen = false;
                this.editingSponsorId = null;
                state.notify();
            };
        }
    }
};
