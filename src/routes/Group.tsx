import { Link, useParams } from 'react-router';
import Cover from '@/components/layout/Cover';
import Page from '@/components/layout/Page';
import LoadFailed from '@/components/ui/LoadFailed';
import Skeleton from '@/components/ui/Skeleton';
import { messages } from '@/config/messages';
import { repoPath } from '@/config/paths';
import { useIndex } from '@/features/content/hooks/useContent';
import { findGroup, latestPosts } from '@/features/content/lib/group';
import { labelOf } from '@/features/content/lib/labels';
import PostList from '@/features/post/components/PostList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import NotFound from '@/routes/NotFound';

// 분류 화면, 저장소별 최근 글

export default function Group() {
  const { group: key = '' } = useParams();
  const { data: index, isPending, isError, refetch } = useIndex();
  const group = index && findGroup(index, key);

  useDocumentTitle(group ? group.label : undefined);

  if (isPending) {
    return <Skeleton lines={6} />;
  }

  if (isError) {
    return <LoadFailed onRetry={() => refetch()} />;
  }

  if (!group) {
    return <NotFound />;
  }

  const label = labelOf(index);

  return (
    <>
      <Cover title={group.label} />
      <Page>
        {group.repos.map((r) => (
          <section key={r.repo} className="mb-10">
            <div className="flex items-baseline justify-between border-b border-rule pb-3.5">
              <h2 className="font-serif text-[18px] font-bold">{r.label}</h2>
              <Link to={repoPath(group.key, r.repo)} className="text-[13px] text-sub">
                {messages.viewMore}
              </Link>
            </div>
            <PostList
              posts={latestPosts(index.posts.filter((p) => p.repo === r.repo)).slice(0, 3)}
              labelOf={label}
            />
          </section>
        ))}
      </Page>
    </>
  );
}
