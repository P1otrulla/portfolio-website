/** Monogram jak zacisk w listwie: dwa „tory” – brązowy (L) i niebieski (N). */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="32" height="32" rx="5" className="fill-ink" />
        <rect x="5" y="8" width="2.5" height="18" rx="1.25" fill="var(--wire-l)" />
        <rect x="26.5" y="8" width="2.5" height="18" rx="1.25" fill="var(--wire-n)" />
        <text
          x="17"
          y="21.5"
          textAnchor="middle"
          className="fill-paper"
          style={{ fontSize: 11, fontWeight: 800, fontStretch: "100%", letterSpacing: "-0.02em" }}
        >
          PZ
        </text>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="heading text-[1.02rem]">Piotr Zych</span>
        <span className="mt-1 text-[0.75rem] text-ink-soft">elektryka i programowanie</span>
      </span>
    </span>
  );
}
