import { describe, expect, it } from 'vitest';
import { shorten } from './shorten';

describe('shorten', () => {
  it('짧으면 그대로 돌려줌', () => {
    expect(shorten('짧은 문장이다.', 100)).toBe('짧은 문장이다.');
  });

  it('길면 문장이 끝나는 곳에서 자름', () => {
    const text = `${'가'.repeat(60)}이다. ${'나'.repeat(60)}`;

    expect(shorten(text, 100)).toBe(`${'가'.repeat(60)}이다.`);
  });

  it('문장 경계가 없으면 낱말 경계에서 자르고 말줄임표를 붙임', () => {
    const text = '단어 '.repeat(40);
    const out = shorten(text, 50);

    expect(out.endsWith('…')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(51);
    expect(out.replace('…', '').trim().endsWith('단어')).toBe(true);
  });
});
