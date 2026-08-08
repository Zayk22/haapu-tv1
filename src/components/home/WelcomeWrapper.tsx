"use client";

import { useState, useEffect } from "react";
import WelcomeAnimation from "./WelcomeAnimation";

interface WelcomeWrapperProps {
  firstName: string;
  children: React.ReactNode;
}

export default function WelcomeWrapper({ firstName, children }: WelcomeWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const key = "haapu_welcome_shown";

    if (sessionStorage.getItem(key)) {
      // Already shown – skip animation
      setShowContent(true);
      return;
    }

    // First visit – show animation
    sessionStorage.setItem(key, "true");
    setShowAnimation(true);
  }, []);

  const handleComplete = () => {
    setShowContent(true);
  };

  if (!isMounted) {
    // Server render – show a black placeholder to avoid flash of empty content
    return <div className="fixed inset-0 bg-matte-black" />;
  }

  return (
    <>
      {showAnimation && (
        <WelcomeAnimation firstName={firstName} onComplete={handleComplete} />
      )}
      {showContent && children}
    </>
  );
}