import { Link } from 'react-router';
import { messages } from '@/config/messages';
import { paths } from '@/config/paths';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// 없는 주소 안내

export default function NotFound({ message = messages.notFound }: { message?: string }) {
  useDocumentTitle('404');

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-24 text-center">
      <p className="font-serif text-[48px] font-bold text-sea">404</p>
      <p className="mt-4 text-sub">{message}</p>
      <Link
        to={paths.home}
        className="mt-8 inline-flex h-11 min-w-32 items-center justify-center rounded-[3px] border border-rule text-[14px]"
      >
        {messages.goHome}
      </Link>
    </div>
  );
}
