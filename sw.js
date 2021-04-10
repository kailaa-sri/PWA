self.addEventListener('install', function(event) {
    // Perform install steps
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
var deferredPrompt;
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