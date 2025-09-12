// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // Função para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função para validar formulário
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Remove classes de erro anteriores
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        
        let isValid = true;
        
        // Validação do email
        if (!email) {
            showError(emailInput, 'Email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'Email inválido');
            isValid = false;
        }
        
        // Validação da senha
        if (!password) {
            showError(passwordInput, 'Senha é obrigatória');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, 'Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }
        
        return isValid;
    }

    // Função para mostrar erro
    function showError(input, message) {
        input.classList.add('error');
        
        // Remove erro anterior se existir
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Cria nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
        
        // Remove erro após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
            input.classList.remove('error');
        }, 5000);
    }

    // Função para mostrar loading
    function showLoading() {
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Entrando...';
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.7';
        
        return () => {
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
        };
    }

    // Função para simular login
    function simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            // Simula tempo de resposta do servidor
            setTimeout(() => {
                // Credenciais de exemplo (em um app real, isso seria validado no backend)
                if (email === 'user@gmail.com' && password === '123456') {
                    resolve({ success: true, message: 'Login realizado com sucesso!' });
                } else {
                    reject({ success: false, message: 'Email ou senha incorretos.' });
                }
            }, 2000);
        });
    }

    // Função para mostrar mensagem de sucesso
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            background: #22c55e;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
        
        // Remove mensagem após 3 segundos
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    // Event listener para o formulário
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const hideLoading = showLoading();
        
        try {
            const result = await simulateLogin(email, password);
            hideLoading();
            showSuccess(result.message);
            
            // Redirecionar ou fazer outras ações após login bem-sucedido
            setTimeout(() => {
                console.log('Redirecionando para dashboard...');
                // window.location.href = '/dashboard';
            }, 2000);
            
        } catch (error) {
            hideLoading();
            showError(passwordInput, error.message);
        }
    });

    // Event listener para "Esqueceu a senha?"
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, 'Digite seu email primeiro');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError(emailInput, 'Email inválido');
            return;
        }
        
        // Simula envio de email de recuperação
        alert(`Email de recuperação enviado para: ${email}`);
    });

    // Adiciona efeito de foco nos inputs
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });

    // Remove erros quando o usuário começar a digitar
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });

    // Adiciona animação de entrada
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// CSS adicional via JavaScript para efeitos
const additionalStyles = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 8px;
        padding-left: 4px;
    }
    
    .input-group.focused {
        transform: scale(1.02);
        transition: transform 0.2s ease;
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
`;

// Adiciona os estilos ao head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('Login page loaded successfully!');