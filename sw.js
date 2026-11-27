// Comando Supremo — service worker: sempre busca a versão nova; usa a cópia salva só sem internet.
const C='cs-app-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./icon-192.png','./manifest.json']).catch(()=>{})))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.endsWith('version.json')||u.pathname.endsWith('painel-loja.html'))return;
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r.mode==='navigate'?'./':r,cp))}return res})
   .catch(()=>caches.match(r.mode==='navigate'?'./':r).then(m=>m||new Response('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><body style="background:#000;color:#e9b949;font:18px sans-serif;text-align:center;padding-top:40vh">Sem internet.<br><small style="color:#999">Conecte-se para jogar Comando Supremo.</small></body>',{headers:{'Content-Type':'text/html; charset=utf-8'}}))))});
