/* ==========================================
   PATROCINADOR OFICIAL - CAFETERÍA BAMBI LOGO
   ========================================== */

export const SponsorBambi = {
    /**
     * Renderiza la imagen oficial del patrocinador Cafetería Bambi.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 32) {
        return `
            <img src="./src/assets/sponsors/bambi-logo.png" 
                 alt="Logo Patrocinador Cafetería Bambi" 
                 class="sponsor-bambi-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; vertical-align:middle; display:inline-block;" />
        `;
    }
};
