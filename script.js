// Melhorias no JavaScript para o carrossel responsivo
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const scrollTopBtn = document.getElementById('scroll-top');
    const carouselBtns = document.querySelectorAll('.carousel-btn');
    const projectsSlider = document.querySelector('.projects-slider');
    
    // Animações de entrada para elementos
    const animatedElements = document.querySelectorAll('.animated');

    // ===== HEADER FIXO AO ROLAR =====
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            scrollTopBtn.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            scrollTopBtn.classList.remove('active');
        }
    });

    // ===== MENU MÓVEL TOGGLE =====
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Alterna o ícone (hamburger/close)
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // ===== ANIMAÇÕES AO ROLAR =====
    function checkAnimations() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
            }
        });
    }

    // Verifica animações no carregamento e ao rolar
    checkAnimations();
    window.addEventListener('scroll', checkAnimations);

    // ===== CARROSSEL DE PROJETOS APRIMORADO =====
    if (projectsSlider) {
        // Verificar se os botões do carrossel existem
        if (carouselBtns.length < 2) {
            console.warn('Botões do carrossel não encontrados. Verifique os seletores.');
        } else {
            // Configurações iniciais
            let currentPosition = 0;
            let visibleCards = 3; // Padrão para desktop
            let cardWidth = 0;
            let gapSize = 20; // Valor padrão de gap
            let totalCards = 0;
            let maxPosition = 0;
            
            // Função para obter os cards atualizados
            function getProjectCards() {
                return Array.from(document.querySelectorAll('.project-card'));
            }
            
            // Função para calcular dimensões responsivas
            function calculateCarouselDimensions() {
                // Verificar se o projectsSlider existe antes de prosseguir
                if (!projectsSlider) {
                    console.error('projects-slider não encontrado no DOM');
                    return;
                }
                
                const projectCards = getProjectCards();
                totalCards = projectCards.length;
                
                // Verificar se existem cards no carrossel
                if (totalCards === 0) {
                    console.warn('Nenhum card de projeto encontrado.');
                    // Esconder os botões de navegação se não houver cards
                    carouselBtns.forEach(btn => btn.style.display = 'none');
                    return;
                }
                
                // Resto do código com verificações adicionais de segurança
                projectsSlider.style.transition = 'none';
                
                // Usar getBoundingClientRect para dimensões mais precisas
                const carouselContainer = projectsSlider.closest('.carousel');
                const containerWidth = carouselContainer ? carouselContainer.getBoundingClientRect().width : projectsSlider.parentElement.getBoundingClientRect().width;
                
                // Debug para dispositivos móveis
                console.log('Container width:', containerWidth);
                
                // Ajuste para telas muito pequenas
                if (window.innerWidth <= 480) {
                    visibleCards = 1;
                    // Forçar exibição em tela cheia em dispositivos muito pequenos
                    cardWidth = containerWidth - 20; // Remover apenas o padding lateral
                } else if (window.innerWidth <= 576) {
                    visibleCards = 1;
                } else if (window.innerWidth <= 768) {
                    visibleCards = 1;
                } else if (window.innerWidth <= 992) {
                    visibleCards = 2;
                } else {
                    visibleCards = 3;
                }
                
                // Verificação adicional para evitar problemas com CSS não carregado
                try {
                    const computedStyle = window.getComputedStyle(projectsSlider);
                    gapSize = parseInt(computedStyle.gap) || parseInt(computedStyle.columnGap) || 20;
                } catch (e) {
                    gapSize = 20;
                    console.warn('Erro ao obter o gap do CSS:', e);
                }
                
                // Garantir cardWidth mínimo para evitar layout quebrado
                cardWidth = Math.max((containerWidth - (gapSize * (visibleCards - 1))) / visibleCards, 250);
                
                // Aplicar as dimensões
                projectCards.forEach(card => {
                    card.style.width = `${cardWidth}px`;
                    card.style.minWidth = `${cardWidth}px`;
                    // Debug para dispositivos móveis
                    console.log('Card width set to:', cardWidth);
                });
                
                // Recalcular maxPosition apenas se houver cards suficientes
                if (totalCards > visibleCards) {
                    const totalWidth = (cardWidth * totalCards) + (gapSize * (totalCards - 1));
                    const visibleWidth = containerWidth;
                    maxPosition = visibleWidth - totalWidth;
                    
                    // Debug para valores críticos
                    console.log('Total width:', totalWidth);
                    console.log('Visible width:', visibleWidth);
                    console.log('Max position:', maxPosition);
                } else {
                    maxPosition = 0;
                    currentPosition = 0;
                }
                
                // Garantir que a posição atual esteja dentro dos limites
                if (currentPosition < maxPosition) {
                    currentPosition = maxPosition;
                }
                
                // Aplicar a posição
                projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                
                // Restaurando a transição suave após os cálculos
                setTimeout(() => {
                    projectsSlider.style.transition = 'transform 0.4s ease-in-out';
                }, 50);
                
                // Atualizar os botões
                updateButtonsVisibility();
            }
            
            // Função para atualizar a visibilidade dos botões com base na posição atual
            function updateButtonsVisibility() {
                // Botão anterior (mostrar apenas se não estiver no início)
                carouselBtns[0].style.opacity = currentPosition < 0 ? '1' : '0.5';
                
                // Botão próximo (mostrar apenas se não estiver no final)
                carouselBtns[1].style.opacity = currentPosition > maxPosition ? '1' : '0.5';
                
                // Se o número de cards for menor ou igual ao número visível, ocultar ambos os botões
                if (totalCards <= visibleCards) {
                    carouselBtns.forEach(btn => btn.style.display = 'none');
                } else {
                    carouselBtns.forEach(btn => btn.style.display = '');
                }
            }
            
            // Navegar para a esquerda (botão anterior)
            carouselBtns[0].addEventListener('click', function() {
                if (currentPosition < 0) {
                    // Avançar um card por vez + o espaço do gap
                    currentPosition += cardWidth + gapSize;
                    
                    // Limitar ao início (0)
                    if (currentPosition > 0) currentPosition = 0;
                    
                    // Aplicar a transformação com transição suave
                    projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                    
                    // Atualizar estado dos botões
                    updateButtonsVisibility();
                }
            });
            
            // Navegar para a direita (botão próximo)
            carouselBtns[1].addEventListener('click', function() {
                if (currentPosition > maxPosition) {
                    // Retroceder um card por vez + o espaço do gap
                    currentPosition -= cardWidth + gapSize;
                    
                    // Limitar ao final (maxPosition)
                    if (currentPosition < maxPosition) currentPosition = maxPosition;
                    
                    // Aplicar a transformação com transição suave
                    projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                    
                    // Atualizar estado dos botões
                    updateButtonsVisibility();
                }
            });
            
            // Observador de mutações para detectar mudanças no conteúdo do carrossel
            const observer = new MutationObserver(function(mutations) {
                let needsRecalculation = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && 
                        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                        needsRecalculation = true;
                    }
                });
                
                if (needsRecalculation) {
                    calculateCarouselDimensions();
                }
            });
            
            // Configurar o observador para monitorar mudanças nos filhos do slider
            observer.observe(projectsSlider, { childList: true });
            
            // Recalcular dimensões ao redimensionar a janela (com debounce)
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(calculateCarouselDimensions, 250);
            });
            
            // Adicionar evento de carregamento para imagens
            window.addEventListener('load', calculateCarouselDimensions);
            
            // Inicializar após um pequeno atraso para garantir que o DOM está completamente carregado
            setTimeout(calculateCarouselDimensions, 100);
        }
    }

    // ===== BOTÃO VOLTAR AO TOPO =====
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== SCROLL SUAVE PARA LINKS DE ANCORAGEM =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});