import React, { useState, useCallback, useEffect } from "react";

const PlanCreator = () => {
  const [additionalGoal, setAdditionalGoal] = useState("");
  const [additionalStrategy, setAdditionalStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [existingPlans, setExistingPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const userId = localStorage.getItem("userId") || "anonymous_user";

    try {
      const url = new URL("http://localhost:8000/api/v1/plan-creator/create-comprehensive-plan");
      url.searchParams.append("user_id", userId);

      // Only add if not empty
      if (additionalGoal && additionalGoal.trim()) {
        url.searchParams.append("financial_goals", additionalGoal.trim());
      }
      if (additionalStrategy && additionalStrategy.trim()) {
        url.searchParams.append("investment_preferences", additionalStrategy.trim());
      }

      console.log("Making API call to:", url.toString());

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", errorData);
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log("Plan Creation Response:", data);
      setResponse(data);
      setAdditionalGoal("");
      setAdditionalStrategy("");

      // Refresh the plans list to include the new plan
      await fetchExistingPlans();

      // Show the create form if we had existing plans
      if (existingPlans.length === 0) {
        setShowCreateForm(false);
      }

    } catch (error) {
      console.error("Error creating plan:", error);
      setError(`Failed to create plan: ${error.message}. Please check the console for details.`);
    } finally {
      setLoading(false);
    }
  }, [additionalGoal, additionalStrategy]);

  // Fetch existing plans for the user
  const fetchExistingPlans = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoadingPlans(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/plan-creator/plans/${userId}?active_only=true`);

      if (response.ok) {
        const data = await response.json();
        setExistingPlans(data.plans || []);
      } else {
        console.warn("Failed to fetch existing plans:", response.status);
        setExistingPlans([]);
      }
    } catch (error) {
      console.warn("Error fetching existing plans:", error);
      setExistingPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  // Load existing plans on component mount
  useEffect(() => {
    fetchExistingPlans();
  }, [fetchExistingPlans]);

  // Fetch detailed plan data
  const fetchPlanDetails = useCallback(async (planId) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching plan details for ID:", planId);
      const response = await fetch(`http://localhost:8000/api/v1/plan-creator/plan/${planId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch plan details: ${response.status}`);
      }

      const data = await response.json();
      console.log("Plan details response:", data);

      // Check different possible data structures and normalize for display
      let planData = null;

      if (data.plan && data.plan.plan_data) {
        planData = data.plan.plan_data;
      } else if (data.plan_data) {
        planData = data.plan_data;
      } else if (data.plan) {
        planData = data.plan;
      } else if (data.investment_plan) {
        planData = data;
      } else {
        console.warn("Plan data structure:", data);
        throw new Error("Could not find plan data in response");
      }

      // Ensure the data structure matches what renderInvestmentPlan expects
      // It expects: data.investment_plan.investment_plan
      let normalizedData = planData;

      if (planData && planData.investment_plan && planData.investment_plan.investment_plan) {
        // Already in correct format
        normalizedData = planData;
      } else if (planData && planData.investment_plan) {
        // Need to wrap in another investment_plan layer
        normalizedData = {
          investment_plan: {
            investment_plan: planData.investment_plan
          }
        };
      } else if (planData && (planData.monthly_contribution || planData.asset_allocation)) {
        // Raw investment plan data - need to double wrap
        normalizedData = {
          investment_plan: {
            investment_plan: planData
          }
        };
      } else {
        // Try to use the whole data object
        normalizedData = planData;
      }

      console.log("Original plan data:", planData);
      console.log("Normalized plan data:", normalizedData);
      setResponse(normalizedData);

    } catch (error) {
      console.error("Error fetching plan details:", error);
      setError(`Failed to load plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderInvestmentPlan = (data) => {
    console.log("Rendering investment plan with data:", data);

    if (!data) {
      return <p className="text-slate-300">No plan data available</p>;
    }

    // Try to find the plan data in different possible structures
    let plan = null;

    if (data.investment_plan && data.investment_plan.investment_plan) {
      plan = data.investment_plan.investment_plan;
    } else if (data.investment_plan) {
      plan = data.investment_plan;
    } else if (data.monthly_contribution || data.asset_allocation) {
      plan = data; // Data is already the plan
    } else {
      console.warn("Could not find plan structure in:", data);
      return <p className="text-slate-300">Plan data format not recognized</p>;
    }
    const allocation = plan.asset_allocation || {};
    const milestones = plan.milestones || [];
    const risks = plan.risk_considerations || {};

    // Calculate normalized percentages and USD amounts
    const calculateAllocation = (allocation, targetAmount = 100000) => {
      const entries = Object.entries(allocation);
      if (entries.length === 0) return [];

      // Calculate total percentage to normalize
      const totalPercentage = entries.reduce((sum, [_, percentage]) => sum + (percentage || 0), 0);

      // If total is 0, return empty
      if (totalPercentage === 0) return [];

      // Normalize percentages to add up to 100%
      const normalizedEntries = entries.map(([asset, percentage]) => {
        const normalizedPercentage = (percentage / totalPercentage) * 100;
        const usdAmount = (normalizedPercentage / 100) * targetAmount;

        return {
          asset: asset,
          percentage: normalizedPercentage,
          usdAmount: usdAmount,
          originalPercentage: percentage
        };
      });

      return normalizedEntries;
    };

    // Try to get target amount from different possible locations
    const getTargetAmount = (data, plan) => {
      // Check various possible locations for target amount
      if (data.user_input && data.user_input.target_amount) {
        return data.user_input.target_amount;
      }
      if (data.target_amount) {
        return data.target_amount;
      }
      if (plan.target_amount) {
        return plan.target_amount;
      }
      if (plan.monthly_contribution) {
        // Estimate based on monthly contribution (assume 10 years)
        return plan.monthly_contribution * 12 * 10;
      }
      // Default fallback
      return 100000;
    };

    const targetAmount = getTargetAmount(data, plan);
    const allocationData = calculateAllocation(allocation, targetAmount);

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
              <div className="text-xs text-slate-400 mt-1">
                Target Portfolio: {formatCurrency(targetAmount)}
              </div>
            </div>
            <div className="p-4">
              {allocationData.length > 0 ? (
                <>
                  <div className="flex mb-4 justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {allocationData.map((item) => (
                      <div key={item.asset} className="flex flex-col">
                        <div className="flex justify-between mb-2">
                          <span className="text-white capitalize font-medium">{item.asset}</span>
                          <div className="text-right">
                            <div className="text-[#F59E0B] font-medium">
                              {item.percentage.toFixed(1)}%
                            </div>
                            <div className="text-slate-400 text-xs">
                              {formatCurrency(item.usdAmount)}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-[#1A1D29] rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              item.asset === 'stocks' ? 'bg-blue-500' :
                              item.asset === 'bonds' ? 'bg-green-500' :
                              item.asset === 'alternatives' ? 'bg-purple-500' :
                              item.asset === 'cash' ? 'bg-gray-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total verification */}
                  <div className="mt-4 pt-3 border-t border-[#3D4252]">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Allocation:</span>
                      <div className="text-right">
                        <div className="text-white font-medium">100.0%</div>
                        <div className="text-slate-400 text-xs">
                          {formatCurrency(targetAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400">No allocation data available</p>
                </div>
              )}
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
        <h2 className="text-2xl font-bold text-white text-center">
          {existingPlans.length > 0 ? "Your Investment Plans" : "Create Your Investment Plan"}
        </h2>
        <p className="text-slate-300 text-center mt-1">
          {existingPlans.length > 0
            ? "View your existing plans or create a new one"
            : "Get a personalized investment strategy based on your financial goals"
          }
        </p>
      </div>

      <div className="p-6">
        {loadingPlans ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-[#F59E0B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-white">Loading plans...</span>
          </div>
        ) : existingPlans.length > 0 && !showCreateForm ? (
          <div className="space-y-4">
            {/* Existing Plans Display */}
            <div className="bg-[#232736] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Your Existing Plans</h3>
              <div className="space-y-3">
                {existingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-[#1A1D29] rounded-lg p-4 border border-[#3D4252] hover:border-[#F59E0B] transition-colors cursor-pointer"
                    onClick={() => {
                      console.log("Clicked on plan:", plan.id, plan);
                      fetchPlanDetails(plan.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">
                          {plan.plan_name || `${plan.plan_type || 'Investment'} Plan`}
                        </h4>
                        <p className="text-slate-400 text-sm mt-1">
                          {plan.plan_type || 'General'} • {formatCurrency(plan.target_amount || 0)}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          Created: {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {plan.is_favorite && (
                          <span className="text-yellow-500 text-sm">⭐</span>
                        )}
                        <svg className="w-4 h-4 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Plan Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-3 px-6 rounded-xl font-bold bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90 transition duration-200"
            >
              Create New Plan
            </button>
          </div>
        ) : (
          <>
            {/* Back Button (if showing create form and have existing plans) */}
            {existingPlans.length > 0 && showCreateForm && (
              <button
                onClick={() => setShowCreateForm(false)}
                className="mb-4 flex items-center text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Plans
              </button>
            )}

            {/* Create Plan Form */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default PlanCreator;