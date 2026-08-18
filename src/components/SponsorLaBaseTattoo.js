/* ==========================================
   PATROCINADOR OFICIAL - LA BASE TATTOO STUDIO LOGO
   ========================================== */

export const SponsorLaBaseTattoo = {
    /**
     * Renderiza la imagen oficial del patrocinador La Base Tattoo Studio.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 36) {
        return `
            <img src="./src/assets/sponsors/labase-tattoo-logo.png" 
                 alt="Logo Patrocinador La Base Tattoo Studio" 
                 class="sponsor-labase-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; border-radius:4px; vertical-align:middle; display:inline-block;" />
        `;
    }
};
