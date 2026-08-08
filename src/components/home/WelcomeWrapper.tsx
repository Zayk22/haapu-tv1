"use client";

import { useState, useLayoutEffect } from "react";
import WelcomeAnimation from "./WelcomeAnimation";

interface WelcomeWrapperProps {
  firstName: string;
  children: React.ReactNode;
}

export default function WelcomeWrapper({ firstName, children }: WelcomeWrapperProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useLayoutEffect(() => {
    const key = "haapu_welcome_shown";

    if (sessionStorage.getItem(key)) {
      // Already shown – skip animation, show content immediately
      setShowAnimation(false);
      setShowContent(true);
      return;
    }

    // First visit – show animation, set flag
    sessionStorage.setItem(key, "true");
    // content will be shown when onComplete fires
  }, []);

  const handleComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      {showAnimation && (
        <WelcomeAnimation firstName={firstName} onComplete={handleComplete} />
      )}
      {showContent && children}
    </>
  );
}