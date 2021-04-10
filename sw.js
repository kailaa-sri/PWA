self.addEventListener('install', function(event) {
    // Perform install steps
    var CACHE_NAME = 'my-site-cache-v1';
    var urlsToCache = [
        './',
        '/src/style.css',
        './images'
    ];


    return cache.addAll(urlsToCache);
});