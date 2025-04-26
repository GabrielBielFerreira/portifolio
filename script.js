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
                
                // Desativar transição durante os cálculos
                projectsSlider.style.transition = 'none';
                
                // Obter largura do container do carrossel
                const carouselContainer = projectsSlider.closest('.carousel');
                const containerWidth = carouselContainer ? carouselContainer.clientWidth : projectsSlider.parentElement.clientWidth;
                
                // Ajustar para o espaço dos botões de navegação
                const effectiveContainerWidth = containerWidth - 80; // Espaço para os botões (40px de cada lado)
                
                // Determinar número de cards visíveis com base na largura da tela
                if (window.innerWidth <= 480) {
                    visibleCards = 1;
                } else if (window.innerWidth <= 768) {
                    visibleCards = 1;
                } else if (window.innerWidth <= 992) {
                    visibleCards = 2;
                } else {
                    visibleCards = 3;
                }
                
                // Obter o gap do CSS
                const computedStyle = window.getComputedStyle(projectsSlider);
                gapSize = parseInt(computedStyle.gap) || parseInt(computedStyle.columnGap) || 20;
                
                // Calcular largura do card considerando o gap
                cardWidth = (effectiveContainerWidth - (gapSize * (visibleCards - 1))) / visibleCards;
                
                // Garantir largura mínima para evitar cards muito pequenos
                cardWidth = Math.max(cardWidth, 220);
                
                // Aplicar largura aos cards
                projectCards.forEach(card => {
                    card.style.width = `${cardWidth}px`;
                    card.style.minWidth = `${cardWidth}px`;
                    card.style.maxWidth = `${cardWidth}px`;
                });
                
                // Calcular a largura total do slider
                const totalWidth = (cardWidth * totalCards) + (gapSize * (totalCards - 1));
                
                // Calcular a posição máxima (negativa) para o slider
                maxPosition = -(totalWidth - (cardWidth * visibleCards + gapSize * (visibleCards - 1)));
                
                // Garantir que a posição atual esteja dentro dos limites
                if (currentPosition < maxPosition) {
                    currentPosition = maxPosition;
                }
                if (currentPosition > 0) {
                    currentPosition = 0;
                }
                
                // Aplicar a posição
                projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                
                // Restaurar a transição suave após os cálculos
                setTimeout(() => {
                    projectsSlider.style.transition = 'transform 0.4s ease-in-out';
                }, 50);
                
                // Atualizar visibilidade dos botões
                updateButtonsVisibility();
            }
            
            // Função para atualizar a visibilidade dos botões
            function updateButtonsVisibility() {
                // Botão anterior (mostrar apenas se não estiver no início)
                carouselBtns[0].style.opacity = currentPosition < 0 ? '1' : '0.5';
                carouselBtns[0].style.pointerEvents = currentPosition < 0 ? 'auto' : 'none';
                
                // Botão próximo (mostrar apenas se não estiver no final)
                carouselBtns[1].style.opacity = currentPosition > maxPosition ? '1' : '0.5';
                carouselBtns[1].style.pointerEvents = currentPosition > maxPosition ? 'auto' : 'none';
                
                // Se o número de cards for menor ou igual ao número visível, ocultar ambos os botões
                if (totalCards <= visibleCards) {
                    carouselBtns.forEach(btn => btn.style.display = 'none');
                } else {
                    carouselBtns.forEach(btn => btn.style.display = 'flex');
                }
            }
            
            // Navegar para a esquerda (botão anterior)
            carouselBtns[0].addEventListener('click', function() {
                if (currentPosition < 0) {
                    // Mover um card por vez
                    currentPosition += cardWidth + gapSize;
                    
                    // Limitar ao início
                    if (currentPosition > 0) currentPosition = 0;
                    
                    // Aplicar a transformação
                    projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                    
                    // Atualizar botões
                    updateButtonsVisibility();
                }
            });
            
            // Navegar para a direita (botão próximo)
            carouselBtns[1].addEventListener('click', function() {
                if (currentPosition > maxPosition) {
                    // Mover um card por vez
                    currentPosition -= cardWidth + gapSize;
                    
                    // Limitar ao final
                    if (currentPosition < maxPosition) currentPosition = maxPosition;
                    
                    // Aplicar a transformação
                    projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                    
                    // Atualizar botões
                    updateButtonsVisibility();
                }
            });
            
            // Adicionar suporte para gestos de toque (swipe)
            let touchStartX = 0;
            let touchEndX = 0;
            
            projectsSlider.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            projectsSlider.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50; // Mínimo de pixels para considerar um swipe
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe para a esquerda (próximo)
                    if (currentPosition > maxPosition) {
                        currentPosition -= cardWidth + gapSize;
                        if (currentPosition < maxPosition) currentPosition = maxPosition;
                        projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                        updateButtonsVisibility();
                    }
                }
                
                if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe para a direita (anterior)
                    if (currentPosition < 0) {
                        currentPosition += cardWidth + gapSize;
                        if (currentPosition > 0) currentPosition = 0;
                        projectsSlider.style.transform = `translateX(${currentPosition}px)`;
                        updateButtonsVisibility();
                    }
                }
            }
            
            // Recalcular dimensões ao redimensionar a janela (com debounce)
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(calculateCarouselDimensions, 250);
            });
            
            // Inicializar o carrossel
            window.addEventListener('load', calculateCarouselDimensions);
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
