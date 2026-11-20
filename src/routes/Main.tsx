import { Link } from 'react-router';
import Cover from '@/components/layout/Cover';
import Page from '@/components/layout/Page';
import LoadFailed from '@/components/ui/LoadFailed';
import Skeleton from '@/components/ui/Skeleton';
import { messages } from '@/config/messages';
import { groupPath } from '@/config/paths';
import { site } from '@/config/site';
import { useIndex } from '@/features/content/hooks/useContent';
import { latestPosts } from '@/features/content/lib/group';
import { labelOf } from '@/features/content/lib/labels';
import PostList from '@/features/post/components/PostList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// 홈, 분류별 최근 글

const PER_GROUP = 3;

export default function Main() {
  const { data: index, isPending, isError, refetch } = useIndex();

  useDocumentTitle();

  return (
    <>
      <Cover title={site.coverTitle} text={site.coverText} snippet={site.homeSnippet} />
      <Page>
        {isPending && <Skeleton lines={6} />}
        {isError && <LoadFailed onRetry={() => refetch()} />}
        {index?.groups.map((g) => {
          const repos = new Set(g.repos.map((r) => r.repo));
          const posts = latestPosts(index.posts.filter((p) => repos.has(p.repo))).slice(
            0,
            PER_GROUP,
          );

          return (
            <section key={g.key} className="mb-10">
              <div className="flex items-baseline justify-between border-b border-rule pb-3.5">
                <h2 className="font-serif text-[18px] font-bold">{g.label}</h2>
                <Link to={groupPath(g.key)} className="text-[13px] text-sub">
                  {messages.viewMore}
                </Link>
              </div>
              <PostList posts={posts} labelOf={labelOf(index)} pageSize={PER_GROUP} />
            </section>
          );
        })}
      </Page>
    </>
  );
}
