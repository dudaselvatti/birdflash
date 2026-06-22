async function fetchWeather() {
    try {
        // fetch de Guarulhos
        const resGRU = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.4628&longitude=-46.5333&current_weather=true');
        const dataGRU = await resGRU.json();
        const tempGru = document.getElementById('temp-gru');
        if (tempGru) tempGru.textContent = `${Math.round(dataGRU.current_weather.temperature)}°C`;

        // fetch do RN (Mossoró)
        const resRN = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-5.188&longitude=-37.344&current_weather=true');
        const dataRN = await resRN.json();
        const tempRn = document.getElementById('temp-rn');
        if (tempRn) tempRn.textContent = `${Math.round(dataRN.current_weather.temperature)}°C`;
    } catch (error) {
        console.error("Erro ao carregar o clima:", error);
    }
}

fetchWeather();

function updateSunMoon() {
    const hour = new Date().getHours();
    const caption = document.getElementById('weather-caption');
    const icon = document.getElementById('weather-icon');

    if (hour >= 19 || hour < 5) {
        if (caption) caption.textContent = "ainda estamos sob a mesma lua.";
        if (icon) icon.textContent = "🌙";
    } else {
        if (caption) caption.textContent = "ainda estamos sob o mesmo sol.";
        if (icon) icon.textContent = "☀️";
    }
}

updateSunMoon();

document.addEventListener('DOMContentLoaded', () => {

    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.addEventListener('click', () => {
            document.body.classList.add('revealed');
        });
    }

    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const entry = header.parentElement;
            entry.classList.toggle('active');
        });
    });

    const pieces = document.querySelectorAll('.draggable-piece');
    const dropZone = document.getElementById('drop-zone');
    const craftingArea = document.getElementById('crafting-area');
    const craftedSong = document.getElementById('crafted-song');
    let piecesInZone = 0;

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
        piece.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handlePieceAssembled(piece);
        }, { passive: false });

        piece.addEventListener('click', () => {
            handlePieceAssembled(piece);
        });

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

    const batBtn = document.getElementById('bat-signal-btn');
    const gothamNight = document.getElementById('gotham-night');
    const gothamContent = document.getElementById('gotham-content');

    function releaseBats(startX, startY) {
        const batCount = 20;

        for (let i = 0; i < batCount; i++) {
            const bat = document.createElement('div');
            bat.textContent = '🦇';
            bat.classList.add('flying-bat');

            bat.style.left = `${startX}px`;
            bat.style.top = `${startY}px`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rot = (Math.random() - 0.5) * 90;

            bat.style.setProperty('--tx', `${tx}px`);
            bat.style.setProperty('--ty', `${ty}px`);
            bat.style.setProperty('--rot', `${rot}deg`);

            document.body.appendChild(bat);

            setTimeout(() => {
                bat.remove();
            }, 1500);
        }
    }

    if (batBtn && gothamNight && gothamContent) {
        batBtn.addEventListener('click', () => {
            const rect = batBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            releaseBats(centerX, centerY);

            batBtn.style.transform = 'scale(1.2)';
            batBtn.style.boxShadow = '0 0 100px rgba(252, 235, 59, 1)';

            setTimeout(() => {
                gothamNight.classList.add('revealed');
                gothamContent.classList.add('illuminated');
            }, 300);
        });
    }

    // 6. LÓGICA DE ORGANIZAR A MENTE NO PAPEL E REVELAR MÚSICA (DIA 22)
    const thoughts = document.querySelectorAll('.draggable-thought');
    const paperZone = document.getElementById('paper-zone');
    const thoughtsContainer = document.getElementById('thoughts-container');
    const songContainer = document.getElementById('organized-thoughts'); 
    let wordsFilled = 0;

    const ordemCerta = ['confusão', 'palavras', 'clareza'];

    function fillNextBlank(element) {
        if (wordsFilled >= 3) return; 

        const wordText = element.id; 

        if (wordText !== ordemCerta[wordsFilled]) {
            element.style.transform = 'translateX(-5px)';
            setTimeout(() => element.style.transform = 'translateX(5px)', 100);
            setTimeout(() => element.style.transform = 'translateX(0)', 200);
            return; 
        }

        wordsFilled++;
        
        const blank = document.getElementById(`blank-${wordsFilled}`);
        if (blank) {
            blank.textContent = wordText;
            blank.classList.add('filled');
        }

        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        element.style.pointerEvents = 'none';
        setTimeout(() => element.style.display = 'none', 400);

        if (wordsFilled === 3) {
            // Passo 1: Revela a frase final no papel
            setTimeout(() => {
                if (thoughtsContainer) thoughtsContainer.style.display = 'none';
                if (paperZone) paperZone.classList.add('completed');
                
                // Passo 2: Espera 2.5s pra ela ler, depois vira o envelope
                setTimeout(() => {
                    if (paperZone) paperZone.classList.add('envelope-mode');
                    
                    // Passo 3: Espera mais 0.8s e desce a música suavemente
                    setTimeout(() => {
                        if (songContainer) {
                            songContainer.classList.add('show');
                            const accordionContent = songContainer.closest('.accordion-content');
                            if (accordionContent) {
                                accordionContent.style.maxHeight = '3000px'; 
                            }
                        }
                    }, 800);
                }, 2500); 
            }, 600);
        }
    }

    thoughts.forEach(thought => {
        thought.addEventListener('click', (e) => {
            e.preventDefault();
            fillNextBlank(thought);
        });
        thought.addEventListener('touchstart', (e) => {
            e.preventDefault();
            fillNextBlank(thought);
        }, { passive: false });

        thought.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', thought.id);
        });
    });

    if (paperZone) {
        paperZone.addEventListener('dragover', (e) => e.preventDefault());
        paperZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const draggableElement = document.getElementById(id);
            if (draggableElement && draggableElement.style.display !== 'none') {
                fillNextBlank(draggableElement);
            }
        });
    }
});