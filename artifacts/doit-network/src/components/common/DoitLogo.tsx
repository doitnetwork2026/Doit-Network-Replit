import React from 'react';
import logoSrc from '../../assets/images/doit_logo.svg';

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
      <img
        src={logoSrc}
        alt="Doit Network"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default DoitLogo;
