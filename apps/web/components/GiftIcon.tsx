'use client';

import { useId } from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Gift box icon with gradient stroke (pink → orange).
 * Each instance uses a unique gradient ID to avoid SVG conflicts.
 */
export function GiftIcon({ className, size = 24 }: IconProps) {
  const gradId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${gradId})`}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D8D" />
          <stop offset="100%" stopColor="#FF8A00" />
        </linearGradient>
      </defs>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
