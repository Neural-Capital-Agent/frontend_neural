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
          { path: "/dashboard", label: "Dashboard", icon: "�" },
          { path: "/wallet", label: "Wallet", icon: "�" },
          { path: "/watchlist", label: "Watchlist", icon: "�️" },
          { path: "/stocks", label: "Stocks", icon: "📈" }
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
              <span role="img" aria-label={item.label} className="text-xl">
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