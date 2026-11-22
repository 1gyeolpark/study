import { useState } from 'react';
import { messages } from '@/config/messages';
import type { Post } from '@/features/content/types';
import PostItem from '@/features/post/components/PostItem';

// 글 목록, 더 보기 버튼

type Props = { posts: Post[]; labelOf: (post: Post) => string; pageSize?: number };

export default function PostList({ posts, labelOf, pageSize = 10 }: Props) {
  const [count, setCount] = useState(pageSize);

  if (posts.length === 0) {
    return <p className="py-16 text-center text-sub">{messages.emptyList}</p>;
  }

  return (
    <>
      <ul>
        {posts.slice(0, count).map((p) => (
          <PostItem key={`${p.repo}/${p.slug}`} post={p} label={labelOf(p)} />
        ))}
      </ul>
      {count < posts.length && (
        <div className="py-8 text-center">
          <button
            type="button"
            onClick={() => setCount(count + pageSize)}
            className="h-11 min-w-32 rounded-[3px] border border-rule text-[14px]"
          >
            {messages.more}
          </button>
        </div>
      )}
    </>
  );
}
