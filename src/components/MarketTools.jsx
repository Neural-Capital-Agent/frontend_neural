import React, { useState } from 'react';
import QuickAdvice from './QuickAnalisis';
import PlanCreator from './PlanCreator';

const MarketTools = () => {
  const [activeCard, setActiveCard] = useState(null);

  // Tool cards data
  const tools = [
    {
      id: 'quick-advice',
      title: 'Quick Advice',
      description: 'Get instant insights and recommendations for your investments',
      component: <QuickAdvice />
    },
    {
      id: 'create-a-plan',
      title: 'Plan Creator',
      description: 'Comprehensive market analysis with charts and trends',
      component: <PlanCreator />
    },
    {
      id: 'portfolio-advisory',
      title: 'Portfolio Advisory',
      description: 'Personalized portfolio recommendations based on your financial goals',
      component: <PortfolioAdvisoryComponent />
    },
    {
      id: 'stock-screener',
      title: 'Stock Screener',
      description: 'Find investment opportunities with customizable screening criteria',
      component: <StockScreenerComponent />
    },
    {
      id: 'investment-advisor',
      title: 'AI Investment Advisor',
      description: 'Get personalized investment advice powered by AI',
      component: <AIAdvisorComponent />
    },
    {
      id: 'market-news',
      title: 'Market News',
      description: 'Latest financial news and updates filtered for relevance',
      component: <MarketNewsComponent />
    },
    {
      id: 'calculator',
      title: 'Financial Calculators',
      description: 'Tools for calculating investment returns, loan payments, and more',
      component: <FinancialCalculatorsComponent />
    }
  ];

  const handleCardClick = (cardId) => {
    // If clicking the active card, close it
    if (activeCard === cardId) {
      setActiveCard(null);
    } else {
      setActiveCard(cardId);
    }
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-3">
        {activeCard === null ? (
          tools.map(tool => (
            <div key={tool.id} className="flex flex-col">
              <div 
                className="bg-[#1A1D29] rounded-md shadow-md p-3 cursor-pointer transition-all duration-300 aspect-square flex flex-col justify-between hover:shadow-sm hover:shadow-[#F59E0B]/10"
                onClick={() => handleCardClick(tool.id)}
              >
                <h3 className="text-base font-semibold text-white">{tool.title}</h3>
                <p className="text-slate-300 text-xs flex-grow mt-1 line-clamp-3">{tool.description}</p>
                <div className="mt-1 flex justify-center">
                  <span className="text-[#F59E0B] text-xs font-medium bg-[#10131C] px-2 py-0.5 rounded-md">
                    Open
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show only the active card and its content
          <>
            <div className="col-span-full mb-2">
              <button 
                onClick={() => setActiveCard(null)}
                className="text-[#F59E0B] hover:underline bg-[#1A1D29] px-2 py-1 rounded-md text-xs"
              >
                Back to all tools
              </button>
            </div>
            
            {tools.filter(tool => tool.id === activeCard).map(tool => (
              <div key={tool.id} className="col-span-full animate-fadeIn">
                <div className="bg-[#1A1D29] rounded-md shadow-md p-3 mb-2 ring-1 ring-[#F59E0B] shadow-[#F59E0B]/20">
                  <h3 className="text-lg font-semibold text-white mb-1 text-center">{tool.title}</h3>
                  <p className="text-slate-300 text-center max-w-2xl mx-auto text-xs">{tool.description}</p>
                </div>
                
                <div className="bg-[#10131C] border border-[#2D3348] rounded-md p-3 shadow-md animate-fadeIn">
                  {tool.component}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// Placeholder components for each tool
const MarketAnalysisComponent = () => (
  <div>
    <h4 className="text-xl font-semibold text-white mb-4">Market Analysis</h4>
    <div className="flex flex-col space-y-4">
      <div className="bg-[#1A1D29] p-4 rounded-lg">
        <h5 className="text-[#F59E0B] font-medium mb-2">Major Indices</h5>
        <div className="flex justify-between items-center">
          <span className="text-white">S&P 500</span>
          <span className="text-green-500">+1.2%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">NASDAQ</span>
          <span className="text-green-500">+0.8%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">DOW</span>
          <span className="text-red-500">-0.3%</span>
        </div>
      </div>
      <button className="bg-[#F59E0B] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#F59E0B]/90 transition">
        Run Detailed Analysis
      </button>
    </div>
  </div>
);

const PortfolioAdvisoryComponent = () => (
  <div>
    <h4 className="text-xl font-semibold text-white mb-4">Portfolio Advisory</h4>
    <div className="mb-4">
      <label className="block text-slate-300 mb-2">Your Financial Goal</label>
      <textarea 
        className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" 
        placeholder="Describe your investment goals (e.g., retirement in 20 years, saving for a house in 5 years)"
        rows={3}
      />
    </div>
    <div className="mb-4">
      <label className="block text-slate-300 mb-2">Risk Tolerance</label>
      <select className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
        <option value="1">Low Risk</option>
        <option value="2">Moderate-Low Risk</option>
        <option value="3">Moderate Risk</option>
        <option value="4">Moderate-High Risk</option>
        <option value="5">High Risk</option>
      </select>
    </div>
    <button className="bg-[#F59E0B] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#F59E0B]/90 transition">
      Get Portfolio Advice
    </button>
  </div>
);

const StockScreenerComponent = () => (
  <div>
    <h4 className="text-xl font-semibold text-white mb-4">Stock Screener</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-slate-300 mb-2">Sector</label>
        <select className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
          <option value="">All Sectors</option>
          <option value="tech">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Financial</option>
          <option value="consumer">Consumer Goods</option>
          <option value="energy">Energy</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-300 mb-2">Market Cap</label>
        <select className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
          <option value="">Any</option>
          <option value="large">Large Cap ($10B)</option>
          <option value="mid">Mid Cap ($2B-$10B)</option>
          <option value="small">Small Cap ($300M-$2B)</option>
        </select>
      </div>
    </div>
    <button className="bg-[#F59E0B] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#F59E0B]/90 transition">
      Run Screener
    </button>
  </div>
);

const AIAdvisorComponent = () => (
  <div>
    <h4 className="text-xl font-semibold text-white mb-4">AI Investment Advisor</h4>
    <div className="mb-4">
      <label className="block text-slate-300 mb-2">Ask a Question</label>
      <textarea 
        className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" 
        placeholder="E.g., Should I invest in tech stocks given the current market conditions?"
        rows={3}
      />
    </div>
    <button className="bg-[#F59E0B] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#F59E0B]/90 transition">
      Get AI Advice
    </button>
  </div>
);

const MarketNewsComponent = () => (
  <div>
    <h4 className="text-xl font-semibold text-white mb-4">Market News</h4>
    <div className="space-y-4">
      {[1, 2, 3].map(item => (
        <div key={item} className="bg-[#1A1D29] p-4 rounded-lg">
          <h5 className="text-[#F59E0B] font-medium mb-1">Fed Announces New Interest Rate Policy</h5>
          <p className="text-slate-300 text-sm mb-2">The Federal Reserve today announced changes to its approach on inflation targeting...</p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Financial Times</span>
            <span className="text-slate-400">2 hours ago</span>
          </div>
        </div>
      ))}
    </div>
    <button className="mt-4 bg-[#F59E0B] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#F59E0B]/90 transition">
      View All News
    </button>
  </div>
);

const FinancialCalculatorsComponent = () => (
  <div>
    <h4 className="text-xl font-semibold text-white mb-4">Financial Calculators</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button className="bg-[#1A1D29] hover:bg-[#1A1D29]/80 text-white p-4 rounded-lg transition">
        Compound Interest Calculator
      </button>
      <button className="bg-[#1A1D29] hover:bg-[#1A1D29]/80 text-white p-4 rounded-lg transition">
        Mortgage Calculator
      </button>
      <button className="bg-[#1A1D29] hover:bg-[#1A1D29]/80 text-white p-4 rounded-lg transition">
        Retirement Planner
      </button>
      <button className="bg-[#1A1D29] hover:bg-[#1A1D29]/80 text-white p-4 rounded-lg transition">
        Investment Returns Calculator
      </button>
    </div>
  </div>
);

export default MarketTools;