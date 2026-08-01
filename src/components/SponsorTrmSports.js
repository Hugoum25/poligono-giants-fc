/* ==========================================
   PATROCINADOR OFICIAL - TRM SPORTS LOGO
   ========================================== */

export const SponsorTrmSports = {
    /**
     * Renderiza la imagen oficial del patrocinador TRM Sports.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 32) {
        return `
            <img src="./src/assets/trm-sports-logo.png" 
                 alt="Logo Patrocinador TRM Sports" 
                 class="sponsor-trm-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; border-radius:4px; vertical-align:middle; display:inline-block; filter: invert(1) brightness(1.15);" />
        `;
    }
};
