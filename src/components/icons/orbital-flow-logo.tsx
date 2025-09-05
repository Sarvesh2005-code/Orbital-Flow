import React from 'react';

interface OrbitalFlowLogoProps {
  className?: string;
  size?: number;
}

export const OrbitalFlowLogo: React.FC<OrbitalFlowLogoProps> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer orbital ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#gradient1)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Middle orbital ring */}
      <circle
        cx="50"
        cy="50"
        r="30"
        stroke="url(#gradient2)"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      
      {/* Inner core */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="url(#coreGradient)"
      />
      
      {/* Orbital dots */}
      <circle
        cx="95"
        cy="50"
        r="3"
        fill="url(#gradient1)"
      />
      <circle
        cx="20"
        cy="30"
        r="2.5"
        fill="url(#gradient2)"
      />
      <circle
        cx="80"
        cy="20"
        r="2"
        fill="url(#gradient1)"
      />
      
      {/* Flow lines */}
      <path
        d="M25 40 Q40 35 55 40 Q70 45 85 40"
        stroke="url(#flowGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M25 60 Q40 65 55 60 Q70 55 85 60"
        stroke="url(#flowGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7849" />
          <stop offset="100%" stopColor="#fd5843" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default OrbitalFlowLogo;
