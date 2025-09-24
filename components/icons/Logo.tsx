import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 250 50" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rent Anything Logo"
    >
      <text 
        x="0" 
        y="35" 
        fontFamily="Poppins, sans-serif" 
        fontSize="32" 
        fontWeight="600"
        letterSpacing="0.5"
      >
        <tspan fill="#4A5568">Rent</tspan>
        <tspan fill="#DC2626">Anything</tspan>
      </text>
    </svg>
  );
};

export default Logo;
