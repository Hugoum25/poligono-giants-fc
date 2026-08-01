/* ==========================================
   PATROCINADOR OFICIAL - SOHO BAR LOGO
   ========================================== */

export const SponsorSohoBar = {
    /**
     * Renderiza la imagen oficial del patrocinador Soho Bar Gijón.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 36) {
        return `
            <img src="./src/assets/soho-bar-logo.png" 
                 alt="Logo Patrocinador Soho Bar Gijón" 
                 class="sponsor-soho-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; border-radius:50%; vertical-align:middle; display:inline-block;" />
        `;
    }
};
