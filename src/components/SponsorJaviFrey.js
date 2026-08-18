/* ==========================================
   PATROCINADOR OFICIAL - JAVI FREY (IMAGEN ORIGINAL)
   ========================================== */

export const SponsorJaviFrey = {
    /**
     * Renderiza la imagen original sin modificar del logo de Javi Frey facilitada por el usuario.
     * @param {number} height - Altura en píxeles.
     */
    render(height = 42) {
        return `
            <img src="./src/assets/sponsors/javi-frey-logo.png" 
                 alt="Logo Patrocinador Javi Frey" 
                 class="sponsor-javi-frey-logo" 
                 style="height:${height}px; width:auto; object-fit:contain; vertical-align:middle; display:inline-block;" />
        `;
    }
};
