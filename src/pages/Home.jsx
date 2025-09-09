import React from 'react';
import Chat from '../components/Chat';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-[2px] text-[#F3ECDC] mb-2">Welcome to Neural Broker</h1>
        <p className="text-lg text-[#9BA4B5]">
          Your AI-powered trading assistant. Ask anything about markets, stocks, or get investment advice.
        </p>
      </div>
      <Chat />
    </div>
  );
};

export default Home;