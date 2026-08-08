"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeAnimationProps {
  firstName: string;
}

export default function WelcomeAnimation({ firstName }: WelcomeAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const key = "haapu_welcome_shown";

    if (sessionStorage.getItem(key)) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem(key, "true");

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-matte-black"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute left-0 right-0 top-0 h-[2px]"
            style={{
              background:
                "linear-gradient(to right, transparent, #D4AF37, transparent)",
            }}
          />

          <motion.img
            src="/logo.png"
            alt="Haapu TV"
            className="mb-8 h-14 w-auto object-contain"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-3 text-center text-sm uppercase tracking-[0.3em] text-matte-400"
          >
            Welcome back
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center text-5xl font-bold sm:text-6xl lg:text-7xl"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: "#D4AF37",
              letterSpacing: "-0.01em",
            }}
          >
            {firstName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-4 text-sm tracking-wider text-matte-600"
          >
            Your stories. Your terms.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.4, delay: 1.8 }}
            className="absolute bottom-8 text-xs text-matte-700"
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}