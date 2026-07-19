'use client';

import { useEffect, useState } from 'react';

export default function ViewTracker({ articleId, initialViews }: { articleId: string; initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = 'view_count_' + articleId;
    const viewedKey = 'viewed_' + articleId;
    let count = parseInt(localStorage.getItem(key) || '0', 10);
    if (!sessionStorage.getItem(viewedKey)) {
      count += 1;
      localStorage.setItem(key, String(count));
      sessionStorage.setItem(viewedKey, '1');
    }
    setViews(count);
    fetch('/api/articles/' + articleId)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API unavailable');
      })
      .then((data) => {
        if (data && typeof data.views === 'number') {
          setViews(data.views);
        }
      })
      .catch(() => {});
  }, [articleId]);
  return <>{views.toLocaleString()}</>;
}
