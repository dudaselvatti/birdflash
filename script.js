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

    // 7. LÓGICA DO CONEXO (DIA 29)
    const conexoCategories = [
        { id: 0, name: "como eu te chamo", words: ["linda", "princesa", "amor", "vida"], colorClass: "cat-0" },
        { id: 1, name: "coisas que me lembram você", words: ["megan", "buffy", "batman", "bellingham"], colorClass: "cat-1" },
        { id: 2, name: "músicas que já te mandei", words: ["peach eyes", "delicate", "softly", "maggots for brains"], colorClass: "cat-2" },
        { id: 3, name: "coisas que eu mais amo em você", words: ["olhinhos", "humor", "forma de pensar", "cuidado"], colorClass: "cat-3" }
    ];

    const conexoGrid = document.getElementById('conexo-grid');
    const conexoSolved = document.getElementById('conexo-solved');
    const conexoReward = document.getElementById('conexo-reward');
    const conexoIntro = document.getElementById('conexo-intro');
    
    let conexoSelected = [];
    let conexoCount = 0;

    if (conexoGrid) {
        // Passo 1: Juntar todas as 16 palavras e embaralhar
        let conexoWords = [];
        conexoCategories.forEach(cat => {
            cat.words.forEach(word => {
                conexoWords.push({ word: word, catId: cat.id });
            });
        });
        
        // Embaralha o array aleatoriamente
        conexoWords.sort(() => Math.random() - 0.5);

        // Passo 2: Criar os quadradinhos na tela
        conexoWords.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'conexo-btn';
            btn.textContent = item.word;
            btn.dataset.catId = item.catId;
            
            btn.addEventListener('click', () => {
                // Se já estiver selecionado, desmarca
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    conexoSelected = conexoSelected.filter(b => b !== btn);
                } else {
                    // Se não, seleciona (máximo de 4)
                    if (conexoSelected.length < 4) {
                        btn.classList.add('selected');
                        conexoSelected.push(btn);
                    }
                }

                // Quando escolher 4, verifica se estão certos
                if (conexoSelected.length === 4) {
                    checkConexoMatch();
                }
            });
            
            conexoGrid.appendChild(btn);
        });
    }

    function checkConexoMatch() {
        const firstCatId = conexoSelected[0].dataset.catId;
        
        // Verifica se todas as 4 pecinhas têm o mesmo ID de categoria
        const isMatch = conexoSelected.every(btn => btn.dataset.catId === firstCatId);

        if (isMatch) {
            // Acertou!
            const catInfo = conexoCategories.find(c => c.id == firstCatId);
            
            // Remove os botões da grade
            conexoSelected.forEach(btn => btn.remove());
            
            // Cria a barra colorida na área resolvida
            const solvedDiv = document.createElement('div');
            solvedDiv.className = `conexo-category ${catInfo.colorClass}`;
            solvedDiv.innerHTML = `<h3>${catInfo.name}</h3><p>${catInfo.words.join(', ')}</p>`;
            conexoSolved.appendChild(solvedDiv);
            
            conexoCount++;
            conexoSelected = [];

            // Se resolveu as 4 categorias (Ganhou o jogo)
            // Se resolveu as 4 categorias (Ganhou o jogo)
            if (conexoCount === 4) {
                setTimeout(() => {
                    // 1. Esconde o grid vazio e a introdução do jogo
                    if(conexoGrid) conexoGrid.style.display = 'none';
                    if(conexoIntro) conexoIntro.style.display = 'none';
                    
                    // 2. Modifica o estilo inline diretamente via JS para garantir a revelação
                    if (conexoReward) {
                        conexoReward.style.display = 'block'; // Substitui o 'none' inline
                        
                        // Um micro-atraso para o navegador processar a mudança de display antes de rodar a opacidade
                        setTimeout(() => {
                            conexoReward.style.opacity = '1';
                        }, 50);
                        
                        // 3. Expande o accordion pai para caber o bloco novo
                        const accordionContent = conexoReward.closest('.accordion-content');
                        if (accordionContent) {
                            accordionContent.style.maxHeight = '3000px'; 
                        }
                    }
                }, 800);
            }
        } else {
            // Errou! Faz as pecinhas tremerem e desmarca
            conexoSelected.forEach(btn => {
                btn.classList.remove('selected');
                btn.classList.add('error');
                
                // Tira a classe de erro depois da animação
                setTimeout(() => {
                    btn.classList.remove('error');
                }, 400);
            });
            conexoSelected = [];
        }
    }

    // 8. LÓGICA DO COFRE DA DEDICATÓRIA (DIA 04.07)
    const safeGame0407 = document.getElementById('safe-game-0407');
    const safeDisplay0407 = document.getElementById('safe-display-0407');
    const safeSlots0407 = safeDisplay0407 ? safeDisplay0407.querySelectorAll('.safe-slot') : [];
    const safeKeys0407 = document.querySelectorAll('#safe-keypad-0407 .safe-key');
    const safeClear0407 = document.getElementById('safe-clear-0407');
    const safeFeedback0407 = document.getElementById('safe-feedback-0407');
    const safeReward0407 = document.getElementById('safe-reward-0407');

    const safeCode0407 = ['potiguar', 'sábado', 'júlia', 'música'];
    let safeInput0407 = [];
    let safeUnlocked0407 = false;

    function renderSafeSlots0407() {
        safeSlots0407.forEach((slot, index) => {
            slot.textContent = safeInput0407[index] || '';

            if (safeInput0407[index]) {
                slot.classList.add('filled');
            } else {
                slot.classList.remove('filled');
            }
        });
    }

    function resetSafe0407() {
        safeInput0407 = [];
        renderSafeSlots0407();

        safeKeys0407.forEach(key => {
            key.classList.remove('used');
            key.disabled = false;
        });
    }

    function unlockSafe0407() {
        safeUnlocked0407 = true;

        if (safeFeedback0407) {
            safeFeedback0407.textContent = 'cofre aberto: uma música pra minha potiguar.';
        }

        if (safeGame0407) {
            safeGame0407.classList.add('success');

            setTimeout(() => {
                safeGame0407.classList.add('unlocked');
            }, 500);
        }

        safeKeys0407.forEach(key => {
            key.disabled = true;
        });

        if (safeClear0407) {
            safeClear0407.disabled = true;
            safeClear0407.style.opacity = '0.5';
            safeClear0407.style.cursor = 'default';
        }

        if (safeReward0407) {
            safeReward0407.style.display = 'block';

            setTimeout(() => {
                safeReward0407.classList.add('show');

                const accordionContent = safeReward0407.closest('.accordion-content');
                if (accordionContent) {
                    accordionContent.style.maxHeight = '3000px';
                }
            }, 900);
        }
    }

    function checkSafe0407() {
        const isCorrect = safeCode0407.every((word, index) => word === safeInput0407[index]);

        if (isCorrect) {
            unlockSafe0407();
        } else {
            if (safeFeedback0407) {
                safeFeedback0407.textContent = 'senha incorreta... tenta de novo, meu amor.';
            }

            if (safeGame0407) {
                safeGame0407.classList.add('error');
            }

            setTimeout(() => {
                if (safeGame0407) {
                    safeGame0407.classList.remove('error');
                }

                if (safeFeedback0407) {
                    safeFeedback0407.textContent = 'dica: toque nas palavras na ordem das pistas.';
                }

                resetSafe0407();
            }, 850);
        }
    }

    if (safeKeys0407.length) {
        safeKeys0407.forEach(key => {
            key.addEventListener('click', () => {
                if (safeUnlocked0407) return;
                if (safeInput0407.length >= 4) return;

                const selectedWord = key.dataset.word;

                safeInput0407.push(selectedWord);
                key.classList.add('used');
                key.disabled = true;

                renderSafeSlots0407();

                if (safeInput0407.length === 4) {
                    setTimeout(() => {
                        checkSafe0407();
                    }, 250);
                }
            });
        });
    }

    if (safeClear0407) {
        safeClear0407.addEventListener('click', () => {
            if (safeUnlocked0407) return;

            resetSafe0407();

            if (safeFeedback0407) {
                safeFeedback0407.textContent = 'dica: toque nas palavras na ordem das pistas.';
            }
        });
    }

    // 9. LÓGICA DO JARDIM DAS REAFIRMAÇÕES (DIA 10.07)
    const honeybeeGame1007 = document.getElementById('honeybee-game-1007');
    const honeybeeFlowers1007 = document.querySelectorAll('#honeybee-flowers-1007 .honeybee-flower');
    const honeybeeProgress1007 = document.querySelectorAll('#honeybee-progress-1007 span');
    const honeybeeHive1007 = document.getElementById('honeybee-hive-1007');
    const honeybeeFinal1007 = document.getElementById('honeybee-final-1007');
    const honeybeeReward1007 = document.getElementById('honeybee-reward-1007');
    const honeybeeInstruction1007 = document.getElementById('honeybee-instruction-1007');
    let honeybeeOpened1007 = 0;
    let honeybeeUnlocked1007 = false;

    function expandHoneybeeAccordion1007(extraHeight = 0) {
        const accordionContent = honeybeeGame1007 ? honeybeeGame1007.closest('.accordion-content') : null;

        if (accordionContent) {
            accordionContent.style.maxHeight = `${accordionContent.scrollHeight + extraHeight}px`;
        }
    }

    function bounceHoneybee1007() {
        if (!honeybeeGame1007) return;

        honeybeeGame1007.classList.remove('bee-bounce');
        void honeybeeGame1007.offsetWidth;
        honeybeeGame1007.classList.add('bee-bounce');

        setTimeout(() => {
            honeybeeGame1007.classList.remove('bee-bounce');
        }, 450);
    }

    function revealHoneybeeReward1007() {
        if (honeybeeUnlocked1007) return;
        honeybeeUnlocked1007 = true;

        if (honeybeeHive1007) {
            honeybeeHive1007.classList.add('full');
        }

        if (honeybeeInstruction1007) {
            honeybeeInstruction1007.textContent = 'prontinho. colmeia cheia do mel do amor :D.';
        }

        setTimeout(() => {
            if (honeybeeFinal1007) {
                honeybeeFinal1007.style.display = 'block';

                requestAnimationFrame(() => {
                    honeybeeFinal1007.classList.add('show');
                    expandHoneybeeAccordion1007(600);
                });
            }
        }, 500);

        setTimeout(() => {
            if (honeybeeReward1007) {
                honeybeeReward1007.style.display = 'block';

                requestAnimationFrame(() => {
                    honeybeeReward1007.classList.add('show');
                    expandHoneybeeAccordion1007(1200);
                });
            }
        }, 1700);
    }

    if (honeybeeFlowers1007.length) {
        honeybeeFlowers1007.forEach(flower => {
            flower.addEventListener('click', () => {
                if (flower.classList.contains('bloomed')) return;

                flower.classList.add('bloomed');
                flower.setAttribute('aria-pressed', 'true');
                honeybeeOpened1007++;

                const currentDot = honeybeeProgress1007[honeybeeOpened1007 - 1];
                if (currentDot) currentDot.classList.add('filled');

                bounceHoneybee1007();
                expandHoneybeeAccordion1007(350);

                if (honeybeeInstruction1007 && honeybeeOpened1007 < honeybeeFlowers1007.length) {
                    const remaining = honeybeeFlowers1007.length - honeybeeOpened1007;
                    honeybeeInstruction1007.textContent = remaining === 1
                        ? 'falta só uma florzinha pra completar a colmeia.'
                        : `mais ${remaining} florzinhas e a promessa aparece.`;
                }

                if (honeybeeOpened1007 === honeybeeFlowers1007.length) {
                    revealHoneybeeReward1007();
                }
            });
        });
    }

});