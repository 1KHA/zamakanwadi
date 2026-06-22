'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  delay?: number;
  className?: string;
  sizes?: string;
}

export default function FlipImage({ src, alt, delay = 0, className = '', sizes }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: '1200px' }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'bottom center',
          transform: visible ? 'rotateX(0deg) scale(1)' : 'rotateX(75deg) scale(0.88)',
          opacity: visible ? 1 : 0,
          transition: `transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, opacity 0.6s ease ${delay}ms`,
          borderRadius: 'inherit',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>
    </div>
  );
}
