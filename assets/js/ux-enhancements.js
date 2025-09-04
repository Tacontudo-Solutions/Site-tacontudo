// UX Enhancements Script
// Implementa animações e feedback visual para melhorar a experiência do usuário

(function() {
    'use strict';

    // Aguarda o carregamento completo do DOM
    document.addEventListener('DOMContentLoaded', function() {
        initializeUXEnhancements();
    });

    function initializeUXEnhancements() {
        // Inicializa todas as funcionalidades UX
        setupScrollAnimations();
        setupButtonFeedback();
        setupFormEnhancements();
        setupLoadingStates();
        setupTooltips();
        setupSmoothScrolling();
        setupProgressIndicators();
        setupImageLoadingEffects();
        setupMobileOptimizations();
    }

    // Animações de scroll
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Observa elementos que devem ser animados
        const animatedElements = document.querySelectorAll('.u-section, .u-container, .u-image, .u-text');
        animatedElements.forEach(function(el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // Feedback visual para botões
    function setupButtonFeedback() {
        const buttons = document.querySelectorAll('button, .u-btn, .u-button, a[href]');
        
        buttons.forEach(function(button) {
            // Efeito ripple ao clicar
            button.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });

            // Feedback de hover
            button.addEventListener('mouseenter', function() {
                this.classList.add('ux-hover');
            });

            button.addEventListener('mouseleave', function() {
                this.classList.remove('ux-hover');
            });
        });
    }

    // Cria efeito ripple
    function createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(function() {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Melhorias para formulários
    function setupFormEnhancements() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(function(input) {
            // Feedback visual para foco
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('input-focused');
                validateInput(this);
            });

            // Validação em tempo real
            input.addEventListener('input', function() {
                clearTimeout(this.validationTimeout);
                this.validationTimeout = setTimeout(function() {
                    validateInput(input);
                }, 300);
            });
        });
    }

    // Validação de entrada
    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');
        
        // Remove classes anteriores
        input.classList.remove('input-valid', 'input-invalid');
        
        if (required && !value) {
            input.classList.add('input-invalid');
            return false;
        }

        if (value) {
            let isValid = true;
            
            switch (type) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'tel':
                    isValid = /^[\d\s\-\+\(\)]+$/.test(value);
                    break;
                case 'url':
                    isValid = /^https?:\/\/.+/.test(value);
                    break;
            }
            
            input.classList.add(isValid ? 'input-valid' : 'input-invalid');
            return isValid;
        }
        
        return true;
    }

    // Estados de carregamento
    function setupLoadingStates() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitButton) {
                    submitButton.classList.add('loading');
                    submitButton.disabled = true;
                    
                    // Simula carregamento (remover em produção se não necessário)
                    setTimeout(function() {
                        submitButton.classList.remove('loading');
                        submitButton.disabled = false;
                    }, 2000);
                }
            });
        });
    }

    // Tooltips
    function setupTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
        
        elementsWithTooltips.forEach(function(element) {
            element.addEventListener('mouseenter', function() {
                showTooltip(this);
            });
            
            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    function showTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'ux-tooltip';
        tooltip.textContent = tooltipText;
        tooltip.id = 'ux-tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        setTimeout(function() {
            tooltip.classList.add('visible');
        }, 10);
    }

    function hideTooltip() {
        const tooltip = document.getElementById('ux-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
            setTimeout(function() {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        }
    }

    // Scroll suave
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Indicadores de progresso
    function setupProgressIndicators() {
        // Indicador de progresso de scroll
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Efeitos de carregamento de imagem
    function setupImageLoadingEffects() {
        const images = document.querySelectorAll('img');
        
        images.forEach(function(img) {
            if (!img.complete) {
                img.classList.add('loading');
                
                img.addEventListener('load', function() {
                    this.classList.remove('loading');
                    this.classList.add('loaded');
                });
                
                img.addEventListener('error', function() {
                    this.classList.remove('loading');
                    this.classList.add('error');
                });
            } else {
                img.classList.add('loaded');
            }
        });
    }

    // Otimizações para mobile
    function setupMobileOptimizations() {
        // Detecta dispositivos touch
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Melhora a responsividade do toque
            const touchElements = document.querySelectorAll('button, .u-btn, a');
            touchElements.forEach(function(element) {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                element.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });
        }
        
        // Otimiza para orientação
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 100);
        });
    }

    // Utilitários
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance monitoring
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log('Page load time:', loadTime + 'ms');
                }, 0);
            });
        }
    }

    // Inicializa monitoramento de performance
    logPerformance();

})();