"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/motion";

// Stops the page behind an overlay from scrolling while `locked` is true.
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      root.style.overflow = previous;
      getLenis()?.start();
    };
  }, [locked]);
}
