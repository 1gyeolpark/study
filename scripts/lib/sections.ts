// 글이 있는 폴더로 소분류 정하기

import path from 'node:path';

export type SectionInfo = { key: string; folder: string };

const dirOf = (rel: string) =>
  path.posix
    .dirname(rel)
    .split('/')
    .filter((s) => s !== '.' && s !== 'Theory');

function commonPrefix(dirs: string[][]): string[] {
  const first = dirs[0] ?? [];
  let n = 0;

  while (n < first.length && dirs.every((d) => d[n] === first[n])) {
    n += 1;
  }

  return first.slice(0, n);
}

export const keyOf = (folder: string): string =>
  folder
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'etc';

// 공통 폴더 아래 첫 폴더를 소분류로, 폴더가 둘 이상일 때만
export function assignSections(rels: string[]): (SectionInfo | null)[] {
  const dirs = rels.map(dirOf);
  const prefix = commonPrefix(dirs);
  const firsts = dirs.map((d) => d[prefix.length] ?? null);
  const distinct = new Set(firsts.filter((f): f is string => f !== null));

  if (distinct.size < 2) {
    return rels.map(() => null);
  }

  return firsts.map((f) => (f ? { key: keyOf(f), folder: f } : { key: 'etc', folder: '' }));
}

// 폴더 앞 번호를 뗀 이름, 덮어쓸 이름 우선
export function sectionLabel(folder: string, override?: string): string {
  if (override) {
    return override;
  }

  return folder.replace(/^\d+[_\s-]*/, '').replace(/_/g, ' ') || '기타';
}
