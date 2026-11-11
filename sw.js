/* Chuyển Xanh: cho phép mở lại trang và tra cứu khi mất mạng.
   Đổi VERSION mỗi lần phát hành để người dùng nhận bản mới. */
const VERSION = "cx-2026-11-12";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
const RUNTIME_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "unpkg.com", "images.unsplash.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Trang chính: ưu tiên mạng để luôn có quy định mới nhất, mất mạng thì dùng bản đã lưu
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Tệp của trang, font, thư viện bản đồ, ảnh: dùng bản đã lưu, lưu thêm khi tải lần đầu
  if (url.origin === location.origin || RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return r;
    })));
  }
  // Ô bản đồ và tìm phố (Nominatim) luôn lấy trực tiếp, không lưu
});
