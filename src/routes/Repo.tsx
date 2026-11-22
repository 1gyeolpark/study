import { useParams, useSearchParams } from 'react-router';
import Cover from '@/components/layout/Cover';
import Page from '@/components/layout/Page';
import LoadFailed from '@/components/ui/LoadFailed';
import Skeleton from '@/components/ui/Skeleton';
import SectionTabs from '@/features/category/components/SectionTabs';
import { useIndex } from '@/features/content/hooks/useContent';
import { findRepo, groupOfRepo, repoPosts } from '@/features/content/lib/group';
import { labelOf } from '@/features/content/lib/labels';
import PostList from '@/features/post/components/PostList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import NotFound from '@/routes/NotFound';

// 저장소 화면, 공부 순서의 글 목록과 소분류 탭

export default function Repo() {
  const { repo: name = '' } = useParams();
  const [params] = useSearchParams();
  const { data: index, isPending, isError, refetch } = useIndex();
  const repo = index && findRepo(index, name);
  const section = params.get('s');

  useDocumentTitle(repo ? repo.label : undefined);

  if (isPending) {
    return <Skeleton lines={6} />;
  }

  if (isError) {
    return <LoadFailed onRetry={() => refetch()} />;
  }

  if (!repo) {
    return <NotFound />;
  }

  const active = repo.sections.some((s) => s.key === section) ? section : null;

  return (
    <>
      <Cover title={repo.label} snippet={repo.snippet} />
      <Page>
        <SectionTabs groupKey={groupOfRepo(index, name)?.key ?? ''} repo={repo} active={active} />
        <PostList
          key={active ?? 'all'}
          posts={repoPosts(index.posts, repo.repo, active)}
          labelOf={labelOf(index)}
        />
      </Page>
    </>
  );
}
