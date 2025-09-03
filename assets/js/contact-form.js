// Funcionalidade do formulário de contato
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar estilos CSS para animações
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes slideInSuccess {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .success-message-enhanced {
            position: relative;
            overflow: hidden;
        }
        
        .success-message-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    `;
    document.head.appendChild(animationStyles);
    const form = document.querySelector('.u-form-1 form');
    const submitBtn = document.querySelector('.u-btn-submit');
    const successMessage = document.querySelector('.u-form-send-success');
    const errorMessage = document.querySelector('.u-form-send-error');
    
    // Campos do formulário
    const nameField = document.getElementById('name-84b5');
    const emailField = document.getElementById('email-84b5');
    const companyField = document.getElementById('text-0e66');
    const positionField = document.getElementById('text-ef75');
    const messageField = document.getElementById('message-84b5');
    
    // Função para validar email
    function isValidEmail(email) {
        // Regex mais robusta para validação de email
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        // Verificações básicas
        if (!email || email.length === 0) return false;
        if (email.length > 254) return false; // RFC 5321
        if (email.indexOf('@') === -1) return false;
        
        // Dividir em partes local e domínio
        const parts = email.split('@');
        if (parts.length !== 2) return false;
        
        const [localPart, domain] = parts;
        
        // Validar parte local (antes do @)
        if (localPart.length === 0 || localPart.length > 64) return false;
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (localPart.includes('..')) return false;
        
        // Validar domínio
        if (domain.length === 0 || domain.length > 253) return false;
        if (domain.startsWith('.') || domain.endsWith('.')) return false;
        if (domain.startsWith('-') || domain.endsWith('-')) return false;
        if (!domain.includes('.')) return false;
        
        // Verificar se o domínio tem pelo menos um ponto
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return false;
        
        // Verificar se a última parte do domínio tem pelo menos 2 caracteres
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2) return false;
        
        // Teste final com regex
        return emailRegex.test(email);
    }
    
    // Função para mostrar erro em campo específico
    function showFieldError(field, message) {
        // Remove erro anterior se existir
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Adiciona classe de erro
        field.classList.add('error');
        
        // Cria elemento de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorElement);
    }
    
    // Função para remover erro de campo
    function removeFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Função para validar formulário
    function validateForm() {
        let isValid = true;
        
        // Limpar erros anteriores
        [nameField, emailField, companyField, positionField, messageField].forEach(field => {
            if (field) removeFieldError(field);
        });
        
        // Validar nome
        if (!nameField.value.trim()) {
            showFieldError(nameField, 'Nome é obrigatório');
            isValid = false;
        } else if (nameField.value.length > 50) {
            showFieldError(nameField, 'O nome deve ter no máximo 50 caracteres.');
            isValid = false;
        }
        
        // Validar email
        if (!emailField.value.trim()) {
            showFieldError(emailField, 'Email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(emailField.value.trim())) {
            showFieldError(emailField, 'Por favor, insira um email válido');
            isValid = false;
        }
        
        // Validar mensagem
        if (!messageField.value.trim()) {
            showFieldError(messageField, 'Mensagem é obrigatória');
            isValid = false;
        } else if (messageField.value.length > 500) {
            showFieldError(messageField, 'A mensagem deve ter no máximo 500 caracteres.');
            isValid = false;
        }
        
        // Validação da empresa (opcional, mas com limite se preenchida)
        if (companyField && companyField.value.trim().length > 100) {
            showFieldError(companyField, 'O nome da empresa deve ter no máximo 100 caracteres.');
            isValid = false;
        }
        
        // Validação do cargo (opcional, mas com limite se preenchido)
        if (positionField && positionField.value.trim().length > 50) {
            showFieldError(positionField, 'O cargo deve ter no máximo 50 caracteres.');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Função para mostrar mensagem de status
    function showMessage(type, message) {
        // Esconder todas as mensagens
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        if (type === 'success') {
            successMessage.style.display = 'block';
            successMessage.textContent = message;
            
            // Melhorar estilização da mensagem de sucesso
            successMessage.className = 'success-message-enhanced';
            successMessage.style.cssText = `
                display: block !important;
                background: linear-gradient(135deg, #4CAF50, #45a049) !important;
                color: white !important;
                padding: 20px 25px !important;
                border-radius: 12px !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                text-align: center !important;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3) !important;
                border: none !important;
                margin: 20px 0 !important;
                animation: slideInSuccess 0.5s ease-out !important;
                position: relative !important;
                overflow: hidden !important;
            `;
            
            // Adicionar ícone de sucesso
            successMessage.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                        <circle cx="12" cy="12" r="10" fill="white" fill-opacity="0.2"/>
                        <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${message}</span>
                </div>
            `;
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = message;
        }
        
        // Scroll para a mensagem
        setTimeout(() => {
            const messageElement = type === 'success' ? successMessage : errorMessage;
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // Configuração do EmailJS
    const EMAILJS_CONFIG = {
        serviceId: 'service_pw3w57i',
        templateId: 'template_2pejqhi',
        publicKey: 'JJwuB83dpqM7bTrG7' // Substitua pela sua chave pública do EmailJS
    };
    
    // Função para enviar email via EmailJS
    async function sendEmailJS(data) {
        try {
            // Verificar se EmailJS está carregado
            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS não está carregado. Usando modo de demonstração.');
                return { success: true, demo: true };
            }
            
            const templateParams = {
                to_email: 'marcelo.andrade@tacontudo.com',
                from_name: data.name,
                from_email: data.email,
                company: data.company,
                position: data.position,
                message: data.message,
                timestamp: data.timestamp
            };
            
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams,
                EMAILJS_CONFIG.publicKey
            );
            
            return { success: true, response };
        } catch (error) {
            console.error('Erro ao enviar email via EmailJS:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Função para processar formulário
    async function processForm(formData) {
        try {
            // Coletar dados do formulário
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('text') || 'Não informado',
                position: formData.get('text-1') || 'Não informado',
                message: formData.get('message'),
                timestamp: new Date().toLocaleString('pt-BR')
            };
            
            // Log dos dados para demonstração
            console.log('📧 Dados do formulário coletados:', data);
            
            // Tentar enviar via EmailJS
            const emailResult = await sendEmailJS(data);
            
            // Salvar no localStorage para backup
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push({
                ...data,
                emailSent: emailResult.success,
                emailError: emailResult.error || null,
                isDemo: emailResult.demo || false
            });
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            return emailResult;
        } catch (error) {
            console.error('Erro ao processar formulário:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Event listener para o botão de envio
    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Ocultar mensagens de erro do sistema original
        const systemError = document.querySelector('.u-form-send-error');
        if (systemError) {
            systemError.style.display = 'none';
        }
        
        // Validar formulário
        if (!validateForm()) {
            showMessage('error', 'Por favor, corrija os erros e tente novamente.');
            return;
        }
        
        // Mostrar loading
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';
        
        // Coletar dados do formulário
        const formData = new FormData(form);
        
        // Processar formulário
        const result = await processForm(formData);
        
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
        
        if (result.success) {
            showMessage('success', '✅ Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve. Obrigado pelo seu interesse!');
            form.reset();
            
            // Atualizar contadores após reset
            document.querySelectorAll('.character-counter').forEach(counter => {
                const field = counter.previousElementSibling;
                if (field) {
                    const maxLength = parseInt(counter.textContent.split('/')[1]);
                    counter.textContent = `0/${maxLength} caracteres`;
                    counter.style.color = '#666';
                }
            });
        } else {
            showMessage('error', 'Não foi possível enviar sua mensagem. Por favor, tente novamente ou entre em contato diretamente conosco.');
        }
    });
    
    // Validação em tempo real
    nameField.addEventListener('blur', function() {
        if (this.value.trim()) {
            removeFieldError(this);
        }
    });
    
    emailField.addEventListener('blur', function() {
        if (this.value.trim() && isValidEmail(this.value.trim())) {
            removeFieldError(this);
        }
    });
    
    messageField.addEventListener('blur', function() {
        if (this.value.trim()) {
            removeFieldError(this);
        }
    });
    
    // Função para criar contador de caracteres
    function createCharacterCounter(field, maxLength, fieldName) {
        if (!field) return;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = 'font-size: 12px; color: #666; text-align: right; margin-top: 5px;';
        field.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - field.value.length;
            counter.textContent = `${field.value.length}/${maxLength} caracteres`;
            
            if (remaining < 0) {
                counter.style.color = '#e74c3c';
            } else if (remaining < 10) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#666';
            }
        }
        
        // Função para limitar a entrada de caracteres
        function limitInput(e) {
            // Permitir teclas especiais (backspace, delete, arrow keys, etc.)
            const allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Home', 'End', 'Tab', 'Escape', 'Enter'
            ];
            
            // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
                return;
            }
            
            // Se a tecla é permitida, não bloquear
            if (allowedKeys.includes(e.key)) {
                return;
            }
            
            // Validação específica para campo nome - apenas letras, espaços e acentos
            if (fieldName === 'Nome' && e.key.length === 1) {
                const nameRegex = /^[a-zA-ZÀ-ÿ\s]$/;
                if (!nameRegex.test(e.key)) {
                    e.preventDefault();
                    return false;
                }
            }
            
            // Se já atingiu o limite e não é uma tecla especial, bloquear
            if (field.value.length >= maxLength) {
                e.preventDefault();
                return false;
            }
        }
        
        // Função para limitar entrada via paste
        function limitPaste(e) {
            setTimeout(() => {
                // Validação específica para campo nome - remover caracteres especiais
                if (fieldName === 'Nome') {
                    const nameRegex = /[^a-zA-ZÀ-ÿ\s]/g;
                    field.value = field.value.replace(nameRegex, '');
                }
                
                if (field.value.length > maxLength) {
                    field.value = field.value.substring(0, maxLength);
                }
                updateCounter();
            }, 0);
        }
        
        field.addEventListener('input', updateCounter);
        field.addEventListener('keyup', updateCounter);
        field.addEventListener('keydown', limitInput);
        field.addEventListener('paste', limitPaste);
        updateCounter();
    }
    
    // Adicionar contadores para todos os campos
    createCharacterCounter(nameField, 50, 'Nome');
    createCharacterCounter(companyField, 100, 'Empresa');
    createCharacterCounter(positionField, 50, 'Cargo');
    createCharacterCounter(messageField, 500, 'Mensagem');
    
    // Adicionar estilos CSS para campos com erro
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            color: #d32f2f;
            background-color: #ffebee;
            border: 1px solid #ffcdd2;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            margin-top: 8px;
            display: block;
        }
        
        .u-input.error {
            border-color: #d32f2f !important;
            box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1) !important;
            background-color: #fff5f5 !important;
        }
        
        .u-form-send-success,
        .u-form-send-error {
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: bold;
        }
        
        .u-form-send-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .u-form-send-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: none !important;
        }
    `;
    document.head.appendChild(style);
});