import { describe, expect, it } from 'vitest';
import type { SearchEntry } from '@/features/content/types';
import { matchPosts } from '@/features/search/lib/matchPosts';

const entries: SearchEntry[] = [
  { repo: 'a', slug: 'one', title: '조인', text: '여러 테이블을 연결하는 inner join 설명' },
  { repo: 'a', slug: 'two', title: '뷰', text: '가상 테이블 view, join 도 가끔 씀' },
];

describe('matchPosts', () => {
  it('검색어가 없으면 빈 목록', () => {
    expect(matchPosts(entries, '  ')).toEqual([]);
  });

  it('모든 검색어가 들어간 글만 찾음', () => {
    expect(matchPosts(entries, 'join 연결').map((h) => h.slug)).toEqual(['one']);
  });

  it('제목에 맞는 글을 앞에 둠', () => {
    expect(matchPosts(entries, '조인 join').map((h) => h.slug)[0]).toBe('one');
  });

  it('대소문자를 구분하지 않음', () => {
    expect(matchPosts(entries, 'JOIN')).toHaveLength(2);
  });

  it('발췌는 낱말 중간에서 자르지 않고 잘린 쪽에 말줄임표를 붙임', () => {
    const text = `${'앞 '.repeat(60)}찾는말 ${'뒤 '.repeat(80)}`;
    const [hit] = matchPosts([{ repo: 'a', slug: 's', title: 't', text }], '찾는말');

    expect(hit.snippet.startsWith('…')).toBe(true);
    expect(hit.snippet.endsWith('…')).toBe(true);
    expect(hit.snippet).toContain('찾는말');
  });
});
