import { messages } from '@/config/messages';

// 불러오기 실패 안내

export default function LoadFailed({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="py-16 text-center text-sub">
      <p>{messages.loadFailed}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 h-11 min-w-32 rounded-[3px] border border-rule px-4 text-[13px]"
        >
          {messages.retry}
        </button>
      )}
    </div>
  );
}
