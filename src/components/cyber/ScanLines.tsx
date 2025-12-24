"use client";

import { type HTMLAttributes, forwardRef } from "react";

type ScanLinesProps = HTMLAttributes<HTMLDivElement> & {
  /** Intensity of scanlines (subtle, normal, intense) */
  intensity?: "subtle" | "normal" | "intense";
  /** Enable animation */
  animated?: boolean;
  /** Custom opacity (0-1) */
  opacity?: number;
};

/**
 * ScanLines - Full-screen or container scanlines overlay
 * Creates a CRT monitor effect with horizontal lines
 */
export const ScanLines = forwardRef<HTMLDivElement, ScanLinesProps>(
  (
    {
      intensity = "normal",
      animated = false,
      opacity,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const intensityMap = {
      subtle: 0.015,
      normal: 0.025,
      intense: 0.04,
    };

    const lineOpacity = opacity ?? intensityMap[intensity];

    const baseClasses = `
      pointer-events-none fixed inset-0 z-50
      ${animated ? "cyber-scanlines-animated" : ""}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, ${lineOpacity}) 2px,
            rgba(0, 255, 255, ${lineOpacity}) 4px
          )`,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

ScanLines.displayName = "ScanLines";

/**
 * ScanLinesOverlay - Non-fixed version for container use
 */
export const ScanLinesOverlay = forwardRef<HTMLDivElement, ScanLinesProps>(
  (
    {
      intensity = "normal",
      animated = false,
      opacity,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const intensityMap = {
      subtle: 0.015,
      normal: 0.025,
      intense: 0.04,
    };

    const lineOpacity = opacity ?? intensityMap[intensity];

    const baseClasses = `
      pointer-events-none absolute inset-0 z-10
      ${animated ? "cyber-scanlines-animated" : ""}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, ${lineOpacity}) 2px,
            rgba(0, 255, 255, ${lineOpacity}) 4px
          )`,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

ScanLinesOverlay.displayName = "ScanLinesOverlay";

export default ScanLines;

