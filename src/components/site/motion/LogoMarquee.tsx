interface Props {
  items: string[];
}

export function LogoMarquee({ items }: Props) {
  // Duplicate the list so the marquee loop has no visible seam.
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee__track">
        {doubled.map((n, i) => (
          <span
            key={`${n}-${i}`}
            className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80"
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
