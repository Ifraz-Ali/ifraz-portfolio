"use client";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: reduced ? 0 : [10, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.45 }}
    >
      {children}
    </motion.div>
  );
}
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia(
      "(prefers-reduced-motion: reduce), (pointer: coarse)",
    );
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (preference.matches || !ref.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${event.clientX - 180}px,${event.clientY - 180}px,0)`;
          ref.current.style.opacity = "1";
        }
      });
    };
    const hide = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    const change = () => {
      if (preference.matches) hide();
    };
    preference.addEventListener("change", change);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      preference.removeEventListener("change", change);
    };
  }, []);
  return <div ref={ref} className="cursor-light" aria-hidden="true" />;
}
