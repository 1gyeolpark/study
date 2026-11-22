import { Link } from 'react-router';
import { repoPath } from '@/config/paths';
import { useActive } from '@/features/category/hooks/useActive';
import { useIndex } from '@/features/content/hooks/useContent';

// 좁은 화면에서 사이드바 대신 쓰는 저장소 가로 목록

export default function RepoChips() {
  const { data: index } = useIndex();
  const { repo: activeRepo } = useActive(index);

  if (!index) {
    return null;
  }

  return (
    <nav
      aria-label="저장소"
      className="no-scrollbar -mx-4 hidden overflow-x-auto border-b border-line px-4 max-[900px]:block"
    >
      <ul className="flex gap-5 whitespace-nowrap">
        {index.groups.flatMap((g) =>
          g.repos.map((r) => (
            <li key={r.repo}>
              <Link
                to={repoPath(g.key, r.repo)}
                className={`block py-3 text-[14px] ${activeRepo === r.repo ? 'font-bold text-sea' : 'text-sub'}`}
              >
                {r.label}
              </Link>
            </li>
          )),
        )}
      </ul>
    </nav>
  );
}
