import { useEffect, useRef, useState } from "react";

type SkeletonGateOptions = {
  delayMs?: number;
  minVisibleMs?: number;
};

export const useSkeletonGate = (
  loading: boolean,
  options: SkeletonGateOptions = {}
) => {
  const { delayMs = 180, minVisibleMs = 320 } = options;
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (loading) {
      if (visible) return;
      delayTimerRef.current = setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
      }, delayMs);
      return;
    }

    if (!visible) return;
    const shownAt = shownAtRef.current ?? Date.now();
    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(minVisibleMs - elapsed, 0);

    hideTimerRef.current = setTimeout(() => {
      shownAtRef.current = null;
      setVisible(false);
    }, remaining);
  }, [loading, delayMs, minVisibleMs, visible]);

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return visible;
};

