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

    // ===== CARROSSEL DE PROJETOS MELHORADO =====
    if (projectsSlider) {
        let currentPosition = 0;
        let projectCards = document.querySelectorAll('.project-card');
        const totalCards = projectCards.length;
        let visibleCards = 3; // Padrão para desktop
        let cardWidth = 0;
        let gapSize = 0;
        
        function calculateCardWidth() {
            const sliderWidth = projectsSlider.clientWidth;
            // lê gap real do CSS (.projects-slider { gap: X })
            gapSize = parseFloat(getComputedStyle(projectsSlider).gap) || 0;
            
            // define quantos cards aparecem de uma vez
            if (window.innerWidth <= 576) {
                visibleCards = 1;
            } else if (window.innerWidth <= 768) {
                visibleCards = 1;
            } else if (window.innerWidth <= 992) {
                visibleCards = 2;
            } else {
                visibleCards = 3;
            }
            
            // calcula largura (incluindo gaps)
            cardWidth = (sliderWidth - (gapSize * (visibleCards - 1))) / visibleCards;
            
            projectCards.forEach(card => {
                card.style.minWidth = `${cardWidth}px`;
                card.style.maxWidth = `${cardWidth}px`;
                card.style.flexShrink = '0'; // impede encolhimento
            });
            
            currentPosition = 0;
            updateCarouselPosition();
        }
        
        // próximo
        carouselBtns[1].addEventListener('click', () => {
            const maxSlides = totalCards - visibleCards;
            const maxPosition = -(maxSlides * (cardWidth + gapSize));
            if (currentPosition > maxPosition) {
                currentPosition -= (cardWidth + gapSize);
                updateCarouselPosition();
            }
        });
        
        // anterior
        carouselBtns[0].addEventListener('click', () => {
            if (currentPosition < 0) {
                currentPosition += (cardWidth + gapSize);
                updateCarouselPosition();
            }
        });
        
        function updateCarouselPosition() {
            const maxSlides = Math.max(totalCards - visibleCards, 0);
            const maxPosition = -(maxSlides * (cardWidth + gapSize));
            
            // ajusta dentro dos limites
            currentPosition = Math.max(currentPosition, maxPosition);
            currentPosition = Math.min(currentPosition, 0);
            
            // aplica deslocamento
            projectsSlider.style.transform = `translateX(${currentPosition}px)`;
            
            // atualiza visibilidade das setas
            carouselBtns[0].style.opacity = currentPosition < 0 ? '1' : '0.5';
            carouselBtns[1].style.opacity = currentPosition > maxPosition ? '1' : '0.5';
        }
        
        window.addEventListener('resize', () => {
            projectCards = document.querySelectorAll('.project-card');
            calculateCardWidth();
        });
        
        calculateCardWidth();
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