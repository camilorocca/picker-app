// Picker App - Service Worker
// Provides offline functionality and caching

const CACHE_NAME = 'picker-v1.0.0';
const STATIC_CACHE = 'picker-static-v1';
const DYNAMIC_CACHE = 'picker-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/evaluation.html',
    '/insights.html',
    '/main.js',
    '/manifest.json',
    '/resources/hero-wellness.png',
    '/resources/patterns-bg.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
    'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js',
    'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css',
    'https://cdn.tailwindcss.com'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache static files', error);
            })
    );
    
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
    
    self.clients.claim();
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle different types of requests
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Not in cache, fetch from network
                    return fetch(request)
                        .then(networkResponse => {
                            // Don't cache non-successful responses
                            if (!networkResponse.ok) {
                                return networkResponse;
                            }
                            
                            // Cache successful responses for future offline use
                            const responseClone = networkResponse.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    cache.put(request, responseClone);
                                });
                            
                            return networkResponse;
                        })
                        .catch(error => {
                            // Network failed, try to serve offline fallback
                            console.log('Service Worker: Network failed, looking for fallback', error);
                            
                            // For HTML pages, return the main page
                            if (request.headers.get('accept').includes('text/html')) {
                                return caches.match('/index.html');
                            }
                            
                            // For other resources, return a basic response
                            return new Response('Offline - Resource not available', {
                                status: 503,
                                statusText: 'Service Unavailable'
                            });
                        });
                })
        );
    }
});

// Background sync for data synchronization
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'data-sync') {
        event.waitUntil(syncData());
    }
});

// Push notifications for reminders
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received', event);
    
    const options = {
        body: 'Time to evaluate your recent experience',
        icon: '/resources/hero-wellness.png',
        badge: '/resources/hero-wellness.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/evaluation.html'
        },
        actions: [
            {
                action: 'evaluate',
                title: 'Evaluate Now',
                icon: '/resources/hero-wellness.png'
            },
            {
                action: 'dismiss',
                title: 'Later',
                icon: '/resources/hero-wellness.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Picker - Evaluation Reminder', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event);
    
    event.notification.close();
    
    if (event.action === 'evaluate') {
        event.waitUntil(
            clients.openWindow('/evaluation.html')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync for data cleanup
self.addEventListener('periodicsync', event => {
    if (event.tag === 'data-cleanup') {
        event.waitUntil(performDataCleanup());
    }
});

// Helper functions
async function syncData() {
    try {
        console.log('Service Worker: Syncing data...');
        
        // In a real app, this would sync with a backend server
        // For now, we'll just perform local data cleanup
        const entries = JSON.parse(localStorage.getItem('picker_entries') || '[]');
        const evaluations = JSON.parse(localStorage.getItem('picker_evaluations') || '[]');
        
        // Clean up old data (older than 1 year)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const cleanedEntries = entries.filter(entry => 
            new Date(entry.timestamp) >= oneYearAgo
        );
        
        const cleanedEvaluations = evaluations.filter(evaluation => 
            new Date(evaluation.timestamp) >= oneYearAgo &&
            cleanedEntries.some(entry => entry.id === evaluation.entryId)
        );
        
        localStorage.setItem('picker_entries', JSON.stringify(cleanedEntries));
        localStorage.setItem('picker_evaluations', JSON.stringify(cleanedEvaluations));
        
        console.log('Service Worker: Data sync completed');
    } catch (error) {
        console.error('Service Worker: Data sync failed', error);
    }
}

async function performDataCleanup() {
    console.log('Service Worker: Performing periodic data cleanup...');
    await syncData();
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Received message', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});

console.log('Service Worker: Script loaded successfully');