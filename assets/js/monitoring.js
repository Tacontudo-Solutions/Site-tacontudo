// Monitoring Script
// Implementa Analytics, Core Web Vitals e logs de erro

(function() {
    'use strict';

    // Configurações de monitoramento
    const MONITORING_CONFIG = {
        // Google Analytics (substitua pelo seu ID)
        gaTrackingId: 'G-ND2C2T2QD4',
        
        // Configurações de Core Web Vitals
        webVitals: {
            enabled: true,
            reportThreshold: 100, // ms
            sampleRate: 1.0 // 100% das sessões
        },
        
        // Configurações de logs de erro
        errorLogging: {
            enabled: true,
            maxErrors: 50,
            reportToConsole: true,
            reportToServer: false, // Configurar endpoint se necessário
            serverEndpoint: '/api/errors'
        },
        
        // Configurações de performance
        performance: {
            enabled: true,
            trackUserTiming: true,
            trackResourceTiming: true
        }
    };

    let errorCount = 0;
    let performanceData = {};
    let webVitalsData = {};

    // Inicializa monitoramento quando DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        initializeMonitoring();
    });

    function initializeMonitoring() {
        console.log('Monitoring: Initializing...');
        
        // Inicializa Google Analytics
        initializeGoogleAnalytics();
        
        // Inicializa Core Web Vitals
        initializeWebVitals();
        
        // Inicializa logs de erro
        initializeErrorLogging();
        
        // Inicializa monitoramento de performance
        initializePerformanceMonitoring();
        
        // Inicializa eventos customizados
        initializeCustomEvents();
        
        console.log('Monitoring: Initialization complete');
    }

    // Inicializa Google Analytics
    function initializeGoogleAnalytics() {
        if (!MONITORING_CONFIG.gaTrackingId || MONITORING_CONFIG.gaTrackingId === 'G-XXXXXXXXXX') {
            console.log('Monitoring: Google Analytics ID not configured');
            return;
        }

        // Carrega Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${MONITORING_CONFIG.gaTrackingId}`;
        document.head.appendChild(script);

        // Configura gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', MONITORING_CONFIG.gaTrackingId, {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'web_vitals_data'
            }
        });

        console.log('Monitoring: Google Analytics initialized');
    }

    // Inicializa Core Web Vitals
    function initializeWebVitals() {
        if (!MONITORING_CONFIG.webVitals.enabled) return;

        // Largest Contentful Paint (LCP)
        measureLCP();
        
        // First Input Delay (FID)
        measureFID();
        
        // Cumulative Layout Shift (CLS)
        measureCLS();
        
        // First Contentful Paint (FCP)
        measureFCP();
        
        // Time to First Byte (TTFB)
        measureTTFB();

        console.log('Monitoring: Core Web Vitals initialized');
    }

    // Mede Largest Contentful Paint
    function measureLCP() {
        if (!('PerformanceObserver' in window)) return;

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            webVitalsData.lcp = Math.round(lastEntry.startTime);
            
            reportWebVital('LCP', webVitalsData.lcp, {
                element: lastEntry.element?.tagName || 'unknown',
                url: lastEntry.url || 'unknown'
            });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Mede First Input Delay
    function measureFID() {
        if (!('PerformanceObserver' in window)) return;

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                webVitalsData.fid = Math.round(entry.processingStart - entry.startTime);
                
                reportWebVital('FID', webVitalsData.fid, {
                    eventType: entry.name,
                    target: entry.target?.tagName || 'unknown'
                });
            });
        });

        observer.observe({ entryTypes: ['first-input'] });
    }

    // Mede Cumulative Layout Shift
    function measureCLS() {
        if (!('PerformanceObserver' in window)) return;

        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach((entry) => {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                    if (sessionValue && 
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }

                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        webVitalsData.cls = Math.round(clsValue * 1000) / 1000;
                        
                        reportWebVital('CLS', webVitalsData.cls, {
                            sources: sessionEntries.map(e => e.sources?.[0]?.node?.tagName || 'unknown')
                        });
                    }
                }
            });
        });

        observer.observe({ entryTypes: ['layout-shift'] });
    }

    // Mede First Contentful Paint
    function measureFCP() {
        if (!('PerformanceObserver' in window)) return;

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    webVitalsData.fcp = Math.round(entry.startTime);
                    reportWebVital('FCP', webVitalsData.fcp);
                }
            });
        });

        observer.observe({ entryTypes: ['paint'] });
    }

    // Mede Time to First Byte
    function measureTTFB() {
        if (!('performance' in window) || !performance.timing) return;

        window.addEventListener('load', () => {
            const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
            webVitalsData.ttfb = ttfb;
            reportWebVital('TTFB', ttfb);
        });
    }

    // Reporta Web Vital
    function reportWebVital(name, value, additionalData = {}) {
        console.log(`Monitoring: ${name}:`, value, 'ms', additionalData);
        
        // Envia para Google Analytics se configurado
        if (window.gtag) {
            gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: name,
                value: Math.round(value),
                custom_parameter_1: JSON.stringify(additionalData)
            });
        }
        
        // Armazena localmente
        localStorage.setItem(`webvital_${name.toLowerCase()}`, JSON.stringify({
            value,
            timestamp: Date.now(),
            url: window.location.href,
            ...additionalData
        }));
    }

    // Inicializa logs de erro
    function initializeErrorLogging() {
        if (!MONITORING_CONFIG.errorLogging.enabled) return;

        // Erros JavaScript
        window.addEventListener('error', (event) => {
            logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Promises rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            logError({
                type: 'unhandled_promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Erros de recursos
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                logError({
                    type: 'resource',
                    message: `Failed to load resource: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: Date.now(),
                    url: window.location.href
                });
            }
        }, true);

        console.log('Monitoring: Error logging initialized');
    }

    // Registra erro
    function logError(errorData) {
        errorCount++;
        
        if (errorCount > MONITORING_CONFIG.errorLogging.maxErrors) {
            console.warn('Monitoring: Maximum error count reached');
            return;
        }

        if (MONITORING_CONFIG.errorLogging.reportToConsole) {
            console.error('Monitoring: Error logged:', errorData);
        }

        // Armazena localmente
        const errors = JSON.parse(localStorage.getItem('monitoring_errors') || '[]');
        errors.push(errorData);
        
        // Mantém apenas os últimos 50 erros
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('monitoring_errors', JSON.stringify(errors));

        // Envia para Google Analytics se configurado
        if (window.gtag) {
            gtag('event', 'exception', {
                description: errorData.message,
                fatal: errorData.type === 'javascript'
            });
        }

        // Envia para servidor se configurado
        if (MONITORING_CONFIG.errorLogging.reportToServer) {
            sendErrorToServer(errorData);
        }
    }

    // Envia erro para servidor
    function sendErrorToServer(errorData) {
        fetch(MONITORING_CONFIG.errorLogging.serverEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(errorData)
        }).catch(err => {
            console.warn('Monitoring: Failed to send error to server:', err);
        });
    }

    // Inicializa monitoramento de performance
    function initializePerformanceMonitoring() {
        if (!MONITORING_CONFIG.performance.enabled) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                collectPerformanceData();
            }, 1000);
        });

        console.log('Monitoring: Performance monitoring initialized');
    }

    // Coleta dados de performance
    function collectPerformanceData() {
        if (!('performance' in window)) return;

        const timing = performance.timing;
        const navigation = performance.getEntriesByType('navigation')[0];
        
        performanceData = {
            // Tempos de carregamento
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            loadComplete: timing.loadEventEnd - timing.navigationStart,
            
            // Tempos de rede
            dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcpConnect: timing.connectEnd - timing.connectStart,
            serverResponse: timing.responseEnd - timing.requestStart,
            
            // Tempos de renderização
            domProcessing: timing.domComplete - timing.domLoading,
            
            // Informações de navegação
            navigationType: navigation?.type || 'unknown',
            redirectCount: navigation?.redirectCount || 0,
            
            // Timestamp
            timestamp: Date.now(),
            url: window.location.href
        };

        console.log('Monitoring: Performance data collected:', performanceData);
        
        // Armazena localmente
        localStorage.setItem('monitoring_performance', JSON.stringify(performanceData));
        
        // Envia para Google Analytics se configurado
        if (window.gtag) {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: performanceData.loadComplete
            });
        }
    }

    // Inicializa eventos customizados
    function initializeCustomEvents() {
        // Rastreia cliques em botões importantes
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.matches('button, .u-btn, .u-button, a[href]')) {
                trackCustomEvent('click', {
                    element: target.tagName,
                    text: target.textContent?.trim().substring(0, 50),
                    href: target.href,
                    className: target.className
                });
            }
        });

        // Rastreia tempo na página
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            trackCustomEvent('time_on_page', {
                duration: timeOnPage,
                url: window.location.href
            });
        });

        // Rastreia scroll depth
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', debounce(() => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                if (maxScrollDepth % 25 === 0) { // 25%, 50%, 75%, 100%
                    trackCustomEvent('scroll_depth', {
                        depth: maxScrollDepth,
                        url: window.location.href
                    });
                }
            }
        }, 250));

        console.log('Monitoring: Custom events initialized');
    }

    // Rastreia evento customizado
    function trackCustomEvent(eventName, eventData) {
        console.log(`Monitoring: Custom event - ${eventName}:`, eventData);
        
        // Envia para Google Analytics se configurado
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'User Interaction',
                event_label: JSON.stringify(eventData),
                value: eventData.duration || eventData.depth || 1
            });
        }
    }

    // Utilitário debounce
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

    // API pública para monitoramento
    window.Monitoring = {
        // Obtém dados de Web Vitals
        getWebVitals: () => webVitalsData,
        
        // Obtém dados de performance
        getPerformanceData: () => performanceData,
        
        // Obtém erros registrados
        getErrors: () => JSON.parse(localStorage.getItem('monitoring_errors') || '[]'),
        
        // Limpa dados de monitoramento
        clearData: () => {
            localStorage.removeItem('monitoring_errors');
            localStorage.removeItem('monitoring_performance');
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('webvital_')) {
                    localStorage.removeItem(key);
                }
            });
        },
        
        // Rastreia evento customizado
        trackEvent: trackCustomEvent,
        
        // Obtém relatório completo
        getReport: () => ({
            webVitals: webVitalsData,
            performance: performanceData,
            errors: JSON.parse(localStorage.getItem('monitoring_errors') || '[]'),
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        })
    };

    console.log('Monitoring: Script loaded');

})();