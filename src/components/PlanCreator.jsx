import React, { useState, useCallback } from "react";

const PlanCreator = () => {
  const [additionalGoal, setAdditionalGoal] = useState("");
  const [additionalStrategy, setAdditionalStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const url = new URL("http://localhost:8000/api/v1/llm/create-plan");
    url.searchParams.append("user_id", localStorage.getItem("userId")); 


    fetch(url.toString(), {
      method: "POST", // Changed to POST since we're using query parameters
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        "goal":{"additionalProp1": additionalGoal} ,
        "strategy":{"additionalProp1": additionalStrategy} })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // Handle the response data
      console.log("Quick Advice Response:", data);
      setResponse(data);
      setAdditionalGoal("");
      setAdditionalStrategy("");
    })
    .catch(error => {
      console.error("Error:", error);
      setError("Failed to get advice. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderInvestmentPlan = (data) => {
    if (!data || !data.investment_plan || !data.investment_plan.investment_plan) {
      return <p className="text-slate-300">No plan details available</p>;
    }

    const plan = data.investment_plan.investment_plan;
    const allocation = plan.asset_allocation || {};
    const milestones = plan.milestones || [];
    const risks = plan.risk_considerations || {};

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#F59E0B]/20 to-transparent p-3 rounded-lg border-l-4 border-[#F59E0B]">
          <div>
            <h3 className="text-xl font-bold text-white">Investment Plan Summary</h3>
            <p className="text-slate-300 text-sm">Personalized strategy based on your goals</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Created on</div>
            <div className="text-[#F59E0B] font-medium">{new Date(data.timestamp).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Monthly Contribution & Asset Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#232736] rounded-lg overflow-hidden">
            <div className="bg-[#2A2F3F] px-4 py-2 border-b border-[#3D4252]">
              <h4 className="text-white font-semibold">Monthly Contribution</h4>
            </div>
            <div className="p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F59E0B]">{formatCurrency(plan.monthly_contribution)}</div>
                <div className="text-slate-400 text-sm mt-1">Recommended monthly investment</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#232736] rounded-lg overflow-hidden">
            <div className="bg-[#2A2F3F] px-4 py-2 border-b border-[#3D4252]">
              <h4 className="text-white font-semibold">Asset Allocation</h4>
            </div>
            <div className="p-4">
              <div className="flex mb-4 justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className="flex flex-col space-y-3">
                {Object.entries(allocation).map(([asset, percentage]) => (
                  <div key={asset} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-white capitalize">{asset}</span>
                      <span className="text-[#F59E0B] font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[#1A1D29] rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          asset === 'stocks' ? 'bg-blue-500' : 
                          asset === 'bonds' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investment Milestones */}
        <div className="bg-[#232736] rounded-lg overflow-hidden">
          <div className="bg-[#2A2F3F] px-4 py-2 border-b border-[#3D4252]">
            <h4 className="text-white font-semibold">Investment Milestones</h4>
          </div>
          <div className="p-5">
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 h-full w-0.5 bg-[#3D4252]"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className="mb-6 relative last:mb-0">
                
                  <div className="text-[#F59E0B] font-semibold">{milestone.timeline}</div>
                  <div className="text-white mt-1">{milestone.checkpoint}</div>
                  {index < milestones.length - 1 && (
                    <div className="absolute -left-3 top-6 h-6 w-px border-l border-dashed border-[#3D4252]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>:
        </div>

        {/* Risk Considerations */}
        <div className="bg-[#232736] rounded-lg overflow-hidden">
          <div className="bg-[#2A2F3F] px-4 py-2 border-b border-[#3D4252]">
            <h4 className="text-white font-semibold">Risk Considerations</h4>
          </div>
          <div className="p-4 divide-y divide-[#3D4252]">
            {Object.entries(risks).map(([risk, description], index) => (
              <div key={risk} className={`py-3 ${index === 0 ? 'pt-0' : ''}`}>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B] mr-2"></div>
                  <h5 className="text-white font-medium capitalize">
                    {risk.replace(/_/g, ' ')}
                  </h5>
                </div>
                <p className="text-slate-300 text-sm pl-4">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1A1D29] rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-[#232736] p-5 border-b border-[#3D4252]">
        <h2 className="text-2xl font-bold text-white text-center">Create Your Investment Plan</h2>
        <p className="text-slate-300 text-center mt-1">Get a personalized investment strategy based on your financial goals</p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-[#232736] rounded-lg p-4">
            <label htmlFor="additionalGoal" className="block text-sm font-medium text-white mb-2">
              Your Financial Goals
            </label>
            <input
              id="additionalGoal"
              value={additionalGoal}
              onChange={(e) => setAdditionalGoal(e.target.value)}
              placeholder="Describe your financial goals (e.g., retirement, education, home purchase)"
              className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>
          
          <div className="bg-[#232736] rounded-lg p-4">
            <label htmlFor="additionalStrategy" className="block text-sm font-medium text-white mb-2">
              Your Investment Preferences
            </label>
            <input
              id="additionalStrategy"
              value={additionalStrategy}
              onChange={(e) => setAdditionalStrategy(e.target.value)}
              placeholder="Any specific investment preferences or strategies you'd like to include"
              className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
            <p className="text-slate-400 text-xs mt-2">Both fields are optional. Leave blank for a standard plan based on your profile.</p>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-xl font-bold transition duration-200 ${
              loading 
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Plan...
              </span>
            ) : "Create Investment Plan"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {response && (
          <div className="mt-6">
            {renderInvestmentPlan(response)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCreator;