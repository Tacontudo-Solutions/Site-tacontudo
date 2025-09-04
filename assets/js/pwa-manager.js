// PWA Manager
// Gerencia registro do service worker e funcionalidades PWA

(function() {
    'use strict';

    // Configurações PWA
    const PWA_CONFIG = {
        swPath: '/sw.js',
        updateCheckInterval: 60000, // 1 minuto
        installPromptDelay: 3000, // 3 segundos
        notificationPermission: false
    };

    let deferredPrompt = null;
    let swRegistration = null;
    let isOnline = navigator.onLine;

    // Inicializa PWA quando DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        initializePWA();
    });

    async function initializePWA() {
        console.log('PWA Manager: Initializing...');
        
        // Verifica suporte a Service Worker
        if (!('serviceWorker' in navigator)) {
            console.log('PWA Manager: Service Worker not supported');
            return;
        }

        try {
            // Registra Service Worker
            await registerServiceWorker();
            
            // Configura eventos PWA
            setupPWAEvents();
            
            // Configura prompt de instalação
            setupInstallPrompt();
            
            // Monitora status de conexão
            setupConnectionMonitoring();
            
            // Configura notificações
            setupNotifications();
            
            // Verifica atualizações
            checkForUpdates();
            
            console.log('PWA Manager: Initialization complete');
        } catch (error) {
            console.error('PWA Manager: Initialization failed:', error);
        }
    }

    // Registra o Service Worker
    async function registerServiceWorker() {
        try {
            swRegistration = await navigator.serviceWorker.register(PWA_CONFIG.swPath);
            console.log('PWA Manager: Service Worker registered:', swRegistration.scope);
            
            // Escuta atualizações do SW
            swRegistration.addEventListener('updatefound', () => {
                const newWorker = swRegistration.installing;
                console.log('PWA Manager: New Service Worker found');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
            
            return swRegistration;
        } catch (error) {
            console.error('PWA Manager: Service Worker registration failed:', error);
            throw error;
        }
    }

    // Configura eventos PWA
    function setupPWAEvents() {
        // Evento beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA Manager: Install prompt available');
            e.preventDefault();
            deferredPrompt = e;
            
            // Mostra botão de instalação após delay
            setTimeout(() => {
                showInstallButton();
            }, PWA_CONFIG.installPromptDelay);
        });

        // Evento appinstalled
        window.addEventListener('appinstalled', () => {
            console.log('PWA Manager: App installed');
            hideInstallButton();
            showInstallSuccessMessage();
            deferredPrompt = null;
        });

        // Mensagens do Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            handleServiceWorkerMessage(event.data);
        });
    }

    // Configura prompt de instalação
    function setupInstallPrompt() {
        // Cria botão de instalação
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install-button';
        installButton.className = 'pwa-install-btn hidden';
        installButton.innerHTML = '📱 Instalar App';
        installButton.setAttribute('aria-label', 'Instalar aplicativo');
        
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('PWA Manager: Install prompt result:', outcome);
                deferredPrompt = null;
                hideInstallButton();
            }
        });
        
        document.body.appendChild(installButton);
    }

    // Mostra botão de instalação
    function showInstallButton() {
        const button = document.getElementById('pwa-install-button');
        if (button && deferredPrompt) {
            button.classList.remove('hidden');
            button.classList.add('visible');
        }
    }

    // Esconde botão de instalação
    function hideInstallButton() {
        const button = document.getElementById('pwa-install-button');
        if (button) {
            button.classList.remove('visible');
            button.classList.add('hidden');
        }
    }

    // Configura monitoramento de conexão
    function setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            console.log('PWA Manager: Connection restored');
            isOnline = true;
            hideOfflineMessage();
            syncWhenOnline();
        });

        window.addEventListener('offline', () => {
            console.log('PWA Manager: Connection lost');
            isOnline = false;
            showOfflineMessage();
        });

        // Verifica status inicial
        if (!isOnline) {
            showOfflineMessage();
        }
    }

    // Mostra mensagem offline
    function showOfflineMessage() {
        let offlineBar = document.getElementById('pwa-offline-bar');
        
        if (!offlineBar) {
            offlineBar = document.createElement('div');
            offlineBar.id = 'pwa-offline-bar';
            offlineBar.className = 'pwa-offline-bar';
            offlineBar.innerHTML = '📡 Você está offline. Algumas funcionalidades podem estar limitadas.';
            document.body.insertBefore(offlineBar, document.body.firstChild);
        }
        
        offlineBar.classList.add('visible');
    }

    // Esconde mensagem offline
    function hideOfflineMessage() {
        const offlineBar = document.getElementById('pwa-offline-bar');
        if (offlineBar) {
            offlineBar.classList.remove('visible');
        }
    }

    // Configura notificações
    async function setupNotifications() {
        if (!('Notification' in window)) {
            console.log('PWA Manager: Notifications not supported');
            return;
        }

        if (Notification.permission === 'default') {
            // Solicita permissão após interação do usuário
            document.addEventListener('click', requestNotificationPermission, { once: true });
        }
    }

    // Solicita permissão para notificações
    async function requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            PWA_CONFIG.notificationPermission = permission === 'granted';
            console.log('PWA Manager: Notification permission:', permission);
        } catch (error) {
            console.error('PWA Manager: Notification permission error:', error);
        }
    }

    // Verifica atualizações
    function checkForUpdates() {
        if (swRegistration) {
            setInterval(() => {
                swRegistration.update();
            }, PWA_CONFIG.updateCheckInterval);
        }
    }

    // Mostra notificação de atualização
    function showUpdateNotification() {
        const updateBar = document.createElement('div');
        updateBar.id = 'pwa-update-bar';
        updateBar.className = 'pwa-update-bar';
        updateBar.innerHTML = `
            <span>🔄 Nova versão disponível!</span>
            <button onclick="window.PWAManager.applyUpdate()">Atualizar</button>
            <button onclick="this.parentElement.remove()">Depois</button>
        `;
        
        document.body.insertBefore(updateBar, document.body.firstChild);
    }

    // Aplica atualização
    function applyUpdate() {
        if (swRegistration && swRegistration.waiting) {
            swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    // Sincroniza quando online
    function syncWhenOnline() {
        if (swRegistration && swRegistration.sync) {
            swRegistration.sync.register('background-sync');
        }
    }

    // Manipula mensagens do Service Worker
    function handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'CACHE_UPDATED':
                console.log('PWA Manager: Cache updated');
                break;
            case 'OFFLINE_READY':
                console.log('PWA Manager: Offline functionality ready');
                break;
            default:
                console.log('PWA Manager: Unknown SW message:', data);
        }
    }

    // Mostra mensagem de sucesso da instalação
    function showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.innerHTML = '✅ App instalado com sucesso!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Obtém informações do cache
    async function getCacheInfo() {
        if (!swRegistration) return null;
        
        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data);
            };
            
            swRegistration.active.postMessage(
                { type: 'GET_CACHE_SIZE' },
                [messageChannel.port2]
            );
        });
    }

    // Limpa cache
    async function clearCache() {
        if (!swRegistration) return false;
        
        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.success);
            };
            
            swRegistration.active.postMessage(
                { type: 'CLEAR_CACHE' },
                [messageChannel.port2]
            );
        });
    }

    // Verifica se está instalado
    function isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    // API pública
    window.PWAManager = {
        applyUpdate,
        getCacheInfo,
        clearCache,
        isInstalled,
        isOnline: () => isOnline,
        getRegistration: () => swRegistration
    };

    console.log('PWA Manager: Script loaded');

})();