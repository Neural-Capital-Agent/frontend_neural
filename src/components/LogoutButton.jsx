import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LogoutButton = ({ className = '' }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // This simulates a visual logout process without changing any logic
    setTimeout(() => {
      logout();
      navigate('/login');
      setIsLoggingOut(false);
    }, 800);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center justify-center px-4 py-2 bg-[#111726] border border-[#C87933]/30 text-[#F3ECDC] text-sm font-medium rounded-md
        transition-all hover:bg-[#0A0F1C] hover:border-[#C87933]/50 hover:shadow-[0_0_2px_1px_rgba(200,121,51,0.2)]
        focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/40 focus:ring-offset-1 focus:ring-offset-[#C87933]
        ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}`}
    >
      {isLoggingOut ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#F3ECDC]/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing out...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </>
      )}
    </button>
  );
};

export default LogoutButton;
