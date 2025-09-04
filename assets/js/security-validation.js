/* ========================================
   VALIDAÇÕES DE SEGURANÇA ROBUSTAS
   ======================================== */

// Classe para validações de segurança
class SecurityValidator {
    constructor() {
        this.patterns = {
            // Padrões para detectar tentativas de XSS
            xss: /<script[^>]*>.*?<\/script>|javascript:|on\w+\s*=|<iframe|<object|<embed|<link|<meta|<style/gi,
            
            // Padrões para detectar SQL Injection
            sqlInjection: /(union|select|insert|update|delete|drop|create|alter|exec|execute|script|declare|cast|convert)\s*[\(\s]/gi,
            
            // Padrões para detectar Path Traversal
            pathTraversal: /(\.\.\/|\.\.\\\\|%2e%2e%2f|%2e%2e%5c)/gi,
            
            // Padrões para detectar LDAP Injection
            ldapInjection: /[\*\(\)\\\x00]/g,
            
            // Padrões para detectar Command Injection
            commandInjection: /[;&|`$\(\){}\[\]]/g,
            
            // Caracteres especiais perigosos
            dangerousChars: /[<>"'&\x00-\x1f\x7f-\x9f]/g
        };
        
        this.maxLengths = {
            name: 100,
            email: 254,
            phone: 20,
            message: 2000,
            subject: 200
        };
    }
    
    // Sanitizar entrada removendo caracteres perigosos
    sanitizeInput(input, type = 'general') {
        if (typeof input !== 'string') {
            return '';
        }
        
        let sanitized = input.trim();
        
        // Remover caracteres de controle
        sanitized = sanitized.replace(/[\x00-\x1f\x7f-\x9f]/g, '');
        
        // Escapar HTML
        sanitized = this.escapeHtml(sanitized);
        
        // Validações específicas por tipo
        switch (type) {
            case 'name':
                // Permitir apenas letras, espaços, acentos e hífens
                sanitized = sanitized.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                break;
            case 'email':
                // Manter apenas caracteres válidos para email
                sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '');
                break;
            case 'phone':
                // Manter apenas números, espaços, parênteses e hífens
                sanitized = sanitized.replace(/[^0-9\s\(\)\-\+]/g, '');
                break;
            case 'message':
                // Remover scripts e tags perigosas
                sanitized = sanitized.replace(this.patterns.xss, '');
                break;
        }
        
        return sanitized;
    }
    
    // Escapar caracteres HTML
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
    
    // Validar se a entrada contém padrões maliciosos
    containsMaliciousPatterns(input) {
        const threats = [];
        
        if (this.patterns.xss.test(input)) {
            threats.push('XSS');
        }
        
        if (this.patterns.sqlInjection.test(input)) {
            threats.push('SQL Injection');
        }
        
        if (this.patterns.pathTraversal.test(input)) {
            threats.push('Path Traversal');
        }
        
        if (this.patterns.ldapInjection.test(input)) {
            threats.push('LDAP Injection');
        }
        
        if (this.patterns.commandInjection.test(input)) {
            threats.push('Command Injection');
        }
        
        return threats;
    }
    
    // Validar comprimento da entrada
    validateLength(input, type) {
        const maxLength = this.maxLengths[type] || 255;
        return input.length <= maxLength;
    }
    
    // Validar formato de email
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    
    // Validar formato de telefone
    validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\(\)\-]{8,20}$/;
        return phoneRegex.test(phone);
    }
    
    // Validar nome (apenas letras, espaços e acentos)
    validateName(name) {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,100}$/;
        return nameRegex.test(name);
    }
    
    // Validação completa de um campo
    validateField(value, type) {
        const result = {
            isValid: true,
            sanitizedValue: '',
            errors: [],
            threats: []
        };
        
        // Verificar se o valor existe
        if (!value || typeof value !== 'string') {
            result.isValid = false;
            result.errors.push('Campo obrigatório');
            return result;
        }
        
        // Detectar padrões maliciosos
        const threats = this.containsMaliciousPatterns(value);
        if (threats.length > 0) {
            result.isValid = false;
            result.threats = threats;
            result.errors.push('Conteúdo não permitido detectado');
            return result;
        }
        
        // Sanitizar entrada
        result.sanitizedValue = this.sanitizeInput(value, type);
        
        // Validar comprimento
        if (!this.validateLength(result.sanitizedValue, type)) {
            result.isValid = false;
            result.errors.push(`Texto muito longo (máximo ${this.maxLengths[type] || 255} caracteres)`);
        }
        
        // Validações específicas por tipo
        switch (type) {
            case 'name':
                if (!this.validateName(result.sanitizedValue)) {
                    result.isValid = false;
                    result.errors.push('Nome deve conter apenas letras e espaços');
                }
                break;
            case 'email':
                if (!this.validateEmail(result.sanitizedValue)) {
                    result.isValid = false;
                    result.errors.push('Formato de email inválido');
                }
                break;
            case 'phone':
                if (!this.validatePhone(result.sanitizedValue)) {
                    result.isValid = false;
                    result.errors.push('Formato de telefone inválido');
                }
                break;
        }
        
        return result;
    }
    
    // Rate limiting simples (baseado em localStorage)
    checkRateLimit(action = 'form_submit', maxAttempts = 5, timeWindow = 300000) { // 5 minutos
        const now = Date.now();
        const key = `rate_limit_${action}`;
        const attempts = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remover tentativas antigas
        const recentAttempts = attempts.filter(timestamp => now - timestamp < timeWindow);
        
        if (recentAttempts.length >= maxAttempts) {
            return {
                allowed: false,
                remainingTime: Math.ceil((recentAttempts[0] + timeWindow - now) / 1000)
            };
        }
        
        // Adicionar nova tentativa
        recentAttempts.push(now);
        localStorage.setItem(key, JSON.stringify(recentAttempts));
        
        return {
            allowed: true,
            remainingAttempts: maxAttempts - recentAttempts.length
        };
    }
    
    // Gerar token CSRF simples
    generateCSRFToken() {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('csrf_token', token);
        return token;
    }
    
    // Validar token CSRF
    validateCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        return token === storedToken;
    }
    
    // Log de segurança (para desenvolvimento)
    logSecurityEvent(event, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.warn('Security Event:', logEntry);
        
        // Em produção, enviar para servidor de logs
        // this.sendToSecurityLog(logEntry);
    }
}

// Instância global do validador
window.SecurityValidator = new SecurityValidator();

// Integração com formulários existentes
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Adicionar token CSRF
        const csrfToken = window.SecurityValidator.generateCSRFToken();
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Interceptar envio do formulário
        form.addEventListener('submit', function(e) {
            // Verificar rate limiting
            const rateLimit = window.SecurityValidator.checkRateLimit('form_submit');
            if (!rateLimit.allowed) {
                e.preventDefault();
                alert(`Muitas tentativas. Tente novamente em ${rateLimit.remainingTime} segundos.`);
                window.SecurityValidator.logSecurityEvent('rate_limit_exceeded', {
                    form: form.id || 'unknown',
                    remainingTime: rateLimit.remainingTime
                });
                return;
            }
            
            // Validar todos os campos
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
            let hasErrors = false;
            
            inputs.forEach(input => {
                const fieldType = input.type === 'email' ? 'email' : 
                                input.type === 'tel' ? 'phone' : 
                                input.name === 'name' ? 'name' : 'message';
                
                const validation = window.SecurityValidator.validateField(input.value, fieldType);
                
                if (!validation.isValid) {
                    hasErrors = true;
                    input.classList.add('error');
                    
                    // Log de ameaças detectadas
                    if (validation.threats.length > 0) {
                        window.SecurityValidator.logSecurityEvent('malicious_input_detected', {
                            field: input.name,
                            threats: validation.threats,
                            value: input.value.substring(0, 100) // Apenas primeiros 100 chars para log
                        });
                    }
                } else {
                    input.classList.remove('error');
                    input.value = validation.sanitizedValue;
                }
            });
            
            if (hasErrors) {
                e.preventDefault();
                alert('Por favor, corrija os erros no formulário antes de enviar.');
            }
        });
    });
});

// Proteção contra ataques de timing
function constantTimeStringCompare(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
}

// Exportar para uso global
window.constantTimeStringCompare = constantTimeStringCompare;