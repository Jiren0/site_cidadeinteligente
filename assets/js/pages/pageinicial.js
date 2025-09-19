/**
 * KEFI - Sistema de Página Inicial Inteligente
 * Versão: 2.0
 * Autor: Sistema KEFI
 */

class KefiHomepage {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoSlideInterval = null;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.particles = [];
        
        // Configurações
        this.config = {
            slideInterval: 4000,
            transitionSpeed: 600,
            particleCount: 50,
            autoPlayPause: 3000,
            loadingDuration: 2500
        };
        
        this.init();
    }

    // Inicialização principal
    init() {
        this.waitForDOM(() => {
            this.setupElements();
            this.setupEventListeners();
            this.initializeParticles();
            this.initializeSlider();
            this.startAnimationCounters();
            this.setupIntersectionObserver();
            this.setupKeyboardNavigation();
            this.logSystemInfo();
        });
    }

    // Aguarda o DOM estar pronto
    waitForDOM(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Configurar elementos
    setupElements() {
        // Elementos do slider
        this.sliderTrack = document.getElementById('sliderTrack');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.progressBar = document.getElementById('progressBar');
        
        // Botões de ação
        this.startButton = document.getElementById('startButton');
        this.learnMoreButton = document.getElementById('learnMore');
        
        // Elementos de interface
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.particlesContainer = document.getElementById('particles');
        this.navbar = document.querySelector('.navbar');
        
        // Contadores
        this.statNumbers = document.querySelectorAll('.stat-number');
        
        this.totalSlides = this.slides.length;
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botões do slider
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.handleSliderNavigation('next'));
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.handleSliderNavigation('prev'));
        }

        // Indicadores
        this.indicators?.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.handleSliderNavigation(index));
        });

        // Botão principal
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.handleStartButton());
        }

        // Botão secundário
        if (this.learnMoreButton) {
            this.learnMoreButton.addEventListener('click', () => this.handleLearnMore());
        }

        // Controles de hover no slider
        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => this.pauseAutoSlide());
            sliderWrapper.addEventListener('mouseleave', () => this.resumeAutoSlide());
        }

        // Suporte touch
        this.setupTouchEvents();

        // Eventos de visibilidade
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

        // Scroll da navbar
        window.addEventListener('scroll', () => this.handleNavbarScroll());

        // Redimensionamento
        window.addEventListener('resize', () => this.handleResize());

        // Links da navegação
        this.setupNavigationLinks();
    }

    // Navegação do slider
    handleSliderNavigation(direction) {
        if (this.isTransitioning) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (this.currentSlide + 1) % this.totalSlides;
        } else if (direction === 'prev') {
            newIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        } else {
            newIndex = direction;
        }

        this.goToSlide(newIndex);
        this.resetAutoSlide();
    }

    // Ir para slide específico
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;

        // Remover classes ativas
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Atualizar índice
        this.currentSlide = slideIndex;

        // Mover slider
        const translateX = -slideIndex * (100 / this.totalSlides);
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;

        // Ativar slide atual
        this.slides[this.currentSlide]?.classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');

        // Atualizar cor de fundo baseada no slide
        this.updateSlideBackground();

        // Atualizar barra de progresso
        this.updateProgressBar();

        // Aplicar efeitos visuais
        this.applySlideEffects();

        setTimeout(() => {
            this.isTransitioning = false;
        }, this.config.transitionSpeed);
    }

    // Atualizar fundo do slide
    updateSlideBackground() {
        const currentSlideEl = this.slides[this.currentSlide];
        const bgColor = currentSlideEl?.dataset.bg || '#3b82f6';
        
        document.documentElement.style.setProperty('--primary', bgColor);
        
        // Animar mudança de cor suave
        document.body.style.transition = 'all 0.6s ease';
    }

    // Atualizar barra de progresso
    updateProgressBar() {
        if (this.progressBar) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    // Aplicar efeitos visuais
    applySlideEffects() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.style.transform = 'scale(1)';
                slide.style.opacity = '1';
                slide.style.filter = 'blur(0px)';
            } else {
                slide.style.transform = 'scale(0.9)';
                slide.style.opacity = '0.3';
                slide.style.filter = 'blur(1px)';
            }
        });
    }

    // Auto slide
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.handleSliderNavigation('next');
            }
        }, this.config.slideInterval);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resumeAutoSlide() {
        if (!this.autoSlideInterval) {
            setTimeout(() => {
                this.startAutoSlide();
            }, 1000);
        }
    }

    resetAutoSlide() {
        this.pauseAutoSlide();
        setTimeout(() => {
            this.startAutoSlide();
        }, this.config.autoPlayPause);
    }

    // Botão principal
    handleStartButton() {
        if (this.startButton.disabled) return;
        
        // Efeito visual
        this.startButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.startButton.style.transform = 'scale(1)';
        }, 150);

        // Mostrar loading
        this.showLoadingScreen();

        // Simular carregamento e redirecionamento
        setTimeout(() => {
            window.location.href = 'login.html';
        }, this.config.loadingDuration);
    }

    // Botão secundário
    handleLearnMore() {
        // Scroll suave para a seção do slider
        const showcaseSection = document.querySelector('.showcase-section');
        if (showcaseSection) {
            showcaseSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Tela de loading
    showLoadingScreen() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('active');
            
            // Desabilitar botão
            this.startButton.disabled = true;
            this.startButton.innerHTML = `
                <span class="btn-text">Carregando...</span>
                <div class="loading-spinner" style="width: 20px; height: 20px; margin-left: 0.5rem;"></div>
            `;
        }
    }

    // Suporte touch
    setupTouchEvents() {
        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (!sliderWrapper) return;

        sliderWrapper.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                this.handleSliderNavigation('prev');
            } else {
                this.handleSliderNavigation('next');
            }
        }
    }

    // Navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.handleSliderNavigation('prev');
                    break;
                case 'ArrowRight':
                    this.handleSliderNavigation('next');
                    break;
                case 'Enter':
                case ' ':
                    if (e.target === this.startButton) {
                        e.preventDefault();
                        this.handleStartButton();
                    }
                    break;
                case 'Escape':
                    if (this.loadingOverlay?.classList.contains('active')) {
                        this.loadingOverlay.classList.remove('active');
                    }
                    break;
            }
        });
    }

    // Inicializar partículas
    initializeParticles() {
        if (!this.particlesContainer) return;

        for (let i = 0; i < this.config.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const startX = Math.random() * window.innerWidth;
        const delay = Math.random() * 20;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            animation-delay: ${delay}s;
            animation-duration: ${20 + Math.random() * 10}s;
        `;

        this.particlesContainer.appendChild(particle);
        
        // Remover após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(); // Criar nova partícula
            }
        }, (30 + Math.random() * 10) * 1000);
    }

    // Contadores animados
    startAnimationCounters() {
        this.statNumbers.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += step;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Observer para animações
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Navbar scroll
    handleNavbarScroll() {
        if (this.navbar) {
            if (window.scrollY > 50) {
                this.navbar.style.background = 'rgba(10, 14, 26, 0.95)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'rgba(10, 14, 26, 0.8)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            }
        }
    }

    // Links de navegação
    setupNavigationLinks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href?.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Mudança de visibilidade
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAutoSlide();
        } else {
            this.resumeAutoSlide();
        }
    }

    // Redimensionamento
    handleResize() {
        // Recalcular posições se necessário
        if (this.slides.length > 0) {
            this.goToSlide(this.currentSlide);
        }
    }

    // Inicializar slider
    initializeSlider() {
        if (this.totalSlides > 0) {
            this.goToSlide(0);
            this.startAutoSlide();
        }
    }

    // Log do sistema
    logSystemInfo() {
        console.group('🚀 KEFI Homepage System');
        console.log('✅ Sistema inicializado com sucesso');
        console.log(`📊 Slides configurados: ${this.totalSlides}`);
        console.log(`⚙️ Intervalo auto-slide: ${this.config.slideInterval}ms`);
        console.log(`🎨 Partículas ativas: ${this.config.particleCount}`);
        console.log(`🔧 Versão: 2.0`);
        console.groupEnd();

        // Easter egg
        console.log('%cBem-vindo ao KEFI! 🌟', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
    }

    // Métodos públicos para debug
    getStatus() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            isAutoPlaying: !!this.autoSlideInterval,
            isTransitioning: this.isTransitioning
        };
    }

    // Controle manual do slider
    manualControl(action, value) {
        switch(action) {
            case 'goto':
                if (value >= 0 && value < this.totalSlides) {
                    this.goToSlide(value);
                }
                break;
            case 'play':
                this.startAutoSlide();
                break;
            case 'pause':
                this.pauseAutoSlide();
                break;
            case 'next':
                this.handleSliderNavigation('next');
                break;
            case 'prev':
                this.handleSliderNavigation('prev');
                break;
        }
    }
}

// Inicializar sistema
const kefiSystem = new KefiHomepage();

// Expor para debug global
window.KEFI = kefiSystem;

// Service Worker para cache (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(error => {
                console.log('SW falhou:', error);
            });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`⚡ Página carregada em: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    }, 1000);
});

// Preload de recursos críticos
const preloadResources = [
    'login.html',
    // Adicione outros recursos que precisam ser pré-carregados
];

preloadResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
});