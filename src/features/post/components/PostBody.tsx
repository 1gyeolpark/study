import LoadFailed from '@/components/ui/LoadFailed';
import Skeleton from '@/components/ui/Skeleton';
import { usePostHtml } from '@/features/content/hooks/useContent';

// 변환된 글 HTML 표시

export default function PostBody({ repo, slug }: { repo: string; slug: string }) {
  const { data, isPending, isError, refetch } = usePostHtml(repo, slug);

  if (isPending) {
    return <Skeleton lines={8} />;
  }

  if (isError) {
    return <LoadFailed onRetry={() => refetch()} />;
  }

  return <div className="post-body" dangerouslySetInnerHTML={{ __html: data }} />;
}
