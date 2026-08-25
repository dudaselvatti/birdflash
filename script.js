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

    // =========================================================
    // BIRDFLASH — NOVA HOME / NOVA ERA
    // =========================================================
    const relationshipStart = new Date(2026, 7, 5); // 05.08.2026
    relationshipStart.setHours(0, 0, 0, 0);

    function updateRelationshipDays() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const diff = Math.max(0, Math.floor((now - relationshipStart) / 86400000));
        const label = `${diff} ${diff === 1 ? 'dia' : 'dias'}`;
        document.querySelectorAll('[data-relationship-days]').forEach(element => {
            element.textContent = label;
        });
    }

    updateRelationshipDays();

    const appViews = [...document.querySelectorAll('.app-view')];
    const viewButtons = document.querySelectorAll('[data-open-view]');

    function openBirdflashView(viewName) {
        const target = appViews.find(view => view.dataset.view === viewName);
        if (!target) return;

        appViews.forEach(view => {
            view.classList.toggle('active', view === target);
        });

        document.body.dataset.birdflashView = viewName;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    viewButtons.forEach(button => {
        button.addEventListener('click', () => openBirdflashView(button.dataset.openView));
    });

    // =========================================================
    // CARTEIRINHA DA MINHA SHAW
    // =========================================================
    const girlfriendCardTrigger = document.getElementById('girlfriend-card-trigger');
    const girlfriendModal = document.getElementById('girlfriend-modal');
    const girlfriendIdCard = document.getElementById('girlfriend-id-card');
    const girlfriendCloseButtons = document.querySelectorAll('[data-close-girlfriend-card]');

    function openGirlfriendCard() {
        if (!girlfriendModal) return;
        girlfriendModal.hidden = false;
        document.body.classList.add('modal-open');
        girlfriendIdCard?.classList.remove('is-flipped');
        setTimeout(() => girlfriendIdCard?.focus(), 20);
    }

    function closeGirlfriendCard() {
        if (!girlfriendModal) return;
        girlfriendModal.hidden = true;
        document.body.classList.remove('modal-open');
        girlfriendIdCard?.classList.remove('is-flipped');
        girlfriendCardTrigger?.focus();
    }

    girlfriendCardTrigger?.addEventListener('click', openGirlfriendCard);
    girlfriendCloseButtons.forEach(button => button.addEventListener('click', closeGirlfriendCard));
    girlfriendIdCard?.addEventListener('click', () => girlfriendIdCard.classList.toggle('is-flipped'));
    girlfriendIdCard?.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            girlfriendIdCard.classList.toggle('is-flipped');
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && girlfriendModal && !girlfriendModal.hidden) {
            closeGirlfriendCard();
        }
    });

    // =========================================================
    // DUDA I JULIA CODED
    // Cadastro/sincronização agora são tratados em firebase-codeds.js.
    // Mantemos o restante das dinâmicas antigas completamente separado.
    // =========================================================

    const dayHeaders = document.querySelectorAll('.accordion-header');
    const monthSections = document.querySelectorAll('.month-section');

    // The accordions now animate with CSS Grid, so dynamic content no longer needs
    // fixed max-height values. Keeping this helper preserves the existing game calls.
    function refreshAccordion(element) {
        if (!element) return;

        const dayContent = element.classList && element.classList.contains('accordion-content')
            ? element
            : element.closest && element.closest('.accordion-content');
        const monthContent = element.classList && element.classList.contains('month-content')
            ? element
            : element.closest && element.closest('.month-content');

        if (dayContent) dayContent.style.removeProperty('max-height');
        if (monthContent) monthContent.style.removeProperty('max-height');
    }

    monthSections.forEach(section => {
        const header = section.firstElementChild;
        if (!header || !header.classList.contains('month-header')) return;

        header.setAttribute('aria-expanded', section.classList.contains('active') ? 'true' : 'false');

        header.addEventListener('click', () => {
            const opening = !section.classList.contains('active');

            monthSections.forEach(otherSection => {
                if (otherSection === section) return;
                otherSection.classList.remove('active');
                const otherHeader = otherSection.firstElementChild;
                if (otherHeader && otherHeader.classList.contains('month-header')) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                }
            });

            section.classList.toggle('active', opening);
            header.setAttribute('aria-expanded', opening ? 'true' : 'false');
        });
    });

    dayHeaders.forEach(header => {
        const entry = header.closest('.diary-entry');
        const content = header.nextElementSibling;
        if (!entry || !content || !content.classList.contains('accordion-content')) return;

        header.setAttribute('aria-expanded', entry.classList.contains('active') ? 'true' : 'false');

        header.addEventListener('click', () => {
            const opening = !entry.classList.contains('active');
            entry.classList.toggle('active', opening);
            header.setAttribute('aria-expanded', opening ? 'true' : 'false');
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
                    if (conexoGrid) conexoGrid.style.display = 'none';
                    if (conexoIntro) conexoIntro.style.display = 'none';

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
    const contextReward2207 = document.getElementById('context-reward-2207');
    const contextReview2207 = document.getElementById('context-review-2207');
    const contextReviewToggle2207 = document.getElementById('context-review-toggle-2207');
    const contextReviewLabel2207 = document.getElementById('context-review-label-2207');

    const contextWords2207 = [
        { word: "minha", rank: 1 },
        { word: "júlia", rank: 2, aliases: ["julia"] },
        { word: "princesa", rank: 3 },
        { word: "vida", rank: 4 },
        { word: "amor", rank: 5 },
        { word: "linda", rank: 6 },
        { word: "você", rank: 7, aliases: ["voce", "vc"] },
        { word: "mulher", rank: 8 },
        { word: "namorada", rank: 9 },
        { word: "gatinha", rank: 10 },
        { word: "meu", rank: 11 },
        { word: "sua", rank: 12 },
        { word: "nossa", rank: 13 },
        { word: "querida", rank: 14 },
        { word: "bebê", rank: 15, aliases: ["bebe"] },
        { word: "paixão", rank: 16, aliases: ["paixao"] },
        { word: "apaixonada", rank: 17 },
        { word: "carinho", rank: 18 },
        { word: "beijo", rank: 19, aliases: ["beijos"] },
        { word: "abraço", rank: 20, aliases: ["abraco", "abraços", "abracos"] },
        { word: "namoro", rank: 21 },
        { word: "aliança", rank: 22, aliases: ["alianca"] },
        { word: "saudade", rank: 23 },
        { word: "cuidado", rank: 24 },
        { word: "coração", rank: 25, aliases: ["coracao", "corações", "coracoes"] },
        { word: "sentimento", rank: 26, aliases: ["sentimentos"] },
        { word: "ciúme", rank: 27, aliases: ["ciume"] },
        { word: "ciúmes", rank: 28, aliases: ["ciumes"] },
        { word: "potiguar", rank: 29 },
        { word: "mossoró", rank: 30, aliases: ["mossoro"] },
        { word: "guarulhos", rank: 31 },
        { word: "distância", rank: 32, aliases: ["distancia"] },
        { word: "encontro", rank: 33, aliases: ["encontros"] },
        { word: "coragem", rank: 34 },
        { word: "medo", rank: 35 },
        { word: "demais", rank: 36 },
        { word: "grudenta", rank: 37 },
        { word: "emocionada", rank: 38 },
        { word: "irmã", rank: 39, aliases: ["irma"] },
        { word: "betinhas", rank: 40, aliases: ["betinha"] },
        { word: "cunhado", rank: 41 },
        { word: "amiga", rank: 42 },
        { word: "amizade", rank: 43 },
        { word: "mensagem", rank: 44, aliases: ["mensagens"] },
        { word: "dm", rank: 45, aliases: ["direct", "direct message"] },
        { word: "flerte", rank: 46, aliases: ["flertar", "flertes"] },
        { word: "tweet", rank: 47, aliases: ["tuíte", "tuite"] },
        { word: "twitter", rank: 48, aliases: ["x"] },
        { word: "outubro", rank: 49 },
        { word: "aniversário", rank: 50, aliases: ["aniversario"] },
        { word: "vinte", rank: 51, aliases: ["20"] },
        { word: "vinte e um", rank: 52, aliases: ["21"] },
        { word: "abril", rank: 53 },
        { word: "birdflash", rank: 54 },
        { word: "robin", rank: 55 },
        { word: "batman", rank: 56 },
        { word: "megan", rank: 57 },
        { word: "katseye", rank: 58 },
        { word: "bellingham", rank: 59 },
        { word: "real madrid", rank: 60, aliases: ["real"] },
        { word: "vasco", rank: 61 },
        { word: "flamengo", rank: 62 },
        { word: "futebol", rank: 63 },
        { word: "plato", rank: 64 },
        { word: "ludo", rank: 65 },
        { word: "vela", rank: 66 },
        { word: "cama", rank: 67 },
        { word: "presente", rank: 68, aliases: ["presentes"] },
        { word: "música", rank: 69, aliases: ["musica", "músicas", "musicas"] },
        { word: "spotify", rank: 70 },
        { word: "texto", rank: 71, aliases: ["textinho", "textos"] },
        { word: "palavra", rank: 72, aliases: ["palavras"] },
        { word: "afirmação", rank: 73, aliases: ["afirmacao", "afirmações", "afirmacoes"] },
        { word: "paraíso", rank: 74, aliases: ["paraiso", "paradise"] },
        { word: "verão", rank: 75, aliases: ["verao", "summer"] },
        { word: "lover", rank: 76, aliases: ["amante"] },
        { word: "memória", rank: 77, aliases: ["memoria", "memórias", "memorias"] },
        { word: "dias", rank: 78, aliases: ["dia"] },
        { word: "sorte", rank: 79 },
        { word: "destino", rank: 80 },
        { word: "coincidência", rank: 81, aliases: ["coincidencia", "coincidências", "coincidencias"] },
        { word: "rainha", rank: 82 },
        { word: "garota", rank: 83 },
        { word: "menina", rank: 84 },
        { word: "casal", rank: 85 },
        { word: "relacionamento", rank: 86 },
        { word: "rio grande do norte", rank: 87, aliases: ["rn"] },
        { word: "são paulo", rank: 88, aliases: ["sao paulo", "sp"] },
        { word: "nordeste", rank: 89 },
        { word: "sudeste", rank: 90 },
        { word: "afeto", rank: 91 },
        { word: "ternura", rank: 92 },
        { word: "romance", rank: 93 },
        { word: "desejo", rank: 94 },
        { word: "admiração", rank: 95, aliases: ["admiracao"] },
        { word: "confiança", rank: 96, aliases: ["confianca"] },
        { word: "segurança", rank: 97, aliases: ["seguranca"] },
        { word: "conforto", rank: 98 },
        { word: "felicidade", rank: 99 },
        { word: "alegria", rank: 100 },
        { word: "intensidade", rank: 101 },
        { word: "conexão", rank: 102, aliases: ["conexao"] },
        { word: "proximidade", rank: 103 },
        { word: "companheira", rank: 104 },
        { word: "parceira", rank: 105 },
        { word: "união", rank: 106, aliases: ["uniao"] },
        { word: "compromisso", rank: 107 },
        { word: "futuro", rank: 108 },
        { word: "sempre", rank: 109 },
        { word: "eternidade", rank: 110 },
        { word: "vontade", rank: 111 },
        { word: "apego", rank: 112 },
        { word: "reciprocidade", rank: 113 },
        { word: "intimidade", rank: 114 },
        { word: "química", rank: 115, aliases: ["quimica"] },
        { word: "encanto", rank: 116 },
        { word: "sorriso", rank: 117 },
        { word: "olhar", rank: 118 },
        { word: "olhos", rank: 119, aliases: ["olho"] },
        { word: "voz", rank: 120 },
        { word: "cheiro", rank: 121 },
        { word: "toque", rank: 122 },
        { word: "colo", rank: 123 },
        { word: "mimo", rank: 124, aliases: ["mimos"] },
        { word: "surpresa", rank: 125 },
        { word: "carta", rank: 126, aliases: ["cartinha"] },
        { word: "poema", rank: 127 },
        { word: "dedicação", rank: 128, aliases: ["dedicacao"] },
        { word: "promessa", rank: 129 },
        { word: "sonho", rank: 130, aliases: ["sonhos"] },
        { word: "liberdade", rank: 131 },
        { word: "verdade", rank: 132 },
        { word: "honestidade", rank: 133 },
        { word: "calma", rank: 134 },
        { word: "paz", rank: 135 },
        { word: "proteção", rank: 136, aliases: ["protecao"] },
        { word: "presença", rank: 137, aliases: ["presenca"] },
        { word: "companhia", rank: 138 },
        { word: "pertinho", rank: 139, aliases: ["perto"] },
        { word: "juntas", rank: 140, aliases: ["junta"] },
        { word: "pessoa", rank: 141, aliases: ["pessoas"] },
        { word: "alguém", rank: 142, aliases: ["alguem"] },
        { word: "família", rank: 143, aliases: ["familia"] },
        { word: "mãe", rank: 144, aliases: ["mae"] },
        { word: "pai", rank: 145 },
        { word: "irmão", rank: 146, aliases: ["irmao"] },
        { word: "prima", rank: 147 },
        { word: "primo", rank: 148 },
        { word: "tia", rank: 149 },
        { word: "tio", rank: 150 },
        { word: "amigo", rank: 151, aliases: ["amigos"] },
        { word: "melhor amiga", rank: 152 },
        { word: "colega", rank: 153, aliases: ["colegas"] },
        { word: "conhecida", rank: 154 },
        { word: "parceiras", rank: 155 },
        { word: "garotas", rank: 156 },
        { word: "mulheres", rank: 157 },
        { word: "companheirismo", rank: 158 },
        { word: "crush", rank: 159 },
        { word: "paquera", rank: 160 },
        { word: "ficante", rank: 161 },
        { word: "ex", rank: 162 },
        { word: "sogra", rank: 163 },
        { word: "sogro", rank: 164 },
        { word: "cunhada", rank: 165 },
        { word: "sobrinha", rank: 166 },
        { word: "sobrinho", rank: 167 },
        { word: "criança", rank: 168, aliases: ["crianca"] },
        { word: "adulta", rank: 169 },
        { word: "humano", rank: 170 },
        { word: "gente", rank: 171 },
        { word: "nome", rank: 172 },
        { word: "apelido", rank: 173, aliases: ["apelidos"] },
        { word: "favorita", rank: 174, aliases: ["favorito"] },
        { word: "amorosa", rank: 175 },
        { word: "apaixonadas", rank: 176 },
        { word: "conversa", rank: 177, aliases: ["conversas"] },
        { word: "conversar", rank: 178 },
        { word: "ligação", rank: 179, aliases: ["ligacao"] },
        { word: "call", rank: 180 },
        { word: "chamada", rank: 181, aliases: ["chamadas"] },
        { word: "áudio", rank: 182, aliases: ["audio", "áudios", "audios"] },
        { word: "foto", rank: 183, aliases: ["fotos"] },
        { word: "vídeo", rank: 184, aliases: ["video", "vídeos", "videos"] },
        { word: "postagem", rank: 185, aliases: ["post"] },
        { word: "publicação", rank: 186, aliases: ["publicacao"] },
        { word: "perfil", rank: 187 },
        { word: "timeline", rank: 188, aliases: ["tl"] },
        { word: "internet", rank: 189 },
        { word: "rede social", rank: 190, aliases: ["redes sociais"] },
        { word: "celular", rank: 191 },
        { word: "iphone", rank: 192 },
        { word: "notificação", rank: 193, aliases: ["notificacao", "notificações", "notificacoes"] },
        { word: "resposta", rank: 194, aliases: ["respostas"] },
        { word: "comentário", rank: 195, aliases: ["comentario", "comentários", "comentarios"] },
        { word: "curtida", rank: 196, aliases: ["curtidas"] },
        { word: "seguidor", rank: 197, aliases: ["seguidores"] },
        { word: "seguir", rank: 198 },
        { word: "bloquear", rank: 199, aliases: ["block"] },
        { word: "desbloquear", rank: 200 },
        { word: "online", rank: 201 },
        { word: "offline", rank: 202 },
        { word: "madrugada", rank: 203 },
        { word: "bom dia", rank: 204 },
        { word: "boa noite", rank: 205 },
        { word: "risada", rank: 206, aliases: ["risadas"] },
        { word: "emoji", rank: 207, aliases: ["emojis"] },
        { word: "coraçãozinho", rank: 208, aliases: ["coracaozinho"] },
        { word: "print", rank: 209, aliases: ["prints"] },
        { word: "assunto", rank: 210, aliases: ["assuntos"] },
        { word: "segredo", rank: 211, aliases: ["segredos"] },
        { word: "teclado", rank: 212 },
        { word: "tela", rank: 213 },
        { word: "site", rank: 214 },
        { word: "link", rank: 215 },
        { word: "perfilzinho", rank: 216 },
        { word: "hoje", rank: 217 },
        { word: "ontem", rank: 218 },
        { word: "amanhã", rank: 219, aliases: ["amanha"] },
        { word: "manhã", rank: 220, aliases: ["manha"] },
        { word: "tarde", rank: 221 },
        { word: "noite", rank: 222 },
        { word: "semana", rank: 223, aliases: ["semanas"] },
        { word: "mês", rank: 224, aliases: ["mes", "meses"] },
        { word: "ano", rank: 225, aliases: ["anos"] },
        { word: "hora", rank: 226, aliases: ["horas"] },
        { word: "minuto", rank: 227, aliases: ["minutos"] },
        { word: "março", rank: 228, aliases: ["marco"] },
        { word: "maio", rank: 229 },
        { word: "junho", rank: 230 },
        { word: "julho", rank: 231 },
        { word: "agosto", rank: 232 },
        { word: "setembro", rank: 233 },
        { word: "novembro", rank: 234 },
        { word: "dezembro", rank: 235 },
        { word: "cidade", rank: 236, aliases: ["cidades"] },
        { word: "casa", rank: 237 },
        { word: "quarto", rank: 238 },
        { word: "rua", rank: 239 },
        { word: "viagem", rank: 240, aliases: ["viagens"] },
        { word: "aeroporto", rank: 241 },
        { word: "estrada", rank: 242 },
        { word: "praia", rank: 243 },
        { word: "céu", rank: 244, aliases: ["ceu"] },
        { word: "sol", rank: 245 },
        { word: "lua", rank: 246 },
        { word: "estrela", rank: 247, aliases: ["estrelas"] },
        { word: "longe", rank: 248 },
        { word: "aqui", rank: 249 },
        { word: "lá", rank: 250, aliases: ["la"] },
        { word: "filme", rank: 251, aliases: ["filmes"] },
        { word: "série", rank: 252, aliases: ["serie", "séries", "series"] },
        { word: "álbum", rank: 253, aliases: ["album", "álbuns", "albuns"] },
        { word: "cantora", rank: 254, aliases: ["cantoras"] },
        { word: "cantor", rank: 255, aliases: ["cantores"] },
        { word: "banda", rank: 256, aliases: ["bandas"] },
        { word: "grupo", rank: 257, aliases: ["grupos"] },
        { word: "dança", rank: 258, aliases: ["danca"] },
        { word: "show", rank: 259, aliases: ["shows"] },
        { word: "palco", rank: 260 },
        { word: "cinema", rank: 261 },
        { word: "televisão", rank: 262, aliases: ["televisao", "tv"] },
        { word: "personagem", rank: 263, aliases: ["personagens"] },
        { word: "herói", rank: 264, aliases: ["heroi", "heróis", "herois"] },
        { word: "vilão", rank: 265, aliases: ["vilao", "vilões", "viloes"] },
        { word: "quadrinho", rank: 266, aliases: ["quadrinhos"] },
        { word: "jogo", rank: 267, aliases: ["jogos"] },
        { word: "videogame", rank: 268, aliases: ["video game"] },
        { word: "time", rank: 269, aliases: ["times"] },
        { word: "jogador", rank: 270, aliases: ["jogadores"] },
        { word: "gol", rank: 271, aliases: ["gols"] },
        { word: "camisa", rank: 272, aliases: ["camisas"] },
        { word: "torcida", rank: 273 },
        { word: "estádio", rank: 274, aliases: ["estadio"] },
        { word: "esporte", rank: 275, aliases: ["esportes"] },
        { word: "playlist", rank: 276, aliases: ["playlists"] },
        { word: "lego", rank: 277 },
        { word: "livro", rank: 278, aliases: ["livros"] },
        { word: "leitura", rank: 279 },
        { word: "história", rank: 280, aliases: ["historia", "histórias", "historias"] },
        { word: "coisa", rank: 281, aliases: ["coisas"] },
        { word: "objeto", rank: 282, aliases: ["objetos"] },
        { word: "lugar", rank: 283, aliases: ["lugares"] },
        { word: "comida", rank: 284, aliases: ["comidas"] },
        { word: "bebida", rank: 285, aliases: ["bebidas"] },
        { word: "animal", rank: 286, aliases: ["animais"] },
        { word: "gato", rank: 287, aliases: ["gatos"] },
        { word: "cachorro", rank: 288, aliases: ["cachorros"] },
        { word: "flor", rank: 289, aliases: ["flores"] },
        { word: "cor", rank: 290, aliases: ["cores"] },
        { word: "roupa", rank: 291, aliases: ["roupas"] },
        { word: "sapato", rank: 292, aliases: ["sapatos"] },
        { word: "trabalho", rank: 293, aliases: ["trabalhos"] },
        { word: "faculdade", rank: 294 },
        { word: "escola", rank: 295 },
        { word: "aula", rank: 296, aliases: ["aulas"] },
        { word: "projeto", rank: 297, aliases: ["projetos"] },
        { word: "computador", rank: 298 },
        { word: "código", rank: 299, aliases: ["codigo"] },
        { word: "dinheiro", rank: 300 },
        { word: "número", rank: 301, aliases: ["numero", "números", "numeros"] },
        { word: "data", rank: 302, aliases: ["datas"] },
        { word: "frase", rank: 303, aliases: ["frases"] },
        { word: "pergunta", rank: 304, aliases: ["perguntas"] },
        { word: "caminho", rank: 305, aliases: ["caminhos"] },
        { word: "começo", rank: 306, aliases: ["comeco"] },
        { word: "fim", rank: 307 },
        { word: "mundo", rank: 308 },
        { word: "tempo", rank: 309 },
        { word: "ideia", rank: 310, aliases: ["ideias"] },
        { word: "mentira", rank: 311, aliases: ["mentiras"] },
        { word: "problema", rank: 312, aliases: ["problemas"] },
        { word: "escolha", rank: 313, aliases: ["escolhas"] },
        { word: "ação", rank: 314, aliases: ["acao", "ações", "acoes"] },
        { word: "impacto", rank: 315 },
        { word: "momento", rank: 316, aliases: ["momentos"] },
        { word: "parte", rank: 317, aliases: ["partes"] },
        { word: "forma", rank: 318, aliases: ["formas"] },
        { word: "jeito", rank: 319, aliases: ["jeitos"] },
        { word: "motivo", rank: 320, aliases: ["motivos"] }
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
        if (rank <= 15) return 'context-hot';
        if (rank <= 50) return 'context-warm';
        if (rank <= 120) return 'context-mild';
        return 'context-cold';
    }

    function contextProgress2207(rank) {
        const maxRank = contextWords2207.length;
        const logarithmicCloseness = 1 - (Math.log(rank) / Math.log(maxRank + 1));
        return Math.max(7, Math.min(100, Math.round(7 + logarithmicCloseness * 93)));
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

        const best = guesses.find(guess => !guess.seed) || null;
        if (contextBest2207) {
            contextBest2207.textContent = best ? `${best.word} · #${best.rank}` : '—';
        }
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

    function setContextReviewOpen2207(open) {
        if (!contextGame2207 || !contextReviewToggle2207) return;

        contextGame2207.hidden = !open;
        contextReviewToggle2207.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (contextReviewLabel2207) {
            contextReviewLabel2207.textContent = open
                ? 'ocultar palavras e palpites'
                : 'ver palavras e palpites';
        }

        requestAnimationFrame(() => {
            refreshAccordion(contextReview2207 || contextReward2207, 40);
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
        }, 450);

        setTimeout(() => {
            if (!contextReward2207) return;
            contextReward2207.hidden = false;
            requestAnimationFrame(() => {
                contextReward2207.classList.add('show');
                refreshAccordion(contextReward2207, 40);
            });
        }, 1500);

        setTimeout(() => {
            if (contextReview2207) contextReview2207.hidden = false;
            setContextReviewOpen2207(false);

            requestAnimationFrame(() => {
                refreshAccordion(contextReward2207 || contextReview2207, 40);
                if (contextReward2207) {
                    contextReward2207.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }, 2500);
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
            if (contextFeedback2207) contextFeedback2207.textContent = 'essa palavra ainda não entrou no nosso dicionário… tenta outra.';
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
            contextFeedback2207.textContent = result.rank <= 15
                ? 'tá queimando… você chegou muito perto.'
                : result.rank <= 50
                    ? 'quentinha. continua seguindo esse caminho.'
                    : result.rank <= 120
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
            const open = contextReviewToggle2207.getAttribute('aria-expanded') !== 'true';
            setContextReviewOpen2207(open);
        });
    }



    // 11. JOGO DA MEMÓRIA DO EU TE AMO (DIA 30.07)
    const loveMemoryGame3007 = document.getElementById('love-memory-game-3007');
    const memoryPlayView3007 = document.getElementById('memory-play-view-3007');
    const memoryCompletionView3007 = document.getElementById('memory-completion-view-3007');
    const memoryGrid3007 = document.getElementById('memory-grid-3007');
    const memoryMatches3007 = document.getElementById('memory-matches-3007');
    const memoryAttempts3007 = document.getElementById('memory-attempts-3007');
    const memoryInstruction3007 = document.getElementById('memory-instruction-3007');
    const memoryPreview3007 = document.getElementById('memory-preview-3007');
    const memoryReplay3007 = document.getElementById('memory-replay-3007');
    const memoryLanguagesToggle3007 = document.getElementById('memory-languages-toggle-3007');
    const memoryLanguageList3007 = document.getElementById('memory-language-list-3007');

    const memoryPairs3007 = [
        { id: 'pt', language: 'português', phrase: 'eu te amo' },
        { id: 'it', language: 'italiano', phrase: 'io ti amo' },
        { id: 'en', language: 'inglês', phrase: 'I love you' },
        { id: 'es', language: 'espanhol', phrase: 'yo te amo' },
        { id: 'tl', language: 'filipino', phrase: 'mahal kita' },
        { id: 'ko', language: 'coreano', phrase: '사랑해' },
        { id: 'zh', language: 'mandarim', phrase: '我爱你' },
        { id: 'hi', language: 'hindi', phrase: 'मैं तुमसे प्यार करती हूँ', longPhrase: true }
    ];

    let memoryOpenedCards3007 = [];
    let memoryLocked3007 = false;
    let memoryPreviewing3007 = false;
    let memoryMatchesCount3007 = 0;
    let memoryAttemptsCount3007 = 0;
    let memoryFinishTimer3007 = null;

    function shuffleMemory3007(array) {
        const clone = [...array];
        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }
        return clone;
    }

    function updateMemoryScore3007() {
        if (memoryMatches3007) memoryMatches3007.textContent = `${memoryMatchesCount3007}/${memoryPairs3007.length}`;
        if (memoryAttempts3007) memoryAttempts3007.textContent = String(memoryAttemptsCount3007);
    }

    function memoryCardMarkup3007(cardData) {
        const compactClass = cardData.longContent ? ' memory-card-front-small' : '';
        return `
            <span class="memory-card-back" aria-hidden="true">♡</span>
            <span class="memory-card-front${compactClass}">${cardData.content}</span>
        `;
    }

    function renderMemoryDeck3007() {
        if (!memoryGrid3007) return;
        memoryGrid3007.innerHTML = '';

        const deck = shuffleMemory3007(
            memoryPairs3007.flatMap(pair => [
                {
                    pairId: pair.id,
                    type: 'language',
                    content: pair.language,
                    label: `idioma ${pair.language}`,
                    longContent: pair.language.length > 12
                },
                {
                    pairId: pair.id,
                    type: 'phrase',
                    content: pair.phrase,
                    label: `frase ${pair.phrase}`,
                    longContent: Boolean(pair.longPhrase)
                }
            ])
        );

        deck.forEach(cardData => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'memory-card';
            button.dataset.pairId = cardData.pairId;
            button.dataset.cardType = cardData.type;
            button.dataset.cardLabel = cardData.label;
            button.setAttribute('aria-label', 'carta virada para baixo');
            button.innerHTML = memoryCardMarkup3007(cardData);
            button.addEventListener('click', () => handleMemoryCardClick3007(button));
            memoryGrid3007.appendChild(button);
        });
    }

    function closeMemoryCards3007() {
        memoryOpenedCards3007.forEach(card => {
            if (!card.classList.contains('is-matched')) {
                card.classList.remove('is-revealed');
                card.setAttribute('aria-label', 'carta virada para baixo');
            }
        });
        memoryOpenedCards3007 = [];
        memoryLocked3007 = false;
    }

    function showMemoryCompletion3007() {
        if (!memoryPlayView3007 || !memoryCompletionView3007) return;
        memoryLocked3007 = true;
        memoryPlayView3007.classList.add('is-leaving');

        setTimeout(() => {
            memoryPlayView3007.hidden = true;
            memoryPlayView3007.classList.remove('is-leaving');
            memoryCompletionView3007.hidden = false;

            requestAnimationFrame(() => {
                memoryCompletionView3007.classList.add('show');
                refreshAccordion(memoryCompletionView3007);
                setTimeout(() => {
                    memoryCompletionView3007.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 180);
            });
        }, 420);
    }

    function matchMemoryCards3007() {
        memoryOpenedCards3007.forEach(card => {
            card.classList.remove('is-revealed');
            card.classList.add('is-matched');
            card.disabled = true;
            card.setAttribute('aria-label', `${card.dataset.cardLabel} encontrado`);
        });

        memoryOpenedCards3007 = [];
        memoryLocked3007 = false;
        memoryMatchesCount3007++;
        updateMemoryScore3007();

        if (memoryInstruction3007 && memoryMatchesCount3007 < memoryPairs3007.length) {
            const remaining = memoryPairs3007.length - memoryMatchesCount3007;
            memoryInstruction3007.textContent = remaining === 1
                ? 'falta só um par pra revelar tudo ♡'
                : `mais ${remaining} pares e a mensagem final aparece.`;
        }

        if (memoryMatchesCount3007 === memoryPairs3007.length) {
            if (memoryInstruction3007) {
                memoryInstruction3007.textContent = 'achou tudo, minha linda ♡';
            }
            memoryFinishTimer3007 = setTimeout(showMemoryCompletion3007, 1050);
        }
    }

    function handleMemoryCardClick3007(card) {
        if (!card || memoryLocked3007 || memoryPreviewing3007 || card.classList.contains('is-revealed') || card.classList.contains('is-matched')) return;

        card.classList.add('is-revealed');
        card.setAttribute('aria-label', card.dataset.cardLabel);
        memoryOpenedCards3007.push(card);

        if (memoryOpenedCards3007.length < 2) return;

        memoryLocked3007 = true;
        memoryAttemptsCount3007++;
        updateMemoryScore3007();

        const [firstCard, secondCard] = memoryOpenedCards3007;
        const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;

        if (isMatch) {
            setTimeout(matchMemoryCards3007, 480);
        } else {
            if (memoryInstruction3007) {
                memoryInstruction3007.textContent = 'não é um par, meu amor. tenta de novo ♡';
            }
            setTimeout(closeMemoryCards3007, 820);
        }
    }

    function previewAllMemoryCards3007() {
        if (!memoryGrid3007 || !memoryPreview3007 || memoryLocked3007 || memoryPreviewing3007) return;

        memoryPreviewing3007 = true;
        memoryPreview3007.disabled = true;
        memoryPreview3007.textContent = 'memorizando...';

        const alreadyRevealed = new Set(memoryOpenedCards3007);
        const cards = [...memoryGrid3007.querySelectorAll('.memory-card:not(.is-matched)')];
        cards.forEach(card => card.classList.add('is-preview'));

        setTimeout(() => {
            cards.forEach(card => {
                card.classList.remove('is-preview');
                if (alreadyRevealed.has(card)) card.classList.add('is-revealed');
            });
            memoryPreviewing3007 = false;
            memoryPreview3007.disabled = false;
            memoryPreview3007.textContent = 'ver todas por 2 segundos';
        }, 2000);
    }

    function resetMemoryGame3007() {
        if (memoryFinishTimer3007) clearTimeout(memoryFinishTimer3007);
        memoryOpenedCards3007 = [];
        memoryLocked3007 = false;
        memoryPreviewing3007 = false;
        memoryMatchesCount3007 = 0;
        memoryAttemptsCount3007 = 0;

        if (memoryCompletionView3007) {
            memoryCompletionView3007.classList.remove('show');
            memoryCompletionView3007.hidden = true;
        }
        if (memoryPlayView3007) {
            memoryPlayView3007.hidden = false;
            memoryPlayView3007.classList.remove('is-leaving');
        }
        if (memoryLanguageList3007) {
            memoryLanguageList3007.classList.remove('show');
            memoryLanguageList3007.hidden = true;
        }
        if (memoryLanguagesToggle3007) {
            memoryLanguagesToggle3007.setAttribute('aria-expanded', 'false');
            memoryLanguagesToggle3007.textContent = 'ver lista de línguas';
        }
        if (memoryInstruction3007) memoryInstruction3007.textContent = 'encontra todos os pares, meu amor ♡';
        if (memoryPreview3007) {
            memoryPreview3007.disabled = false;
            memoryPreview3007.textContent = 'ver todas por 2 segundos';
        }

        renderMemoryDeck3007();
        updateMemoryScore3007();
        refreshAccordion(loveMemoryGame3007);

        setTimeout(() => {
            loveMemoryGame3007?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    }

    function toggleMemoryLanguageList3007() {
        if (!memoryLanguageList3007 || !memoryLanguagesToggle3007) return;
        const opening = memoryLanguageList3007.hidden;

        if (opening) {
            memoryLanguageList3007.hidden = false;
            requestAnimationFrame(() => memoryLanguageList3007.classList.add('show'));
        } else {
            memoryLanguageList3007.classList.remove('show');
            setTimeout(() => {
                memoryLanguageList3007.hidden = true;
                refreshAccordion(memoryCompletionView3007);
            }, 260);
        }

        memoryLanguagesToggle3007.setAttribute('aria-expanded', opening ? 'true' : 'false');
        memoryLanguagesToggle3007.textContent = opening ? 'ocultar lista de línguas' : 'ver lista de línguas';
        refreshAccordion(memoryCompletionView3007);
    }

    if (memoryGrid3007) {
        renderMemoryDeck3007();
        updateMemoryScore3007();
    }
    if (memoryPreview3007) memoryPreview3007.addEventListener('click', previewAllMemoryCards3007);
    if (memoryReplay3007) memoryReplay3007.addEventListener('click', resetMemoryGame3007);
    if (memoryLanguagesToggle3007) memoryLanguagesToggle3007.addEventListener('click', toggleMemoryLanguageList3007);

    // =========================================================
    // BATMAN CASE FILE — 18.08
    // Cole este bloco DENTRO do seu DOMContentLoaded atual,
    // imediatamente antes do último "});" do script.js.
    // Ele usa a função refreshAccordion() que já existe no seu arquivo.
    // =========================================================

    const batcase1808 = document.getElementById('batcase-1808');
    const batcaseStart1808 = document.getElementById('batcase-start-1808');
    const batcaseInvestigation1808 = document.getElementById('batcase-investigation-1808');
    const batcaseEvidence1808 = document.querySelectorAll('#batcase-1808 .batcase-evidence');
    const batcaseProgress1808 = document.getElementById('batcase-progress-1808');
    const batcaseBoard1808 = document.getElementById('batcase-board-1808');
    const batcaseConclusion1808 = document.getElementById('batcase-conclusion-1808');
    const batcaseStatus1808 = document.getElementById('batcase-status-1808');
    const batcaseSignalButton1808 = document.getElementById('batcase-signal-button-1808');
    const batcaseReward1808 = document.getElementById('batcase-reward-1808');

    let batcaseOpened1808 = 0;
    let batcaseSolved1808 = false;
    let batcaseSignalUsed1808 = false;

    function showBatcaseBlock1808(element) {
        if (!element) return;

        element.hidden = false;
        requestAnimationFrame(() => {
            element.classList.add('show');
            refreshAccordion(element);
        });
    }

    function updateBatcaseProgress1808() {
        if (!batcaseProgress1808) return;
        batcaseProgress1808.textContent = `${batcaseOpened1808} / ${batcaseEvidence1808.length} evidências analisadas`;
    }

    function solveBatcase1808() {
        if (batcaseSolved1808) return;
        batcaseSolved1808 = true;

        if (batcaseStatus1808) batcaseStatus1808.textContent = 'SOLVED';

        setTimeout(() => {
            showBatcaseBlock1808(batcaseBoard1808);
        }, 500);

        setTimeout(() => {
            showBatcaseBlock1808(batcaseConclusion1808);
        }, 1500);
    }

    function releaseBatcaseBats1808(button) {
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        for (let i = 0; i < 14; i++) {
            const bat = document.createElement('div');
            bat.className = 'batcase-flying-bat';
            bat.textContent = '🦇';
            bat.style.left = `${startX}px`;
            bat.style.top = `${startY}px`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 90 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rot = (Math.random() - .5) * 120;

            bat.style.setProperty('--tx', `${tx}px`);
            bat.style.setProperty('--ty', `${ty}px`);
            bat.style.setProperty('--rot', `${rot}deg`);

            document.body.appendChild(bat);
            setTimeout(() => bat.remove(), 1450);
        }
    }

    if (batcaseStart1808 && batcaseInvestigation1808) {
        batcaseStart1808.addEventListener('click', () => {
            batcaseStart1808.disabled = true;
            batcaseStart1808.textContent = 'investigação iniciada';
            showBatcaseBlock1808(batcaseInvestigation1808);

            setTimeout(() => {
                batcaseInvestigation1808.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 220);
        });
    }

    if (batcaseEvidence1808.length) {
        batcaseEvidence1808.forEach(evidence => {
            evidence.addEventListener('click', () => {
                if (evidence.classList.contains('opened')) return;

                evidence.classList.add('opened');
                evidence.setAttribute('aria-expanded', 'true');

                const lock = evidence.querySelector('.batcase-lock');
                if (lock) lock.textContent = 'ANALYZED';

                batcaseOpened1808++;
                updateBatcaseProgress1808();
                refreshAccordion(evidence);

                if (batcaseOpened1808 === batcaseEvidence1808.length) {
                    if (batcaseProgress1808) {
                        batcaseProgress1808.textContent = '5 / 5 evidências analisadas // padrão identificado';
                    }
                    solveBatcase1808();
                }
            });
        });
    }

    if (batcaseSignalButton1808) {
        batcaseSignalButton1808.addEventListener('click', () => {
            if (batcaseSignalUsed1808) return;
            batcaseSignalUsed1808 = true;

            batcaseSignalButton1808.classList.add('lit');
            batcaseSignalButton1808.disabled = true;
            releaseBatcaseBats1808(batcaseSignalButton1808);

            setTimeout(() => {
                showBatcaseBlock1808(batcaseReward1808);
                refreshAccordion(batcase1808);
            }, 850);

            setTimeout(() => {
                batcaseReward1808?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1150);
        });
    }
    // =========================================================
    // PAREDÃO DE VESTÍGIOS — 25.08
    // =========================================================

    const fossilDig2508 = document.getElementById('fossil-dig-2508');
    const fossilSites2508 = document.querySelectorAll('#fossil-dig-2508 [data-fossil-site]');
    const fossilProgressText2508 = document.getElementById('fossil-progress-text-2508');
    const fossilProgressBar2508 = document.getElementById('fossil-progress-bar-2508');
    const fossilHelp2508 = document.getElementById('fossil-help-2508');
    const fossilDiscovery2508 = document.getElementById('fossil-discovery-2508');
    const fossilRecordButton2508 = document.getElementById('fossil-record-button-2508');
    const fossilReward2508 = document.getElementById('fossil-reward-2508');
    const fossilWall2508 = document.getElementById('fossil-wall-2508');

    let fossilFound2508 = 0;
    let fossilCompleted2508 = false;
    let fossilRewardShown2508 = false;

    function showFossilBlock2508(element) {
        if (!element) return;

        element.hidden = false;

        requestAnimationFrame(() => {
            element.classList.add('show');
            refreshAccordion(element);
        });
    }

    function updateFossilProgress2508() {
        const total = fossilSites2508.length;
        const percentage = total
            ? (fossilFound2508 / total) * 100
            : 0;

        if (fossilProgressText2508) {
            fossilProgressText2508.textContent =
                `${fossilFound2508} / ${total} ${fossilFound2508 === 1 ? 'vestígio encontrado' : 'vestígios encontrados'}`;
        }

        if (fossilProgressBar2508) {
            fossilProgressBar2508.style.width = `${percentage}%`;
        }

        if (!fossilHelp2508) return;

        const remaining = total - fossilFound2508;

        if (remaining === total) {
            fossilHelp2508.textContent =
                'ainda existem quatro pontos escondidos na rocha.';
        } else if (remaining > 1) {
            fossilHelp2508.textContent =
                `mais ${remaining} vestígios continuam escondidos no paredão.`;
        } else if (remaining === 1) {
            fossilHelp2508.textContent =
                'falta só um último vestígio.';
        } else {
            fossilHelp2508.textContent =
                'todos os vestígios foram encontrados.';
        }
    }

    function releaseFossilDust2508(site) {
        if (!site) return;

        const rect = site.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 14; i++) {
            const dust = document.createElement('span');
            dust.className = 'fossil-dust';

            const size = 3 + Math.random() * 6;
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 65;

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            dust.style.left = `${centerX + (Math.random() - .5) * rect.width * .35}px`;
            dust.style.top = `${centerY + (Math.random() - .5) * rect.height * .35}px`;

            dust.style.setProperty('--size', `${size}px`);
            dust.style.setProperty('--x', `${x}px`);
            dust.style.setProperty('--y', `${y}px`);

            document.body.appendChild(dust);

            setTimeout(() => {
                dust.remove();
            }, 800);
        }
    }

    function completeFossilDig2508() {
        if (fossilCompleted2508) return;
        fossilCompleted2508 = true;
        fossilWall2508?.classList.add('complete');

        if (fossilProgressText2508) {
            fossilProgressText2508.textContent =
                '4 / 4 vestígios encontrados // escavação concluída';
        }

        if (fossilHelp2508) {
            fossilHelp2508.textContent =
                'acho que já temos material suficiente para uma conclusão.';
        }

        setTimeout(() => {
            showFossilBlock2508(fossilDiscovery2508);

            setTimeout(() => {
                fossilDiscovery2508?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 250);
        }, 750);
    }

    if (fossilSites2508.length) {
        fossilSites2508.forEach(site => {
            site.addEventListener('click', () => {
                if (site.classList.contains('excavated')) return;

                releaseFossilDust2508(site);

                site.classList.add('excavated');
                const fossilKey = site.dataset.fossilKey;

                if (fossilKey === 'brachio') {
                    fossilWall2508?.classList.add('reveal-brachio');
                }

                if (fossilKey === 'raptor') {
                    fossilWall2508?.classList.add('reveal-raptor');
                }
                site.setAttribute('aria-expanded', 'true');
                site.disabled = true;

                fossilFound2508++;

                updateFossilProgress2508();
                refreshAccordion(site);

                if (fossilFound2508 === fossilSites2508.length) {
                    completeFossilDig2508();
                }
            });
        });

        updateFossilProgress2508();
    }

    if (fossilRecordButton2508) {
        fossilRecordButton2508.addEventListener('click', () => {
            if (fossilRewardShown2508) return;
            fossilRewardShown2508 = true;

            fossilRecordButton2508.disabled = true;
            fossilRecordButton2508.textContent = 'descoberta registrada ♡';

            showFossilBlock2508(fossilReward2508);
            refreshAccordion(fossilDig2508);

            setTimeout(() => {
                fossilReward2508?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    }

});