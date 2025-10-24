// キャッシュ名にバージョンを含めて強制更新可能に
const STATIC_CACHE_NAME = 'timeport-v4-static-v2';
const DYNAMIC_CACHE_NAME = 'timeport-v4-dynamic-v2';

const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon-16x16.png',
];

// インストール時
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// アクティベート時
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// SW即時更新用
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// fetchイベント
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Next.js内部アセット・HMR・HTMLナビゲーションはSWでキャッシュしない
  // Next.js のビルドアセットはブラウザに任せる（キャッシュしない）
  if (url.pathname.startsWith('/_next/')) return;

  // 開発用の HMR 系は完全に素通し
  if (
    request.mode === 'navigate' ||
    url.pathname.includes('hot-update') ||
    url.pathname.includes('__nextjs') ||
    url.pathname.includes('webpack-hmr')
  )
    return;

  // APIはネットワークファースト（SWキャッシュしない）
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request, { cache: 'no-store' }).catch(() => caches.match(request)));
    return;
  }

  // /public配下などの静的ファイルのみキャッシュファースト
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) return response;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            if (
              (request.url.startsWith('http://') || request.url.startsWith('https://')) &&
              !url.pathname.startsWith('/_next/')
            ) {
              caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
          }
          return response;
        });
      })
    );
  }
});

// プッシュ通知の受信処理
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);

  if (event.data) {
    let data;
    try {
      data = event.data.json();
      console.log('Push data (JSON):', data);
    } catch (error) {
      // JSON形式でない場合はテキストとして処理
      const text = event.data.text();
      console.log('Push data (text):', text);
      data = {
        title: '通知',
        message: text,
        type: 'test',
        link_url: '/',
        priority: 'normal',
        metadata: {},
      };
    }
    const options = {
      body: data.message,
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      data: {
        url: data.link_url || '/',
        notificationId: data.id,
        type: data.type,
      },
      actions: [
        {
          action: 'open',
          title: '開く',
          icon: '/android-chrome-192x192.png',
        },
        {
          action: 'close',
          title: '閉じる',
        },
      ],
      requireInteraction: data.priority === 'urgent',
      tag: data.type, // 同じタイプの通知を置き換え
    };

    console.log('Showing notification with options:', options);
    event.waitUntil(
      self.registration
        .showNotification(data.title, options)
        .then(() => {
          console.log('Notification shown successfully');
          console.log('Notification title:', data.title);
          console.log('Notification body:', data.message);
        })
        .catch((err) => {
          console.error('Error showing notification:', err);
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
          });
        })
    );
  } else {
    console.log('No data in push event');
  }
});

// 通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 既に開いているウィンドウがあればフォーカス
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }

      // 新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// バックグラウンド同期（オフライン時のデータ同期）
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // オフライン時に保存されたデータを同期
      syncOfflineData()
    );
  }
});

// オフラインデータの同期処理
async function syncOfflineData() {
  try {
    // IndexedDBからオフラインで保存されたデータを取得
    const offlineData = await getOfflineData();

    if (offlineData.length > 0) {
      console.log('Service Worker: Syncing offline data', offlineData);

      // データをサーバーに送信
      for (const data of offlineData) {
        try {
          const response = await fetch(data.url, {
            method: data.method,
            headers: data.headers,
            body: data.body,
          });

          if (response.ok) {
            // 同期成功したデータを削除
            await removeOfflineData(data.id);
          }
        } catch (error) {
          console.error('Service Worker: Sync failed for', data, error);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync error', error);
  }
}

// IndexedDBからオフラインデータを取得
async function getOfflineData() {
  // 実装は後で追加
  return [];
}

// オフラインデータを削除
async function removeOfflineData(id) {
  // 実装は後で追加
}
