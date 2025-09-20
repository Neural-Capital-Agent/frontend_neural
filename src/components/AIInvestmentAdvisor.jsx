import React, { useState } from 'react';
import { useCrewAI } from '../hooks/useAgents';

const AIInvestmentAdvisor = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crewAI = useCrewAI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Use the existing quickAdvice method for general investment advice
      const result = await crewAI.quickAdvice(question.trim());
      setResponse(result);
    } catch (err) {
      console.error('AI Investment Advisor error:', err);
      setError(err.message || 'Failed to get investment advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#F3ECDC] mb-2">AI Investment Advisor</h3>
        <p className="text-[#9BA4B5]">
          Get personalized investment advice powered by advanced AI. Ask any question about investments, market conditions, or trading strategies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#F3ECDC] mb-2 font-medium">Ask a Question</label>
          <textarea 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-4 bg-[#0A0F1C] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#C87933] resize-none" 
            placeholder="E.g., Should I invest in tech stocks given the current market conditions? What's your take on dividend investing for retirement planning?"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button 
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-[#C87933] hover:bg-[#C87933]/80 disabled:bg-[#C87933]/50 text-[#F3ECDC] font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#F3ECDC] border-t-transparent rounded-full animate-spin mr-2"></div>
                Getting Advice...
              </>
            ) : (
              'Get AI Advice'
            )}
          </button>

          {(response || error) && (
            <button 
              type="button"
              onClick={handleClear}
              className="bg-[#111726] hover:bg-[#111726]/80 text-[#F3ECDC] font-medium py-3 px-6 rounded-lg border border-[#C87933]/30 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 font-medium">Error</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 p-6 bg-[#0A0F1C] border border-[#C87933]/30 rounded-lg">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-[#C87933] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h4 className="text-lg font-bold text-[#F3ECDC]">AI Investment Advice</h4>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div className="text-[#F3ECDC] whitespace-pre-wrap leading-relaxed">
              {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
            </div>
          </div>
        </div>
      )}

      {/* Quick Question Examples */}
      {!response && !loading && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Example Questions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "What are the best investment strategies for beginners?",
              "Should I diversify my portfolio internationally?",
              "How do I evaluate a company's financial health?",
              "What's the difference between growth and value investing?",
              "How much should I allocate to bonds vs stocks?",
              "What are the risks of investing in cryptocurrency?"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setQuestion(example)}
                className="text-left p-3 bg-[#111726] hover:bg-[#111726]/80 border border-[#C87933]/20 hover:border-[#C87933]/40 rounded-lg transition-colors text-[#9BA4B5] hover:text-[#F3ECDC] text-sm"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInvestmentAdvisor;