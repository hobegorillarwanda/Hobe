import React from 'react';
import { getAdaptiveImageUrl } from '../services';

interface LogoProps {
  size?: number | string;
  className?: string;
  onClick?: () => void;
}

export default function Logo({ size = 48, className, ...props }: LogoProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src={getAdaptiveImageUrl('/hobe-icon.png')}
      alt="Hobe Gorilla Rwanda Logo"
      style={{ width: dimension, height: dimension }}
      className={`object-contain ${className || ''}`}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}

// git-sync-trigger