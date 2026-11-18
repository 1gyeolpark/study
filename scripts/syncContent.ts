// 글 저장소 목록을 찾아 가져오기

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const org = 'hg-study';
const topic = 'fullstack-notes';
const root = path.resolve(import.meta.dirname, '../content');

type ApiRepo = { name: string; description: string | null; topics?: string[]; archived: boolean };

async function listRepos(): Promise<ApiRepo[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&type=public`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`저장소 목록 조회 실패: ${res.status}`);
  }

  const repos = (await res.json()) as ApiRepo[];

  return repos.filter((r) => !r.archived && r.topics?.includes(topic));
}

fs.mkdirSync(root, { recursive: true });

const repos = await listRepos();

for (const { name } of repos) {
  const dir = path.join(root, name);

  try {
    if (fs.existsSync(path.join(dir, '.git'))) {
      execFileSync('git', ['pull', '--ff-only', '-q'], { cwd: dir, stdio: 'inherit' });
    } else {
      execFileSync('git', ['clone', '-q', `https://github.com/${org}/${name}.git`, dir], {
        stdio: 'inherit',
      });
    }
    console.log(`가져옴: ${name}`);
  } catch {
    console.warn(`건너뜀: ${name}`);
  }
}

fs.writeFileSync(
  path.join(root, 'repos.json'),
  JSON.stringify(repos.map((r) => ({ name: r.name, description: r.description ?? '' }))),
);
