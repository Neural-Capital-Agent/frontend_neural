import React from 'react';

const Background = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none bg-[url('/assets/candles.svg')] bg-center bg-repeat opacity-[0.08]"
      aria-hidden="true"
    />
  );
};

export default Background;
