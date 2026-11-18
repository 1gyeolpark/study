// 가져온 글을 HTML과 색인으로 변환

import fs from 'node:fs';
import path from 'node:path';
import { defaultGroup, excluded, groupDefs, overrides } from '../src/config/categories';
import type {
  GroupMeta,
  Post,
  PostIndex,
  RepoMeta,
  SearchEntry,
  SectionMeta,
} from '../src/features/content/types';
import { readGitDates } from './lib/gitDates';
import { readReadmeTitles } from './lib/readmeTitles';
import { renderMarkdown } from './lib/render';
import { shorten } from './lib/shorten';
import { assignSections, sectionLabel } from './lib/sections';
import { makeSlug, uniqueSlug } from './lib/slug';

const root = path.resolve(import.meta.dirname, '..');
const contentDir = path.join(root, 'content');
const outDir = path.join(root, 'public/content');

const toPosix = (p: string) => p.split(path.sep).join('/');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') {
      continue;
    }

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }

  return out;
}

function summaryOf(source: string): string {
  const quote = /^>\s*(.+)$/m.exec(source);

  if (!quote) {
    return '';
  }

  const text = quote[1]
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/[`*_]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();

  return shorten(text, 140);
}

const textOf = (source: string) =>
  source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`|_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function buildRepo(
  repo: string,
  posts: Post[],
  search: SearchEntry[],
  sectionsOut: Record<string, SectionMeta[]>,
) {
  const repoDir = path.join(contentDir, repo);

  if (!fs.existsSync(repoDir)) {
    console.warn(`없음: ${repo}`);
    return;
  }

  const files = walk(repoDir).map((f) => toPosix(path.relative(repoDir, f)));
  const titles = new Map<string, string>();

  const rank = new Map<string, number>();
  const readmes = files
    .filter((f) => /(^|\/)README\.md$/i.test(f))
    .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));

  for (const rel of readmes) {
    const text = fs.readFileSync(path.join(repoDir, rel), 'utf8');

    for (const [k, v] of readReadmeTitles(rel, text)) {
      titles.set(k, v);

      if (!rank.has(k)) {
        rank.set(k, rank.size);
      }
    }
  }

  const docs = files.filter((f) => f.endsWith('.md') && !f.startsWith('.github/'));
  const hasTheory = docs.some((f) => f.split('/').includes('Theory'));
  const theory = docs
    .filter((f) => (hasTheory ? f.split('/').includes('Theory') : !/(^|\/)README\.md$/i.test(f)))
    .sort();
  const dates = readGitDates(repoDir);
  const used = new Set<string>();
  const slugs = new Map<string, string>();

  for (const rel of theory) {
    slugs.set(rel, uniqueSlug(makeSlug(rel), used));
  }

  const outImageDir = path.join(outDir, 'images', repo);
  const assigned = assignSections(theory);
  const folderNames = overrides[repo]?.sections;
  const sections = new Map<string, SectionMeta>();

  for (const [i, rel] of theory.entries()) {
    const source = fs.readFileSync(path.join(repoDir, rel), 'utf8');
    const slug = slugs.get(rel)!;
    const heading = /^#\s+(.+)$/m.exec(source)?.[1].trim();
    const title = titles.get(rel) ?? heading ?? slug;
    const { html, headings, firstImage } = await renderMarkdown(source, {
      repo,
      repoDir,
      fileRel: rel,
      slugOf: (r) => slugs.get(r),
      outImageDir,
    });
    const htmlPath = path.join(outDir, 'posts', repo, `${slug}.html`);

    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, html);

    posts.push({
      repo,
      slug,
      title,
      summary: summaryOf(source),
      date: dates.get(rel) ?? '',
      order: rank.get(rel) ?? Number.MAX_SAFE_INTEGER,
      section: assigned[i]?.key ?? null,
      firstImage,
      headings,
    });
    search.push({ repo, slug, title, text: textOf(source).slice(0, 4000) });

    const sec = assigned[i];

    if (sec) {
      const meta = sections.get(sec.key) ?? {
        key: sec.key,
        label: sectionLabel(sec.folder, folderNames?.[sec.folder]),
        count: 0,
      };

      meta.count += 1;
      sections.set(sec.key, meta);
    }
  }

  sectionsOut[repo] = [...sections.values()].sort((a, b) => a.key.localeCompare(b.key));

  console.log(`변환함: ${repo} ${theory.length}편`);
}

type RepoEntry = { name: string; description: string };

const repos: RepoEntry[] = JSON.parse(fs.readFileSync(path.join(contentDir, 'repos.json'), 'utf8'));

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const posts: Post[] = [];
const search: SearchEntry[] = [];
const sectionsOf: Record<string, SectionMeta[]> = {};

for (const { name } of repos) {
  if (!excluded.includes(name)) {
    await buildRepo(name, posts, search, sectionsOf);
  }
}

const metas: RepoMeta[] = repos
  .map(({ name, description }) => {
    const count = posts.filter((p) => p.repo === name).length;
    const ov = overrides[name];

    return {
      repo: name,
      label: ov?.label ?? name,
      group: ov?.group ?? defaultGroup,
      description,
      snippet: ov?.snippet ?? [],
      count,
      sections: sectionsOf[name] ?? [],
    };
  })
  .filter((m) => m.count > 0);

const order = Object.keys(overrides);
const rank = (repo: string) => (order.includes(repo) ? order.indexOf(repo) : order.length);

const groups: GroupMeta[] = groupDefs
  .map((def) => ({
    ...def,
    repos: metas
      .filter((m) => m.group === def.key)
      .sort((a, b) => rank(a.repo) - rank(b.repo) || a.repo.localeCompare(b.repo)),
  }))
  .filter((g) => g.repos.length > 0);

const index: PostIndex = { groups, posts };

fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index));
fs.writeFileSync(path.join(outDir, 'search.json'), JSON.stringify(search));
console.log(`전체 ${posts.length}편, 저장소 ${metas.length}개`);
