import React from 'react';

interface NexoraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-32 h-32'
  };

  const textSizes = {
    xs: { title: 'text-xs', sub: 'text-[7px]', spacing: 'tracking-[0.18em]' },
    sm: { title: 'text-sm', sub: 'text-[8px]', spacing: 'tracking-[0.2em]' },
    md: { title: 'text-base sm:text-lg', sub: 'text-[9px] sm:text-[10px]', spacing: 'tracking-[0.25em]' },
    lg: { title: 'text-xl sm:text-2xl', sub: 'text-xs', spacing: 'tracking-[0.3em]' },
    xl: { title: 'text-2xl sm:text-3xl', sub: 'text-sm', spacing: 'tracking-[0.35em]' },
    '2xl': { title: 'text-4xl sm:text-5xl', sub: 'text-base', spacing: 'tracking-[0.4em]' }
  };

  // The official Gold "N" Emblem SVG with the arrow and technology node
  const GoldEmblemSvg = (
    <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center select-none`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#DFBA51" />
            <stop offset="50%" stopColor="#C59B27" />
            <stop offset="75%" stopColor="#F5DF88" />
            <stop offset="90%" stopColor="#9E721D" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          <linearGradient id="goldN" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="25%" stopColor="#DFBA51" />
            <stop offset="60%" stopColor="#C59B27" />
            <stop offset="85%" stopColor="#F39C12" />
            <stop offset="100%" stopColor="#A0720A" />
          </linearGradient>

          <radialGradient id="badgeBg" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="80%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#F0F2F5" />
          </radialGradient>
        </defs>

        {/* Outer Circular Medallion */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#badgeBg)"
          stroke="url(#goldRim)"
          strokeWidth="3.2"
        />

        {/* Inner Subtle Accent Ring */}
        <circle
          cx="60"
          cy="60"
          r="51"
          stroke="url(#goldRim)"
          strokeWidth="0.8"
          strokeDasharray="2.5 2"
          opacity="0.55"
        />

        {/* Monogram N with Growth Arrow & Circuit Node */}
        <g stroke="url(#goldN)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Main N Upright & Diagonal */}
          <path
            d="M 40 68 L 40 38 C 40 30, 50 30, 55 37 L 70 57 L 80 43"
            strokeWidth="4.8"
          />

          {/* Arrow Tip at top right */}
          <path
            d="M 72 37 L 84 40 L 80 52 Z"
            fill="url(#goldN)"
            strokeWidth="1"
          />

          {/* Inner Loop & Circuit Connection */}
          <path
            d="M 40 67 C 40 57, 56 45, 64 54 L 74 68 C 78 74, 85 72, 86 65 L 86 53"
            strokeWidth="4.8"
          />

          {/* Node Terminal Circle */}
          <circle
            cx="86"
            cy="50"
            r="3.5"
            fill="url(#badgeBg)"
            stroke="url(#goldN)"
            strokeWidth="3.2"
          />
        </g>
      </svg>
    </div>
  );

  // Standalone Full Medallion Badge variant (including the embedded text inside circle)
  if (variant === 'badge') {
    return (
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="badgeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="20%" stopColor="#DFBA51" />
              <stop offset="45%" stopColor="#C59B27" />
              <stop offset="70%" stopColor="#F5DF88" />
              <stop offset="90%" stopColor="#9E721D" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            <linearGradient id="badgeGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDF0CD" />
              <stop offset="30%" stopColor="#C89D2B" />
              <stop offset="70%" stopColor="#E5C158" />
              <stop offset="100%" stopColor="#8F6312" />
            </linearGradient>

            <radialGradient id="badgeFaceBg" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#FBFBFC" />
              <stop offset="100%" stopColor="#F0F1F4" />
            </radialGradient>
          </defs>

          <circle cx="250" cy="250" r="240" fill="url(#badgeFaceBg)" stroke="url(#badgeGoldRim)" strokeWidth="7" />
          <circle cx="250" cy="250" r="226" fill="none" stroke="url(#badgeGoldRim)" strokeWidth="1.5" strokeOpacity="0.45" />

          <g transform="translate(0, -18)" stroke="url(#badgeGoldGrad)" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path 
              d="M 175 272 L 175 160 C 175 135, 212 135, 230 162 L 282 238 L 320 180" 
              strokeWidth="18" 
            />
            <path 
              d="M 288 152 L 332 165 L 319 209 Z" 
              fill="url(#badgeGoldGrad)" 
              strokeWidth="2" 
            />
            <path 
              d="M 175 270 C 175 235, 235 180, 260 215 L 300 270 C 316 292, 338 285, 342 260 L 342 215" 
              strokeWidth="18" 
            />
            <circle cx="342" cy="205" r="14" fill="url(#badgeFaceBg)" stroke="url(#badgeGoldGrad)" strokeWidth="12" />
          </g>

          <text 
            x="250" 
            y="345" 
            textAnchor="middle" 
            fontFamily="'Plus Jakarta Sans', sans-serif" 
            fontSize="52" 
            fontWeight="900" 
            letterSpacing="9" 
            fill="url(#badgeGoldGrad)"
          >
            NEXORA
          </text>

          <text 
            x="250" 
            y="385" 
            textAnchor="middle" 
            fontFamily="'Plus Jakarta Sans', sans-serif" 
            fontSize="20" 
            fontWeight="700" 
            letterSpacing="14" 
            fill="url(#badgeGoldGrad)" 
            opacity="0.95"
          >
            LIMITED
          </text>
        </svg>
      </div>
    );
  }

  if (variant === 'icon') {
    return GoldEmblemSvg;
  }

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3.5 ${className}`}>
      {variant !== 'text-only' && GoldEmblemSvg}

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-sans ${textSizes[size].title}`}
            style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              letterSpacing: '0.08em'
            }}
          >
            NEXORA
          </span>
          <span
            className={`font-extrabold uppercase px-1.5 py-0.5 rounded font-mono text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm ${textSizes[size].sub}`}
          >
            LTD
          </span>
        </div>

        <span
          className={`font-bold text-amber-300/90 uppercase font-sans mt-0.5 ${textSizes[size].sub} ${textSizes[size].spacing}`}
          style={{ letterSpacing: '0.26em' }}
        >
          LIMITED
        </span>

        {showTagline && (
          <span className="text-[10px] text-slate-400 mt-0.5 truncate hidden sm:block">
            Founder Governance & Shariah Ventures
          </span>
        )}
      </div>
    </div>
  );
};
