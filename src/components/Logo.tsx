import logoFull from "@/assets/saito-logo.png";
import logoMark from "@/assets/saito-mark.png";

export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  if (!withText) {
    return (
      <img
        src={logoMark}
        alt="SAITO"
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
      />
    );
  }
  return (
    <img
      src={logoFull}
      alt="SAITO"
      style={{ height: size }}
      className="shrink-0 object-contain"
    />
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <img
      src={logoMark}
      alt="SAITO"
      style={{ width: size, height: size }}
      className="shrink-0 object-contain"
    />
  );
}
