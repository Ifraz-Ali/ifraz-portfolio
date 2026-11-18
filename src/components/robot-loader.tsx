"use client";

import { Component, type ReactNode } from "react";
import type { RobotLoaderVariant } from "@/lib/guide-loading";
import styles from "./robot-loader.module.css";

const labels: Record<RobotLoaderVariant, string> = {
  eyes: "Waking up the guide…",
  assembly: "Assembling the guide…",
  orbital: "Connecting the guide…",
  diagnostic: "Initializing guide…",
};

export function RobotLoader({ variant = "eyes", paused = false }: {
  variant?: RobotLoaderVariant;
  paused?: boolean;
}) {
  return (
    <div className={styles.loader} data-variant={variant} data-paused={paused} role="status" aria-label="Loading portfolio guide">
      <div className={styles.visual} aria-hidden="true">
        {variant === "eyes" ? <div className={styles.face}><div className={styles.antenna}/><div className={`${styles.eye} ${styles.leftEye}`}/><div className={`${styles.eye} ${styles.rightEye}`}/><div className={styles.faceLight}/></div> : null}
        {variant === "assembly" ? <div className={styles.assembly}><div className={styles.outlineBot}><div className={styles.outlineAntenna}/><div className={styles.outlineHead}><div className={styles.outlineVisor}/><div className={`${styles.outlineEar} ${styles.leftEar}`}/><div className={`${styles.outlineEar} ${styles.rightEar}`}/></div><div className={styles.outlineBody}><i/><i/><i/></div></div><div className={styles.scan}/></div> : null}
        {variant === "orbital" ? <div className={styles.orbits}><div className={`${styles.orbit} ${styles.orbitA}`}/><div className={`${styles.orbit} ${styles.orbitB}`}/><div className={styles.core}/></div> : null}
        {variant === "diagnostic" ? <div className={styles.diagnostic}><div className={styles.diagnosticTitle}><i/>GUIDE / BOOT</div><div className={styles.diagnosticRow}><span>Graphics</span><i/></div><div className={styles.diagnosticRow}><span>Character</span><i/></div><div className={styles.diagnosticRow}><span>Navigation</span><i/></div><div className={styles.activity}><i/></div><div className={styles.diagnosticMessage}>Initializing guide<span/></div></div> : null}
      </div>
      {variant !== "diagnostic" ? <span className={styles.label} aria-hidden="true">{labels[variant]}</span> : null}
      <span className="sr-only">Loading the 3D guide. Portfolio navigation is available.</span>
    </div>
  );
}

// Covers failures of the lazy JavaScript chunk as well as the scene itself.
export class RobotLoadingBoundary extends Component<{
  children: ReactNode;
  onFailure: () => void;
}, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
