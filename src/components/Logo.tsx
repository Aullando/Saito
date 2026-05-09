import { useClub } from "@/clubs/ClubProvider";
import saitoFull from "@/assets/brand/saito-logo-frase.png";
import saitoMark from "@/assets/brand/saito-iso.svg";

export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  const { club } = useClub();
  const fullSrc = club.brand.logoFull ?? saitoFull;
  const markSrc = club.brand.logoMark ?? saitoMark;
  const alt = club.brand.shortName;

  if (!withText) {
    return (
      <img
        src={markSrc}
        alt={alt}
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
      />
    );
  }
  return (
    <img
      src={fullSrc}
      alt={alt}
      style={{ height: size }}
      className="shrink-0 object-contain"
    />
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  const { club } = useClub();
  const markSrc = club.brand.logoMark ?? saitoMark;
  return (
    <img
      src={markSrc}
      alt={club.brand.shortName}
      style={{ width: size, height: size }}
      className="shrink-0 object-contain"
    />
  );
}
