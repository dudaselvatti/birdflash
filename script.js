document.addEventListener('DOMContentLoaded', () => {
    
    const intro = document.getElementById('intro-screen');

    intro.addEventListener('click', () => {
        document.body.classList.add('revealed');
        console.log("Clique detectado, revelando conteúdo...");
    });
});