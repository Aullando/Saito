import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export function ModuleCard({ icon: Icon, title, description, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_var(--saito-blue)]"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.div>
  );
}
