import { useEffect } from 'react';
import { site } from '@/config/site';

// 탭 제목 설정

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} - ${site.name}` : site.name;
  }, [title]);
}
