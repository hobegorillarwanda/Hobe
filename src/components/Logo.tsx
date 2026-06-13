/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  hasBackground?: boolean;
  className?: string;
}

export default function Logo({ size = 48, className, ...props }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 400 400" 
      width={size} 
      height={size}
      className={className}
      {...props}
    >
      <g>
        {/* 1. FLIGHT TRAIL & AIRPLANE SILHOUETTE (Left side) */}
        {/* Flight path curve */}
        <path 
          d="M 40 280 C 40 220, 60 170, 110 150 C 130 142, 145 158, 155 170" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeDasharray="2 6"
          className="text-forest-400"
        />
        {/* Airplane */}
        <g transform="translate(42, 230) rotate(-55) scale(0.95)">
          <path 
            d="M 0 -15 L 3 -5 L 18 2 L 18 5 L 3 3 L 0 10 L 6 14 L 6 16 L -2 15 Q -4 15.5 -10 16 L -6 14 L 0 10 L -3 3 L -18 5 L -18 2 L -3 2 Z" 
            fill="currentColor"
            className="text-forest-650"
          />
        </g>

        {/* 2. THE MOUNTAINS & RIVER (Bottom circular basin) */}
        {/* Mountain background circle frame segment */}
        <path 
          d="M 50 280 A 150 150 0 0 0 350 280 C 352 320, 310 365, 270 375 A 150 150 0 0 1 130 375 Q 85 355, 50 280 Z" 
          fill="currentColor" 
          className="text-forest-900"
        />
        {/* Left mountain peak */}
        <path 
          d="M 50 280 L 120 225 L 170 285 L 210 235 L 240 270 L 200 320 L 50 280 Z" 
          fill="currentColor" 
          className="text-forest-750"
        />
        {/* Right mountain peak */}
        <path 
          d="M 350 280 L 285 220 L 235 280 L 205 240 L 175 270 L 210 320 L 350 280 Z" 
          fill="currentColor" 
          className="text-forest-800"
        />
        {/* Highlight detail on peaks */}
        <path 
          d="M 120 225 L 140 250 L 125 254 L 150 275 L 120 275 Z" 
          fill="currentColor" 
          className="text-forest-400 opacity-40"
        />
        <path 
          d="M 285 220 L 265 245 L 280 250 L 255 270 L 285 270 Z" 
          fill="currentColor" 
          className="text-forest-400 opacity-40"
        />

        {/* Winding River */}
        <path 
          d="M 198 252 C 185 268, 215 285, 185 308 C 158 330, 215 350, 192 376 H 218 C 235 350, 182 330, 210 308 C 238 285, 212 268, 203 252 Z" 
          fill="#a9ca94"
        />

        {/* 3. STYLIZED MOUNTAIN GORILLA IN THE CENTER (Majestic Roaring/Yelling Head) */}
        {/* Head general shape/hood */}
        <path 
          d="M 125 185 C 115 130, 135 30, 200 30 C 265 30, 285 130, 275 185 C 270 205, 260 215, 250 220 L 255 230 C 238 240, 218 236, 200 236 C 182 236, 162 240, 145 230 L 150 220 C 140 215, 130 205, 125 185 Z" 
          fill="currentColor" 
          className="text-forest-850"
        />
        {/* Inner face mask definition - contrast green */}
        <path 
          d="M 148 165 C 144 135, 161 85, 200 85 C 239 85, 256 135, 252 165 C 249 185, 241 195, 200 195 C 159 195, 151 185, 148 165 Z" 
          fill="currentColor" 
          className="text-forest-750"
        />
        {/* Dynamic aggressive blocky eyebrow core */}
        <path 
          d="M 160 112 L 200 122 L 240 112 L 230 125 L 200 129 L 170 125 Z" 
          fill="currentColor" 
          className="text-forest-900"
        />
        {/* Expressive angry/furious eye slits */}
        {/* Left eye */}
        <polygon points="168,124 182,128 180,132 166,128" fill="#dfcfab" />
        {/* Right eye */}
        <polygon points="232,124 218,128 220,132 234,128" fill="#dfcfab" />

        {/* Cheek definition and wrinkles */}
        <path d="M 155 142 Q 170 149, 175 162 M 245 142 Q 230 149, 225 162" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-forest-900" />

        {/* Gorilla nose core */}
        <path 
          d="M 188 139 Q 200 131, 212 139 Q 200 146, 188 139 Z" 
          fill="currentColor" 
          className="text-forest-950"
        />
        {/* Nostril details */}
        <circle cx="194" cy="142" r="2.5" fill="currentColor" className="text-forest-900" />
        <circle cx="206" cy="142" r="2.5" fill="currentColor" className="text-forest-900" />

        {/* Aggressive roaring mouth / jaws outline */}
        <path 
          d="M 168 159 C 168 154, 232 154, 232 159 C 232 174, 224 214, 200 214 C 176 214, 168 174, 168 159 Z" 
          fill="currentColor" 
          className="text-forest-950"
        />
        
        {/* Top teeth block and fangs */}
        {/* Left fang */}
        <polygon points="172,158 178,158 176,169" fill="#fbfaf7" />
        {/* Right fang */}
        <polygon points="228,158 222,158 224,169" fill="#fbfaf7" />
        {/* Middle teeth */}
        <rect x="183" y="157" width="5" height="4" rx="1" fill="#fbfaf7" />
        <rect x="191" y="157" width="5" height="4" rx="1" fill="#fbfaf7" />
        <rect x="199" y="157" width="5" height="4" rx="1" fill="#fbfaf7" />
        <rect x="207" y="157" width="5" height="4" rx="1" fill="#fbfaf7" />
        <rect x="215" y="157" width="5" height="4" rx="1" fill="#fbfaf7" />

        {/* Lower teeth block and fangs */}
        {/* Bottom Left fang */}
        <polygon points="177,192 181,192 179,183" fill="#fbfaf7" />
        {/* Bottom Right fang */}
        <polygon points="223,192 219,192 221,183" fill="#fbfaf7" />
        {/* Bottom teeth */}
        <rect x="184" y="189" width="4" height="4" rx="1" fill="#fbfaf7" />
        <rect x="191" y="189" width="4" height="4" rx="1" fill="#fbfaf7" />
        <rect x="198" y="189" width="4" height="4" rx="1" fill="#fbfaf7" />
        <rect x="205" y="189" width="4" height="4" rx="1" fill="#fbfaf7" />
        <rect x="212" y="189" width="4" height="4" rx="1" fill="#fbfaf7" />

        {/* Aggressive red tongue/throat interior depth */}
        <path 
          d="M 184 176 Q 200 168, 216 176 Q 200 186, 184 176 Z" 
          fill="#e06666"
        />

        {/* Chin line */}
        <path d="M 175 224 Q 200 229, 225 224" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-forest-900" />
      </g>
    </svg>
  );
}
