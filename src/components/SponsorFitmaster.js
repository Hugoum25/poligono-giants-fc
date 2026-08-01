/* ==========================================
   PATROCINADOR OFICIAL - FITMASTER BY PABLOALV LOGO
   ========================================== */

export const SponsorFitmaster = {
    /**
     * Renderiza la imagen oficial del patrocinador FITMASTER by PABLOALV.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 56) {
        return `
            <img src="./src/assets/fitmaster-logo.png" 
                 alt="Logo Patrocinador FITMASTER by PABLOALV" 
                 class="sponsor-fitmaster-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; border-radius:4px; vertical-align:middle; display:inline-block;" />
        `;
    }
};
