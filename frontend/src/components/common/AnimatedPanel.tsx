import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedPanelProps {
  isOpen: boolean;
  children: ReactNode;
  direction?: "left" | "right";
  className?: string;
}

const variants = {
  left: {
    hidden: { x: -320, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -320, opacity: 0 },
  },
  right: {
    hidden: { x: 320, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 320, opacity: 0 },
  },
};

export function AnimatedPanel({
  isOpen,
  children,
  direction = "right",
  className = "",
}: AnimatedPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants[direction]}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
