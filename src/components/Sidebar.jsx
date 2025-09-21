import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon, ChartBarIcon, CogIcon, UserIcon,
  ChatIcon, DocumentReportIcon, LogoutIcon, CloudIcon
} from '@heroicons/react/outline';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Market', path: '/stocks', icon: ChartBarIcon },
    { name: 'Account', path: '/profile', icon: UserIcon },
    { name: 'Macro Info', path: '/macro-info', icon: DocumentReportIcon },
    { name: 'Coral Protocol', path: '/coral', icon: CloudIcon },
    { name: 'Plans & Pricing', path: '/pricing', icon: ChatIcon },
  ];

  return (
    <div className="bg-[#111726] w-64 min-h-screen flex flex-col shadow-lg">
      {/* Logo section with increased top padding */}
      <div className="px-6 sidebar-top-padding m-3">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="Neural Broker" className="h-10 w-10 rounded-md" />
          <span className="ml-3 text-xl font-semibold text-[#F3ECDC]">Neural Broker</span>
        </div>
      </div>
      
      {/* Menu items with enhanced active state */}
      <nav className="mt-8 px-4">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm sidebar-item ${
                  isActive ? 'active' : 'text-[#9BA4B5] hover:text-[#F3ECDC] hover:bg-[#0A0F1C]/50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="mt-auto px-4 mb-6">
        <button className="flex items-center px-4 py-3 text-sm text-[#9BA4B5] hover:text-[#F3ECDC] hover:bg-[#0A0F1C]/50 w-full rounded-md sidebar-item">
          <LogoutIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;