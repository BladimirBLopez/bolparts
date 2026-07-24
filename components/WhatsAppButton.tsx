"use client";

import { motion } from "framer-motion";

export function WhatsAppButton({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.1 }}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
    >
      Contactar por WhatsApp
    </motion.a>
  );
}
