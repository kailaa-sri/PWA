const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Install');

    event.waitUntil((async() => {
        const cache = await caches.open(CACHE_NAME);
        // Setting {cache: 'reload'} in the new request will ensure that the response
        // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
        await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })());

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil((async() => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    // console.log('[Service Worker] Fetch', event.request.url);
    if (event.request.mode === 'navigate') {
        event.respondWith((async() => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                console.log('[Service Worker] Fetch failed; returning offline page instead.', error);

                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }
        })());
    }
});
/*




self.addEventListener('install', function(event) {

    var CACHE_NAME = 'DiagnosticsCache';
    var urlsToCache = [
        './',
        './src/style.css',
        './images'
    ];
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

self.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
});

var buttonInstall = document.getElementById('Install');
buttonInstall.addEventListener('click', async() => {
    // Hide the app provided install promotion
    hideInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
});

function showInstallPromotion() {
    var promotion = document.getElementById("promo");
    promotion.style.visibility = "visible";
}

function hideInstallPromotion() {
    var promotion = document.getElementById("promo");
    promotion.style.visibility = "hidden";
}

self.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    hideInstallPromotion();
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    console.log('PWA was installed');
});























/*var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(event) {
    event.preventDefault();
    deferredPrompt = event;
    btnAdd.style.display = 'block';

});
btnAdd.addEventListener('click', function(event) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceres) {
        if (choiceres == 'accepted') {
            console.log("User Accepted add to home screen request");

        }
        deferredPrompt = null;
    });
});

window.addEventListener('appinstalled', function(e) {
    app.logEvent('a2hs', 'installed');
});*/