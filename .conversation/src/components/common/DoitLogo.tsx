import React from 'react';

interface DoitLogoProps {
  className?: string;
  size?: number | string;
  rounded?: string;
  border?: boolean;
}

export const DoitLogo: React.FC<DoitLogoProps> = ({
  className = 'w-8 h-8',
  rounded = 'rounded-xl',
  border = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 bg-black select-none ${rounded} ${
        border ? 'border border-zinc-800 shadow-2xs' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        <g fill="#FFFFFF">
          {/* Left vertical leg of N */}
          <rect x="75" y="90" width="35" height="210" />
          
          {/* Top horizontal bar of D */}
          <rect x="75" y="90" width="145" height="35" />
          
          {/* Bottom horizontal bar of D */}
          <rect x="75" y="265" width="145" height="35" />
          
          {/* D curved bowl */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="
              M 220 90 
              C 285 90 305 135 305 195 
              C 305 255 285 300 220 300 
              H 200 
              V 265 
              H 220 
              C 260 265 270 235 270 195 
              C 270 155 260 125 220 125 
              H 200 
              V 90 
              H 220 
              Z
            "
          />
          
          {/* Continuous diagonal stroke of N */}
          <polygon points="105,90 148,90 320,315 320,355 275,355 75,140 75,100" />
          
          {/* Right vertical leg of N with chamfer foot */}
          <polygon points="320,90 355,90 355,350 320,315" />
        </g>
      </svg>
    </div>
  );
};

export default DoitLogo;
