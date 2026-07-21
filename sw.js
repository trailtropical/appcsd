const CACHE_NAME = 'csd-v12'
const ASSETS = [
  './manifest.json',
  './logo-csd-quad.jpg'
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  )
})

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  if (url.pathname.endsWith('index.html') || url.pathname.endsWith('/') || url.pathname === '') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
    return
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const clone = resp.clone()
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
      return resp
    }))
  )
})
