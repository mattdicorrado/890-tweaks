const CACHE = 'matty890-cache-v3';
const ASSETS = ['./','./index.html','./manifest.webmanifest'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e)=>{
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(network => {
        if(network && network.status === 200){
          const copy = network.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return network;
      }).catch(()=>cached);
      return cached || fetchPromise;
    })
  );
});