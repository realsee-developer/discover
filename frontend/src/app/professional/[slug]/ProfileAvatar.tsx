"use client";

import { useState } from "react";

interface ProfileAvatarProps {
  professionalId: number;
  name: string;
  className?: string;
}

export function ProfileAvatar({ professionalId, name, className = "" }: ProfileAvatarProps) {
  const [imageSrc, setImageSrc] = useState(`/professional/${professionalId}.jpg`);
  
  const handleImageError = () => {
    setImageSrc('/professional/1.jpg'); // fallback image
  };

  return (
    <img 
      src={imageSrc} 
      alt={name} 
      className={className}
      onError={handleImageError}
    />
  );
}
