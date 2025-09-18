// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationsPanel = document.getElementById('notificationsPanel');
    
    // Modals
    const healthModal = document.getElementById('healthModal');
    const hygieneModal = document.getElementById('hygieneModal');
    
    // Botões de ação rápida
    const quickHealthBtn = document.getElementById('quickHealthBtn');
    const quickHygieneBtn = document.getElementById('quickHygieneBtn');
    const quickReportBtn = document.getElementById('quickReportBtn');
    
    // Botões dos cards
    const newHealthBtn = document.getElementById('newHealthBtn');
    const newHygieneBtn = document.getElementById('newHygieneBtn');
    const healthHistoryBtn = document.getElementById('healthHistoryBtn');
    const hygieneHistoryBtn = document.getElementById('hygieneHistoryBtn');
    
    // Botões de fechar modals
    const closeHealthModal = document.getElementById('closeHealthModal');
    const closeHygieneModal = document.getElementById('closeHygieneModal');
    const cancelHealthBtn = document.getElementById('cancelHealthBtn');
    const cancelHygieneBtn = document.getElementById('cancelHygieneBtn');
    
    // Formulários
    const healthForm = document.getElementById('healthForm');
    const hygieneForm = document.getElementById('hygieneForm');
    
    // Notificações
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    // Dados simulados
    let notifications = [
        {
            id: 1,
            icon: '🏥',
            title: 'Atendimento Confirmado',
            message: 'Seu atendimento foi agendado para hoje às 14h',
            time: '2 min atrás',
            unread: true
        },
        {
            id: 2,
            icon: '🗑️',
            title: 'Coleta Agendada',
            message: 'Coleta de lixo reciclável agendada para amanhã às 8h',
            time: '1 hora atrás',
            unread: true
        },
        {
            id: 3,
            icon: '💡',
            title: 'Nova Dica Disponível',
            message: 'Confira nossa dica sobre reciclagem de hoje',
            time: '3 horas atrás',
            unread: false
        }
    ];
    
    // Função para atualizar contador de notificações
    function updateNotificationCount() {
        const unreadCount = notifications.filter(n => n.unread).length;
        const countElement = document.querySelector('.notification-count');
        
        if (unreadCount > 0) {
            countElement.textContent = unreadCount;
            countElement.style.display = 'flex';
        } else {
            countElement.style.display = 'none';
        }
    }
    
    // Função para toggle do painel de notificações
    function toggleNotifications() {
        notificationsPanel.classList.toggle('active');
    }
    
    // Função para mostrar modal
    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Função para esconder modal
    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Função para mostrar toast de sucesso
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${type === 'success' ? '✅' : '❌'}</div>
            <div class="toast-message">${message}</div>
        `;
        
        // Adicionar estilos do toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        `;
        
        document.body.appendChild(toast);
        
        // Remover após 4 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 4000);
    }
    
    // Função para adicionar notificação
    function addNotification(icon, title, message) {
        const newNotification = {
            id: Date.now(),
            icon,
            title,
            message,
            time: 'Agora',
            unread: true
        };
        
        notifications.unshift(newNotification);
        updateNotificationCount();
        renderNotifications();
        
        // Auto-abrir painel se não estiver aberto
        if (!notificationsPanel.classList.contains('active')) {
            setTimeout(() => {
                showToast(`Nova notificação: ${title}`);
            }, 500);
        }
    }
    
    // Função para renderizar notificações
    function renderNotifications() {
        const notificationsList = document.querySelector('.notifications-list');
        
        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Função para processar solicitação de saúde
    function processHealthRequest(formData) {
        const type = formData.get('healthType');
        const description = formData.get('healthDescription');
        const time = formData.get('healthTime');
        
        // Simular processamento
        showToast('Solicitação de atendimento enviada com sucesso!');
        
        // Adicionar notificação
        setTimeout(() => {
            addNotification('🏥', 'Solicitação Recebida', 'Sua solicitação de atendimento está sendo analisada');
        }, 2000);
        
        // Atualizar card de status (simulação)
        setTimeout(() => {
            const healthCard = document.querySelector('.health-card .status-value');
            healthCard.textContent = 'Em análise';
            
            const statusBadge = document.querySelector('.health-card .status-badge');
            statusBadge.className = 'status-badge pending';
            statusBadge.textContent = 'Pendente';
            
            addNotification('🏥', 'Status Atualizado', 'Sua solicitação está sendo analisada pela equipe médica');
        }, 5000);
        
        hideModal(healthModal);
        healthForm.reset();
    }
    
    // Função para processar solicitação de coleta
    function processHygieneRequest(formData) {
        const address = formData.get('hygieneAddress');
        const type = formData.get('hygieneType');
        const quantity = formData.get('hygieneQuantity');
        const observations = formData.get('hygieneObservations');
        
        // Simular processamento
        showToast('Solicitação de coleta enviada com sucesso!');
        
        // Adicionar notificação
        setTimeout(() => {
            addNotification('🗑️', 'Coleta Solicitada', `Solicitação de coleta para ${address} foi recebida`);
        }, 2000);
        
        // Atualizar card de status (simulação)
        setTimeout(() => {
            const hygieneCard = document.querySelector('.hygiene-card .status-value');
            hygieneCard.textContent = 'Confirmada';
            
            const statusBadge = document.querySelector('.hygiene-card .status-badge');
            statusBadge.className = 'status-badge active';
            statusBadge.textContent = 'Ativo';
            
            addNotification('🗑️', 'Coleta Confirmada', 'Sua coleta foi agendada e será realizada em breve');
        }, 6000);
        
        hideModal(hygieneModal);
        hygieneForm.reset();
    }
    
    // Event Listeners
    
    // Notificações
    notificationBtn.addEventListener('click', toggleNotifications);
    
    // Fechar painel ao clicar fora
    document.addEventListener('click', (e) => {
        if (!notificationsPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            if (notificationsPanel.classList.contains('active')) {
                notificationsPanel.classList.remove('active');
            }
        }
    });
    
    // Marcar todas como lidas
    markAllReadBtn.addEventListener('click', () => {
        notifications = notifications.map(n => ({ ...n, unread: false }));
        updateNotificationCount();
        renderNotifications();
        showToast('Todas as notificações foram marcadas como lidas');
    });
    
    // Botões de ação rápida
    quickHealthBtn.addEventListener('click', () => showModal(healthModal));
    quickHygieneBtn.addEventListener('click', () => showModal(hygieneModal));
    quickReportBtn.addEventListener('click', () => {
        showToast('Funcionalidade de denúncia será implementada em breve', 'info');
    });
    
    // Botões dos cards
    newHealthBtn.addEventListener('click', () => showModal(healthModal));
    newHygieneBtn.addEventListener('click', () => showModal(hygieneModal));
    
    healthHistoryBtn.addEventListener('click', () => {
        showToast('Histórico de saúde será implementado em breve', 'info');
    });
    
    hygieneHistoryBtn.addEventListener('click', () => {
        showToast('Histórico de higiene será implementado em breve', 'info');
    });
    
    // Fechar modals
    closeHealthModal.addEventListener('click', () => hideModal(healthModal));
    closeHygieneModal.addEventListener('click', () => hideModal(hygieneModal));
    cancelHealthBtn.addEventListener('click', () => hideModal(healthModal));
    cancelHygieneBtn.addEventListener('click', () => hideModal(hygieneModal));
    
    // Fechar modal ao clicar no backdrop
    [healthModal, hygieneModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
    
    // Formulários
    healthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(healthForm);
        processHealthRequest(formData);
    });
    
    hygieneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(hygieneForm);
        processHygieneRequest(formData);
    });
    
    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // ESC para fechar modals
        if (e.key === 'Escape') {
            if (healthModal.classList.contains('active')) {
                hideModal(healthModal);
            }
            if (hygieneModal.classList.contains('active')) {
                hideModal(hygieneModal);
            }
            if (notificationsPanel.classList.contains('active')) {
                notificationsPanel.classList.remove('active');
            }
        }
        
        // Ctrl+N para notificações
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            toggleNotifications();
        }
    });
    
    // Animações e efeitos
    
    // Animação das barras de progresso
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }
    
    // Efeito de hover nos cards
    const cards = document.querySelectorAll('.action-card, .status-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.classList.contains('action-card') ? 'translateY(-5px)' : 'translateY(-3px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Inicialização
    function init() {
        updateNotificationCount();
        renderNotifications();
        animateProgressBars();
        
        // Simular carregamento de dados
        setTimeout(() => {
            console.log('Dashboard do usuário carregado com sucesso!');
            console.log(`${notifications.length} notificações carregadas`);
        }, 1000);
        
        // Adicionar estilos dinâmicos para animações
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .toast {
                font-family: inherit;
                font-weight: 500;
            }
            
            .toast-icon {
                font-size: 1.2rem;
            }
            
            .toast-message {
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Funções de debug
    window.dashboardDebug = {
        addTestNotification: () => {
            addNotification('🧪', 'Teste', 'Esta é uma notificação de teste');
        },
        clearNotifications: () => {
            notifications = [];
            updateNotificationCount();
            renderNotifications();
        },
        showTestToast: () => {
            showToast('Esta é uma mensagem de teste!');
        }
    };
    
    init();
});