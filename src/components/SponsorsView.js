/* ==========================================
   FC HUB - VISTA DE PATROCINADORES OFICIALES (TODOS IGUALES)
   ========================================== */

import { teamData } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { SponsorJaviFrey } from './SponsorJaviFrey.js';
import { SponsorMambaShaved } from './SponsorMambaShaved.js';
import { SponsorBambi } from './SponsorBambi.js';
import { SponsorLaBaseTattoo } from './SponsorLaBaseTattoo.js';
import { SponsorTrmSports } from './SponsorTrmSports.js';
import { SponsorSohoBar } from './SponsorSohoBar.js';
import { SponsorPastur } from './SponsorPastur.js';

export const SponsorsView = {
    render() {
        const sponsorsHtml = teamData.sponsors.map(sp => {
            let logoHtml = Icon3D.render(sp.logo, 'md');
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
                <div class="glass-card sponsor-detail-card" style="padding:28px 20px; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:space-between; min-height:220px;">
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

        return `
            <div class="container" style="padding-top:16px; padding-bottom:60px;">
                <h2 class="section-title" style="margin:0 0 4px 0; font-size:1.8rem; line-height:1.1;">
                    PATROCINADORES
                </h2>
                <p style="color:var(--text-muted); margin:0 0 24px 0; font-size:0.95rem; line-height:1.3;">
                    Patrocinadores oficiales del club.
                </p>

                <!-- Grilla Igualitaria de Patrocinadores -->
                <div class="sponsors-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:22px;">
                    ${sponsorsHtml}
                </div>
            </div>
        `;
    },

    bindEvents() {}
};
