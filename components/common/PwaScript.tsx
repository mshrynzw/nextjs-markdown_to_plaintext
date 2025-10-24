'use client';
import { useEffect } from 'react';

export default function PwaScript() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // 開発環境では SW を登録しない。既に登録済みなら解除してリロード
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        if (regs && regs.length > 0) {
          Promise.all(regs.map((r) => r.unregister())).then(() => {
            // HMR 環境では自動で更新されるため明示リロードは行わない
          });
        }
      });
      return;
    }

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            nw.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
}
