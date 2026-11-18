import { describe, expect, it } from 'vitest';
import { assignSections, keyOf, sectionLabel } from './sections';

describe('assignSections', () => {
  it('공통 폴더 아래 폴더가 둘 이상으로 갈리면 소분류로 나눔', () => {
    const result = assignSections([
      'HTML_CSS_JS/01_HTML/Theory/01.md',
      'HTML_CSS_JS/02_CSS/Theory/01.md',
      'HTML_CSS_JS/02_CSS/Theory/02.md',
    ]);

    expect(result.map((r) => r?.folder)).toEqual(['01_HTML', '02_CSS', '02_CSS']);
    expect(result[0]?.key).toBe('01_html');
  });

  it('폴더가 하나뿐이면 소분류가 없음', () => {
    expect(assignSections(['MySQL/Theory/01.md', 'MySQL/Theory/02.md'])).toEqual([null, null]);
  });

  it('공통 폴더 바로 아래 글은 기타로 묶음', () => {
    const result = assignSections(['Git/01_A/x.md', 'Git/02_B/y.md', 'Git/z.md']);

    expect(result[2]).toEqual({ key: 'etc', folder: '' });
  });
});

describe('keyOf', () => {
  it('영문과 숫자가 아닌 글자는 밑줄로 바꿈', () => {
    expect(keyOf('01_Git&Branch')).toBe('01_git_branch');
  });
});

describe('sectionLabel', () => {
  it('앞 번호를 떼고 밑줄을 공백으로 바꿈', () => {
    expect(sectionLabel('04_Link_GitHub')).toBe('Link GitHub');
  });

  it('덮어쓸 이름이 있으면 그것을 씀', () => {
    expect(sectionLabel('04_JSLIB', 'JS 라이브러리')).toBe('JS 라이브러리');
  });

  it('폴더가 없으면 기타', () => {
    expect(sectionLabel('')).toBe('기타');
  });
});
