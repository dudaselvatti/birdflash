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

    function getAccordionContent(element) {
        if (!element) return null;
        return element.classList.contains('accordion-content')
            ? element
            : element.closest('.accordion-content');
    }

    function refreshAccordion(element, extraHeight = 0) {
        const content = getAccordionContent(element);
        if (!content) return;

        const entry = content.closest('.diary-entry');
        if (!entry || !entry.classList.contains('active')) {
            content.style.maxHeight = '0px';
            return;
        }

        requestAnimationFrame(() => {
            content.style.maxHeight = `${content.scrollHeight + extraHeight}px`;
        });
    }

    headers.forEach(header => {
        const entry = header.closest('.diary-entry');
        const content = header.nextElementSibling;
        header.setAttribute('aria-expanded', entry && entry.classList.contains('active') ? 'true' : 'false');

        header.addEventListener('click', () => {
            if (!entry || !content) return;

            const opening = !entry.classList.contains('active');
            if (opening) {
                entry.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = '0px';
                refreshAccordion(content);
            } else {
                content.style.maxHeight = `${content.scrollHeight}px`;
                requestAnimationFrame(() => {
                    entry.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = '0px';
                });
            }
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.diary-entry.active .accordion-content').forEach(content => {
            refreshAccordion(content);
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
                    if (craftedSong) {
                        craftedSong.classList.add('revealed-song');
                        refreshAccordion(craftedSong);
                    }
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
                            refreshAccordion(songContainer);
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
                        refreshAccordion(conexoReward);
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

                refreshAccordion(safeReward0407);
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
        refreshAccordion(honeybeeGame1007, extraHeight);
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

    // 10. CONTEXTO PERSONALIZADO (DIA 22.07)
    const contextGame2207 = document.getElementById('context-game-2207');
    const contextForm2207 = document.getElementById('context-form-2207');
    const contextInput2207 = document.getElementById('context-input-2207');
    const contextSubmit2207 = document.getElementById('context-submit-2207');
    const contextFeedback2207 = document.getElementById('context-feedback-2207');
    const contextAttempts2207 = document.getElementById('context-attempts-2207');
    const contextBest2207 = document.getElementById('context-best-2207');
    const contextHint2207 = document.getElementById('context-hint-2207');
    const contextHints2207 = document.getElementById('context-hints-2207');
    const contextGuesses2207 = document.getElementById('context-guesses-2207');
    const contextWin2207 = document.getElementById('context-win-2207');
    const contextReview2207 = document.getElementById('context-review-2207');
    const contextReviewToggle2207 = document.getElementById('context-review-toggle-2207');
    const contextReviewLabel2207 = document.getElementById('context-review-label-2207');
    const contextReviewIcon2207 = document.getElementById('context-review-icon-2207');
    const contextReward2207 = document.getElementById('context-reward-2207');

    const contextWords2207 = [
        { word: 'minha', rank: 1 },
        { word: 'júlia', rank: 2, aliases: ['julia'] },
        { word: 'princesa', rank: 3 },
        { word: 'vida', rank: 4 },
        { word: 'amor', rank: 5 },
        { word: 'linda', rank: 6 },
        { word: 'você', rank: 7, aliases: ['voce', 'vc'] },
        { word: 'gatinha', rank: 8 },
        { word: 'mulher', rank: 9 },
        { word: 'namorada', rank: 10 },
        { word: 'beijo', rank: 11, aliases: ['beijos'] },
        { word: 'abraço', rank: 12, aliases: ['abraco', 'abraços', 'abracos'] },
        { word: 'aliança', rank: 13, aliases: ['alianca'] },
        { word: 'namoro', rank: 14 },
        { word: 'saudade', rank: 15 },
        { word: 'carinho', rank: 16 },
        { word: 'cuidado', rank: 17 },
        { word: 'paixão', rank: 18, aliases: ['paixao'] },
        { word: 'apaixonada', rank: 19 },
        { word: 'ciúme', rank: 20, aliases: ['ciume'] },
        { word: 'ciúmes', rank: 21, aliases: ['ciumes'] },
        { word: 'potiguar', rank: 22 },
        { word: 'mossoró', rank: 23, aliases: ['mossoro'] },
        { word: 'guarulhos', rank: 24 },
        { word: 'distância', rank: 25, aliases: ['distancia'] },
        { word: 'encontro', rank: 26 },
        { word: 'sentimento', rank: 27, aliases: ['sentimentos'] },
        { word: 'coração', rank: 28, aliases: ['coracao'] },
        { word: 'coragem', rank: 29 },
        { word: 'medo', rank: 30 },
        { word: 'demais', rank: 31 },
        { word: 'grudenta', rank: 32 },
        { word: 'emocionada', rank: 33 },
        { word: 'irmã', rank: 34, aliases: ['irma'] },
        { word: 'betinhas', rank: 35, aliases: ['betinha'] },
        { word: 'cunhado', rank: 36 },
        { word: 'amiga', rank: 37 },
        { word: 'amizade', rank: 38 },
        { word: 'mensagem', rank: 39, aliases: ['mensagens'] },
        { word: 'dm', rank: 40, aliases: ['direct', 'direct message'] },
        { word: 'flerte', rank: 41, aliases: ['flertar', 'flertes'] },
        { word: 'tweet', rank: 42, aliases: ['tuíte', 'tuite'] },
        { word: 'outubro', rank: 43 },
        { word: 'aniversário', rank: 44, aliases: ['aniversario'] },
        { word: 'vinte', rank: 45, aliases: ['20'] },
        { word: 'vinte e um', rank: 46, aliases: ['21'] },
        { word: 'abril', rank: 47 },
        { word: 'birdflash', rank: 48 },
        { word: 'robin', rank: 49 },
        { word: 'batman', rank: 50 },
        { word: 'megan', rank: 51 },
        { word: 'katseye', rank: 52 },
        { word: 'bellingham', rank: 53 },
        { word: 'real madrid', rank: 54, aliases: ['real'] },
        { word: 'vasco', rank: 55 },
        { word: 'flamengo', rank: 56 },
        { word: 'futebol', rank: 57 },
        { word: 'twitter', rank: 58, aliases: ['x'] },
        { word: 'plato', rank: 59 },
        { word: 'ludo', rank: 60 },
        { word: 'vela', rank: 61 },
        { word: 'cama', rank: 62 },
        { word: 'presente', rank: 63, aliases: ['presentes'] },
        { word: 'música', rank: 64, aliases: ['musica', 'músicas', 'musicas'] },
        { word: 'spotify', rank: 65 },
        { word: 'texto', rank: 66, aliases: ['textinho', 'textos'] },
        { word: 'palavra', rank: 67, aliases: ['palavras'] },
        { word: 'afirmação', rank: 68, aliases: ['afirmacao', 'afirmações', 'afirmacoes'] },
        { word: 'paraíso', rank: 69, aliases: ['paraiso', 'paradise'] },
        { word: 'verão', rank: 70, aliases: ['verao', 'summer'] },
        { word: 'lover', rank: 71, aliases: ['amante'] },
        { word: 'memória', rank: 72, aliases: ['memoria', 'memórias', 'memorias'] },
        { word: 'dias', rank: 73, aliases: ['dia'] },
        { word: 'sorte', rank: 74 },
        { word: 'destino', rank: 75 },
        { word: 'coincidência', rank: 76, aliases: ['coincidencia', 'coincidências', 'coincidencias'] },
        { word: 'rainha', rank: 77 },
        { word: 'garota', rank: 78 },
        { word: 'menina', rank: 79 },
        { word: 'casal', rank: 80 },
        { word: 'relacionamento', rank: 81 },
        { word: 'rio grande do norte', rank: 82, aliases: ['rn'] },
        { word: 'são paulo', rank: 83, aliases: ['sao paulo', 'sp'] },
        { word: 'nordeste', rank: 84 },
        { word: 'sudeste', rank: 85 }
    ];

    const contextHintsData2207 = [
        'ela aparece várias vezes no jeito como eu te chamo.',
        'costuma vir antes de “vida”, “princesa” e “linda”.',
        'não é o seu nome: é a palavra que faz todas essas coisas parecerem só suas.'
    ];

    function normalizeContextWord2207(value) {
        return value
            .trim()
            .toLocaleLowerCase('pt-BR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[’']/g, '')
            .replace(/\s+/g, ' ');
    }

    const contextLookup2207 = new Map();
    contextWords2207.forEach(item => {
        [item.word, ...(item.aliases || [])].forEach(term => {
            contextLookup2207.set(normalizeContextWord2207(term), item);
        });
    });

    let contextAttemptsCount2207 = 0;
    let contextHintsShown2207 = 0;
    let contextWon2207 = false;
    const contextGuessMap2207 = new Map();
    const contextSeed2207 = contextLookup2207.get('twitter');

    if (contextSeed2207) {
        contextGuessMap2207.set('twitter', { ...contextSeed2207, seed: true });
    }

    function contextTemperature2207(rank) {
        if (rank <= 3) return 'context-burning';
        if (rank <= 10) return 'context-hot';
        if (rank <= 25) return 'context-warm';
        if (rank <= 50) return 'context-mild';
        return 'context-cold';
    }

    function contextProgress2207(rank) {
        return Math.max(7, Math.min(100, Math.round(102 - rank * 1.12)));
    }

    function renderContextGuesses2207() {
        if (!contextGuesses2207) return;

        const guesses = [...contextGuessMap2207.values()].sort((a, b) => a.rank - b.rank);
        contextGuesses2207.innerHTML = '';

        guesses.forEach((guess, index) => {
            const row = document.createElement('div');
            row.className = `context-guess ${contextTemperature2207(guess.rank)}`;
            if (guess.seed) row.classList.add('context-guess-seed');
            if (guess.rank === 1) row.classList.add('context-guess-correct');
            if (index === 0 && !guess.seed) row.classList.add('context-guess-best');

            row.innerHTML = `
                <div class="context-guess-main">
                    <span class="context-guess-word">${guess.word}</span>
                    ${guess.seed ? '<span class="context-seed-tag">inicial</span>' : ''}
                </div>
                <strong class="context-guess-rank">#${guess.rank}</strong>
                <span class="context-guess-bar" aria-hidden="true"><span style="width:${contextProgress2207(guess.rank)}%"></span></span>
            `;
            contextGuesses2207.appendChild(row);
        });

        const best = guesses[0];
        if (contextBest2207 && best) contextBest2207.textContent = `${best.word} · #${best.rank}`;
        refreshAccordion(contextGame2207);
    }

    function updateContextHintButton2207() {
        if (!contextHint2207 || contextWon2207) return;
        if (contextHintsShown2207 >= contextHintsData2207.length) {
            contextHint2207.disabled = true;
            contextHint2207.textContent = 'todas as dicas foram reveladas';
            return;
        }

        const neededAttempts = (contextHintsShown2207 + 1) * 3;
        const remaining = neededAttempts - contextAttemptsCount2207;
        contextHint2207.disabled = remaining > 0;
        contextHint2207.textContent = remaining <= 0
            ? `revelar dica ${contextHintsShown2207 + 1}`
            : remaining === 1
                ? 'dica liberada em 1 palpite'
                : `dica liberada em ${remaining} palpites`;
    }

    function revealContextHint2207() {
        if (!contextHints2207 || contextHintsShown2207 >= contextHintsData2207.length) return;
        const hint = document.createElement('p');
        hint.className = 'context-hint-card';
        hint.innerHTML = `<span>dica ${contextHintsShown2207 + 1}</span>${contextHintsData2207[contextHintsShown2207]}`;
        contextHints2207.appendChild(hint);
        contextHintsShown2207++;
        updateContextHintButton2207();
        refreshAccordion(contextGame2207);
    }

    function setContextReviewOpen2207(open, shouldScroll = false) {
        if (!contextGame2207 || !contextReviewToggle2207) return;

        contextGame2207.hidden = !open;
        contextReviewToggle2207.setAttribute('aria-expanded', open ? 'true' : 'false');

        if (contextReviewLabel2207) {
            contextReviewLabel2207.textContent = open
                ? 'ocultar palavras e palpites'
                : 'ver palavras e palpites';
        }

        if (contextReviewIcon2207) {
            contextReviewIcon2207.textContent = open ? '−' : '+';
        }

        requestAnimationFrame(() => {
            refreshAccordion(open ? contextGame2207 : contextReward2207, 40);

            if (shouldScroll) {
                const target = open ? contextGame2207 : contextReward2207;
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: open ? 'start' : 'center' });
                    }, 120);
                }
            }
        });
    }

    function winContext2207() {
        contextWon2207 = true;
        if (contextInput2207) {
            contextInput2207.disabled = true;
            contextInput2207.blur();
        }
        if (contextSubmit2207) contextSubmit2207.disabled = true;
        if (contextHint2207) {
            contextHint2207.disabled = true;
            contextHint2207.textContent = 'contexto encontrado <3';
        }
        if (contextFeedback2207) {
            contextFeedback2207.textContent = `você encontrou em ${contextAttemptsCount2207} ${contextAttemptsCount2207 === 1 ? 'palpite' : 'palpites'}!`;
            contextFeedback2207.classList.add('success');
        }

        setTimeout(() => {
            if (!contextWin2207) return;
            contextWin2207.hidden = false;
            requestAnimationFrame(() => {
                contextWin2207.classList.add('show');
                refreshAccordion(contextWin2207);
            });
        }, 350);

        setTimeout(() => {
            if (contextReview2207) contextReview2207.hidden = false;
            if (contextReward2207) {
                contextReward2207.hidden = false;
                requestAnimationFrame(() => {
                    contextReward2207.classList.add('show');
                    setContextReviewOpen2207(false);
                    refreshAccordion(contextReward2207, 40);

                    setTimeout(() => {
                        contextReward2207.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 160);
                });
            }
        }, 1250);
    }

    function submitContextGuess2207(rawValue) {
        if (contextWon2207) return;
        const normalized = normalizeContextWord2207(rawValue);

        if (!normalized) {
            if (contextFeedback2207) contextFeedback2207.textContent = 'digite alguma palavra primeiro, linda.';
            return;
        }

        const result = contextLookup2207.get(normalized);
        if (!result) {
            if (contextFeedback2207) contextFeedback2207.textContent = 'essa palavra ainda não entrou no nosso pequeno dicionário… tenta outra.';
            return;
        }

        const canonicalKey = normalizeContextWord2207(result.word);
        if (contextGuessMap2207.has(canonicalKey)) {
            if (contextFeedback2207) contextFeedback2207.textContent = `“${result.word}” já apareceu por aqui.`;
            return;
        }

        contextGuessMap2207.set(canonicalKey, result);
        contextAttemptsCount2207++;
        if (contextAttempts2207) contextAttempts2207.textContent = String(contextAttemptsCount2207);
        if (contextInput2207) contextInput2207.value = '';

        if (contextFeedback2207) {
            contextFeedback2207.classList.remove('success');
            contextFeedback2207.textContent = result.rank <= 10
                ? 'tá queimando… você chegou muito perto.'
                : result.rank <= 25
                    ? 'quentinha. continua seguindo esse caminho.'
                    : result.rank <= 50
                        ? 'essa palavra faz parte do contexto, mas ainda dá pra chegar mais perto.'
                        : 'ainda estamos longe da palavra secreta.';
        }

        renderContextGuesses2207();
        updateContextHintButton2207();
        if (result.rank === 1) winContext2207();
    }

    if (contextGame2207) {
        renderContextGuesses2207();
        updateContextHintButton2207();
    }

    if (contextForm2207) {
        contextForm2207.addEventListener('submit', event => {
            event.preventDefault();
            submitContextGuess2207(contextInput2207 ? contextInput2207.value : '');
        });
    }

    if (contextHint2207) contextHint2207.addEventListener('click', revealContextHint2207);

    if (contextReviewToggle2207) {
        contextReviewToggle2207.addEventListener('click', () => {
            const isOpen = contextReviewToggle2207.getAttribute('aria-expanded') === 'true';
            setContextReviewOpen2207(!isOpen, true);
        });
    }

});