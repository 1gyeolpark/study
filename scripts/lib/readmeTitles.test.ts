import { describe, expect, it } from 'vitest';
import { readReadmeTitles } from './readmeTitles';

const readme = [
  '#### 설치와 접속',
  '- [Install 이론](./MySQL/Theory/01Install.md)',
  '    - [예제](./MySQL/01.sql)',
  '',
  '#### DDL, 테이블 구조',
  '- [Ddl 이론](./MySQL/Theory/02Ddl.md)',
].join('\n');

describe('readReadmeTitles', () => {
  it('제목 아래 이론 링크에 제목을 붙임', () => {
    const titles = readReadmeTitles('README.md', readme);

    expect(titles.get('MySQL/Theory/01Install.md')).toBe('설치와 접속');
    expect(titles.get('MySQL/Theory/02Ddl.md')).toBe('DDL, 테이블 구조');
  });

  it('하위 폴더 README는 그 폴더 기준으로 경로를 풂', () => {
    const titles = readReadmeTitles(
      'Java/README.md',
      '### 기본\n- [기본 이론](./Theory/01Basic.md)',
    );

    expect(titles.get('Java/Theory/01Basic.md')).toBe('기본');
  });

  it('한 제목 아래 두 번째 링크는 링크 글자를 제목으로 씀', () => {
    const titles = readReadmeTitles(
      'README.md',
      '### 목록\n- [A 이론](./Theory/a.md)\n- [B 이론](./Theory/b.md)',
    );

    expect(titles.get('Theory/b.md')).toBe('B');
  });

  it('풀어 쓴 링크 글자는 위 제목 대신 그대로 제목으로 씀', () => {
    const titles = readReadmeTitles(
      'README.md',
      [
        '### 01_Git',
        '#### Git',
        '- [Git 정의 & 주요 기능](./Git/01_Theory.md)',
        '    - [Git 기초 실습](./Git/03_prac.md)',
      ].join('\n'),
    );

    expect(titles.get('Git/01_Theory.md')).toBe('Git 정의 & 주요 기능');
    expect(titles.get('Git/03_prac.md')).toBe('Git 기초 실습');
  });
});
