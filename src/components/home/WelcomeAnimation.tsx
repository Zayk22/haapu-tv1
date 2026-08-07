"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeAnimationProps {
  firstName: string;
}

export default function WelcomeAnimation({ firstName }: WelcomeAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per session
    const key = "haapu_welcome_shown";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "true");
      setVisible(true);
      // Auto-dismiss after 2.8 seconds
      const t = setTimeout(() => setVisible(false), 2800);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-matte-black"
          onClick={() => setVisible(false)}
        >
          {/* Gold top accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }}
          />

          {/* Logo */}
          <motion.img
            src="/logo.png"
            alt="Haapu TV"
            className="mb-8 h-14 w-auto object-contain opacity-80"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* Welcome text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center text-matte-400 text-base uppercase tracking-[0.3em] mb-3"
          >
            Welcome back
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: "#D4AF37",
              letterSpacing: "-0.01em",
            }}
          >
            {firstName}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-4 text-matte-600 text-sm tracking-wider"
          >
            Your stories. Your terms.
          </motion.p>

          {/* Dismiss hint */}
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