"use client";

import Image from "next/image";
import { useState } from "react";

interface ProfileAvatarProps {
  professionalId: number;
  name: string;
  className?: string;
}

export function ProfileAvatar({ professionalId, name, className = "" }: ProfileAvatarProps) {
  const [imageSrc, setImageSrc] = useState(`/professional/${professionalId}.jpg`);

  const handleImageError = () => {
    setImageSrc("/professional/1.jpg");
  };

  return (
    <Image
      src={imageSrc}
      alt={name}
      width={200}
      height={200}
      className={className}
      onError={handleImageError}
    />
  );
}
