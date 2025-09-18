import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import BackgroundCandles from '../components/layouts/BackgroundCandles';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      

      const response = await fetch('http://localhost:8000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

     

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      if(data.access_token) {
        console.log('Login successful:', data);

        // Show success toast
        setShowToast(true);
        setTimeout(() => {
        setShowToast(false);
        login(data.access_token, data.user_id); // Store token and userId
        navigate(from, { replace: true });
      }, 1500);

      }
      else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed incorrect credentials');
      }
      
      
    } catch (error) {
      console.error('Login failed:', error);
    
    let errorMessage = 'Login failed. Please check your credentials and try again.';
    
     if (error.name === 'AbortError') {
      errorMessage = '⏱️ Request timeout: API server is not responding. Please check if the backend is running.';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = '🚫 API Server is not running. Please start the backend server on port 8000.';
    } else if (error.message === 'Failed to fetch') {
      errorMessage = '🔌 Unable to connect to server. Check if the API is running on http://localhost:8000';
    } else if (error.name === 'TypeError') {
      errorMessage = '⚠️ Network error: Cannot reach the API server. Make sure the backend is running.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setErrors({ 
      general: errorMessage
    });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   
      <BackgroundCandles>
      <div className="max-w-[440px] w-[90vw] space-y-8 z-10">
        <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-7 sm:p-7">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-xl bg-[#0A0F1C] border border-[#C87933]/40 flex items-center justify-center overflow-hidden">
              {/* Logo image */}
              <img src="/logo.jpg" alt="Neural Broker Logo" className="h-16 w-16 object-cover" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[#F3ECDC] tracking-[2px]">Neural Broker Login</h2>
            <div className="mt-1 text-sm text-[#C87933]">
              Smarter Portfolios, Powered by AI
            </div>
          </div>
          
          {errors.general && (
            <div className="mt-3 text-sm text-center text-red-400">
              {errors.general}
            </div>
          )}
           {/* Add this toast notification */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Login successful! Redirecting...
            </div>
          )}
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm text-[#F3ECDC]/90 mb-2">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.email ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-[#C84C44]">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm text-[#F3ECDC]/90 mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.password ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      type="button" 
                      className="text-[#C87933] hover:text-[#F3ECDC] focus:outline-none transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-[#C84C44]">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 bg-gradient-to-r from-[#C87933] to-[#D98324] text-[#F3ECDC] text-sm font-semibold rounded-md 
                  transition-all min-h-[44px]
                  ${isSubmitting ? 'bg-[#6B4D36] text-[#F3ECDC]/60 cursor-not-allowed' : 'hover:bg-[#DA8F3B] hover:shadow-[0_0_2px_2px_rgba(203,121,51,0.35)]'}
                  focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933]`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#F3ECDC]/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'SIGN IN'}
              </button>
            </div>
            
            <div className="flex items-center justify-center text-center text-xs mt-4 pt-1">
              <div>
                <a
                  href="#"
                  className="text-[#9BA4B5] hover:text-[#C87933] hover:underline transition-colors"
                >
                  Forgot your password?
                </a>
                {" · "}
                <a
                  href="/signup"
                  className="text-[#9BA4B5] hover:text-[#C87933] hover:underline transition-colors"
                >
                  Don't have account?
                </a>
              </div>
            </div>
          </form>
        </div>
        
        <div className="text-center text-xs text-[#9BA4B5] mt-5">
          © 2025 Neural Broker. All rights reserved.
        </div>
      </div>
      </BackgroundCandles>
  );
};

export default Login;

