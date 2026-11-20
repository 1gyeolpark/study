import { site } from '@/config/site';

// 하단 안내

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-4 py-8 text-[13px] text-faint">
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-2">
        <span>{site.name}</span>
        <a
          href="https://github.com/hg-study"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sea"
        >
          github.com/hg-study
        </a>
      </div>
    </footer>
  );
}
