"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";

interface WelcomeAnimationProps {
  firstName: string;
}

export default function WelcomeAnimation({ firstName }: WelcomeAnimationProps) {
  const { sessionId } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const key = `haapu_welcome_${sessionId}`;
    const hasShown = sessionStorage.getItem(key);

    if (!hasShown) {
      sessionStorage.setItem(key, "true");
      setVisible(true);

      // Auto-dismiss after 2.5 seconds
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [sessionId]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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

          {/* "WELCOME BACK" */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center text-matte-400 text-xs uppercase tracking-[0.3em] mb-4"
          >
            Welcome back
          </motion.p>

          {/* First name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center text-4xl sm:text-5xl lg:text-6xl font-light"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#D4AF37",
              letterSpacing: "0.02em",
            }}
          >
            {firstName}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-4 text-matte-500 text-xs tracking-widest"
          >
            Your stories. Your terms.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}