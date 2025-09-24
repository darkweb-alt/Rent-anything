import React from 'react';
import Logo from '../icons/Logo';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-fade-in-zoom">
        <Logo className="w-80 h-auto" />
      </div>
    </div>
  );
};

export default SplashScreen;