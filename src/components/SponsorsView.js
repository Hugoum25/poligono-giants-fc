/* ==========================================================
   PATROCINADORES — muro de marcas + edición admin
   ========================================================== */

import { teamData, saveSponsorsToStorage } from '../data/teamData.js';
import { state } from '../state.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird, ModalHead, SponsorLogo } from './ui.js';

export const SponsorsView = {
    editingSponsorId: null,
    isModalOpen: false,

    render() {
        const isAdmin = AuthService.isAdmin();
        const sponsors = teamData.sponsors || [];

        const cards = sponsors.map((sp, i) => `
            <article class="sponsor-card">
                <span class="sponsor-card__idx t-meta">${String(i + 1).padStart(2, '0')}</span>
                <div class="sponsor-card__logo">${SponsorLogo(sp, 'sponsor-card__img')}</div>
                <div class="sponsor-card__info">
                    <h3 class="sponsor-card__name">${sp.name}</h3>
                    <p class="sponsor-card__desc">${sp.desc || ''}</p>
                </div>
                ${isAdmin ? `
                    <div class="sponsor-card__admin">
                        <button type="button" class="pg-btn pg-btn--icon pg-btn--xs btn-edit-sponsor" data-id="${sp.id}" title="Editar" aria-label="Editar">${I('edit')}</button>
                        <button type="button" class="pg-btn pg-btn--icon pg-btn--xs pg-btn--danger btn-delete-sponsor" data-id="${sp.id}" title="Eliminar" aria-label="Eliminar">${I('trash')}</button>
                    </div>` : ''}
            </article>
        `).join('');

        let modalHtml = '';
        if (this.isModalOpen && isAdmin) {
            const sp = this.editingSponsorId ? sponsors.find(x => x.id === this.editingSponsorId) : { name: '', logo: '', desc: '' };
            modalHtml = `
                <div class="modal-overlay active" id="sponsor-modal-overlay">
                    <div class="pg-modal">
                        ${ModalHead({ kicker: 'Admin · Patrocinadores', title: this.editingSponsorId ? 'Editar patrocinador' : 'Añadir patrocinador' })}
                        <form id="form-sponsor-admin" class="pg-form pg-modal__body">
                            <div class="pg-field">
                                <label class="pg-label" for="sponsor-input-name">Nombre *</label>
                                <input type="text" id="sponsor-input-name" class="pg-input" required value="${sp.name || ''}" placeholder="La Base Tattoo" />
                            </div>
                            <div class="pg-field">
                                <label class="pg-label" for="sponsor-input-logo">Iniciales / etiqueta (si no hay logo)</label>
                                <input type="text" id="sponsor-input-logo" class="pg-input" value="${sp.logo || ''}" placeholder="LBT" />
                            </div>
                            <div class="pg-field">
                                <label class="pg-label" for="sponsor-input-desc">Descripción *</label>
                                <textarea id="sponsor-input-desc" class="pg-input" rows="3" required placeholder="Servicios de la empresa…">${sp.desc || ''}</textarea>
                            </div>
                            <div class="pg-row" style="justify-content:flex-end">
                                <button type="button" id="btn-cancel-sponsor-modal" class="pg-btn">Cancelar</button>
                                <button type="submit" class="pg-btn pg-btn--primary">${I('check')} Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        return `
            <div class="pg-view">
                ${LowerThird({
                    page: 'sponsors',
                    title: 'Patrocinadores',
                    sub: `${sponsors.length} marcas que hacen posible al club · Gracias`,
                    actions: isAdmin ? `<button type="button" id="btn-add-sponsor" class="pg-btn pg-btn--primary">${I('plus')} Añadir</button>` : ''
                })}
                ${sponsors.length ? `<div class="sponsors-grid">${cards}</div>` : `<div class="pg-empty">Hueco libre para tu marca</div>`}
                <aside class="sponsors-cta">
                    <span class="t-meta">¿Tu marca en la camiseta rosinegra?</span>
                    <span class="sponsors-cta__title">Hay sitio en la parrilla.</span>
                </aside>
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
                const logo = document.getElementById('sponsor-input-logo').value.trim();
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
