interface PanoTo3DIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function PanoTo3DIcon({
  className = "",
  width = 16,
  height = 16,
}: PanoTo3DIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={width}
      height={height}
      className={className}
      style={{ display: "inline-block" }}
    >
      <g stroke="currentColor" fill="none" fillRule="evenodd">
        <path
          d="M13.444 4.079v7.22c0 .17-.14.579-.372.72-1.412.862-2.584 1.43-5.072 1.43s-3.66-.568-5.072-1.43c-.231-.141-.372-.55-.372-.72V4.08"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m3.325 12.098 1.333-1.776a.4.4 0 0 1 .576-.067l.81.678a.4.4 0 0 0 .57-.058l1.438-1.804a.4.4 0 0 1 .636.014l2.71 3.714m-.522-3.36a.972.972 0 1 0 0-1.945.972.972 0 0 0 0 1.945Z"
          strokeWidth="0.3"
        />
        <path
          d="M4.873 5.807V2.262C3.459 2.69 2.556 3.345 2.556 4.08c0 1.288 2.008 2.333 5.444 2.333s5.444-1.045 5.444-2.333c0-.735-.905-1.39-2.32-1.818v3.626"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
