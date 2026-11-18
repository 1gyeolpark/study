// 파일별 마지막 커밋 날짜

import { execFileSync } from 'node:child_process';

// 키는 저장소 기준 경로, 값은 YYYY-MM-DD
export function readGitDates(repoDir: string): Map<string, string> {
  const out = execFileSync(
    'git',
    ['-c', 'core.quotepath=false', 'log', '--format=%x00%cs', '--name-only', '--no-renames'],
    { cwd: repoDir, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
  );
  const dates = new Map<string, string>();

  for (const block of out.split('\0')) {
    const [date, ...files] = block.split('\n').filter(Boolean);

    for (const file of files) {
      if (!dates.has(file)) {
        dates.set(file, date);
      }
    }
  }

  return dates;
}
