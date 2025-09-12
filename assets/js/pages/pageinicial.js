// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do slider
    const sliderTrack = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const startButton = document.getElementById('startButton');

    // Configurações do slider
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Função para ir para um slide específico
    function goToSlide(slideIndex) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        currentSlide = slideIndex;

        const translateX = -slideIndex * (100 / totalSlides);
        sliderTrack.style.transform = `translateX(${translateX}%)`;

        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');

        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.transform = 'scale(1)';
                slide.style.opacity = '1';
            } else {
                slide.style.transform = 'scale(0.9)';
                slide.style.opacity = '0.7';
            }
        });
    }

    // Próximo slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    // Slide anterior
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    // Autoplay
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Botões de navegação
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 2000);
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 2000);
    });

    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            setTimeout(startAutoSlide, 2000);
        });
    });

    // Pausar/resumir no hover
    const sliderWrapper = document.querySelector('.slider-wrapper');
    sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
    sliderWrapper.addEventListener('mouseleave', startAutoSlide);

    // Botão "Começa agora!"
    startButton.addEventListener('click', function() {
        this.style.transform = 'translateY(0) scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-3px) scale(1)';
        }, 100);

        const originalText = this.textContent;
        this.textContent = 'CARREGANDO...';
        this.disabled = true;
        this.style.opacity = '0.8';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });

    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 2000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 2000);
        }
    });

    // Suporte touch/swipe
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            stopAutoSlide();
            setTimeout(startAutoSlide, 2000);
        }
    }

    // Observador de visibilidade
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });

    // Animações de entrada
    function animateOnLoad() {
        const mainTitle = document.querySelector('.main-title');
        const description = document.querySelector('.description');
        const ctaButton = document.querySelector('.cta-button');

        setTimeout(() => {
            mainTitle.style.opacity = '1';
            mainTitle.style.transform = 'translateY(0)';
        }, 200);

        setTimeout(() => {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
        }, 400);

        setTimeout(() => {
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }, 600);
    }

    // Inicialização
    function init() {
        goToSlide(0);
        startAutoSlide();
        animateOnLoad();

        console.log('Homepage carregada com sucesso!');
        console.log(`Slider inicializado com ${totalSlides} slides`);
    }

    init();

    // Estilos dinâmicos
    const dynamicStyles = `
        .main-title,
        .description,
        .cta-button {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
});

// Função de debug
function debugSlider() {
    console.log('Estado atual do slider:', {
        slideAtual: currentSlide,
        totalSlides: totalSlides,
        autoplayAtivo: !!autoSlideInterval
    });
}
