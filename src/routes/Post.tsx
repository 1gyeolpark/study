import { useParams } from 'react-router';
import Page from '@/components/layout/Page';
import LoadFailed from '@/components/ui/LoadFailed';
import Skeleton from '@/components/ui/Skeleton';
import { useIndex } from '@/features/content/hooks/useContent';
import { findRepo, groupOfRepo, neighbors } from '@/features/content/lib/group';
import PostBody from '@/features/post/components/PostBody';
import PostNav from '@/features/post/components/PostNav';
import PostToc from '@/features/post/components/PostToc';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate } from '@/lib/format';
import NotFound from '@/routes/NotFound';
import { messages } from '@/config/messages';

// 글 화면

export default function Post() {
  const { repo = '', slug = '' } = useParams();
  const { data: index, isPending, isError, refetch } = useIndex();
  const post = index?.posts.find((p) => p.repo === repo && p.slug === slug);

  useDocumentTitle(post?.title);

  if (isPending) {
    return <Skeleton lines={8} />;
  }

  if (isError) {
    return <LoadFailed onRetry={() => refetch()} />;
  }

  if (!post) {
    return <NotFound message={messages.notFoundPost} />;
  }

  const repoMeta = findRepo(index, repo);
  const group = groupOfRepo(index, repo);
  const { prev, next } = neighbors(index.posts, repo, slug);

  return (
    <Page>
      <div className="grid grid-cols-[minmax(0,1fr)_200px] gap-x-11 max-[1100px]:block">
        <article className="min-w-0">
          <p className="text-[13px] text-sub">
            {[
              group?.label,
              repoMeta?.label,
              repoMeta?.sections.find((s) => s.key === post.section)?.label,
            ]
              .filter(Boolean)
              .join(' / ')}
          </p>
          <h1 className="mt-2 font-serif text-[clamp(26px,4vw,34px)] leading-[1.25] font-bold tracking-[-0.02em]">
            {post.title}
          </h1>
          {post.date && (
            <time dateTime={post.date} className="mt-3 block text-[13px] text-faint">
              {formatDate(post.date)}
            </time>
          )}
          <div className="mt-5 border-t border-rule pt-2">
            <PostBody repo={repo} slug={slug} />
          </div>
          <PostNav prev={prev} next={next} />
        </article>
        <PostToc headings={post.headings} ready />
      </div>
    </Page>
  );
}
