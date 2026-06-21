'use client';

import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 128, height = 58, className = '' }: LogoProps) {
  return (
    <Image
      src="/images/logo/logo.png"
      alt="Zamakan"
      width={width}
      height={height}
      className={`object-contain max-w-[80%] ${className}`}
      priority
    />
  );
}
