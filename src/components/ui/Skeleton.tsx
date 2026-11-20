// 불러오는 동안 자리 표시

export default function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div aria-busy="true" className="space-y-3 py-6">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-4 bg-line" style={{ width: `${95 - i * 12}%` }} />
      ))}
    </div>
  );
}
