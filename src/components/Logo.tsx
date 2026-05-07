export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "conic-gradient(from 180deg, oklch(0.58 0.17 252), oklch(0.7 0.16 155), oklch(0.78 0.15 75), oklch(0.65 0.2 27), oklch(0.58 0.17 252))",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-[3px] rounded-full bg-card"
          style={{ boxShadow: "inset 0 0 0 1px var(--color-border)" }}
        />
        <div
          className="absolute rounded-full bg-primary"
          style={{ inset: size * 0.32, opacity: 0.9 }}
        />
      </div>
      {withText && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">SAITO</span>
      )}
    </div>
  );
}
