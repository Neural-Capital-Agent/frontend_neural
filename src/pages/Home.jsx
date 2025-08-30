import React from 'react';
import Chat from '../components/Chat';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Neural Broker</h1>
        <p className="text-lg text-gray-600">
          Your AI-powered trading assistant. Ask anything about markets, stocks, or get investment advice.
        </p>
      </div>
      <Chat />
    </div>
  );
};

export default Home;