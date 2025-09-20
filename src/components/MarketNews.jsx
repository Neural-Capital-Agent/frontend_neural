import React, { useState, useEffect } from 'react';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data - replace with actual API call
  const mockNews = [
    {
      id: 1,
      title: "Fed Announces New Interest Rate Policy Changes",
      summary: "The Federal Reserve today announced significant changes to its approach on inflation targeting, with implications for mortgage rates and consumer spending.",
      source: "Financial Times",
      category: "monetary-policy",
      time: "2 hours ago",
      url: "#"
    },
    {
      id: 2,
      title: "Tech Stocks Rally on Strong Earnings Reports",
      summary: "Major technology companies exceeded quarterly expectations, driving a broad rally in the sector with NASDAQ up 3.2% in after-hours trading.",
      source: "Reuters",
      category: "earnings",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 3,
      title: "Oil Prices Surge Amid Supply Chain Disruptions",
      summary: "Crude oil futures jumped 5% following reports of pipeline disruptions in key producing regions, raising concerns about energy costs.",
      source: "Bloomberg",
      category: "commodities",
      time: "6 hours ago",
      url: "#"
    },
    {
      id: 4,
      title: "Cryptocurrency Market Shows Signs of Recovery",
      summary: "Bitcoin and major altcoins posted significant gains as institutional investors renewed interest following regulatory clarity announcements.",
      source: "CoinDesk",
      category: "crypto",
      time: "8 hours ago",
      url: "#"
    },
    {
      id: 5,
      title: "Global Supply Chain Issues Continue to Impact Markets",
      summary: "Manufacturing delays and shipping bottlenecks persist, affecting quarterly guidance for several Fortune 500 companies.",
      source: "Wall Street Journal",
      category: "supply-chain",
      time: "12 hours ago",
      url: "#"
    },
    {
      id: 6,
      title: "Renewable Energy Stocks Gain on New Government Incentives",
      summary: "Clean energy companies surged following announcement of expanded tax credits and infrastructure investments in the renewable sector.",
      source: "CNBC",
      category: "energy",
      time: "1 day ago",
      url: "#"
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: mockNews.length },
    { id: 'monetary-policy', name: 'Monetary Policy', count: mockNews.filter(n => n.category === 'monetary-policy').length },
    { id: 'earnings', name: 'Earnings', count: mockNews.filter(n => n.category === 'earnings').length },
    { id: 'commodities', name: 'Commodities', count: mockNews.filter(n => n.category === 'commodities').length },
    { id: 'crypto', name: 'Cryptocurrency', count: mockNews.filter(n => n.category === 'crypto').length },
    { id: 'energy', name: 'Energy', count: mockNews.filter(n => n.category === 'energy').length }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews(mockNews);
      } catch (err) {
        setError('Failed to fetch market news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const refreshNews = async () => {
    setLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#C87933] border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="text-[#9BA4B5]">Loading market news...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#F3ECDC] mb-2">Market News</h3>
          <p className="text-[#9BA4B5]">
            Stay updated with the latest financial news and market developments
          </p>
        </div>
        
        <button
          onClick={refreshNews}
          disabled={loading}
          className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#C87933] text-[#F3ECDC]'
                  : 'bg-[#111726] text-[#9BA4B5] hover:text-[#F3ECDC] border border-[#C87933]/30'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-[#9BA4B5] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-[#9BA4B5]">No news found for the selected category</p>
          </div>
        ) : (
          filteredNews.map(article => (
            <div key={article.id} className="bg-[#111726] rounded-lg border border-[#C87933]/30 p-6 hover:border-[#C87933]/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[#F3ECDC] mb-2 hover:text-[#C87933] cursor-pointer transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-[#9BA4B5] mb-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-[#C87933] font-medium">{article.source}</span>
                  <span className="text-[#9BA4B5]">{article.time}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-[#C87933]/20 text-[#C87933] rounded text-xs font-medium">
                    {categories.find(c => c.id === article.category)?.name || 'General'}
                  </span>
                  
                  <button className="text-[#9BA4B5] hover:text-[#F3ECDC] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show More Button */}
      {filteredNews.length > 0 && (
        <div className="mt-8 text-center">
          <button className="bg-[#111726] hover:bg-[#111726]/80 text-[#F3ECDC] font-medium py-3 px-8 rounded-lg border border-[#C87933]/30 transition-colors">
            Load More News
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketNews;