import type { ReactNode } from 'react';
import CategorySidebar from '@/features/category/components/CategorySidebar';
import RepoChips from '@/features/category/components/RepoChips';

// 사이드바와 본문 두 칸 레이아웃, 좁은 화면에서는 한 칸

export default function Page({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[240px_minmax(0,1fr)] gap-x-11 px-4 max-[900px]:block">
      <CategorySidebar className="max-[900px]:hidden" />
      <div className="min-w-0 py-8 max-[900px]:pt-0">
        <RepoChips />
        <div className="max-[900px]:pt-6">{children}</div>
      </div>
    </div>
  );
}
