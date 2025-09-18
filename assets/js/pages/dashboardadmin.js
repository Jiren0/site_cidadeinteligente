// Enhanced Dashboard Admin JavaScript

class DashboardAdmin {
    constructor() {
        this.appointments = [
            {
                id: 1,
                patientName: "Maria Silva",
                patientId: "#12345",
                doctorName: "Dr. Victoria Welch",
                doctorSpecialty: "Cardiologia",
                date: "Hoje",
                time: "14:30",
                status: "confirmed",
                type: "Consulta",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            },
            {
                id: 2,
                patientName: "João Santos",
                patientId: "#12346",
                doctorName: "Dr. Carlos Lima",
                doctorSpecialty: "Ortopedia",
                date: "Hoje",
                time: "15:00",
                status: "pending",
                type: "Retorno",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            },
            {
                id: 3,
                patientName: "Ana Costa",
                patientId: "#12347",
                doctorName: "Dr. Marina Oliveira",
                doctorSpecialty: "Dermatologia",
                date: "Amanhã",
                time: "09:30",
                status: "cancelled",
                type: "Consulta",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
            }
        ];

        this.stats = {
            doctors: 100,
            revenue: 125430,
            patients: 1247,
            appointments: 28
        };

        this.medicalChartData = {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            consultas: [45, 52, 38, 65, 42, 28, 35],
            agendadas: [38, 48, 42, 58, 38, 32, 28]
        };

        this.notifications = [
            {
                id: 1,
                type: 'appointment',
                title: 'Nova consulta agendada',
                message: 'Dr. Silva agendou consulta para Maria',
                time: '2 min atrás',
                read: false,
                icon: 'fas fa-calendar',
                color: 'blue'
            },
            {
                id: 2,
                type: 'patient',
                title: 'Novo paciente cadastrado',
                message: 'João Santos foi cadastrado no sistema',
                time: '15 min atrás',
                read: false,
                icon: 'fas fa-user-plus',
                color: 'green'
            },
            {
                id: 3,
                type: 'warning',
                title: 'Consulta cancelada',
                message: 'Consulta de Ana Costa foi cancelada',
                time: '1 hora atrás',
                read: true,
                icon: 'fas fa-exclamation-triangle',
                color: 'orange'
            }
        ];

        this.currentTheme = localStorage.getItem('dashboard-theme') || 'light';
        this.sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';

        this.init();
    }

    init() {
        this.setupTheme();
        this.setupSidebar();
        this.setupEventListeners();
        this.setupDropdowns();
        this.animateStats();
        this.drawCharts();
        this.startRealTimeUpdates();
        this.addFadeInAnimations();
        this.setupSearch();
        this.setupNotifications();
        this.renderAppointments();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // Menu navigation
        const menuItems = document.querySelectorAll('.menu-item a');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMenuClick(e.target.closest('a'));
            });
        });

        // Quick actions
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.closest('button')));
        });

        // Action buttons
        this.setupActionButtons();

        // Table interactions
        this.setupTableInteractions();

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    setupDropdowns() {
        // Notifications dropdown
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(notificationsBtn, 'active');
            });
        }

        // Profile dropdown
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.querySelector('.profile-dropdown');
        
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(profileDropdown, 'active');
            });
        }

        // Mark all notifications as read
        const markAllRead = document.querySelector('.mark-all-read');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => this.markAllNotificationsRead());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('dashboard-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showToast('success', 'Tema alterado', `Tema ${this.currentTheme === 'dark' ? 'escuro' : 'claro'} ativado`);
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');
        this.sidebarCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebar-collapsed', this.sidebarCollapsed);
    }

    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    }

    toggleDropdown(element, activeClass) {
        // Close all other dropdowns
        document.querySelectorAll('.notifications, .profile-dropdown').forEach(dropdown => {
            if (dropdown !== element) {
                dropdown.classList.remove(activeClass);
            }
        });
        
        element.classList.toggle(activeClass);
    }

    handleOutsideClick(e) {
        if (!e.target.closest('.notifications')) {
            document.querySelector('.notifications')?.classList.remove('active');
        }
        if (!e.target.closest('.profile-dropdown')) {
            document.querySelector('.profile-dropdown')?.classList.remove('active');
        }
    }

    handleMenuClick(menuLink) {
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item
        menuLink.closest('.menu-item').classList.add('active');

        // Update breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb h1');
        const breadcrumbPath = document.querySelector('.breadcrumb-path');
        const menuText = menuLink.querySelector('span').textContent;
        
        if (breadcrumb) breadcrumb.textContent = menuText;
        if (breadcrumbPath) breadcrumbPath.textContent = `Home / ${menuText}`;

        // Animate the transition
        this.animateMenuTransition(menuLink);

        this.showToast('info', 'Navegação', `Navegando para ${menuText}`);
    }

    animateMenuTransition(menuLink) {
        menuLink.style.transform = 'translateX(10px)';
        setTimeout(() => {
            menuLink.style.transform = 'translateX(5px)';
        }, 200);
    }

    handleQuickAction(button) {
        const buttonText = button.querySelector('span').textContent;
        
        // Button animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        this.showToast('success', 'Ação Rápida', `${buttonText} executada com sucesso`);
    }

    setupActionButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn')) {
                const btn = e.target.closest('.action-btn');
                const action = btn.classList.contains('edit') ? 'edit' : 
                             btn.classList.contains('view') ? 'view' : 'delete';
                
                this.handleAppointmentAction(action, btn);
            }
        });
    }

    setupTableInteractions() {
        // Select all checkbox
        const selectAll = document.querySelector('.select-all');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.row-select');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
                this.updateSelectedCount();
            });
        }

        // Individual row checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('row-select')) {
                this.updateSelectedCount();
            }
        });

        // Table filters
        const filterSelect = document.querySelector('.filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterAppointments(e.target.value);
            });
        }
    }

    updateSelectedCount() {
        const selectedRows = document.querySelectorAll('.row-select:checked').length;
        if (selectedRows > 0) {
            this.showToast('info', 'Seleção', `${selectedRows} consulta(s) selecionada(s)`);
        }
    }

    filterAppointments(filter) {
        // Implementation for filtering appointments
        this.showToast('info', 'Filtro', `Filtro "${filter}" aplicado`);
    }

    handleAppointmentAction(action, button) {
        const row = button.closest('tr');
        const patientName = row.querySelector('.patient-name').textContent;

        // Button animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, 100);

        switch(action) {
            case 'edit':
                this.showEditModal(patientName);
                break;
            case 'view':
                this.showViewModal(patientName);
                break;
            case 'delete':
                this.showDeleteConfirmation(patientName, row);
                break;
        }
    }

    showEditModal(patientName) {
        this.showToast('info', 'Editar', `Editando consulta de ${patientName}`);
    }

    showViewModal(patientName) {
        this.showToast('info', 'Visualizar', `Visualizando consulta de ${patientName}`);
    }

    showDeleteConfirmation(patientName, row) {
        if (confirm(`Tem certeza que deseja excluir a consulta de ${patientName}?`)) {
            this.deleteAppointment(row, patientName);
        }
    }

    deleteAppointment(row, patientName) {
        // Animate row removal
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.remove();
            this.showToast('success', 'Excluído', `Consulta de ${patientName} excluída com sucesso`);
        }, 300);
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length > 0) {
                    this.showSearchSuggestions(searchInput.value);
                }
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSearchSuggestions();
                }, 200);
            });
        }
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }

        // Simulate search results
        const suggestions = [
            'Maria Silva - Paciente',
            'Dr. João Santos - Cardiologista',
            'Consulta Cardiologia',
            'Agendamentos de hoje'
        ].filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        );

        this.showSearchSuggestions(query, suggestions);
    }

    showSearchSuggestions(query, suggestions = []) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (!searchSuggestions) return;

        if (suggestions.length === 0) {
            searchSuggestions.style.display = 'none';
            return;
        }

        searchSuggestions.innerHTML = suggestions.map(suggestion => 
            `<div class="search-suggestion" onclick="this.selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');

        searchSuggestions.style.display = 'block';
    }

    hideSearchSuggestions() {
        const searchSuggestions = document.getElementById('searchSuggestions');
        if (searchSuggestions) {
            searchSuggestions.style.display = 'none';
        }
    }

    setupNotifications() {
        this.renderNotifications();
        this.updateNotificationBadge();
    }

    renderNotifications() {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${!notification.read ? 'unread' : ''}">
                <div class="notification-icon text-${notification.color}">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <p>${notification.title}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            </div>
        `).join('');
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    markAllNotificationsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        
        this.renderNotifications();
        this.updateNotificationBadge();
        this.showToast('success', 'Notificações', 'Todas as notificações foram marcadas como lidas');
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((stat, index) => {
            const targetValue = Object.values(this.stats)[index];
            this.countUpAnimation(stat, targetValue, index);
        });
    }

    countUpAnimation(element, target, index) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format numbers based on type
            if (index === 1) { // Revenue
                element.textContent = `R$ ${Math.floor(current).toLocaleString()}`;
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, duration / steps);
    }

    drawCharts() {
        this.drawMedicalChart();
        this.drawMiniCharts();
    }

    drawMedicalChart() {
        const canvas = document.getElementById('medicalChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const data = this.medicalChartData;
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-light').trim();
        ctx.lineWidth = 1;

        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // Draw the charts
        const stepX = chartWidth / (data.labels.length - 1);
        const maxValue = Math.max(...data.consultas, ...data.agendadas);
        
        // Draw consultas line
        ctx.beginPath();
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 3;
        
        data.consultas.forEach((value, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();

        // Draw agendadas line
        ctx.beginPath();
        ctx.strokeStyle = '#95e1d3';
        ctx.lineWidth = 3;
        
        data.agendadas.forEach((value, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();

        // Draw data points for consultas
        data.consultas.forEach((value, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#ff6b9d';
            ctx.fill();
        });

        // Draw data points for agendadas
        data.agendadas.forEach((value, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#95e1d3';
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim();
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.textAlign = 'center';
        
        data.labels.forEach((label, index) => {
            const x = padding + stepX * index;
            ctx.fillText(label, x, canvas.height - 10);
        });
    }

    drawMiniCharts() {
        const chartIds = ['doctorsChart', 'revenueChart', 'patientsChart', 'appointmentsChart'];
        
        chartIds.forEach((chartId, index) => {
            this.drawMiniChart(chartId, index);
        });
    }

    drawMiniChart(canvasId, index) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Generate sample data
        const data = Array.from({length: 7}, () => Math.random() * 100);
        const maxValue = Math.max(...data);
        
        // Draw mini line chart
        ctx.beginPath();
        ctx.strokeStyle = index % 2 === 0 ? '#4285f4' : '#22c55e';
        ctx.lineWidth = 2;
        
        data.forEach((value, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (value / maxValue) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    renderAppointments(appointmentsToRender = this.appointments) {
        const tbody = document.getElementById('appointments-tbody');
        if (!tbody) return;

        tbody.innerHTML = appointmentsToRender.map(appointment => `
            <tr>
                <td>
                    <input type="checkbox" class="row-select">
                </td>
                <td>
                    <div class="patient-info">
                        <img src="${appointment.avatar}" alt="Patient" class="patient-avatar">
                        <div class="patient-details">
                            <span class="patient-name">${appointment.patientName}</span>
                            <span class="patient-id">${appointment.patientId}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="doctor-info">
                        <span class="doctor-name">${appointment.doctorName}</span>
                        <span class="doctor-specialty">${appointment.doctorSpecialty}</span>
                    </div>
                </td>
                <td>
                    <div class="datetime-info">
                        <span class="date">${appointment.date}</span>
                        <span class="time">${appointment.time}</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${appointment.status}">${this.getStatusText(appointment.status)}</span>
                </td>
                <td>
                    <span class="appointment-type">${appointment.type}</span>
                </td>
                <td class="actions">
                    <div class="action-buttons">
                        <button class="action-btn view" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'confirmed': 'Confirmada',
            'pending': 'Pendente',
            'cancelled': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateRandomStat();
        }, 10000);

        setInterval(() => {
            this.updateCharts();
        }, 30000);

        // Simulate new notifications
        setInterval(() => {
            this.addRandomNotification();
        }, 60000);
    }

    updateRandomStat() {
        const statKeys = Object.keys(this.stats);
        const randomKey = statKeys[Math.floor(Math.random() * statKeys.length)];
        const oldValue = this.stats[randomKey];
        
        // Small random change
        const change = Math.floor(Math.random() * 10) - 5;
        this.stats[randomKey] = Math.max(0, oldValue + change);
        
        // Update the display
        const statElements = document.querySelectorAll('.stat-number');
        const index = statKeys.indexOf(randomKey);
        
        if (statElements[index]) {
            const element = statElements[index];
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                if (randomKey === 'revenue') {
                    element.textContent = `R$ ${this.stats[randomKey].toLocaleString()}`;
                } else {
                    element.textContent = this.stats[randomKey].toLocaleString();
                }
                element.style.transform = 'scale(1)';
            }, 150);
        }
    }

    updateCharts() {
        // Generate new random data
        this.medicalChartData.consultas = this.medicalChartData.consultas.map(value => {
            const change = Math.floor(Math.random() * 20) - 10;
            return Math.max(10, Math.min(80, value + change));
        });
        
        this.medicalChartData.agendadas = this.medicalChartData.agendadas.map(value => {
            const change = Math.floor(Math.random() * 15) - 7;
            return Math.max(5, Math.min(70, value + change));
        });
        
        this.drawMedicalChart();
        this.drawMiniCharts();
    }

    addRandomNotification() {
        const randomNotifications = [
            {
                type: 'appointment',
                title: 'Nova consulta agendada',
                message: 'Dr. Silva agendou nova consulta',
                icon: 'fas fa-calendar',
                color: 'blue'
            },
            {
                type: 'patient',
                title: 'Paciente chegou',
                message: 'Maria Silva chegou para consulta',
                icon: 'fas fa-user-check',
                color: 'green'
            },
            {
                type: 'system',
                title: 'Sistema atualizado',
                message: 'Nova versão disponível',
                icon: 'fas fa-sync',
                color: 'purple'
            }
        ];

        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        
        this.notifications.unshift({
            id: Date.now(),
            ...randomNotification,
            time: 'Agora',
            read: false
        });

        // Keep only last 10 notifications
        this.notifications = this.notifications.slice(0, 10);
        
        this.renderNotifications();
        this.updateNotificationBadge();
    }

    addFadeInAnimations() {
        const elements = document.querySelectorAll('.stat-card, .card, .quick-action-btn');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    showToast(type, title, message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation',
            info: 'fas fa-info'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconMap[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeToast(toast);
        }, 5000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    handleResize() {
        // Redraw charts on resize
        setTimeout(() => {
            this.drawCharts();
        }, 100);

        // Handle mobile sidebar
        if (window.innerWidth > 1024) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.remove('open');
        }
    }

    // Utility methods
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }

    formatTime(time) {
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(time));
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardAdmin();
    
    // Handle window resize for responsive charts
    window.addEventListener('resize', () => {
        dashboard.handleResize();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        }
        
        // Escape to close dropdowns
        if (e.key === 'Escape') {
            document.querySelectorAll('.notifications, .profile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    console.log('Enhanced Dashboard Admin loaded successfully!');
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}