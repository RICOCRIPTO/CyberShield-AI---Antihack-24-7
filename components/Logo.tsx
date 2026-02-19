import React from 'react';

interface LogoProps {
  size: 'sm' | 'lg';
  isAlert: boolean;
}

const Logo: React.FC<LogoProps> = ({ size, isAlert }) => {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-24 h-24';
  return (
    <div className={`${sizeClass} ${isAlert ? 'text-red-500' : 'text-cyan-500'}`}>
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7v8c0 5 10 7 10 7s10-2 10-7V7l-10-5z"/>
      </svg>
    </div>
  );
};

export default Logo;
