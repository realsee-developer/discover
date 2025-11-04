interface GaloisIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function GaloisIcon({
  className = "",
  width = 16,
  height = 16,
}: GaloisIconProps) {
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
          d="m4.067 2.106 3.067-.256A.8.8 0 0 1 8 2.647v10.706a.8.8 0 0 1-.866.797l-3.067-.256a.8.8 0 0 1-.734-.797V2.903a.8.8 0 0 1 .734-.797Z"
          strokeWidth="0.6"
        />
        <path
          d="m4.432 2.734 2.597-.172a.3.3 0 0 1 .32.3v10.247a.3.3 0 0 1-.32.3l-2.597-.177a.3.3 0 0 1-.28-.3V3.035a.3.3 0 0 1 .28-.3Z"
          strokeWidth="0.3"
        />
        <path
          d="m7.543 1.844 5.1.487a.8.8 0 0 1 .724.796v9.746a.8.8 0 0 1-.724.796l-5.1.489h0M11.432 2.4v11.2"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.57 8.778c.43 0 .779-.523.779-1.167S7 6.444 6.57 6.444c-.43 0-.778.523-.778 1.167s.348 1.167.778 1.167Zm2.52-5.884 1.41.12a.2.2 0 0 1 .182.2v1.021a.2.2 0 0 1-.21.2l-1.408-.068a.2.2 0 0 1-.19-.2V3.094a.2.2 0 0 1 .217-.2Z"
          strokeWidth="0.3"
        />
      </g>
    </svg>
  );
}
