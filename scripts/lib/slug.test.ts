import { describe, expect, it } from 'vitest';
import { makeSlug, uniqueSlug } from './slug';

describe('makeSlug', () => {
  it('Theory 폴더를 빼고 소문자 주소로 바꿈', () => {
    expect(makeSlug('MySQL/Theory/05Select.md')).toBe('mysql-05select');
  });

  it('영문과 숫자가 아닌 글자는 밑줄로 바꿈', () => {
    expect(makeSlug('Git_GitHub/01_Git&Branch/01_Theory.md')).toBe(
      'git_github-01_git_branch-01_theory',
    );
  });

  it('남는 글자가 없으면 기본 이름을 씀', () => {
    expect(makeSlug('한글.md')).toBe('post');
  });
});

describe('uniqueSlug', () => {
  it('같은 이름에는 번호를 붙임', () => {
    const used = new Set<string>();

    expect(uniqueSlug('a', used)).toBe('a');
    expect(uniqueSlug('a', used)).toBe('a-2');
    expect(uniqueSlug('a', used)).toBe('a-3');
  });
});
