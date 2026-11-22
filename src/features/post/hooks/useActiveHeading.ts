import { useEffect, useState } from 'react';

// 화면에 보이는 소제목 찾기

export function useActiveHeading(ids: string[], ready: boolean): string | undefined {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (!ready || ids.length === 0) {
      return;
    }

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px' },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids, ready]);

  return active;
}
