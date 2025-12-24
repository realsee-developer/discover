"use client";

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

type CyberFrameVariant = "neon" | "holographic" | "terminal" | "pulse";

type CyberFrameProps = HTMLAttributes<HTMLDivElement> & {
  /** Content inside the frame */
  children: ReactNode;
  /** Visual variant */
  variant?: CyberFrameVariant;
  /** Show corner decorations */
  corners?: boolean;
  /** Enable pulse animation */
  animated?: boolean;
  /** Add scanlines overlay */
  scanlines?: boolean;
  /** Custom border color (CSS variable or color) */
  borderColor?: string;
};

/**
 * CyberFrame - Cyberpunk styled container with neon borders and effects
 */
export const CyberFrame = forwardRef<HTMLDivElement, CyberFrameProps>(
  (
    {
      children,
      variant = "neon",
      corners = false,
      animated = false,
      scanlines = false,
      borderColor,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<CyberFrameVariant, string> = {
      neon: "border border-cyber-neon-cyan/60 neon-border",
      holographic: "holographic-frame",
      terminal: "terminal-box",
      pulse: "border border-cyber-neon-cyan/60 neon-border-pulse",
    };

    const baseClasses = `
      relative overflow-hidden rounded-2xl
      bg-cyber-gray-900/80 backdrop-blur-xl
      ${variantClasses[variant]}
      ${scanlines ? "cyber-scanlines" : ""}
      ${className}
    `.trim();

    const customStyle = borderColor
      ? { ...style, "--frame-border-color": borderColor }
      : style;

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={customStyle as React.CSSProperties}
        {...props}
      >
        {/* Corner decorations */}
        {corners && (
          <>
            <span className="cyber-corner-tl" aria-hidden="true" />
            <span className="cyber-corner-tr" aria-hidden="true" />
            <span className="cyber-corner-bl" aria-hidden="true" />
            <span className="cyber-corner-br" aria-hidden="true" />
          </>
        )}

        {/* Content */}
        <div className="relative z-[1]">{children}</div>

        {/* Optional animated glow layer */}
        {animated && (
          <div
            className="absolute inset-0 -z-10 opacity-30"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-neon-cyan/20 via-transparent to-cyber-neon-magenta/20 animate-pulse" />
          </div>
        )}
      </div>
    );
  }
);

CyberFrame.displayName = "CyberFrame";

export default CyberFrame;

