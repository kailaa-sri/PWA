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
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
});


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

window.addEventListener('appinstalled', () => {
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