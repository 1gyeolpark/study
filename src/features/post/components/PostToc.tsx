import { useMemo } from 'react';
import type { Heading } from '@/features/content/types';
import { useActiveHeading } from '@/features/post/hooks/useActiveHeading';

// 오른쪽 글 목차

export default function PostToc({ headings, ready }: { headings: Heading[]; ready: boolean }) {
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useActiveHeading(ids, ready);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="글 목차"
      className="sticky top-6 max-h-[calc(100vh-48px)] self-start overflow-y-auto no-scrollbar max-[1100px]:hidden"
    >
      <h2 className="border-b border-rule pb-2.5 text-[13px] font-bold">목차</h2>
      <ul className="mt-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1.5 text-[13.5px] ${active === h.id ? 'font-bold text-sea' : 'text-sub'}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
