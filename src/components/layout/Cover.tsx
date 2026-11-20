// 화면 위쪽 커버 띠

type Props = { title: string; text?: string; snippet?: readonly string[] };

export default function Cover({ title, text, snippet }: Props) {
  return (
    <section className="overflow-hidden bg-sea text-white">
      <div className="relative mx-auto max-w-[1240px] px-4 py-[clamp(36px,6vw,56px)]">
        <h1 className="text-[clamp(32px,5vw,48px)] leading-[1.15] font-bold tracking-[-0.02em] font-serif">
          {title}
        </h1>
        {text && <p className="mt-5 text-[15px] text-cover-sub">{text}</p>}
        {snippet && snippet.length > 0 && (
          <pre
            aria-hidden="true"
            className="absolute top-8 right-4 m-0 font-mono text-[13px] leading-[1.9] text-white/25 max-[900px]:hidden"
          >
            {snippet.join('\n')}
          </pre>
        )}
      </div>
    </section>
  );
}
