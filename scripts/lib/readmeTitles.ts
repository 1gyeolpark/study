// README 목차에서 이론 글의 한글 제목 읽기

import path from 'node:path';

const headingLine = /^#{2,4}\s+(.+?)\s*$/;
const theoryLink = /^\s*-\s*\[([^\]]*)\]\(([^)]*\.md)\)/;

// 키는 저장소 기준 경로, 값은 제목
export function readReadmeTitles(readmeRel: string, text: string): Map<string, string> {
  const titles = new Map<string, string>();
  const dir = path.posix.dirname(readmeRel);
  let heading = '';
  let used = false;

  for (const line of text.split(/\r?\n/)) {
    const head = headingLine.exec(line);

    if (head) {
      heading = head[1].replace(/[`*]/g, '').trim();
      used = false;
      continue;
    }

    const link = theoryLink.exec(line);

    if (!link) {
      continue;
    }

    const target = path.posix.normalize(path.posix.join(dir, decodeURI(link[2])));
    const isTheory = /\s*이론$/.test(link[1]);
    const label = link[1].replace(/\s*이론$/, '').trim();
    // 이론 링크는 위 제목, 그 밖은 링크 글자를 제목으로
    const title = isTheory && !used && heading ? heading : label;

    titles.set(target, title);
    used = isTheory ? true : used;
  }

  return titles;
}
