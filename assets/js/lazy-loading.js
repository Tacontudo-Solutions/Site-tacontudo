// Lazy Loading de Imagens - Otimização de Performance
// Carrega imagens apenas quando estão prestes a entrar na viewport

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o navegador suporta Intersection Observer
    if ('IntersectionObserver' in window) {
        // Configurar o observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Carregar a imagem
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Remover classe de loading e adicionar classe de loaded
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                    
                    // Parar de observar esta imagem
                    observer.unobserve(img);
                }
            });
        }, {
            // Carregar imagem quando estiver 50px antes de entrar na viewport
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Encontrar todas as imagens com data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            // Adicionar classe de loading
            img.classList.add('lazy-loading');
            
            // Começar a observar a imagem
            imageObserver.observe(img);
        });
        
    } else {
        // Fallback para navegadores que não suportam Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
            }
        });
    }
    
    // Preload de imagens críticas
    const criticalImages = document.querySelectorAll('img[data-preload="true"]');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            const preloadImg = new Image();
            preloadImg.src = img.dataset.src;
        }
    });
});

// CSS para animação de loading (será injetado dinamicamente)
const lazyLoadingStyles = `
    .lazy-loading {
        opacity: 0.5;
        transition: opacity 0.3s ease-in-out;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
    }
    
    .lazy-loaded {
        opacity: 1;
        animation: none;
        background: none;
    }
    
    @keyframes loading-shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    /* Placeholder para imagens não carregadas */
    img[data-src]:not(.lazy-loaded) {
        min-height: 200px;
        background-color: #f5f5f5;
        background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f5f5f5"/><text x="50" y="50" font-family="Arial" font-size="12" fill="%23999" text-anchor="middle" dy=".3em">Carregando...</text></svg>');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100px 100px;
    }
`;

// Injetar estilos CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = lazyLoadingStyles;
document.head.appendChild(styleSheet);

// Função utilitária para converter imagens existentes para lazy loading
function convertToLazyLoading() {
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
        if (img.src && !img.classList.contains('no-lazy')) {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="transparent"/></svg>';
            
            if (img.srcset) {
                img.dataset.srcset = img.srcset;
                img.removeAttribute('srcset');
            }
        }
    });
}

// Exportar função para uso externo
window.LazyLoading = {
    convertToLazyLoading: convertToLazyLoading
};