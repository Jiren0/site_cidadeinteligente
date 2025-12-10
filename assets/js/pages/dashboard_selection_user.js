// Dashboard Selection Handler
class DashboardSelector {
    constructor() {
        this.cards = document.querySelectorAll('.dashboard-card');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.dashboardNames = {
            health: 'Saúde',
            education: 'Educação',
            security: 'Segurança',
            banking: 'Sistema Bancário'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initPageAnimation();
        this.logSystemInfo();
    }

    setupEventListeners() {
        // Card click handlers
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Performance monitoring
        window.addEventListener('load', () => this.logPerformance());
    }

    handleCardClick(e) {
        const card = e.currentTarget;
        const dashboard = card.dataset.dashboard;
        const href = card.getAttribute('href');

        // Se não for o dashboard de saúde (que já tem link), previne navegação
        if (href === '#') {
            e.preventDefault();
            this.showComingSoon(dashboard);
            return;
        }

        // Para dashboard de saúde, mostra loading
        e.preventDefault();
        this.showLoading(dashboard);
        
        // Simula carregamento e redireciona
        setTimeout(() => {
            window.location.href = href;
        }, 1500);
    }

    showLoading(dashboard) {
        this.loadingOverlay.classList.add('active');
        
        const loadingContent = this.loadingOverlay.querySelector('.loading-content');
        loadingContent.querySelector('h3').textContent = `Carregando ${this.dashboardNames[dashboard]}`;
        loadingContent.querySelector('p').textContent = 'Preparando sua experiência...';

        console.log(`🚀 Navegando para dashboard: ${this.dashboardNames[dashboard]}`);
    }

    showComingSoon(dashboard) {
        // Cria modal personalizado
        const modal = this.createModal(
            '🚧 Em Desenvolvimento',
            `Dashboard de ${this.dashboardNames[dashboard]} em desenvolvimento!`,
            'Em breve você poderá acessar todas as funcionalidades.'
        );

        document.body.appendChild(modal);

        // Auto remove após 3 segundos
        setTimeout(() => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }, 3000);

        console.log(`ℹ️ Dashboard ${this.dashboardNames[dashboard]} ainda não disponível`);
    }

    createModal(title, message, subtitle) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem 3rem;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            max-width: 90%;
            width: 400px;
            transition: opacity 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🚧</div>
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #ffffff;">${title}</h3>
            <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 0.5rem;">${message}</p>
            <p style="font-size: 0.9rem; color: #64748b;">${subtitle}</p>
        `;

        // Fechar ao clicar
        modal.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });

        return modal;
    }

    handleKeyboard(e) {
        // Esc para fechar loading
        if (e.key === 'Escape' && this.loadingOverlay.classList.contains('active')) {
            this.loadingOverlay.classList.remove('active');
        }

        // Números 1-4 para acesso rápido
        const keyMap = {
            '1': 'health',
            '2': 'education',
            '3': 'security',
            '4': 'banking'
        };

        if (keyMap[e.key]) {
            const card = document.querySelector(`[data-dashboard="${keyMap[e.key]}"]`);
            if (card) {
                card.click();
            }
        }

        // Ctrl/Cmd + H for help
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            this.showHelpModal();
        }
    }

    showHelpModal() {
        const helpContent = `
            ⌨️ Atalhos de Teclado:
            
            1 - Dashboard de Saúde
            2 - Dashboard de Educação
            3 - Dashboard de Segurança
            4 - Dashboard do Sistema Bancário
            ESC - Fechar loading
            Ctrl/Cmd + H - Mostrar esta ajuda
        `;

        const modal = this.createModal(
            '⌨️ Atalhos de Teclado',
            helpContent.trim().replace(/\n/g, '<br>'),
            'Use os números para navegação rápida'
        );

        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }, 5000);
    }

    initPageAnimation() {
        // Fade-in animation para body
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    logPerformance() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
                console.log(`⚡ Página carregada em: ${loadTime}ms`);
            }
        }, 1000);
    }

    logSystemInfo() {
        console.group('🎯 KEFI Dashboard Selector');
        console.log('✅ Sistema inicializado');
        console.log('📊 Dashboards disponíveis: 4');
        console.log('🎨 Tema: Moderno e Responsivo');
        console.log('⌨️ Atalhos: 1-4 para acesso rápido');
        console.log('💡 Dica: Pressione Ctrl+H para ajuda');
        console.groupEnd();

        console.log('%cBem-vindo ao KEFI! 🌟', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
    }

    // Método público para debug
    getStatus() {
        return {
            dashboards: this.dashboardNames,
            totalCards: this.cards.length,
            isLoading: this.loadingOverlay.classList.contains('active')
        };
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const selector = new DashboardSelector();
    
    // Expor para debug global
    window.DashboardSelector = selector;
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker falhou:', error);
            });
    });
}