// Dashboard Admin JavaScript

class DashboardAdmin {
    constructor() {
        this.appointments = [
            {
                id: 1,
                patientName: "Maria Hickle",
                doctorName: "Dr. Victoria Welch",
                date: "10 Set 2022",
                time: "11:00 PM",
                avatar: "https://via.placeholder.com/30x30/74b9ff/ffffff?text=MH"
            },
            {
                id: 2,
                patientName: "Roosevelt Mills",
                doctorName: "Dr. Laurence Adams",
                date: "15 Set 2022",
                time: "11:00 PM",
                avatar: "https://via.placeholder.com/30x30/a29bfe/ffffff?text=RM"
            },
            {
                id: 3,
                patientName: "Nona Welch",
                doctorName: "Dr. Lowell Sherman",
                date: "20 Set 2022",
                time: "11:00 PM",
                avatar: "https://via.placeholder.com/30x30/fd79a8/ffffff?text=NW"
            }
        ];

        this.stats = {
            doctors: 100,
            revenue: 10000,
            patients: 500,
            appointments: 345
        };

        this.medicalChartData = {
            labels: ['Sáb', 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
            patients: [80, 65, 85, 70, 95, 75, 90]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateStats();
        this.drawMedicalChart();
        this.drawGenderChart();
        this.startRealTimeUpdates();
        this.addFadeInAnimations();
    }

    setupEventListeners() {
        // Menu navigation
        const menuItems = document.querySelectorAll('.menu-item a');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMenuClick(e.target.closest('a'));
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Action buttons
        this.setupActionButtons();

        // Profile actions
        this.setupProfileActions();

        // Notification bell
        const notificationBell = document.querySelector('.notifications');
        notificationBell.addEventListener('click', () => {
            this.showNotifications();
        });
    }

    handleMenuClick(menuLink) {
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item
        menuLink.closest('.menu-item').classList.add('active');

        // Animate the transition
        menuLink.style.transform = 'translateX(10px)';
        setTimeout(() => {
            menuLink.style.transform = 'translateX(5px)';
        }, 200);

        // You can add route handling here
        console.log(`Navigating to: ${menuLink.getAttribute('href')}`);
    }

    handleSearch(query) {
        if (query.length < 2) return;

        // Filter appointments based on search query
        const filteredAppointments = this.appointments.filter(appointment => 
            appointment.patientName.toLowerCase().includes(query.toLowerCase()) ||
            appointment.doctorName.toLowerCase().includes(query.toLowerCase())
        );

        this.renderAppointments(filteredAppointments);
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

    handleAppointmentAction(action, button) {
        const row = button.closest('tr');
        const patientName = row.querySelector('.patient-info span').textContent;

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

        // Button animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, 100);
    }

    showEditModal(patientName) {
        alert(`Editando consulta para: ${patientName}`);
        // Aqui você implementaria um modal real
    }

    showViewModal(patientName) {
        alert(`Visualizando consulta de: ${patientName}`);
        // Aqui você implementaria um modal real
    }

    showDeleteConfirmation(patientName, row) {
        if (confirm(`Tem certeza que deseja excluir a consulta de ${patientName}?`)) {
            // Animate row removal
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.remove();
                this.showSuccessMessage('Consulta excluída com sucesso!');
            }, 300);
        }
    }

    setupProfileActions() {
        const seeMoreBtn = document.querySelector('.see-more-btn');
        const profileSettings = document.querySelector('.profile-settings');

        if (seeMoreBtn) {
            seeMoreBtn.addEventListener('click', () => {
                this.showProfileDetails();
            });
        }

        if (profileSettings) {
            profileSettings.addEventListener('click', () => {
                this.showProfileSettings();
            });
        }
    }

    showProfileDetails() {
        alert('Mostrando detalhes completos do perfil...');
        // Implementar modal com detalhes completos
    }

    showProfileSettings() {
        alert('Abrindo configurações do perfil...');
        // Implementar modal de configurações
    }

    showNotifications() {
        const notifications = [
            'Nova consulta agendada',
            'Relatório mensal disponível',
            'Sistema será atualizado às 02:00'
        ];
        
        alert('Notificações:\n' + notifications.join('\n'));
        // Implementar dropdown de notificações real
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

    drawMedicalChart() {
        const canvas = document.getElementById('medicalChart');
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
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // Draw the line chart
        const stepX = chartWidth / (data.labels.length - 1);
        const maxValue = Math.max(...data.patients);
        
        ctx.beginPath();
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 3;
        
        data.patients.forEach((value, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();

        // Draw data points
        data.patients.forEach((value, index) => {
            const x = padding + stepX * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#ff6b9d';
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        data.labels.forEach((label, index) => {
            const x = padding + stepX * index;
            ctx.fillText(label, x, canvas.height - 10);
        });
    }

    drawGenderChart() {
        const canvas = document.getElementById('genderChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 120;
        canvas.height = 120;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        
        // Draw progress arc (70%)
        const percentage = 0.7;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * percentage);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#74b9ff';
        ctx.stroke();
    }

    renderAppointments(appointmentsToRender = this.appointments) {
        const tbody = document.getElementById('appointments-tbody');
        tbody.innerHTML = '';

        appointmentsToRender.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="patient-info">
                        <img src="${appointment.avatar}" alt="Patient" class="patient-avatar">
                        <span>${appointment.patientName}</span>
                    </div>
                </td>
                <td>${appointment.doctorName}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td class="actions">
                    <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn view"><i class="fas fa-eye"></i></button>
                    <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            row.classList.add('fade-in');
            tbody.appendChild(row);
        });
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateRandomStat();
        }, 5000);

        setInterval(() => {
            this.updateMedicalChart();
        }, 10000);
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

    updateMedicalChart() {
        // Generate new random data
        this.medicalChartData.patients = this.medicalChartData.patients.map(value => {
            const change = Math.floor(Math.random() * 20) - 10;
            return Math.max(20, Math.min(100, value + change));
        });
        
        this.drawMedicalChart();
    }

    addFadeInAnimations() {
        const elements = document.querySelectorAll('.stat-card, .card, .appointments-table tr');
        
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

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // Utility method for responsive chart redrawing
    handleResize() {
        setTimeout(() => {
            this.drawMedicalChart();
        }, 100);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardAdmin();
    
    // Handle window resize for responsive charts
    window.addEventListener('resize', () => {
        dashboard.handleResize();
    });
});

// Additional CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);