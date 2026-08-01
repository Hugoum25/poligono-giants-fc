/* ==========================================
   FC HUB - COMPONENTE PIE DE PÁGINA TV (SOLO FOTO PATROCINADORES Y DERECHOS RESERVADOS)
   ========================================== */

import { teamData } from '../data/teamData.js';
import { SponsorJaviFrey } from './SponsorJaviFrey.js';
import { SponsorMambaShaved } from './SponsorMambaShaved.js';
import { SponsorFitmaster } from './SponsorFitmaster.js';
import { SponsorBambi } from './SponsorBambi.js';
import { SponsorLaBaseTattoo } from './SponsorLaBaseTattoo.js';
import { SponsorTrmSports } from './SponsorTrmSports.js';
import { SponsorSohoBar } from './SponsorSohoBar.js';
import { SponsorPastur } from './SponsorPastur.js';

export const Footer = {
    render() {
        const currentYear = new Date().getFullYear();
        const sponsorsListHtml = teamData.sponsors.map(sp => {
            let logoImgHtml = '';
            if (sp.isJaviFrey) {
                logoImgHtml = SponsorJaviFrey.render(28);
            } else if (sp.isMambaShaved) {
                logoImgHtml = SponsorMambaShaved.render(28);
            } else if (sp.isFitmaster) {
                logoImgHtml = SponsorFitmaster.render(28);
            } else if (sp.isBambi) {
                logoImgHtml = SponsorBambi.render(28);
            } else if (sp.isLaBase) {
                logoImgHtml = SponsorLaBaseTattoo.render(28);
            } else if (sp.isTrmSports) {
                logoImgHtml = SponsorTrmSports.render(28);
            } else if (sp.isSohoBar) {
                logoImgHtml = SponsorSohoBar.render(28);
            } else if (sp.isPastur) {
                logoImgHtml = SponsorPastur.render(28);
            } else {
                logoImgHtml = `<span style="font-size:1.1rem;">${sp.logo || '🤝'}</span>`;
            }

            return `
                <div style="display:flex; align-items:center; gap:8px; font-size:0.88rem; font-weight:800; font-family:var(--font-heading); color:var(--text-main); background:transparent; border:none; padding:4px 8px;">
                    ${logoImgHtml}
                    <span>${sp.name}</span>
                </div>
            `;
        }).join('');

        return `
            <footer class="tv-footer" style="padding:16px 20px; border-top:1px solid var(--border-color); background:rgba(7,9,15,0.95); margin-top:auto;">
                <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; width:100%;">
                    
                    <!-- MARCAS Y FOTOS DE PATROCINADORES ALINEADOS A LA IZQUIERDA -->
                    <div style="display:flex; align-items:center; flex-wrap:wrap; gap:10px 20px;">
                        ${sponsorsListHtml}
                    </div>

                    <!-- DERECHOS RESERVADOS ALINEADOS A LA DERECHA -->
                    <div style="font-size:0.78rem; color:var(--text-muted); font-family:var(--font-heading); letter-spacing:0.04em; white-space:nowrap; margin-left:auto;">
                        &copy; ${currentYear} Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        `;
    },

    bindEvents() {}
};

