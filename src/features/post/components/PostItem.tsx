import { Link } from 'react-router';
import { postPath } from '@/config/paths';
import type { Post } from '@/features/content/types';
import { formatDate } from '@/lib/format';

// 글 목록의 글 한 줄

type Props = { post: Post; label: string };

export default function PostItem({ post, label }: Props) {
  return (
    <li>
      <Link
        to={postPath(post.repo, post.slug)}
        className="group flex justify-between gap-6 border-b border-line py-6"
      >
        <div className="min-w-0">
          <p className="text-[13px] text-sub">{label}</p>
          <h3 className="mt-2 font-serif text-[18px] leading-[1.4] font-bold tracking-[-0.02em] group-hover:text-sea">
            {post.title}
          </h3>
          {post.summary && (
            <p className="mt-2 line-clamp-2 text-[14px] leading-[1.65] text-sub">{post.summary}</p>
          )}
          {post.date && (
            <time dateTime={post.date} className="mt-4 block text-[13px] text-faint">
              {formatDate(post.date)}
            </time>
          )}
        </div>
        {post.firstImage && (
          <img
            src={post.firstImage}
            alt=""
            loading="lazy"
            className="h-[105px] w-[140px] shrink-0 rounded-[4px] border border-line object-cover max-[560px]:h-[72px] max-[560px]:w-24"
          />
        )}
      </Link>
    </li>
  );
}
