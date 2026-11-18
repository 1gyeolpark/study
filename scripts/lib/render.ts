// 마크다운을 HTML로 변환

import fs from 'node:fs';
import path from 'node:path';
import rehypeShiki from '@shikijs/rehype';
import type { Element, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified, type Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Heading } from '../../src/features/content/types';
import { SITE_BASE } from './base';

export type RenderContext = {
  repo: string;
  repoDir: string;
  fileRel: string;
  slugOf: (rel: string) => string | undefined;
  outImageDir: string;
};

export type Rendered = { html: string; headings: Heading[]; firstImage: string | null };

const isExternal = (url: string) => /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url);

function resolveRel(ctx: RenderContext, url: string): { rel: string; hash: string } {
  const [raw, hash = ''] = url.split('#');
  const abs = path.resolve(ctx.repoDir, path.dirname(ctx.fileRel), decodeURI(raw.split('?')[0]));
  const rel = path.relative(ctx.repoDir, abs).split(path.sep).join('/');

  return { rel, hash: hash ? `#${hash}` : '' };
}

const rewriteUrls =
  (ctx: RenderContext): Plugin<[], Root> =>
  () =>
  (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && typeof node.properties.src === 'string') {
        const src = node.properties.src;

        if (!isExternal(src)) {
          const { rel } = resolveRel(ctx, src);
          const from = path.join(ctx.repoDir, rel);

          if (rel.startsWith('..') || !fs.existsSync(from)) {
            return;
          }

          // 점으로 시작하는 폴더 이름의 점 제거
          const outRel = rel
            .split('/')
            .map((seg) => seg.replace(/^\.+/, ''))
            .join('/');
          const to = path.join(ctx.outImageDir, outRel);

          fs.mkdirSync(path.dirname(to), { recursive: true });
          fs.copyFileSync(from, to);
          node.properties.src = encodeURI(`${SITE_BASE}content/images/${ctx.repo}/${outRel}`);
          node.properties.loading = 'lazy';
        }
      }

      if (node.tagName === 'a' && typeof node.properties.href === 'string') {
        const href = node.properties.href;

        if (href.startsWith('#')) {
          return;
        }

        if (isExternal(href)) {
          node.properties.target = '_blank';
          node.properties.rel = ['noopener', 'noreferrer'];
          return;
        }

        const { rel, hash } = resolveRel(ctx, href);
        const slug = ctx.slugOf(rel);

        if (slug) {
          node.properties.href = `${SITE_BASE}p/${ctx.repo}/${slug}${hash}`;
          return;
        }

        node.properties.href = `https://github.com/hg-study/${ctx.repo}/blob/main/${rel}`;
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
      }
    });
  };

// 글 제목과 맨 위 직접 쓴 목차 제거
const dropIntro = (): Plugin<[], Root> => () => (tree) => {
  const kids = tree.children;
  const indexOfElement = () => kids.findIndex((n) => n.type === 'element');
  const first = indexOfElement();

  if (first >= 0 && (kids[first] as Element).tagName === 'h1') {
    kids.splice(first, 1);
  }

  const next = indexOfElement();
  const el = next >= 0 ? (kids[next] as Element) : undefined;
  const items = el?.children.filter((c): c is Element => c.type === 'element') ?? [];
  const isAnchorList =
    el?.tagName === 'ul' &&
    items.length > 0 &&
    items.every((li) => {
      const a = li.children.find((c): c is Element => c.type === 'element');

      return a?.tagName === 'a' && String(a.properties.href ?? '').startsWith('#');
    });

  if (isAnchorList) {
    kids.splice(next, 1);
  }
};

const wrapTables = (): Plugin<[], Root> => () => (tree) => {
  visit(tree, 'element', (node: Element, index, parent) => {
    if (node.tagName !== 'table' || !parent || index === undefined) {
      return;
    }

    parent.children[index] = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['table-wrap'] },
      children: [node],
    };

    return 'skip';
  });
};

export async function renderMarkdown(source: string, ctx: RenderContext): Promise<Rendered> {
  const headings: Heading[] = [];
  let firstImage: string | null = null;

  const collect: Plugin<[], Root> = () => (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (/^h[23]$/.test(node.tagName) && typeof node.properties.id === 'string') {
        headings.push({
          id: node.properties.id,
          text: toString(node).trim(),
          depth: Number(node.tagName[1]),
        });
      }

      if (node.tagName === 'img' && !firstImage && typeof node.properties.src === 'string') {
        firstImage = node.properties.src;
      }
    });
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(dropIntro())
    .use(rehypeSlug)
    .use(rewriteUrls(ctx))
    .use(rehypeShiki, {
      theme: 'github-light',
      fallbackLanguage: 'text',
      lazy: true,
    })
    .use(wrapTables())
    .use(collect)
    .use(rehypeStringify)
    .process(source);

  return { html: String(file), headings, firstImage };
}
