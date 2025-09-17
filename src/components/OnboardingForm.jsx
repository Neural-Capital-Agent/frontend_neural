import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'ai',
      message: "Welcome to Neural Broker! I'm here to help you set up your personalized investment profile. Let's start with your primary investment goal.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'multiple_choice',
      field: 'primaryGoal',
      options: ['Grow long-term', 'Generate income', 'Preserve capital', 'Speculate', 'Custom']
    }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
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

  const questions = [
    {
      id: 1,
      message: "What's your primary investment goal?",
      type: 'multiple_choice',
      field: 'primaryGoal',
      options: ['Grow long-term', 'Generate income', 'Preserve capital', 'Speculate', 'Custom']
    },
    {
      id: 2,
      message: "What's your investment time horizon?",
      type: 'multiple_choice',
      field: 'investmentHorizon',
      options: ['≤1y', '1–3y', '3–5y', '5–10y', '10y+']
    },
    {
      id: 3,
      message: "What's your experience level with investing?",
      type: 'multiple_choice',
      field: 'experienceLevel',
      options: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      id: 4,
      message: "What tax wrapper will you be using?",
      type: 'multiple_choice',
      field: 'taxWrapper',
      options: ['Taxable', 'IRA/401k', 'Roth', 'Other', 'Not sure']
    },
    {
      id: 5,
      message: "On a scale of 1-5, what's your risk tolerance? (1=Conservative, 5=Aggressive)",
      type: 'number_input',
      field: 'riskTolerance',
      min: 1,
      max: 5
    },
    {
      id: 6,
      message: "What's the maximum portfolio drawdown you're comfortable with? (in %)",
      type: 'number_input',
      field: 'maxDrawdown',
      min: 0,
      max: 100
    },
    {
      id: 7,
      message: "Which assets are you comfortable investing in? (Select all that apply)",
      type: 'multi_select',
      field: 'comfortableAssets',
      options: [
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
      ]
    },
    {
      id: 8,
      message: "Are there any assets you'd like to avoid? (Select all that apply)",
      type: 'multi_select',
      field: 'assetsToAvoid',
      options: [
        { label: 'ESG concerns', value: 'esg_concerns' },
        { label: 'Sin stocks', value: 'sin_stocks' },
        { label: 'Crypto', value: 'crypto' },
        { label: 'Tobacco', value: 'tobacco' },
        { label: 'Gambling', value: 'gambling' },
        { label: 'Weapons', value: 'weapons' },
        { label: 'Fossil fuels', value: 'fossil_fuels' }
      ]
    },
    {
      id: 9,
      message: "What's your starting investment amount?",
      type: 'currency_input',
      field: 'startingAmount'
    },
    {
      id: 10,
      message: "What's your monthly contribution amount?",
      type: 'currency_input',
      field: 'monthlyContribution'
    },
    {
      id: 11,
      message: "What's your preferred DCA cadence?",
      type: 'multiple_choice',
      field: 'dcaCadence',
      options: ['Weekly', 'Biweekly', 'Monthly', 'Off']
    },
    {
      id: 12,
      message: "What's your budget guardrail amount? (Minimum cash to keep)",
      type: 'currency_input',
      field: 'budgetGuardrail'
    },
    {
      id: 13,
      message: "What's your default stop-loss percentage per position?",
      type: 'percentage_input',
      field: 'equityStopLoss'
    },
    {
      id: 14,
      message: "What's your default take-profit percentage per position?",
      type: 'percentage_input',
      field: 'equityTakeProfit'
    },
    {
      id: 15,
      message: "At what portfolio drawdown percentage should I alert you?",
      type: 'percentage_input',
      field: 'portfolioDrawdownAlert'
    },
    {
      id: 16,
      message: "How often would you like to rebalance your portfolio?",
      type: 'multiple_choice',
      field: 'rebalancing',
      options: ['Quarterly', 'Semiannual', 'Threshold-based (±5%)', 'Off']
    },
    {
      id: 17,
      message: "Would you like to create an auto-split for incoming deposits?",
      type: 'yes_no',
      field: 'createAutoSplit'
    },
    {
      id: 18,
      message: "Would you like to set up auto-pay to savings or T-Bill ladder?",
      type: 'yes_no',
      field: 'autoPayToSavings'
    },
    {
      id: 19,
      message: "What's your state of residence? (For tax optimization hints)",
      type: 'state_select',
      field: 'stateOfResidence'
    },
    {
      id: 20,
      message: "What's your maximum concentration cap per single stock?",
      type: 'percentage_input',
      field: 'concentrationCap'
    },
    {
      id: 21,
      message: "Do you consent to automation rules controlling your portfolio?",
      type: 'consent',
      field: 'consentToAutomation',
      options: ['yes', 'no']
    }
  ];

  const handleUserResponse = (response) => {
    const currentQ = questions[currentQuestion];
    let newFormData = { ...formData };

    // Handle different response types
    if (currentQ.type === 'multiple_choice' || currentQ.type === 'yes_no') {
      newFormData[currentQ.field] = response;
    } else if (currentQ.type === 'number_input' || currentQ.type === 'currency_input' || currentQ.type === 'percentage_input') {
      newFormData[currentQ.field] = parseFloat(response) || response;
    } else if (currentQ.type === 'multi_select') {
      if (Array.isArray(response)) {
        newFormData[currentQ.field] = response;
      } else {
        // Toggle selection
        const currentSelections = newFormData[currentQ.field] || [];
        const isSelected = currentSelections.includes(response);
        if (isSelected) {
          newFormData[currentQ.field] = currentSelections.filter(item => item !== response);
        } else {
          newFormData[currentQ.field] = [...currentSelections, response];
        }
      }
    } else if (currentQ.type === 'state_select') {
      newFormData[currentQ.field] = response;
    } else if (currentQ.type === 'consent') {
      newFormData[currentQ.field] = response === 'yes';
    }

    setFormData(newFormData);

    // Add user response to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'response'
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Move to next question or complete
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        const nextQ = questions[currentQuestion + 1];
        const aiMessage = {
          id: chatHistory.length + 2,
          sender: 'ai',
          message: nextQ.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: nextQ.type,
          field: nextQ.field,
          options: nextQ.options,
          min: nextQ.min,
          max: nextQ.max
        };
        setChatHistory([ aiMessage]);
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Complete onboarding
      setTimeout(() => {
        const completionMessage = {
          id: chatHistory.length + 2,
          sender: 'ai',
          message: "Perfect! I've collected all your investment preferences. Let me create your personalized portfolio strategy.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'completion'
        };
        setChatHistory(prev => [...prev, completionMessage]);

        // Submit form data
        handleSubmit(newFormData);
      }, 1000);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // Navigate to dashboard or next step
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderChatMessage = (message) => {
    
    const isAI = message.sender === 'ai';

    return (
      <div key={message.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-[80%] rounded-lg p-4 ${
          isAI
            ? 'bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/20'
            : 'bg-[#C87933] text-[#F3ECDC]'
        }`}>
          <p className="text-sm mb-2">{message.message} </p>

          {/* Render options for AI questions */}
          {isAI && message.type === 'multiple_choice' && message.options && (
            console.log('hola'),
            <div className="flex flex-wrap gap-2 mt-3">
              {message.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleUserResponse(option)}
                  className="px-3 py-2 bg-[#C87933]/20 hover:bg-[#C87933]/40 text-[#F3ECDC] text-xs rounded-md transition-colors border border-[#C87933]/30"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {isAI && message.type === 'yes_no' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleUserResponse('yes')}
                className="px-4 py-2 bg-[#C87933]/20 hover:bg-[#C87933]/40 text-[#F3ECDC] text-sm rounded-md transition-colors border border-[#C87933]/30"
              >
                Yes
              </button>
              <button
                onClick={() => handleUserResponse('no')}
                className="px-4 py-2 bg-[#C87933]/20 hover:bg-[#C87933]/40 text-[#F3ECDC] text-sm rounded-md transition-colors border border-[#C87933]/30"
              >
                No
              </button>
            </div>
          )}

          {isAI && message.type === 'consent' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleUserResponse('yes')}
                className="px-4 py-2 bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] text-sm rounded-md transition-colors"
              >
                I Consent
              </button>
              <button
                onClick={() => handleUserResponse('no')}
                className="px-4 py-2 bg-[#0A0F1C] hover:bg-[#0A0F1C]/80 text-[#F3ECDC] text-sm rounded-md transition-colors border border-[#C87933]/30"
              >
                Decline
              </button>
            </div>
          )}

          {isAI && (message.type === 'number_input' || message.type === 'currency_input' || message.type === 'percentage_input') && (
            <div className="mt-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  min={message.min}
                  max={message.max}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim() !== '') {
                      handleUserResponse(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#111726] text-[#F3ECDC] border border-[#C87933]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C87933]/50 text-sm"
                  placeholder={message.type === 'currency_input' ? '$0' : message.type === 'percentage_input' ? '0%' : 'Enter value'}
                />
                <button onClick={() => {
                  const input = document.querySelector('input[type="number"]');
                  if (input && input.value.trim() !== '') {
                    handleUserResponse(input.value.trim());
                    input.value = '';
                  }
                }} className="px-4 py-2 bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] text-sm rounded-md transition-colors whitespace-nowrap">
                  Continue
                </button>
              </div>
              
            </div>
          )}

          {isAI && message.type === 'multi_select' && message.options && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.options.map((option) => {
                const isSelected = formData[message.field]?.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleUserResponse(option.value)}
                    className={`px-3 py-2 text-xs rounded-md transition-colors border ${
                      isSelected
                        ? 'bg-[#C87933] text-[#F3ECDC] border-[#C87933]'
                        : 'bg-[#C87933]/20 text-[#F3ECDC] border-[#C87933]/30 hover:bg-[#C87933]/40'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
              {formData[message.field]?.length > 0 && (
                <button
                  onClick={() => handleUserResponse('continue')}
                  className="px-4 py-2 bg-[#C87933] text-[#F3ECDC] text-sm rounded-md transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {isAI && message.type === 'state_select' && (
            <div className="mt-3">
              <select
                onChange={(e) => handleUserResponse(e.target.value)}
                className="w-full px-3 py-2 bg-[#111726] text-[#F3ECDC] border border-[#C87933]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-</button>[#C87933]/50 text-sm"
              >
                <option value="">Select your state</option>
                {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
                  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
                  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
                  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
                  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          )}

          <p className={`text-xs mt-2 ${isAI ? 'text-[#9BA4B5]' : 'text-[#F3ECDC]/70'}`}>
            {message.timestamp}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto p-6">
      <div className="bg-[#111726] rounded-t-xl border border-[#C87933]/30 shadow-lg p-5 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center mb-6 pb-4 border-b border-[#C87933]/20 relative z-10">
          <div className="h-10 w-10 rounded-lg bg-[#0A0F1C] border border-[#C87933]/40 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="Neural Broker Logo" className="h-10 w-10 object-cover" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-[#F3ECDC]">Investment Setup Assistant</h2>
            <p className="text-xs text-[#9BA4B5]">Let's personalize your portfolio</p>
          </div>
          <div className="ml-auto text-sm text-[#9BA4B5]">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
          {chatHistory.map(renderChatMessage)}
        </div>
      </div>
      {/* Input Area */}
      <div className="bg-[#111726] rounded-b-xl border border-t-0 border-[#C87933]/30 shadow-lg p-5">
  
      </div>


      {/* Progress Bar */}
      <div className="bg-[#111726] border-x border-b border-[#C87933]/30 px-6 py-4">
        <div className="w-full bg-[#0A0F1C] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#C87933] to-[#D98324] h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-[#9BA4B5] mt-2 text-center">
          {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
        </p>
      </div>
      </div>
  );
};

export default OnboardingForm;

