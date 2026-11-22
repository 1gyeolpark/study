import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import ChevronIcon from '@/components/ui/ChevronIcon';
import { repoPath } from '@/config/paths';
import { useActive } from '@/features/category/hooks/useActive';
import { useIndex } from '@/features/content/hooks/useContent';
import type { RepoMeta } from '@/features/content/types';

// 왼쪽 카테고리 목록, 소분류 접기와 펼치기

type RepoRowProps = {
  groupKey: string;
  repo: RepoMeta;
  active: boolean;
  activeSection: string | null;
};

function RepoRow({ groupKey, repo, active, activeSection }: RepoRowProps) {
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? active;
  const hasSections = repo.sections.length > 0;

  return (
    <li>
      <div className="flex items-center">
        <Link
          to={repoPath(groupKey, repo.repo)}
          aria-current={active ? 'page' : undefined}
          className={`py-1.5 text-[14.5px] ${active ? 'font-bold text-sea' : 'text-ink'}`}
        >
          {repo.label}
        </Link>
        {hasSections && (
          <button
            type="button"
            aria-label={`${repo.label} 소분류 ${open ? '접기' : '펼치기'}`}
            aria-expanded={open}
            onClick={() => setManual(!open)}
            className="ml-0.5 flex size-6 items-center justify-center text-faint"
          >
            <ChevronIcon open={open} />
          </button>
        )}
        <Link
          to={repoPath(groupKey, repo.repo)}
          tabIndex={-1}
          aria-hidden="true"
          className="ml-auto py-1.5 pl-3 text-[13px] text-faint"
        >
          {repo.count}
        </Link>
      </div>
      {hasSections && open && (
        <ul className="mb-1 ml-1 border-l border-line pl-3">
          {repo.sections.map((s) => (
            <li key={s.key}>
              <Link
                to={`${repoPath(groupKey, repo.repo)}?s=${s.key}`}
                className={`flex justify-between py-1 text-[13.5px] ${active && activeSection === s.key ? 'font-bold text-sea' : 'text-sub'}`}
              >
                <span>{s.label}</span>
                <span className="text-faint">{s.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategorySidebar({ className = '' }: { className?: string }) {
  const { data: index } = useIndex();
  const { repo: activeRepo } = useActive(index);
  const [params] = useSearchParams();

  return (
    <div
      className={`relative after:absolute after:top-0 after:-right-[22px] after:bottom-0 after:w-px after:bg-line ${className}`}
    >
      <aside
        aria-label="카테고리"
        className="no-scrollbar sticky top-0 max-h-screen overflow-y-auto py-8"
      >
        <h2 className="border-b border-rule pb-3.5 text-[14px] font-bold">카테고리</h2>
        {index?.groups.map((g) => (
          <section key={g.key} className="mt-4">
            <h3 className="mb-1 text-[13px] font-normal text-sub">{g.label}</h3>
            <ul>
              {g.repos.map((r) => (
                <RepoRow
                  key={r.repo}
                  groupKey={g.key}
                  repo={r}
                  active={activeRepo === r.repo}
                  activeSection={params.get('s')}
                />
              ))}
            </ul>
          </section>
        ))}
      </aside>
    </div>
  );
}
