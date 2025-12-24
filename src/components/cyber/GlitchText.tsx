"use client";

import { type HTMLAttributes, forwardRef } from "react";

type GlitchTextProps = HTMLAttributes<HTMLElement> & {
  /** The text to display with glitch effect */
  text: string;
  /** HTML tag to render */
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  /** Enable or disable glitch animation */
  animated?: boolean;
  /** Custom class for additional styling */
  glitchClass?: string;
};

/**
 * GlitchText - Cyberpunk glitch effect text component
 * Uses CSS animations to create RGB split and distortion effects
 */
export const GlitchText = forwardRef<HTMLElement, GlitchTextProps>(
  (
    {
      text,
      as: Tag = "span",
      animated = true,
      glitchClass = "",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClass = animated ? "glitch-text" : "";
    const combinedClass =
      `${baseClass} ${glitchClass} ${className}`.trim() || undefined;

    return (
      <Tag
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={combinedClass}
        data-text={text}
        {...props}
      >
        {text}
      </Tag>
    );
  }
);

GlitchText.displayName = "GlitchText";

export default GlitchText;

