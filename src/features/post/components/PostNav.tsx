import { Link } from 'react-router';
import { postPath } from '@/config/paths';
import type { Post } from '@/features/content/types';

// 이전 글, 다음 글

export default function PostNav({ prev, next }: { prev?: Post; next?: Post }) {
  if (!prev && !next) {
    return null;
  }

  const cell = 'min-w-0 py-5 text-[16px] font-bold tracking-[-0.02em]';
  const label = 'mb-1 block text-[12px] font-normal text-faint';

  return (
    <nav
      aria-label="이전 글과 다음 글"
      className="mt-14 grid grid-cols-2 gap-4 border-t border-rule"
    >
      {prev ? (
        <Link to={postPath(prev.repo, prev.slug)} className={cell}>
          <span className={label}>이전 글</span>
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={postPath(next.repo, next.slug)} className={`${cell} text-right`}>
          <span className={label}>다음 글</span>
          {next.title}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
