import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import SearchIcon from '@/components/ui/SearchIcon';
import { paths } from '@/config/paths';

// 제목과 본문 검색 입력

export default function SearchForm({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();

    if (q) {
      navigate(`${paths.search}?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form
      role="search"
      onSubmit={submit}
      className={`flex h-[30px] items-center border-b border-ink ${className}`}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색"
        aria-label="검색"
        className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-faint"
      />
      <button
        type="submit"
        aria-label="검색하기"
        className="flex size-6 items-center justify-center"
      >
        <SearchIcon className="size-4" />
      </button>
    </form>
  );
}
