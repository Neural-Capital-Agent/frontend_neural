import React, { useState } from 'react';
import apiService from '../services/api';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('user123');

  // Mock chat history
  const [chatHistory, setChatHistory] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      message: 'Hello! I\'m your Neural Broker AI assistant.',
      timestamp: '9:30 AM'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat
    const newUserMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory([...chatHistory, newUserMessage]);
    setMessage('');


    // Use the API service to parse the goal
    apiService.plannerAgent.parseGoal(message, userId)
      .then(data => {
        // Handle LLM response
        let responseMessage = "Sorry, I couldn't process that request.";

        if (data && Object.keys(data).length > 0) {
          // Format the structured data for display
          responseMessage = "I've analyzed your financial goal:\n\n";

          // Format the response object into a readable message
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'object') {
              responseMessage += `${key}: ${JSON.stringify(value, null, 2)}\n`;
            } else {
              responseMessage += `${key}: ${value}\n`;
            }
          });
        }

        const aiResponse = {
          id: chatHistory.length + 2,
          sender: 'ai',
          message: responseMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, aiResponse]);
      })
      .catch(error => {
        console.error("Error:", error);
        const errorResponse = {
          id: chatHistory.length + 2,
          sender: 'ai',
          message: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, errorResponse]);
      });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto p-6">
      <div className="bg-[#111726] rounded-t-xl border border-[#C87933]/30 shadow-lg p-5 flex flex-col relative">
        {/* Inner glow effect at the top */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-[#F3ECDC]/10 rounded-t-xl"></div>
        <div className="absolute inset-x-6 top-0 bottom-0 bg-gradient-to-b from-[#F3ECDC]/5 to-transparent h-12 rounded-t-xl pointer-events-none"></div>
        
        <div className="flex items-center mb-6 pb-4 border-b border-[#C87933]/20 relative z-10">
          <div className="h-10 w-10 rounded-lg bg-[#0A0F1C] border border-[#C87933]/40 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="Neural Broker Logo" className="h-10 w-10 object-cover" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-[#F3ECDC]">Neural Broker AI</h2>
            <p className="text-xs text-[#9BA4B5]">AI-powered trading assistant</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <button 
              className="bg-[#0A0F1C] hover:bg-[#171f2c] text-[#C87933] p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933]"
              aria-label="Payment options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className="bg-[#0A0F1C] hover:bg-[#171f2c] text-[#C87933] p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933]"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                chat.sender === 'user' 
                  ? 'bg-[#C87933] text-[#F3ECDC] rounded-tr-none' 
                  : 'bg-[#0A0F1C] text-[#F3ECDC] border border-[#C87933]/20 rounded-tl-none'
              }`}>
                <p className="text-sm">{chat.message}</p>
                <p className={`text-xs mt-1 ${
                  chat.sender === 'user' ? 'text-[#F3ECDC]/70' : 'text-[#9BA4B5]'
                }`}>{chat.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="bg-[#111726] rounded-b-xl shadow-lg p-4 border-t border-[#C87933]/10 border-x border-b border-[#C87933]/30 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about stocks, market trends, or trading advice..."
          className="flex-1 bg-[#0A0F1C] border border-[#C87933]/30 text-[#F3ECDC] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] placeholder-[#9BA4B5] text-sm transition-all"
        />
        <button 
          type="submit" 
          className="bg-gradient-to-r from-[#C87933] to-[#D98324] hover:shadow-copper text-[#F3ECDC] rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex items-center min-h-[44px]"
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;