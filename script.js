document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LÓGICA DA TELA INICIAL (Abertura)
    const intro = document.getElementById('intro-screen');
    intro.addEventListener('click', () => {
        document.body.classList.add('revealed');
    });

    // 2. LÓGICA DOS TÓPICOS EXPANSÍVEIS (Accordion)
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const entry = header.parentElement;
            
            // Alterna a classe 'active' no dia que foi clicado
            entry.classList.toggle('active');
        });
    });
});