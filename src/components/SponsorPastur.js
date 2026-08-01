/* ==========================================
   PATROCINADOR OFICIAL - PASTUR TEJADOS LOGO
   ========================================== */

export const SponsorPastur = {
    /**
     * Renderiza la imagen oficial del patrocinador Pastur Tejados.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 36) {
        return `
            <img src="./src/assets/pastur-logo.png" 
                 alt="Logo Patrocinador Pastur Construcción de Tejados" 
                 class="sponsor-pastur-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; border-radius:4px; vertical-align:middle; display:inline-block; filter:contrast(1.1);" />
        `;
    }
};
