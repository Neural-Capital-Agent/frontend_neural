import React, { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');
  
  // Mock chat history
  const [chatHistory, setChatHistory] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      message: 'Hello! I\'m your Neural Broker AI assistant. How can I help you with your trading today?',
      timestamp: '9:30 AM'
    },
    {
      id: 2,
      sender: 'user',
      message: 'Can you tell me about the current market trends?',
      timestamp: '9:31 AM'
    },
    {
      id: 3,
      sender: 'ai',
      message: 'The market is currently showing mixed signals. Tech stocks are performing well with NASDAQ up 0.8%, while the broader S&P 500 is up 0.3%. Energy sectors are facing some challenges due to fluctuating oil prices. Would you like specific insights on any particular sector or stock?',
      timestamp: '9:31 AM'
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
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        sender: 'ai',
        message: 'I\'m analyzing your request. This is a placeholder response that would normally come from the AI backend.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-t-2xl shadow-lg p-6 flex flex-col">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            NB
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-800">Neural Broker AI</h2>
            <p className="text-sm text-gray-500">AI-powered trading assistant</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                chat.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                <p className="text-sm">{chat.message}</p>
                <p className={`text-xs mt-1 ${
                  chat.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>{chat.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="bg-white rounded-b-2xl shadow-lg p-4 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about stocks, market trends, or trading advice..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 font-medium transition-colors flex items-center"
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;