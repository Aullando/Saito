import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  max?: number;
}

/**
 * Subtle 3D tilt that follows the cursor. Use on hero mockups and feature cards.
 */
export function TiltCard({ children, className, max = 6 }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
