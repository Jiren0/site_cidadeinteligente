// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerBtn = document.querySelector('.register-btn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Utilitários
    const utils = {
        // Validação de email
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Sanitizar entrada
        sanitizeInput(input) {
            return input.trim();
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

        validateName(name) {
            if (!name) {
                return 'Nome é obrigatório';
            }
            if (name.length < 3) {
                return 'Nome deve ter pelo menos 3 caracteres';
            }
            if (name.length > 100) {
                return 'Nome muito longo (máximo 100 caracteres)';
            }
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
                return 'Nome deve conter apenas letras';
            }
            return null;
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
            if (password.length < 6) {
                return 'Senha deve ter pelo menos 6 caracteres';
            }
            if (password.length > 50) {
                return 'Senha muito longa (máximo 50 caracteres)';
            }
            return null;
        }

        validateConfirmPassword(password, confirmPassword) {
            if (!confirmPassword) {
                return 'Confirmação de senha é obrigatória';
            }
            if (password !== confirmPassword) {
                return 'As senhas não coincidem';
            }
            return null;
        }

        checkPasswordStrength(password) {
            let strength = 0;
            
            if (password.length >= 6) strength++;
            if (password.length >= 10) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^a-zA-Z\d]/.test(password)) strength++;
            
            if (strength <= 2) return { level: 'weak', text: 'Fraca' };
            if (strength <= 3) return { level: 'medium', text: 'Média' };
            return { level: 'strong', text: 'Forte' };
        }

        validateForm(name, email, password, confirmPassword) {
            this.errors.clear();
            
            const nameError = this.validateName(name);
            const emailError = this.validateEmail(email);
            const passwordError = this.validatePassword(password);
            const confirmPasswordError = this.validateConfirmPassword(password, confirmPassword);
            
            if (nameError) this.errors.set('name', nameError);
            if (emailError) this.errors.set('email', emailError);
            if (passwordError) this.errors.set('password', passwordError);
            if (confirmPasswordError) this.errors.set('confirmPassword', confirmPasswordError);
            
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
            [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
                this.clearError(input);
            });
        }

        showSuccess(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = message;
            successDiv.setAttribute('role', 'status');
            successDiv.setAttribute('aria-live', 'polite');
            
            registerForm.insertBefore(successDiv, registerForm.firstChild);
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 3000);
            
            utils.log('info', 'Success message displayed', { message });
        }

        showLoading() {
            const originalText = registerBtn.textContent;
            registerBtn.innerHTML = `
                <span class="loading-spinner"></span>
                Cadastrando...
            `;
            registerBtn.disabled = true;
            registerBtn.classList.add('loading');
            
            return () => {
                registerBtn.textContent = originalText;
                registerBtn.disabled = false;
                registerBtn.classList.remove('loading');
            };
        }

        updatePasswordStrength(password) {
            if (!password) {
                strengthBar.className = 'password-strength-bar';
                strengthText.textContent = '';
                return;
            }

            const strength = validator.checkPasswordStrength(password);
            strengthBar.className = `password-strength-bar strength-${strength.level}`;
            strengthText.textContent = `Força da senha: ${strength.text}`;
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

    // Classe para gerenciar registro
    class RegisterManager {
        async register(name, email, password) {
            utils.log('info', 'Register attempt started', { name, email });
            
            try {
                // Simula delay de rede
                await this.simulateNetworkDelay();
                
                const sanitizedName = utils.sanitizeInput(name);
                const sanitizedEmail = utils.sanitizeInput(email).toLowerCase();
                
                // Simula armazenamento do novo usuário
                const newUser = {
                    name: sanitizedName,
                    email: sanitizedEmail,
                    password: password,
                    role: 'user',
                    createdAt: new Date().toISOString()
                };
                
                utils.log('info', 'Registration successful', { 
                    name: sanitizedName, 
                    email: sanitizedEmail 
                });
                
                return {
                    success: true,
                    message: 'Cadastro realizado com sucesso!',
                    user: newUser
                };
                
            } catch (error) {
                utils.log('error', 'Registration failed', { error: error.message });
                throw error;
            }
        }

        async simulateNetworkDelay() {
            const delay = Math.random() * 1000 + 1000; // 1-2 segundos
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        redirectToLogin() {
            utils.log('info', 'Redirecting to login page');
            
            // Animação de saída suave
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 300);
        }
    }

    // Instâncias das classes
    const validator = new FormValidator();
    const ui = new UIManager();
    const register = new RegisterManager();

    // Validação em tempo real (com debounce)
    const debouncedValidation = utils.debounce((input) => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        if (input === nameInput && name) {
            const nameError = validator.validateName(name);
            if (nameError) {
                ui.showError(nameInput, nameError);
            } else {
                ui.clearError(nameInput);
            }
        }
        
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
        
        if (input === confirmPasswordInput && confirmPassword) {
            const confirmPasswordError = validator.validateConfirmPassword(password, confirmPassword);
            if (confirmPasswordError) {
                ui.showError(confirmPasswordInput, confirmPasswordError);
            } else {
                ui.clearError(confirmPasswordInput);
            }
        }
    }, 500);

    // Event Listeners
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        // Limpa erros anteriores
        ui.clearAllErrors();
        
        // Validação completa
        if (!validator.validateForm(name, email, password, confirmPassword)) {
            const errors = validator.getErrors();
            
            if (errors.has('name')) {
                ui.showError(nameInput, errors.get('name'));
            }
            if (errors.has('email')) {
                ui.showError(emailInput, errors.get('email'));
            }
            if (errors.has('password')) {
                ui.showError(passwordInput, errors.get('password'));
            }
            if (errors.has('confirmPassword')) {
                ui.showError(confirmPasswordInput, errors.get('confirmPassword'));
            }
            
            utils.log('warn', 'Form validation failed', Object.fromEntries(errors));
            return;
        }
        
        // Mostra loading
        const hideLoading = ui.showLoading();
        
        try {
            const result = await register.register(name, email, password);
            hideLoading();
            
            ui.showSuccess(result.message);
            
            // Redireciona para o login
            setTimeout(() => {
                register.redirectToLogin();
            }, 2000);
            
        } catch (error) {
            hideLoading();
            ui.showError(emailInput, error.message);
        }
    });

    // Atualização da força da senha em tempo real
    passwordInput.addEventListener('input', function() {
        ui.updatePasswordStrength(this.value);
    });

    // Efeitos de foco melhorados
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('focus', () => ui.animateInputFocus(input, true));
        input.addEventListener('blur', () => ui.animateInputFocus(input, false));
        
        // Validação em tempo real
        input.addEventListener('input', () => {
            ui.clearError(input);
            debouncedValidation(input);
        });
    });

    // Detecção de Caps Lock
    [passwordInput, confirmPasswordInput].forEach(input => {
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

    utils.log('info', 'Register page initialized successfully');
});