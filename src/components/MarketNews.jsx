import React, { useState, useEffect } from 'react';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive news pool - expanded with recent market headlines
  const newsPool = [
    // Central Bank & Monetary Policy
    {
      id: 1,
      title: "Fed Cuts Interest Rates By 25bps; New Policy Direction Expected",
      summary: "The Federal Reserve today announced a 25 basis point rate cut with signals of continued policy adjustments amid market volatility.",
      source: "Economic Times",
      category: "monetary-policy",
      time: "2 hours ago",
      url: "#"
    },
    {
      id: 2,
      title: "ECB Pauses Rate Cuts As Disinflation Ends",
      summary: "European Central Bank maintains current rates as inflation shows signs of stabilization across eurozone economies.",
      source: "Financial Times",
      category: "monetary-policy",
      time: "3 hours ago",
      url: "#"
    },
    {
      id: 3,
      title: "Federal Reserve Calibrates Interest Rate Policy Amid Market Volatility",
      summary: "Fed officials emphasize data-dependent approach as markets experience increased volatility following recent economic indicators.",
      source: "US Bank",
      category: "monetary-policy",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 4,
      title: "US Tariffs Fuel Inflation Talks, ECB Weighs New Moves",
      summary: "Rising tariff concerns prompt inflation discussions as European Central Bank considers additional policy measures.",
      source: "Deloitte Economic Outlook",
      category: "monetary-policy",
      time: "5 hours ago",
      url: "#"
    },
    {
      id: 5,
      title: "Mortgage Rates Respond Mildly To Fed Cut, Not Expected To Fall Further",
      summary: "Housing market sees limited response to rate cut as mortgage rates remain elevated despite Federal Reserve action.",
      source: "PBS NewsHour",
      category: "monetary-policy",
      time: "6 hours ago",
      url: "#"
    },

    // US and India Market Indices
    {
      id: 6,
      title: "Indian Equities Extend Third Week of Gains Despite FII Outflows",
      summary: "Nifty and Sensex continue upward momentum for third consecutive week even as foreign institutional investors reduce positions.",
      source: "Economic Times",
      category: "indices",
      time: "1 hour ago",
      url: "#"
    },
    {
      id: 7,
      title: "Nifty & Sensex Rally, Key Reversal Dates Flagged For Short-Term Trades",
      summary: "Technical analysts highlight crucial reversal dates for Nifty as markets show strong momentum in recent sessions.",
      source: "Economic Times",
      category: "indices",
      time: "2 hours ago",
      url: "#"
    },
    {
      id: 8,
      title: "Bank Nifty, IT Stocks Face Downside Risk Citing H-1B Fee Shock",
      summary: "Banking and IT sectors under pressure following proposed $100,000 H-1B visa fee affecting tech industry outlook.",
      source: "Good Returns",
      category: "indices",
      time: "3 hours ago",
      url: "#"
    },
    {
      id: 9,
      title: "Sensex Falls Post Recent Rally; Adani Stocks Defy Market Slump",
      summary: "Market correction follows strong rally as Adani group stocks show resilience against broader market decline.",
      source: "The Hindu Business Line",
      category: "indices",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 10,
      title: "Nifty Above 25,400, Sensex At 83,000; IT & Pharma Stocks Surge After Fed Move",
      summary: "Indian markets reach new highs with IT and pharmaceutical sectors leading gains following Federal Reserve policy decision.",
      source: "Economic Times",
      category: "indices",
      time: "5 hours ago",
      url: "#"
    },
    {
      id: 11,
      title: "Nifty Climbs 91 Points; BSE Sensex Up By 313",
      summary: "Strong buying interest drives major indices higher with broad-based gains across sectors.",
      source: "The Hindu Business Line",
      category: "indices",
      time: "6 hours ago",
      url: "#"
    },

    // Commodities & Sector Performance
    {
      id: 12,
      title: "Oil Prices Surge Amid Supply Chain Disruptions In Major Regions",
      summary: "Crude oil futures jump 5% following pipeline disruptions in key producing regions, raising energy cost concerns.",
      source: "Reuters",
      category: "commodities",
      time: "2 hours ago",
      url: "#"
    },
    {
      id: 13,
      title: "Agricultural Merchant Louis Dreyfus Posts Volume Rise, Lower Profits",
      summary: "Global agricultural trader reports increased trading volumes but reduced profitability amid market volatility.",
      source: "Reuters",
      category: "commodities",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 14,
      title: "Meat Prices Jump 13.9% in August Due to Labor Shortages",
      summary: "Food commodity prices surge as labor shortages continue to impact meat processing industry nationwide.",
      source: "Deloitte Economic Outlook",
      category: "commodities",
      time: "6 hours ago",
      url: "#"
    },
    {
      id: 15,
      title: "Durable Goods Prices Up 1.9% On Asian Tariffs",
      summary: "Manufacturing sector costs rise as new tariff policies impact imported materials and finished goods pricing.",
      source: "Deloitte Economic Outlook",
      category: "commodities",
      time: "8 hours ago",
      url: "#"
    },
    {
      id: 16,
      title: "Clean Energy Stocks Rally After New Govt Incentives Announced",
      summary: "Renewable energy companies surge following announcement of expanded tax credits and infrastructure investments.",
      source: "Reuters",
      category: "energy",
      time: "3 hours ago",
      url: "#"
    },

    // Corporate & Business Developments
    {
      id: 17,
      title: "JPMorgan Chase Hires Senior Bankers For Consumer, Retail Units",
      summary: "Major investment bank expands consumer and retail divisions with key senior appointments amid market expansion.",
      source: "Reuters",
      category: "corporate",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 18,
      title: "Monte dei Paschi Secures Key Ownership In Mediobanca",
      summary: "Italian banking sector sees major consolidation move as Monte dei Paschi increases stake in Mediobanca.",
      source: "Reuters",
      category: "corporate",
      time: "5 hours ago",
      url: "#"
    },
    {
      id: 19,
      title: "Generali & BPCE Scrap €50M Break-Up Fee In Asset Deal",
      summary: "European insurance and banking giants eliminate break-up fee in major asset management transaction.",
      source: "Reuters",
      category: "corporate",
      time: "6 hours ago",
      url: "#"
    },
    {
      id: 20,
      title: "Goldman Names Ben Snider As New US Equity Chief Strategist",
      summary: "Goldman Sachs appoints new leadership for US equity strategy amid changing market dynamics.",
      source: "Reuters",
      category: "corporate",
      time: "7 hours ago",
      url: "#"
    },
    {
      id: 21,
      title: "Credit Agricole, Deutsche Bank, Rothschild Eye Banco BPM Merger",
      summary: "European banking sector consolidation continues as major institutions explore merger opportunities.",
      source: "Reuters",
      category: "corporate",
      time: "8 hours ago",
      url: "#"
    },

    // Global Trends & Economy
    {
      id: 22,
      title: "US Housing Shares Shine As Fed Restarts Rate Cuts",
      summary: "Real estate and construction stocks rally as Federal Reserve begins new rate cutting cycle.",
      source: "Reuters",
      category: "economy",
      time: "3 hours ago",
      url: "#"
    },
    {
      id: 23,
      title: "Russia's VTB Bank Plans $1B Share Issue",
      summary: "Major Russian bank announces significant capital raising amid evolving economic conditions.",
      source: "Reuters",
      category: "economy",
      time: "5 hours ago",
      url: "#"
    },
    {
      id: 24,
      title: "Job Openings Rate Rises In Construction, Transport, Food",
      summary: "Labor market shows strength in key sectors as unemployment patterns shift across industries.",
      source: "Deloitte Economic Outlook",
      category: "economy",
      time: "6 hours ago",
      url: "#"
    },
    {
      id: 25,
      title: "Global Supply Chain Issues Impact Quarterly Guidance For Big Cos",
      summary: "Fortune 500 companies adjust earnings guidance as supply chain bottlenecks persist across sectors.",
      source: "Reuters",
      category: "supply-chain",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 26,
      title: "Japan-US Investment Deal Sets New Standard For Economic Partnerships",
      summary: "Bilateral investment agreement establishes framework for enhanced economic cooperation between nations.",
      source: "Deloitte Economic Outlook",
      category: "economy",
      time: "7 hours ago",
      url: "#"
    },
    {
      id: 27,
      title: "Unemployment Rises In Manufacturing, Government, Services",
      summary: "Labor market data shows sectoral variations as employment patterns adjust to economic changes.",
      source: "Deloitte Economic Outlook",
      category: "economy",
      time: "8 hours ago",
      url: "#"
    },

    // Banking & Regulatory
    {
      id: 28,
      title: "Anil Ambani, Ex-Yes Bank CEO Charged In Alleged Loan Fraud",
      summary: "Regulatory authorities file charges in high-profile banking fraud case involving prominent business figures.",
      source: "Reuters",
      category: "banking",
      time: "5 hours ago",
      url: "#"
    },
    {
      id: 29,
      title: "Trump To Impose $100,000 Fee For H-1B Visas, Impacting Tech Sector",
      summary: "Proposed immigration policy changes create uncertainty for technology companies relying on skilled foreign workers.",
      source: "CFO Economic Times",
      category: "regulatory",
      time: "2 hours ago",
      url: "#"
    },
    {
      id: 30,
      title: "India Loses Chabahar Port Exemption As US Returns Sanctions",
      summary: "Geopolitical tensions affect trade routes as US policy changes impact regional economic relationships.",
      source: "Money Control",
      category: "regulatory",
      time: "6 hours ago",
      url: "#"
    },

    // Cryptocurrency & Emerging Markets
    {
      id: 31,
      title: "Cryptocurrency Market Recovers Following Regulatory Clarity",
      summary: "Bitcoin and major altcoins post significant gains as institutional investors renew interest following clear regulations.",
      source: "Reuters",
      category: "crypto",
      time: "3 hours ago",
      url: "#"
    },
    {
      id: 32,
      title: "FII Outflows Cross ₹10,962 Crore in India For September",
      summary: "Foreign institutional investors continue reducing positions in Indian markets amid global uncertainty.",
      source: "Economic Times",
      category: "indices",
      time: "4 hours ago",
      url: "#"
    },
    {
      id: 33,
      title: "Market Futures Price Aggressive Fed Easing Into Year-End",
      summary: "Derivatives markets indicate expectations for continued Federal Reserve accommodation through fourth quarter.",
      source: "Deloitte Economic Outlook",
      category: "monetary-policy",
      time: "5 hours ago",
      url: "#"
    }
  ];

  // Function to randomly select news items
  const getRandomNews = (count = 8) => {
    const shuffled = [...newsPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((item, index) => ({
      ...item,
      id: index + 1, // Reassign IDs to avoid conflicts
    }));
  };

  const categories = [
    { id: 'all', name: 'All News', count: news.length },
    { id: 'monetary-policy', name: 'Monetary Policy', count: news.filter(n => n.category === 'monetary-policy').length },
    { id: 'indices', name: 'Market Indices', count: news.filter(n => n.category === 'indices').length },
    { id: 'commodities', name: 'Commodities', count: news.filter(n => n.category === 'commodities').length },
    { id: 'corporate', name: 'Corporate', count: news.filter(n => n.category === 'corporate').length },
    { id: 'economy', name: 'Economy', count: news.filter(n => n.category === 'economy').length },
    { id: 'energy', name: 'Energy', count: news.filter(n => n.category === 'energy').length },
    { id: 'crypto', name: 'Cryptocurrency', count: news.filter(n => n.category === 'crypto').length }
  ];

  useEffect(() => {
    // Simulate API call and get random news
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews(getRandomNews(8)); // Get 8 random news items
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
    // Simulate refresh with new random news
    await new Promise(resolve => setTimeout(resolve, 800));
    setNews(getRandomNews(8)); // Get 8 new random news items
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