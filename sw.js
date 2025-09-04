// Service Worker para TACONTUDO PWA
// Implementa cache estratégico e funcionalidades offline

const CACHE_NAME = 'tacontudo-v1.0.0';
const STATIC_CACHE = 'tacontudo-static-v1.0.0';
const DYNAMIC_CACHE = 'tacontudo-dynamic-v1.0.0';
const IMAGE_CACHE = 'tacontudo-images-v1.0.0';

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/index.css',
  '/assets/css/nicepage.css',
  '/assets/css/accessibility.css',
  '/assets/css/ux-improvements.css',
  '/assets/js/jquery.js',
  '/assets/js/nicepage.js',
  '/assets/js/lazy-loading.js',
  '/assets/js/security-validation.js',
  '/assets/js/ux-enhancements.js',
  '/assets/images/tacontudo_logo2.jpg',
  '/assets/images/banner-home.jpg'
];

// Páginas principais para cache
const PAGES_TO_CACHE = [
  '/servicos.html',
  '/Sobre.html',
  '/Contato.html',
  '/faq.html',
  '/blog/blog.html'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache de recursos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache de páginas principais
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Service Worker: Caching main pages');
        return cache.addAll(PAGES_TO_CACHE);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Força a ativação imediata
      return self.skipWaiting();
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Remove caches antigos
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      // Assume controle de todas as abas
      return self.clients.claim();
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignora requisições não-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Estratégia baseada no tipo de recurso
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'document') {
    event.respondWith(handlePageRequest(request));
  } else if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Manipula requisições de imagens
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Image request failed:', error);
    // Retorna imagem placeholder se disponível
    return caches.match('/assets/images/placeholder.png') || 
           new Response('', { status: 404 });
  }
}

// Manipula requisições de páginas
async function handlePageRequest(request) {
  try {
    // Tenta buscar da rede primeiro (Network First)
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', error);
    
    // Busca no cache se a rede falhar
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline como fallback
    return caches.match('/index.html') || 
           new Response('Página não disponível offline', {
             status: 404,
             headers: { 'Content-Type': 'text/html; charset=utf-8' }
           });
  }
}

// Manipula recursos estáticos
async function handleStaticAsset(request) {
  try {
    // Cache First para recursos estáticos
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Static asset request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Manipula requisições dinâmicas
async function handleDynamicRequest(request) {
  try {
    // Network First para conteúdo dinâmico
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Dynamic request failed:', error);
    
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('', { status: 404 });
  }
}

// Verifica se é um recurso estático
function isStaticAsset(url) {
  return url.includes('/assets/') || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.woff') || 
         url.includes('.woff2');
}

// Manipula mensagens do cliente
self.addEventListener('message', event => {
  const { data } = event;
  
  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('Service Worker: Unknown message type:', data.type);
  }
});

// Calcula o tamanho do cache
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Limpa todos os caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Sincronização em background
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Executa sincronização em background
async function doBackgroundSync() {
  try {
    // Aqui você pode implementar lógica de sincronização
    // como envio de formulários offline, etc.
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.log('Service Worker: Background sync failed:', error);
  }
}

// Notificações push
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível',
    icon: '/assets/images/tacontudo_logo2.jpg',
    badge: '/assets/images/tacontudo_logo2.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver mais',
        icon: '/assets/images/tacontudo_logo2.jpg'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/images/tacontudo_logo2.jpg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('TACONTUDO', options)
  );
});

// Clique em notificações
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Script loaded');