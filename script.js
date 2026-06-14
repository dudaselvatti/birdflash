// 1. CLIMA EM TEMPO REAL (Isolado no topo para rodar instantaneamente)
async function fetchWeather() {
    try {
        // Fetch de Guarulhos
        const resGRU = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.4628&longitude=-46.5333&current_weather=true');
        const dataGRU = await resGRU.json();
        const tempGru = document.getElementById('temp-gru');
        if (tempGru) tempGru.textContent = `${Math.round(dataGRU.current_weather.temperature)}°C`;

        // Fetch do RN (Mossoró)
        const resRN = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-5.188&longitude=-37.344&current_weather=true');
        const dataRN = await resRN.json();
        const tempRn = document.getElementById('temp-rn');
        if (tempRn) tempRn.textContent = `${Math.round(dataRN.current_weather.temperature)}°C`;
    } catch (error) {
        console.error("Erro ao carregar o clima:", error);
    }
}

// Executa o clima imediatamente
fetchWeather();

function updateSunMoon() {
    const hour = new Date().getHours();
    const caption = document.getElementById('weather-caption');
    const icon = document.getElementById('weather-icon');

    // Se for depois das 19h ou antes das 5h da manhã (madrugada)
    if (hour >= 19 || hour < 5) {
        if (caption) caption.textContent = "ainda estamos sob a mesma lua.";
        if (icon) icon.textContent = "🌙";
    } else {
        if (caption) caption.textContent = "ainda estamos sob o mesmo sol.";
        if (icon) icon.textContent = "☀️";
    }
}

// Executa a função na hora que carregar
updateSunMoon();

// ---------------------------------------------------------
// TODO O RESTO DO CÓDIGO (Interface e interações)
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. LÓGICA DA TELA INICIAL (Abertura)
    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.addEventListener('click', () => {
            document.body.classList.add('revealed');
        });
    }

    // 3. LÓGICA DOS TÓPICOS EXPANSÍVEIS (Accordion)
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const entry = header.parentElement;
            // Alterna a classe 'active' no dia que foi clicado
            entry.classList.toggle('active');
        });
    });

    // 4. LÓGICA DA MONTAGEM DAS PEÇAS (Com suporte Mobile Corrigido)
    const pieces = document.querySelectorAll('.draggable-piece');
    const dropZone = document.getElementById('drop-zone');
    const craftingArea = document.getElementById('crafting-area');
    const craftedSong = document.getElementById('crafted-song');
    let piecesInZone = 0;

    // Função central para processar quando uma peça entra na zona
    function handlePieceAssembled(element) {
        if (dropZone && !dropZone.contains(element)) {
            dropZone.appendChild(element);
            piecesInZone++;
            
            const text = dropZone.querySelector('.drop-text');
            if (text) text.style.display = 'none';

            if (piecesInZone === 2) {
                craftingArea.style.opacity = '0';
                setTimeout(() => {
                    craftingArea.style.display = 'none';
                    if (craftedSong) craftedSong.classList.add('revealed-song');
                }, 500);
            }
        }
    }

    pieces.forEach(piece => {
        // SUPORTE MOBILE (Toque na tela)
        piece.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Bloqueia o conflito do navegador mobile
            handlePieceAssembled(piece); // Usa 'piece' direto, ignorando o pino do lego
        }, { passive: false });

        // SUPORTE PC (Clique simples do mouse)
        piece.addEventListener('click', () => {
            handlePieceAssembled(piece);
        });

        // SUPORTE PC (Arrastar e soltar clássico)
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.id);
            setTimeout(() => piece.style.opacity = '0.5', 0);
        });

        piece.addEventListener('dragend', () => {
            piece.style.opacity = '1';
        });
    });

    if (dropZone) {
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
            
            if (draggableElement) {
                handlePieceAssembled(draggableElement);
            }
        });
    }
});