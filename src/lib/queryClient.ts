import { QueryClient } from '@tanstack/react-query';

// 글 데이터를 다시 가져오지 않는 설정

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity, retry: 1, refetchOnWindowFocus: false } },
});
