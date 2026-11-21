// 나란히: 인터넷이 없어도 열리게 화면 파일을 보관한다. 기록은 여기 저장하지 않는다(기록은 localStorage).
const C = 'naranhi-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
// 인터넷이 되면 새 파일을 받고, 안 되면 보관해 둔 파일로 연다.
// 'no-cache'로 물어보면 브라우저가 예전에 받아 둔 화면을 그대로 주지 않고 서버에 새로 확인하므로,
// 고쳐서 올린 화면·피클 기록(data/vector.json)이 바로 보인다.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
