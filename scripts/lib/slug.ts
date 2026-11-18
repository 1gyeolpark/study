// 글 파일 경로를 주소용 이름으로 변환

export function makeSlug(relPath: string): string {
  const slug = relPath
    .replace(/\.md$/i, '')
    .replace(/(^|\/)Theory(\/|$)/g, '$1')
    .replace(/\//g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^[-_]+|[-_]+$/g, '');

  return slug || 'post';
}

export function uniqueSlug(slug: string, used: Set<string>): string {
  let next = slug;
  let n = 2;

  while (used.has(next)) {
    next = `${slug}-${n}`;
    n += 1;
  }
  used.add(next);

  return next;
}
