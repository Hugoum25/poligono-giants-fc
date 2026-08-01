/* ==========================================
   POLÍGONO GIANTS F7 - ESCUDO OFICIAL (IMAGEN ORIGINAL)
   ========================================== */

export const ClubLogo = {
    /**
     * Renderiza la imagen original sin modificar facilitada por el usuario.
     * @param {number|string} size - Tamaño en píxeles.
     * @param {string} extraClass - Clases CSS adicionales.
     */
    render(size = 48, extraClass = '') {
        return `
            <img src="./src/assets/club-logo.png" 
                 alt="Escudo Oficial Polígono Giants F7" 
                 class="club-official-logo ${extraClass}" 
                 style="width:${size}px; height:${size}px; object-fit:contain; border-radius:50%; vertical-align:middle; display:inline-block;" />
        `;
    }
};
