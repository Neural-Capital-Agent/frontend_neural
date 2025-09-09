import React from 'react';

const LoginBackground = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/assets/login-background.jpg')" }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"
      />
    </div>
  );
};

export default LoginBackground;
