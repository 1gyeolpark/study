import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import Page from '@/components/layout/Page';
import LoadFailed from '@/components/ui/LoadFailed';
import Skeleton from '@/components/ui/Skeleton';
import { messages } from '@/config/messages';
import { postPath } from '@/config/paths';
import { useIndex, useSearchIndex } from '@/features/content/hooks/useContent';
import { labelOf } from '@/features/content/lib/labels';
import { matchPosts } from '@/features/search/lib/matchPosts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// 검색 결과 화면

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const { data: index } = useIndex();
  const { data: entries, isPending, isError, refetch } = useSearchIndex(query !== '');
  const hits = useMemo(() => (entries ? matchPosts(entries, query) : []), [entries, query]);
  const label = index ? labelOf(index) : undefined;
  const labelFor = (repo: string, slug: string) => {
    const post = index?.posts.find((p) => p.repo === repo && p.slug === slug);

    return post && label ? label(post) : repo;
  };

  useDocumentTitle(query ? `검색 ${query}` : '검색');

  return (
    <Page>
      <h1 className="border-b border-rule pb-3.5 font-serif text-[18px] font-bold">
        {query ? `"${query}" 검색 결과` : '검색'}
        {entries && <span className="ml-2 text-[14px] font-normal text-sub">{hits.length}편</span>}
      </h1>
      {query && isPending && <Skeleton lines={6} />}
      {isError && <LoadFailed onRetry={() => refetch()} />}
      {entries && hits.length === 0 && (
        <p className="py-16 text-center text-sub">{messages.emptySearch}</p>
      )}
      <ul>
        {hits.slice(0, 50).map((h) => (
          <li key={`${h.repo}/${h.slug}`}>
            <Link to={postPath(h.repo, h.slug)} className="group block border-b border-line py-6">
              <p className="text-[13px] text-sub">{labelFor(h.repo, h.slug)}</p>
              <h2 className="mt-2 font-serif text-[18px] leading-[1.4] font-bold tracking-[-0.02em] group-hover:text-sea">
                {h.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-[14px] leading-[1.65] text-sub">{h.snippet}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
