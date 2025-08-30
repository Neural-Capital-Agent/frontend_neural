import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import WalletPage from './pages/WalletPage';
import WatchlistPage from './pages/WatchlistPage';
import StocksPage from './pages/StocksPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
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

  const login = (token) => {
    localStorage.setItem('authToken', token);
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
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout component with sidebar
const DashboardLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <div className="w-72 shrink-0">
      <Sidebar />
    </div>
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto py-6">
        {children}
      </div>
    </div>
  </div>
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
          
          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;