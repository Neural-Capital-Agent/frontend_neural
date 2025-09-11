import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Profile & Goal
    primaryGoal: '',
    investmentHorizon: '',
    experienceLevel: '',
    taxWrapper: '',
    
    // Step 2 - Risk & Comfort
    riskTolerance: 3,
    maxDrawdown: 20,
    comfortableAssets: [],
    assetsToAvoid: [],
    
    // Step 3 - Funding Plan
    startingAmount: '',
    monthlyContribution: '',
    contributionDay: 1,
    dcaCadence: 'Monthly',
    budgetGuardrail: '',
    
    // Step 4 - Guardrails
    equityStopLoss: 15,
    equityTakeProfit: 30,
    portfolioDrawdownAlert: 10,
    rebalancing: 'Quarterly',
    
    // Step 5 - Savings & Auto-split
    createAutoSplit: false,
    splitRecipe: {
      corePortfolio: 60,
      tBills: 20,
      highYieldSavings: 20
    },
    autoPayToSavings: false,
    autoPayAmount: '',
    autoPayCadence: 'Monthly',
    
    // Step 6 - Compliance & Constraints
    stateOfResidence: '',
    marginAllowed: false,
    concentrationCap: 5,
    sectorCaps: [],
    consentToAutomation: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleMultiSelect = (item, arrayName) => {
    const currentArray = [...formData[arrayName]];
    
    if (currentArray.includes(item)) {
      // Remove item if already selected
      setFormData({
        ...formData,
        [arrayName]: currentArray.filter(i => i !== item)
      });
    } else {
      // Add item if not already selected
      setFormData({
        ...formData,
        [arrayName]: [...currentArray, item]
      });
    }
  };

  const handleSplitRecipeChange = (key, value) => {
    setFormData({
      ...formData,
      splitRecipe: {
        ...formData.splitRecipe,
        [key]: parseInt(value, 10) || 0
      }
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // Here we would normally submit the data, but we're keeping this visual-only
    navigate('/dashboard');
  };

  // Helper function to render multi-select buttons
  const renderMultiSelectButton = (label, value, arrayName) => {
    const isSelected = formData[arrayName].includes(value);
    return (
      <button
        type="button"
        onClick={() => handleMultiSelect(value, arrayName)}
        className={`px-4 py-2 rounded-md text-sm border transition-all ${
          isSelected 
            ? 'bg-[#C87933] text-[#F3ECDC] border-[#C87933]' 
            : 'bg-[#0A0F1C] text-[#F3ECDC]/80 border-[#C87933]/40 hover:border-[#C87933]/60'
        }`}
      >
        {label}
      </button>
    );
  };

  // Render Step 1 with improved visual hierarchy using card sections
  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-[#F3ECDC]">Step 1 — Profile & Goal</h3>
        
        <div className="space-y-5">
          {/* Primary Goal Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Primary Goal</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Grow long-term', 'Generate income', 'Preserve capital', 'Speculate', 'Custom'].map((goal) => (
                <label key={goal} className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${
                  formData.primaryGoal === goal 
                    ? 'bg-[#111726] border-[#C87933] shadow-sm' 
                    : 'bg-[#0A0F1C] border-[#C87933]/30 hover:border-[#C87933]/60'
                }`}>
                  <input
                    type="radio"
                    name="primaryGoal"
                    value={goal}
                    checked={formData.primaryGoal === goal}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    formData.primaryGoal === goal 
                      ? 'border-[#C87933] bg-[#C87933]' 
                      : 'border-[#9BA4B5]'
                  }`}>
                    {formData.primaryGoal === goal && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-[#F3ECDC]">{goal}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Investment Horizon Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Investment Horizon</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['≤1y', '1–3y', '3–5y', '5–10y', '10y+'].map((horizon) => (
                <label key={horizon} className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${
                  formData.investmentHorizon === horizon 
                    ? 'bg-[#111726] border-[#C87933] shadow-sm' 
                    : 'bg-[#0A0F1C] border-[#C87933]/30 hover:border-[#C87933]/60'
                }`}>
                  <input
                    type="radio"
                    name="investmentHorizon"
                    value={horizon}
                    checked={formData.investmentHorizon === horizon}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-[#F3ECDC]">{horizon}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Experience Level Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Experience Level</h4>
            <div className="grid grid-cols-3 gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <label key={level} className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${
                  formData.experienceLevel === level 
                    ? 'bg-[#111726] border-[#C87933] shadow-sm' 
                    : 'bg-[#0A0F1C] border-[#C87933]/30 hover:border-[#C87933]/60'
                }`}>
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    checked={formData.experienceLevel === level}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-[#F3ECDC]">{level}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Tax Wrapper Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Tax Wrapper</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['Taxable', 'IRA/401k', 'Roth', 'Other', 'Not sure'].map((wrapper) => (
                <label key={wrapper} className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${
                  formData.taxWrapper === wrapper 
                    ? 'bg-[#111726] border-[#C87933] shadow-sm' 
                    : 'bg-[#0A0F1C] border-[#C87933]/30 hover:border-[#C87933]/60'
                }`}>
                  <input
                    type="radio"
                    name="taxWrapper"
                    value={wrapper}
                    checked={formData.taxWrapper === wrapper}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-[#F3ECDC]">{wrapper}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Step 2 with improved visual hierarchy
  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-[#F3ECDC]">Step 2 — Risk & Comfort</h3>
        
        <div className="space-y-5">
          {/* Risk Tolerance Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Risk Tolerance</h4>
            <div className="space-y-2">
              <input
                type="range"
                name="riskTolerance"
                min="1"
                max="5"
                step="1"
                value={formData.riskTolerance}
                onChange={handleInputChange}
                className="w-full h-2 bg-[#0A0F1C] rounded-lg appearance-none cursor-pointer accent-[#C87933]"
              />
              <div className="flex justify-between text-xs text-[#9BA4B5]">
                <span>Conservative (1)</span>
                <span>Moderate (3)</span>
                <span>Aggressive (5)</span>
              </div>
            </div>
          </div>
          
          {/* Max Drawdown Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Maximum Acceptable Drawdown</h4>
            <div className="relative">
              <input
                type="number"
                name="maxDrawdown"
                value={formData.maxDrawdown}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-[#9BA4B5]">%</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#9BA4B5]">
              This is the maximum portfolio decline before you'd want intervention
            </p>
          </div>
          
          {/* Comfortable Assets Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Assets You're Comfortable With</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'US stocks', value: 'us_stocks' },
                { label: 'Intl stocks', value: 'intl_stocks' },
                { label: 'Treasuries', value: 'treasuries' },
                { label: 'IG Bonds', value: 'ig_bonds' },
                { label: 'HY Bonds', value: 'hy_bonds' },
                { label: 'T-Bills', value: 't_bills' },
                { label: 'Gold', value: 'gold' },
                { label: 'Bitcoin', value: 'btc' },
                { label: 'Ethereum', value: 'eth' },
                { label: 'REITs', value: 'reits' },
                { label: 'Cash', value: 'cash' }
              ].map((asset) => renderMultiSelectButton(asset.label, asset.value, 'comfortableAssets'))}
            </div>
          </div>
          
          {/* Assets to Avoid Section */}
          <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
            <h4 className="text-[#C87933] text-sm font-medium mb-3">Assets to Avoid/Exclude</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'ESG concerns', value: 'esg_concerns' },
                { label: 'Sin stocks', value: 'sin_stocks' },
                { label: 'Crypto', value: 'crypto' },
                { label: 'Tobacco', value: 'tobacco' },
                { label: 'Gambling', value: 'gambling' },
                { label: 'Weapons', value: 'weapons' },
                { label: 'Fossil fuels', value: 'fossil_fuels' }
              ].map((asset) => renderMultiSelectButton(asset.label, asset.value, 'assetsToAvoid'))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate step with improved visual hierarchy
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-[#F3ECDC]">Step 3 — Funding Plan</h3>
            
            <div className="space-y-5">
              {/* Starting Amount Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Starting Amount</h4>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-[#9BA4B5]">$</span>
                  </div>
                  <input
                    type="number"
                    id="startingAmount"
                    name="startingAmount"
                    value={formData.startingAmount}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                    placeholder="10,000"
                  />
                </div>
              </div>
              
              {/* Monthly Contribution Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Monthly Contribution</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="monthlyContribution" className="block text-sm text-[#F3ECDC]/90 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-[#9BA4B5]">$</span>
                      </div>
                      <input
                        type="number"
                        id="monthlyContribution"
                        name="monthlyContribution"
                        value={formData.monthlyContribution}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                        placeholder="500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="contributionDay" className="block text-sm text-[#F3ECDC]/90 mb-2">
                      Day of Month
                    </label>
                    <select
                      id="contributionDay"
                      name="contributionDay"
                      value={formData.contributionDay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                    >
                      {[...Array(28)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* DCA Cadence Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">DCA Cadence</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Weekly', 'Biweekly', 'Monthly', 'Off'].map((cadence) => (
                    <label key={cadence} className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${
                      formData.dcaCadence === cadence 
                        ? 'bg-[#111726] border-[#C87933] shadow-sm' 
                        : 'bg-[#0A0F1C] border-[#C87933]/30 hover:border-[#C87933]/60'
                    }`}>
                      <input
                        type="radio"
                        name="dcaCadence"
                        value={cadence}
                        checked={formData.dcaCadence === cadence}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-sm text-[#F3ECDC]">{cadence}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Budget Guardrail Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Budget Guardrail</h4>
                <p className="text-xs text-[#F3ECDC]/80 mb-3">
                  Pause DCA if cash falls below this amount
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-[#9BA4B5]">$</span>
                  </div>
                  <input
                    type="number"
                    id="budgetGuardrail"
                    name="budgetGuardrail"
                    value={formData.budgetGuardrail}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                    placeholder="1,000"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-[#F3ECDC]">Step 4 — Guardrails (Win/Loss)</h3>
            
            <div className="space-y-5">
              {/* Stop Loss Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Equity Stop-Loss</h4>
                <p className="text-xs text-[#F3ECDC]/80 mb-3">
                  Default percentage per position
                </p>
                <div className="relative">
                  <input
                    type="number"
                    id="equityStopLoss"
                    name="equityStopLoss"
                    value={formData.equityStopLoss}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-[#9BA4B5]">%</span>
                  </div>
                </div>
              </div>
              
              {/* Take Profit Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Equity Take-Profit</h4>
                <p className="text-xs text-[#F3ECDC]/80 mb-3">
                  Default percentage per position
                </p>
                <div className="relative">
                  <input
                    type="number"
                    id="equityTakeProfit"
                    name="equityTakeProfit"
                    value={formData.equityTakeProfit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-[#9BA4B5]">%</span>
                  </div>
                </div>
              </div>
              
              {/* Portfolio Drawdown Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Portfolio Drawdown Alert</h4>
                <div className="relative">
                  <input
                    type="number"
                    id="portfolioDrawdownAlert"
                    name="portfolioDrawdownAlert"
                    value={formData.portfolioDrawdownAlert}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-[#9BA4B5]">%</span>
                  </div>
                </div>
              </div>
              
              {/* Rebalancing Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Rebalancing</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Quarterly', 'Semiannual', 'Threshold-based (±5%)', 'Off'].map((option) => (
                    <label key={option} className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${
                      formData.rebalancing === option 
                        ? 'bg-[#111726] border-[#C87933] shadow-sm' 
                        : 'bg-[#0A0F1C] border-[#C87933]/30 hover:border-[#C87933]/60'
                    }`}>
                      <input
                        type="radio"
                        name="rebalancing"
                        value={option}
                        checked={formData.rebalancing === option}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-sm text-[#F3ECDC]">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-[#F3ECDC]">Step 5 — Savings & Auto-split</h3>
            
            <div className="space-y-5">
              {/* Auto-Split Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <div className="flex items-center">
                  <input
                    id="createAutoSplit"
                    name="createAutoSplit"
                    type="checkbox"
                    checked={formData.createAutoSplit}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#C87933] border-[#C87933]/50 rounded focus:ring-[#C87933]"
                  />
                  <label htmlFor="createAutoSplit" className="ml-2 block text-[#C87933] text-sm font-medium">
                    Create Auto-Split for incoming deposits?
                  </label>
                </div>
                
                {formData.createAutoSplit && (
                  <div className="mt-4 pl-6 border-l-2 border-[#C87933]/30 space-y-4">
                    <h4 className="text-[#F3ECDC] text-sm font-medium mb-3">Split Recipe</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-sm text-[#F3ECDC]/80 w-40">Core Portfolio:</span>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={formData.splitRecipe.corePortfolio}
                            onChange={(e) => handleSplitRecipeChange('corePortfolio', e.target.value)}
                            className="w-full px-4 py-2 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-[#9BA4B5]">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-[#F3ECDC]/80 w-40">T-Bills (cash bucket):</span>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={formData.splitRecipe.tBills}
                            onChange={(e) => handleSplitRecipeChange('tBills', e.target.value)}
                            className="w-full px-4 py-2 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-[#9BA4B5]">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-[#F3ECDC]/80 w-40">High-yield savings:</span>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={formData.splitRecipe.highYieldSavings}
                            onChange={(e) => handleSplitRecipeChange('highYieldSavings', e.target.value)}
                            className="w-full px-4 py-2 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-[#9BA4B5]">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-[#F3ECDC]/60">
                        Total: {formData.splitRecipe.corePortfolio + formData.splitRecipe.tBills + formData.splitRecipe.highYieldSavings}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Auto-Pay Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <div className="flex items-center">
                  <input
                    id="autoPayToSavings"
                    name="autoPayToSavings"
                    type="checkbox"
                    checked={formData.autoPayToSavings}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#C87933] border-[#C87933]/50 rounded focus:ring-[#C87933]"
                  />
                  <label htmlFor="autoPayToSavings" className="ml-2 block text-[#C87933] text-sm font-medium">
                    Auto-pay to savings or T-Bill ladder?
                  </label>
                </div>
                
                {formData.autoPayToSavings && (
                  <div className="mt-4 pl-6 border-l-2 border-[#C87933]/30 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="autoPayAmount" className="block text-sm text-[#F3ECDC]/90 mb-2">
                          Amount
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-[#9BA4B5]">$</span>
                          </div>
                          <input
                            type="number"
                            id="autoPayAmount"
                            name="autoPayAmount"
                            value={formData.autoPayAmount}
                            onChange={handleInputChange}
                            className="w-full pl-8 pr-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                            placeholder="100"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="autoPayCadence" className="block text-sm text-[#F3ECDC]/90 mb-2">
                          Cadence
                        </label>
                        <select
                          id="autoPayCadence"
                          name="autoPayCadence"
                          value={formData.autoPayCadence}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Biweekly">Biweekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-[#F3ECDC]">Step 6 — Compliance & Constraints</h3>
            
            <div className="space-y-5">
              {/* State of Residence Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">State of Residence</h4>
                <p className="text-xs text-[#F3ECDC]/80 mb-3">
                  For tax hints (non-KYC)
                </p>
                <select
                  id="stateOfResidence"
                  name="stateOfResidence"
                  value={formData.stateOfResidence}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                >
                  <option value="">Select state</option>
                  {[
                    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
                    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
                    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
                    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
                    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
                  ].map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              {/* Trading Options Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Trading Options</h4>
                <div className="flex items-center mb-4">
                  <input
                    id="marginAllowed"
                    name="marginAllowed"
                    type="checkbox"
                    checked={formData.marginAllowed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#C87933] border-[#C87933]/50 rounded focus:ring-[#C87933]"
                  />
                  <label htmlFor="marginAllowed" className="ml-2 block text-sm text-[#F3ECDC]/90">
                    Margin allowed? (Default: No)
                  </label>
                </div>
                
                <div>
                  <label htmlFor="concentrationCap" className="block text-sm text-[#F3ECDC]/90 mb-2">
                    Concentration cap per single stock (max %)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="concentrationCap"
                      name="concentrationCap"
                      value={formData.concentrationCap}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933]"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-[#9BA4B5]">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sectors to Cap Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Sectors to Cap</h4>
                <p className="text-xs text-[#F3ECDC]/80 mb-3">
                  Select sectors and add cap percentage
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Technology', value: 'technology' },
                    { label: 'Financials', value: 'financials' },
                    { label: 'Healthcare', value: 'healthcare' },
                    { label: 'Consumer Discretionary', value: 'consumer_disc' },
                    { label: 'Industrials', value: 'industrials' },
                    { label: 'Energy', value: 'energy' }
                  ].map((sector) => renderMultiSelectButton(sector.label, sector.value, 'sectorCaps'))}
                </div>
              </div>
              
              {/* Consent Section */}
              <div className="bg-[#0A0F1C]/60 border border-[#C87933]/20 rounded-lg p-4">
                <h4 className="text-[#C87933] text-sm font-medium mb-3">Consent</h4>
                <div className="flex items-center">
                  <input
                    id="consentToAutomation"
                    name="consentToAutomation"
                    type="checkbox"
                    checked={formData.consentToAutomation}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#C87933] border-[#C87933]/50 rounded focus:ring-[#C87933]"
                  />
                  <label htmlFor="consentToAutomation" className="ml-2 block text-sm text-[#F3ECDC]/90">
                    I consent to automation rules controlling my portfolio
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render the progress steps indicator with improved labels and highlighting
  const renderProgressSteps = () => {
  const steps = [
    { number: 1, label: "Profile" },
    { number: 2, label: "Risk" },
    { number: 3, label: "Funding" },
    { number: 4, label: "Guardrails" },
    { number: 5, label: "Savings" },
    { number: 6, label: "Compliance" }
  ];

  // Clamp just in case
  const idx = Math.min(Math.max(currentStep, 1), steps.length);
  const pct = ((idx - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step) => {
          const isActive = idx === step.number;
          const isCompleted = idx > step.number;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                isActive
                  ? 'border-[#C87933] bg-[#C87933] text-white shadow-[0_0_6px_rgba(200,121,51,0.5)]'
                  : isCompleted
                    ? 'border-[#C87933] bg-[#C87933]/20 text-[#C87933]'
                    : 'border-[#9BA4B5] text-[#9BA4B5]'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{step.number}</span>
                )}
              </div>
              <span className={`text-xs mt-2 ${
                isActive ? 'text-[#C87933] font-bold'
                         : isCompleted ? 'text-[#F3ECDC]'
                                       : 'text-[#9BA4B5]'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative mt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-[#0A0F1C]">
          <div
            style={{ width: `${pct}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#C87933] to-[#D98324] transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

  // helpers
const requiredFilled = (...vals) =>
  vals.every(v => (Array.isArray(v) ? v.length > 0 : String(v ?? '').trim() !== ''));

const canProceed = (step, data) => {
  if (step === 1)
    return requiredFilled(data.primaryGoal, data.investmentHorizon, data.experienceLevel, data.taxWrapper);
  if (step === 2)
    return data.riskTolerance >= 1 && data.riskTolerance <= 5 &&
           data.maxDrawdown >= 0 && data.maxDrawdown <= 100;
  if (step === 3)
    return Number(data.startingAmount ?? 0) >= 0 &&
           Number(data.monthlyContribution ?? 0) >= 0 &&
           Number(data.budgetGuardrail ?? 0) >= 0;
  if (step === 4)
    return [data.equityStopLoss, data.equityTakeProfit, data.portfolioDrawdownAlert]
      .every(p => p >= 0 && p <= 100);
  if (step === 5) {
    if (!data.createAutoSplit) return true;
    const total = (data.splitRecipe.corePortfolio || 0) +
                  (data.splitRecipe.tBills || 0) +
                  (data.splitRecipe.highYieldSavings || 0);
    return total === 100;
  }
  if (step === 999) return data.consentToAutomation === true;
  return true;
};
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {renderProgressSteps()}
      
      <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
         <div className="sticky bottom-0 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 bg-[#111726]/95 border-t border-[#C87933]/20 px-6 sm:px-8 py-4 flex justify-between">
           <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 text-sm rounded-md transition-all ${
                currentStep === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/50 hover:border-[#C87933]'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed(currentStep, formData)}
                className={`px-6 py-3 text-sm font-semibold rounded-md transition-all ${
                  !canProceed(currentStep, formData)
                    ? 'bg-[#30384c] text-[#9BA4B5] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C87933] to-[#D98324] text-[#F3ECDC] hover:shadow-[0_0_2px_2px_rgba(203,121,51,0.35)]'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canProceed(999, formData)} // final gate
                className={`px-6 py-3 text-sm font-semibold rounded-md transition-all ${
                  !canProceed(999, formData)
                    ? 'bg-[#30384c] text-[#9BA4B5] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C87933] to-[#D98324] text-[#F3ECDC] hover:shadow-[0_0_2px_2px_rgba(203,121,51,0.35)]'
                }`}
              >
                Complete Setup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;
