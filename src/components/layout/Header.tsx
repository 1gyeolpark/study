import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import MenuIcon from '@/components/ui/MenuIcon';
import { groupPath, paths, repoPath } from '@/config/paths';
import { site } from '@/config/site';
import { useActive } from '@/features/category/hooks/useActive';
import { useIndex } from '@/features/content/hooks/useContent';
import SearchForm from '@/features/search/components/SearchForm';

// 사이트 헤더, 좁은 화면의 햄버거 메뉴

export default function Header() {
  const { data: index } = useIndex();
  const { pathname } = useLocation();
  const { group: activeGroup } = useActive(index);
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenedAt(null);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = (active: boolean) =>
    `relative flex h-11 items-center ${active ? 'font-bold text-sea after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-sea' : 'text-nav'}`;

  return (
    <header className="relative">
      <div className="border-b border-line">
        <div className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between px-4">
          <Link to={paths.home} className="font-serif text-[21px] font-bold tracking-[-0.02em]">
            {site.name}
          </Link>
          <div className="flex items-center gap-2">
            <SearchForm className="w-[200px] max-[700px]:hidden" />
            <button
              type="button"
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={open}
              onClick={() => setOpenedAt(open ? null : pathname)}
              className="hidden size-9 items-center justify-center max-[700px]:flex"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </div>
      <nav aria-label="주 메뉴" className="border-b border-line max-[700px]:hidden">
        <div className="mx-auto flex max-w-[1240px] gap-[30px] px-4 text-[14.5px]">
          <NavLink to={paths.home} end className={({ isActive }) => linkClass(isActive)}>
            Home
          </NavLink>
          {index?.groups.map((g) => (
            <NavLink key={g.key} to={groupPath(g.key)} className={linkClass(activeGroup === g.key)}>
              {g.label}
            </NavLink>
          ))}
        </div>
      </nav>
      {open && (
        <nav
          aria-label="모바일 메뉴"
          className="absolute top-full right-0 left-0 z-40 hidden max-h-[calc(100vh-60px)] overflow-y-auto border-b border-line bg-white px-4 py-3 max-[700px]:block"
        >
          <SearchForm className="mb-2" />
          <NavLink to={paths.home} end className="block border-b border-line py-3.5 text-[15px]">
            Home
          </NavLink>
          {index?.groups.map((g) => (
            <div key={g.key} className="border-b border-line py-3 last:border-b-0">
              <Link to={groupPath(g.key)} className="block py-1 text-[15px] font-bold">
                {g.label}
              </Link>
              <ul className="mt-1 grid grid-cols-2 gap-x-4">
                {g.repos.map((r) => (
                  <li key={r.repo}>
                    <Link
                      to={repoPath(g.key, r.repo)}
                      className="block py-1.5 text-[14px] text-sub"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
