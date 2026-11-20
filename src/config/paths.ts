// 화면 주소 상수

export const paths = {
  home: '/',
  group: '/c/:group',
  repo: '/c/:group/:repo',
  post: '/p/:repo/:slug',
  search: '/search',
} as const;

export const groupPath = (group: string) => `/c/${group}`;
export const repoPath = (group: string, repo: string) => `/c/${group}/${repo}`;
export const postPath = (repo: string, slug: string) => `/p/${repo}/${slug}`;
