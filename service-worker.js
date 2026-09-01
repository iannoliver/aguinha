const CACHE = 'aguinha-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp => {
        if(resp && resp.status === 200){
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ---- push notifications (lembrete + checagem de 2h, funciona com o app fechado) ----
self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch(e) {}
  const opts = {
    body: payload.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: payload.tag || 'aguinha',
    requireInteraction: !!payload.requireInteraction,
    actions: payload.actions || [],
    data: payload.data || {}
  };
  event.waitUntil(self.registration.showNotification(payload.title || 'Águinha 💧', opts));
});

self.addEventListener('notificationclick', event => {
  const action = event.action;
  const apiBase = (event.notification.data && event.notification.data.apiBase) || '';
  const apiSecret = (event.notification.data && event.notification.data.apiSecret) || '';
  event.notification.close();

  if(action === 'still-busy' || action === 'not-busy'){
    if(apiBase){
      event.waitUntil(
        fetch(apiBase + '/api/busy-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiSecret },
          body: JSON.stringify({ response: action === 'still-busy' ? 'yes' : 'no' })
        }).catch(() => {})
      );
    }
    return;
  }

  // ação padrão (ou toque no corpo da notificação): abre/foca o app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for(const c of list){ if('focus' in c) return c.focus(); }
      if(clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
