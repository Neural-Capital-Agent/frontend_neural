import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App'; // Import the auth context

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth(); // Use the auth context
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Success toast state
  const [showToast, setShowToast] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      fetch('http://localhost:8000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login successful:', data);
        // Show success toast
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          login(data.access_token);
          navigate(from, { replace: true });
        }, 1500);
      })
      .catch(error => {
        console.error('Login failed:', error);
        setErrors({ general: 'Login failed. Please check your credentials and try again.' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
      
      // For demo purposes - in production, use a real token from your API
      const mockToken = "mock-jwt-token";
      
      // Show success toast
      setShowToast(true);
      
      // Wait for toast animation before navigating
      setTimeout(() => {
        setShowToast(false);
        // Update auth context with successful login
        login(mockToken);
        // Navigate to the page the user was trying to access
        navigate(from, { replace: true });
      }, 1500);
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        general: 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `
          radial-gradient(900px 600px at 75% 0%, rgba(200,121,51,0.12), rgba(10,15,28,0) 50%),
          linear-gradient(180deg, #0A0F1C 0%, #0B1326 100%)
        `
      }}
    >
      {/* Background candlestick pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "url('/trading-pattern.svg')", // or base64 like before
          backgroundSize: "300px"
        }}
      ></div>
      
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
    </div>
  );
};

export default Login;

