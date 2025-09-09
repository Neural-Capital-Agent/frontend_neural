 
import React from 'react';

const BackgroundCandles = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `
          radial-gradient(900px 600px at 75% 0%, rgba(200,121,51,0.12), rgba(10,15,28,0) 50%),
          linear-gradient(180deg, #0A0F1C 0%, #0B1326 100%)
        `
      }}
    >
      {/* Background candlestick pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "url('/trading-pattern.svg')",
          backgroundSize: "300px"
        }}
      />
      {children}
    </div>
  );
};

export default BackgroundCandles;