import type { SearchEntry } from '@/features/content/types';

// 검색어에 맞는 글 찾기, 제목 일치에 가중

export type SearchHit = SearchEntry & { snippet: string };

function excerpt(text: string, at: number): string {
  if (at < 0) {
    return text.slice(0, 120).trim();
  }

  let start = Math.max(0, at - 40);
  let end = Math.min(text.length, at + 120);

  if (start > 0) {
    const gap = text.slice(start, at).search(/\s/);

    start = gap >= 0 ? start + gap + 1 : start;
  }

  if (end < text.length) {
    const space = text.lastIndexOf(' ', end);

    end = space > at ? space : end;
  }

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

const countOf = (text: string, word: string) => text.split(word).length - 1;

export function matchPosts(entries: SearchEntry[], query: string): SearchHit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const text = entry.text.toLowerCase();
      const all = words.every((w) => title.includes(w) || text.includes(w));
      const score = words.reduce((sum, w) => sum + countOf(title, w) * 5 + countOf(text, w), 0);
      const snippet = excerpt(entry.text, text.indexOf(words[0]));

      return { entry, all, score, snippet };
    })
    .filter((hit) => hit.all)
    .sort((a, b) => b.score - a.score)
    .map(({ entry, snippet }) => ({ ...entry, snippet }));
}
