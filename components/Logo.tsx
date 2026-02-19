
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'lg', isAlert?: boolean }> = ({ size = 'lg', isAlert = false }) => {
  const iconSize = size === 'lg' ? 'w-24 h-24' : 'w-10 h-10';
  const colorClass = isAlert ? 'text-red-500 animate-pulse' : 'text-cyan-500';

  return (
    <div className={`flex flex-col items-center justify-center ${colorClass}`}>
      <svg 
        className={iconSize}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      {size === 'lg' && (
        <span className="mt-2 font-bold text-xl tracking-widest uppercase">CyberShield AI</span>
      )}
    </div>
  );
};

export default Logo;
