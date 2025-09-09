import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <nav className="top-0 left-0 h-screen w-72 bg-[#111726] text-[#F3ECDC] flex flex-col py-12 px-6 shadow-xl z-40 border-r border-[#C87933]/20">
      <div className="mb-10 text-2xl font-semibold tracking-[2px] text-center flex items-center justify-center">
        <div className="w-10 h-10 bg-[#0A0F1C] border border-[#C87933]/40 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
          <img src="/logo.jpg" alt="Neural Broker Logo" className="h-10 w-10 object-cover" />
        </div>
        <span className="text-[#F3ECDC]">Neural Broker</span>
      </div>
      
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c87b3d]/30 to-transparent mb-8 opacity-50"></div>
      
      <ul className="flex flex-col gap-2">
        {[
          { 
            path: "/dashboard", 
            label: "Dashboard", 
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            )
          },
          { 
            path: "/wallet", 
            label: "Wallet", 
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            )
          },
          { 
            path: "/watchlist", 
            label: "Watchlist", 
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            )
          },
          { 
            path: "/stocks", 
            label: "Stocks", 
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )
          }
        ].map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 text-sm rounded-lg transition-all duration-200 ${
                location.pathname === item.path 
                  ? "bg-[#c87b3d]/20 text-[#c87b3d] border-l-2 border-[#c87b3d]" 
                  : "hover:bg-[#1e2235] hover:border-l-2 hover:border-[#c87b3d]/50"
              }`}
            >
              <span className="flex items-center justify-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto mb-8 px-4 py-3 bg-[#1e2235] rounded-lg border border-[#c87b3d]/20 text-sm">
        <p className="text-center text-xs text-[#e9d8b4]/70">AI Powered Trading</p>
      </div>
    </nav>
  );
};

export default Sidebar;