import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import WalletPage from './pages/WalletPage';
import WatchlistPage from './pages/WatchlistPage';
import StocksPage from './pages/StocksPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LogoutButton from './components/LogoutButton';
import CustomerProfile from './pages/CustomerProfile';
import SettingsMarket from './pages/SettingsMarket';
import Pricing from './pages/Pricing';
import './App.css';

// Create authentication context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Auth provider component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking localStorage or a token)
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#0A0F1C] text-[#F3ECDC]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#C87933] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-[#9BA4B5]">Loading...</span>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


// Layout component with sidebar
const DashboardLayout = ({ children }) => (
  <>
  <div className="fixed top-4 right-4 z-50">
            <LogoutButton />
          </div>
  <div className="flex flex-col h-screen bg-[#0A0F1C]">
    <div className="flex flex-1 overflow-hidden">
      <div className="w-72 shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </div>
    </div>
    
    {/* Footer */}
    <footer className="bg-[#111726] border-t border-[#C87933]/20 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#9BA4B5] text-xs mb-4 md:mb-0">
            © 2025 Neural Broker. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-[#9BA4B5]/70 hover:text-[#C87933] transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-[#9BA4B5]/70 hover:text-[#C87933] transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-[#9BA4B5]/70 hover:text-[#C87933] transition-colors">Contact Us</a>
            <a href="#" className="text-xs text-[#9BA4B5]/70 hover:text-[#C87933] transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  </>
);

function App() {

  return (
    <AuthProvider>
      <Router>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/wallet" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WalletPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/watchlist" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WatchlistPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/stocks" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StocksPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
           <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
            <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsMarket />
              </DashboardLayout>
            </ProtectedRoute>
          } />
            <Route path="/pricing" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Pricing />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;