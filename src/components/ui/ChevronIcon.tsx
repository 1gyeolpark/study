// 접고 펴는 꽉 찬 세모

export default function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`size-3.5 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M4 8h16l-8 10z" />
    </svg>
  );
}
