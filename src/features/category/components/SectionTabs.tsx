import { Link } from 'react-router';
import { repoPath } from '@/config/paths';
import type { RepoMeta } from '@/features/content/types';

// 저장소 안의 소분류 탭

type Props = { groupKey: string; repo: RepoMeta; active: string | null };

export default function SectionTabs({ groupKey, repo, active }: Props) {
  if (repo.sections.length === 0) {
    return null;
  }

  const tab = (isActive: boolean) =>
    `relative block whitespace-nowrap py-3 text-[14.5px] ${isActive ? 'font-bold text-sea after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-sea' : 'text-sub'}`;

  return (
    <nav aria-label="소분류" className="no-scrollbar mb-2 overflow-x-auto border-b border-line">
      <ul className="flex gap-6">
        <li>
          <Link to={repoPath(groupKey, repo.repo)} className={tab(!active)}>
            전체
          </Link>
        </li>
        {repo.sections.map((s) => (
          <li key={s.key}>
            <Link
              to={`${repoPath(groupKey, repo.repo)}?s=${s.key}`}
              className={tab(active === s.key)}
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
