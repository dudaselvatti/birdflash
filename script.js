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


    async function fetchWeather() {
        try {
            // Fetch de Guarulhos
            const resGRU = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.4628&longitude=-46.5333&current_weather=true');
            const dataGRU = await resGRU.json();
            document.getElementById('temp-gru').textContent = `${Math.round(dataGRU.current_weather.temperature)}°C`;

            const resRN = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-5.188&longitude=-37.344&current_weather=true');
            const dataRN = await resRN.json();
            document.getElementById('temp-rn').textContent = `${Math.round(dataRN.current_weather.temperature)}°C`;
        } catch (error) {
            console.error("Erro ao carregar o clima:", error);
            // Em caso de erro, os traços '--°C' definidos no HTML permanecem discretamente
        }
    }

    // Chama a função para carregar os dados
    fetchWeather();


    // 4. LÓGICA DA MONTAGEM DAS PEÇAS
    const pieces = document.querySelectorAll('.draggable-piece');
    const dropZone = document.getElementById('drop-zone');
    const craftingArea = document.getElementById('crafting-area');
    const craftedSong = document.getElementById('crafted-song');
    let piecesInZone = 0;

    // Função central para processar quando uma peça entra na zona
    function handlePieceAssembled(element) {
        if (!dropZone.contains(element)) {
            dropZone.appendChild(element);
            piecesInZone++;
            
            const text = dropZone.querySelector('.drop-text');
            if (text) text.style.display = 'none';

            if (piecesInZone === 2) {
                craftingArea.style.opacity = '0';
                setTimeout(() => {
                    craftingArea.style.display = 'none';
                    craftedSong.classList.add('revealed-song');
                }, 500);
            }
        }
    }

    // Suporte a CLIQUE / TOQUE (Garante que funciona no celular)
    pieces.forEach(piece => {
        piece.addEventListener('click', (e) => {
            handlePieceAssembled(e.target);
        });

        // Suporte a DRAG & DROP (Para usar no PC)
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => e.target.style.opacity = '0.5', 0);
        });

        piece.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('over');
        const id = e.dataTransfer.getData('text/plain');
        const draggableElement = document.getElementById(id);
        if (draggableElement) handlePieceAssembled(draggableElement);
    });
});