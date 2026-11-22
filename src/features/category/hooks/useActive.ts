import { useLocation } from 'react-router';
import { groupOfRepo } from '@/features/content/lib/group';
import type { PostIndex } from '@/features/content/types';

// 지금 보는 화면의 분류와 저장소

export function useActive(index?: PostIndex): { group?: string; repo?: string } {
  const { pathname } = useLocation();
  const [kind, a, b] = pathname.split('/').filter(Boolean);

  if (kind === 'c') {
    return { group: a, repo: b };
  }

  if (kind === 'p' && index) {
    return { group: groupOfRepo(index, a)?.key, repo: a };
  }

  return {};
}
