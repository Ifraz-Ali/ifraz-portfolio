"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** A visual-only reveal. Assistive technology receives the complete text once. */
export function Typewriter({
  text,
  animate = true,
  paused = false,
  onStart,
  onComplete,
}: {
  text: string;
  animate?: boolean;
  paused?: boolean;
  onStart?: () => void;
  onComplete?: (didAnimate: boolean) => void;
}) {
  const reduced = useReducedMotion();
  // Keep this run's animation decision fixed; read history only affects later runs.
  const [shouldAnimate] = useState(animate);
  const instant = !shouldAnimate || Boolean(reduced);
  const characters = Array.from(text);
  const [count, setCount] = useState(() => (instant ? characters.length : 0));
  const progress = useRef(0);
  const started = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    if (instant) {
      const timer = window.setTimeout(() => {
        if (finished.current) return;
        finished.current = true;
        onComplete?.(started.current);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    if (paused || finished.current) return;
    if (!started.current) {
      started.current = true;
      onStart?.();
    }
    const length = Array.from(text).length;
    const timer = window.setInterval(() => {
      progress.current = Math.min(progress.current + 1, length);
      setCount(progress.current);
      if (progress.current >= length) {
        window.clearInterval(timer);
        finished.current = true;
        onComplete?.(true);
      }
    }, 40); // About 36 characters/second; navigation never waits for this timer.
    return () => window.clearInterval(timer);
  }, [instant, paused, text, onStart, onComplete]);

  const complete = instant || count >= characters.length;
  return (
    <span
      className="typewriter"
      data-complete={complete}
      data-animated={!instant}
      data-paused={paused}
    >
      <span className="typewriter-reserve" aria-hidden="true">
        {text}
        <span className="typewriter-cursor" />
      </span>
      <span className="typewriter-visual" aria-hidden="true">
        {instant ? text : characters.slice(0, count).join("")}
        <span className="typewriter-cursor" />
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
