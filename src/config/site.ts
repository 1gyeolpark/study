// 사이트 이름과 홈 커버 문구

export const site = {
  name: 'hg-study',
  coverTitle: 'Study Notes',
  coverText: '풀스택 개발 공부',
  homeSnippet: ['SELECT title', 'FROM notes', 'ORDER BY id DESC;'],
} as const;
