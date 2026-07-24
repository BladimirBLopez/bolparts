"use client";

import { motion } from "framer-motion";

export function TapButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
