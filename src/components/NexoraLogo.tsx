import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge' | 'text-only';
  showTagline?: boolean;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = false,
  className = ''
}) => {
  // Dimensions
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: { title: 'text-sm', sub: 'text-[8px]', spacing: 'tracking-[0.2em]' },
    md: { title: 'text-lg', sub: 'text-[10px]', spacing: 'tracking-[0.25em]' },
    lg: { title: 'text-2xl', sub: 'text-xs', spacing: 'tracking-[0.3em]' },
    xl: { title: 'text-3xl', sub: 'text-sm', spacing: 'tracking-[0.35em]' }
  };

  // The official Gold "N" Emblem SVG with the arrow and technology node
  const GoldEmblemSvg = (
    <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1B8" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F9E29D" />
            <stop offset="75%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          <linearGradient id="goldN" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#F39C12" />
            <stop offset="100%" stopColor="#B7870A" />
          </linearGradient>

          <linearGradient id="badgeBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4F6F8" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Rim */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#badgeBg)"
          stroke="url(#goldRim)"
          strokeWidth="3.5"
        />

        {/* Inner Subtle Ring */}
        <circle
          cx="60"
          cy="60"
          r="51"
          stroke="url(#goldRim)"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.6"
        />

        {/* The Golden Stylized 'N' Monogram */}
        {/* Left vertical / curved stalk */}
        <path
          d="M 36 82 L 36 38 C 36 33, 44 33, 44 38 L 44 82 C 44 86, 36 86, 36 82 Z"
          fill="url(#goldN)"
        />

        {/* Dynamic diagonal bridge */}
        <path
          d="M 42 42 L 72 74 C 74 76, 78 75, 78 71 L 78 48 C 78 44, 85 44, 85 48 L 85 76 C 85 82, 78 85, 73 80 L 43 47 Z"
          fill="url(#goldN)"
        />

        {/* Right Upright with Upward Growth Arrow */}
        <path
          d="M 77 56 L 77 34 L 84 34 L 84 56 Z"
          fill="url(#goldN)"
        />
        {/* Arrow Tip at top right of N */}
        <polygon
          points="80.5,23 72,35 89,35"
          fill="url(#goldRim)"
        />

        {/* Tech / Connected Investment Node (Dot on the right) */}
        <circle
          cx="88"
          cy="68"
          r="4.5"
          fill="url(#goldRim)"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      </svg>
    </div>
  );

  if (variant === 'icon' || variant === 'badge') {
    return GoldEmblemSvg;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {variant !== 'text-only' && GoldEmblemSvg}

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-sans ${textSizes[size].title}`}
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              letterSpacing: '0.08em'
            }}
          >
            NEXORA
          </span>
          <span
            className={`font-extrabold uppercase px-1.5 py-0.2 rounded font-mono text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm ${textSizes[size].sub}`}
          >
            LTD
          </span>
        </div>

        <span
          className={`font-bold text-amber-300/80 uppercase font-sans ${textSizes[size].sub} ${textSizes[size].spacing}`}
          style={{ letterSpacing: '0.24em' }}
        >
          LIMITED
        </span>

        {showTagline && (
          <span className="text-[10px] text-slate-400 mt-0.5">
            Founder Governance & Shariah Ventures
          </span>
        )}
      </div>
    </div>
  );
};
