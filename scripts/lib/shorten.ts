// 요약을 문장이나 낱말 경계에서 자르기

export function shorten(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }

  const head = text.slice(0, max);
  const sentence = Math.max(head.lastIndexOf('다. '), head.lastIndexOf('. '));

  // 뒤쪽 절반 안의 문장 끝에서 자르기
  if (sentence > max * 0.5) {
    return head.slice(0, sentence + 2).trim();
  }

  const space = head.lastIndexOf(' ');

  return `${(space > 0 ? head.slice(0, space) : head).trim()}…`;
}
