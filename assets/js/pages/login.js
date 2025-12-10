// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // Configuração de usuários (em produção, isso seria no backend)
    const users = {
        'admin@gmail.com': {
            password: '1234',
            role: 'admin',
            redirectTo: 'dashboard_selection.html'
        },
        'user@gmail.com': {
            password: 'user123',
            role: 'user',
            redirectTo: 'dashboard_selection.html'
        }
    };

    // Utilitários
    const utils = {
        // Validação de email
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Sanitizar entrada
        sanitizeInput(input) {
            return input.trim().toLowerCase();
        },

        // Debounce para validação em tempo real
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Logger melhorado
        log(level, message, data = null) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
            
            if (level === 'error') {
                console.error(logMessage, data);
            } else if (level === 'warn') {
                console.warn(logMessage, data);
            } else {
                console.log(logMessage, data);
            }
        }
    };

    // Classe para gerenciar validações
    class FormValidator {
        constructor() {
            this.errors = new Map();
        }

        validateEmail(email) {
            if (!email) {
                return 'Email é obrigatório';
            }
            if (!utils.isValidEmail(email)) {
                return 'Formato de email inválido';
            }
            return null;
        }

        validatePassword(password) {
            if (!password) {
                return 'Senha é obrigatória';
            }
            if (password.length < 4) {
                return 'Senha deve ter pelo menos 4 caracteres';
            }
            if (password.length > 50) {
                return 'Senha muito longa (máximo 50 caracteres)';
            }
            return null;
        }

        validateForm(email, password) {
            this.errors.clear();
            
            const emailError = this.validateEmail(email);
            const passwordError = this.validatePassword(password);
            
            if (emailError) this.errors.set('email', emailError);
            if (passwordError) this.errors.set('password', passwordError);
            
            return this.errors.size === 0;
        }

        getErrors() {
            return this.errors;
        }
    }

    // Classe para gerenciar UI
    class UIManager {
        showError(input, message) {
            input.classList.add('error');
            this.clearError(input);
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.setAttribute('role', 'alert');
            errorDiv.setAttribute('aria-live', 'polite');
            
            input.parentNode.appendChild(errorDiv);
            
            // Remove erro automaticamente após 5 segundos
            setTimeout(() => this.clearError(input), 5000);
            
            utils.log('info', 'Error displayed', { field: input.id, message });
        }

        clearError(input) {
            input.classList.remove('error');
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }

        clearAllErrors() {
            [emailInput, passwordInput].forEach(input => {
                this.clearError(input);
            });
        }

        showSuccess(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = message;
            successDiv.setAttribute('role', 'status');
            successDiv.setAttribute('aria-live', 'polite');
            
            Object.assign(successDiv.style, {
                background: '#22c55e',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                margin: '20px 0',
                textAlign: 'center',
                fontWeight: '500',
                animation: 'slideIn 0.3s ease',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            });
            
            loginForm.insertBefore(successDiv, loginForm.firstChild);
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => successDiv.remove(), 300);
                }
            }, 3000);
            
            utils.log('info', 'Success message displayed', { message });
        }

        showLoading() {
            const originalText = loginBtn.textContent;
            loginBtn.innerHTML = `
                <span class="loading-spinner"></span>
                Entrando...
            `;
            loginBtn.disabled = true;
            loginBtn.classList.add('loading');
            
            return () => {
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
            };
        }

        animateInputFocus(input, focused) {
            const inputGroup = input.parentNode;
            if (focused) {
                inputGroup.classList.add('focused');
            } else {
                inputGroup.classList.remove('focused');
            }
        }
    }

    // Classe para gerenciar autenticação
    class AuthManager {
        async login(email, password) {
            utils.log('info', 'Login attempt started', { email });
            
            try {
                // Simula delay de rede
                await this.simulateNetworkDelay();
                
                const sanitizedEmail = utils.sanitizeInput(email);
                const user = users[sanitizedEmail];
                
                if (!user || user.password !== password) {
                    throw new Error('Email ou senha incorretos');
                }
                
                // Simula armazenamento de sessão (sem usar localStorage devido às restrições)
                this.currentUser = {
                    email: sanitizedEmail,
                    role: user.role,
                    loginTime: new Date().toISOString()
                };
                
                utils.log('info', 'Login successful', { 
                    email: sanitizedEmail, 
                    role: user.role 
                });
                
                return {
                    success: true,
                    message: 'Login realizado com sucesso!',
                    user: this.currentUser,
                    redirectTo: user.redirectTo
                };
                
            } catch (error) {
                utils.log('error', 'Login failed', { email, error: error.message });
                throw error;
            }
        }

        async simulateNetworkDelay() {
            const delay = Math.random() * 1000 + 1000; // 1-2 segundos
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        redirectToPage(url) {
            utils.log('info', 'Redirecting to page', { url });
            
            // Animação de saída suave
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        }

        logout() {
            this.currentUser = null;
            utils.log('info', 'User logged out');
        }
    }

    // Instâncias das classes
    const validator = new FormValidator();
    const ui = new UIManager();
    const auth = new AuthManager();

    // Validação em tempo real (com debounce)
    const debouncedValidation = utils.debounce((input) => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (input === emailInput && email) {
            const emailError = validator.validateEmail(email);
            if (emailError) {
                ui.showError(emailInput, emailError);
            } else {
                ui.clearError(emailInput);
            }
        }
        
        if (input === passwordInput && password) {
            const passwordError = validator.validatePassword(password);
            if (passwordError) {
                ui.showError(passwordInput, passwordError);
            } else {
                ui.clearError(passwordInput);
            }
        }
    }, 500);

    // Event Listeners
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Limpa erros anteriores
        ui.clearAllErrors();
        
        // Validação completa
        if (!validator.validateForm(email, password)) {
            const errors = validator.getErrors();
            
            if (errors.has('email')) {
                ui.showError(emailInput, errors.get('email'));
            }
            if (errors.has('password')) {
                ui.showError(passwordInput, errors.get('password'));
            }
            
            utils.log('warn', 'Form validation failed', Object.fromEntries(errors));
            return;
        }
        
        // Mostra loading
        const hideLoading = ui.showLoading();
        
        try {
            const result = await auth.login(email, password);
            hideLoading();
            
            ui.showSuccess(result.message);
            
            // Redireciona baseado no tipo de usuário
            setTimeout(() => {
                auth.redirectToPage(result.redirectTo);
            }, 2000);
            
        } catch (error) {
            hideLoading();
            ui.showError(passwordInput, error.message);
        }
    });

    // Recuperação de senha melhorada
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            ui.showError(emailInput, 'Digite seu email primeiro');
            return;
        }
        
        if (!utils.isValidEmail(email)) {
            ui.showError(emailInput, 'Email inválido');
            return;
        }
        
        // Simula envio de email com feedback melhor
        const modal = document.createElement('div');
        modal.className = 'recovery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Email de Recuperação Enviado</h3>
                <p>Um email com instruções para redefinir sua senha foi enviado para:</p>
                <strong>${email}</strong>
                <p><small>Verifique sua caixa de entrada e spam.</small></p>
                <button class="modal-close">Entendi</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        utils.log('info', 'Password recovery requested', { email });
    });

    // Efeitos de foco melhorados
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => ui.animateInputFocus(input, true));
        input.addEventListener('blur', () => ui.animateInputFocus(input, false));
        
        // Validação em tempo real
        input.addEventListener('input', (e) => {
            ui.clearError(input);
            debouncedValidation(input);
        });
        
        // Teclas especiais
        input.addEventListener('keydown', function(e) {
            // Enter no email move para senha
            if (e.key === 'Enter' && input === emailInput) {
                e.preventDefault();
                passwordInput.focus();
            }
        });
    });

    // Detecção de Caps Lock
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                ui.showError(input, 'Caps Lock está ativo');
            }
        });
    });

    // Animação de entrada da página
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Detecta tentativas de força bruta (básico)
    let loginAttempts = 0;
    const maxAttempts = 3;
    
    loginForm.addEventListener('submit', function() {
        loginAttempts++;
        
        if (loginAttempts >= maxAttempts) {
            ui.showError(passwordInput, `Muitas tentativas. Aguarde ${30} segundos.`);
            loginBtn.disabled = true;
            
            setTimeout(() => {
                loginAttempts = 0;
                loginBtn.disabled = false;
            }, 30000);
        }
    });

    utils.log('info', 'Login page initialized successfully');
});

// Estilos CSS melhorados via JavaScript
const enhancedStyles = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        animation: shake 0.3s ease;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 8px;
        padding-left: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .error-message::before {
        content: "⚠️";
        font-size: 12px;
    }
    
    .input-group.focused {
        transform: scale(1.02);
        transition: transform 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .login-btn.loading {
        position: relative;
        opacity: 0.8;
        cursor: not-allowed;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    .recovery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 400px;
        margin: 20px;
        animation: slideIn 0.3s ease;
    }
    
    .modal-content h3 {
        margin-bottom: 16px;
        color: #1f2937;
    }
    
    .modal-close {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 16px;
        font-weight: 500;
        transition: background 0.2s ease;
    }
    
    .modal-close:hover {
        background: #2563eb;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-20px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Adiciona os estilos melhorados
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);