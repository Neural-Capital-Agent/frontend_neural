import React from 'react';

const BackgroundCandles = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background pattern with adjusted opacity and size */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/candles.svg')",
          backgroundSize: "250px",      // Adjusted size for better density
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          opacity: 0.07                 // Adjusted opacity for better visibility
        }}
        aria-hidden="true"
      />
      
      {/* Content */}
      {children}
    </div>
  );
};

export default BackgroundCandles;