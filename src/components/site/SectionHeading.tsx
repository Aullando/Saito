import { motion } from "framer-motion";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  invert?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", invert }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mx-auto max-w-2xl ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${invert ? "text-white/70" : "text-primary"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-3xl font-bold sm:text-4xl md:text-5xl ${invert ? "text-white" : "text-foreground"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg ${invert ? "text-white/70" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
