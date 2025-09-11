import React from 'react';

const DashboardHeader = ({ userName = 'Investor' }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold welcome-header">
        Welcome to Neural Broker, {userName}
      </h1>
      <p className="welcome-subheader">
        Your AI-powered portfolio management platform
      </p>
    </div>
  );
};

export default DashboardHeader;
