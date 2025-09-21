import Image from "next/image";
import type { CSSProperties } from "react";

import { getStrapiMedia } from "@/lib/utils";

interface IStrapiMediaProps {
  src: string;
  alt: string | null;
  height?: number;
  width?: number;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  priority?: boolean;
}

export function StrapiImage({ src, alt, className, ...rest }: Readonly<IStrapiMediaProps>) {
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;
  return <Image src={imageUrl} alt={alt ?? "No alternative text provided"} className={className} {...rest} />;
}

export default StrapiImage;


