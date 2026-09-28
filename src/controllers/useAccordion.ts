"use client";

import { useCallback, useState } from "react";

// Single-open accordion: opening one item closes the others; clicking the open item closes it.
export function useAccordion(initialOpenId: string | null = null) {
  const [openId, setOpenId] = useState<string | null>(initialOpenId);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const isOpen = useCallback((id: string) => openId === id, [openId]);

  return { isOpen, toggle };
}
