import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <nav className="top-0 left-0 h-screen w-72 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white flex flex-col py-12 px-6 shadow-2xl z-40 border-r border-indigo-700">
      <div className="mb-14 text-3xl font-extrabold tracking-wide text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
          Neural Broker
        </span>
      </div>
      
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent mb-8 opacity-50"></div>
      
      <ul className="flex flex-col gap-4">
        {[
          { path: "/", label: "Chat", icon: "💬" },
          { path: "/wallet", label: "Wallet", icon: "👛" },
          { path: "/watchlist", label: "Watchlist", icon: "👀" },
          { path: "/stocks", label: "Stocks", icon: "📈" }
        ].map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 text-lg rounded-xl transition-all duration-300 font-medium ${
                location.pathname === item.path 
                  ? "bg-indigo-600 shadow-lg shadow-indigo-900/50" 
                  : "hover:bg-indigo-700/70 hover:translate-x-1"
              }`}
            >
              <span role="img" aria-label={item.label} className="text-2xl">
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto mb-8 px-4 py-3 bg-indigo-700/30 rounded-lg text-indigo-200 text-sm">
        <p className="text-center font-medium">AI Powered Trading</p>
      </div>
    </nav>
  );
};

export default Sidebar;