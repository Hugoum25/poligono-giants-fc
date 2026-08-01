/* ==========================================
   PATROCINADOR OFICIAL - MAMBA SHAVED LOGO
   ========================================== */

export const SponsorMambaShaved = {
    /**
     * Renderiza la imagen oficial del patrocinador Mamba Shaved (By Samu Barber).
     * @param {number} height - Altura en píxeles.
     */
    render(height = 54) {
        return `
            <img src="./src/assets/mambashaved-logo.png" 
                 alt="Logo Patrocinador Mamba Shaved By Samu Barber" 
                 class="sponsor-mamba-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; border-radius:50%; vertical-align:middle; display:inline-block;" />
        `;
    }
};
