const CACHE_NAME = 'railway-app-v1';

// アプリ初回起動時に、まずは本体(HTML)をスマホに保存
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(['./', './index.html']);
        })
    );
});

// 通信が発生するたびに横取りしてスマホに保存する
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // ① すでにスマホに保存されていれば、それを一瞬で返す（オフライン対応！）
            if (response) {
                return response;
            }
            // ② まだ保存されていなければ、ネットから取得してスマホに保存する
            return fetch(event.request).then(function(fetchResponse) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    // 画像や問題データをキャッシュに格納
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});