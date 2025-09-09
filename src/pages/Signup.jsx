import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundCandles from '../components/layouts/BackgroundCandles';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    given_name: '',
    family_name: '',
    date_of_birth: '',
    country_of_citizenship: '',
    country_of_birth: '',
    tax_id: '',
    contact_given: '',
    contact_family: '',
    contact_email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.given_name) newErrors.given_name = 'First name is required';
      if (!formData.family_name) newErrors.family_name = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.street_address) newErrors.street_address = 'Street address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.postal_code) newErrors.postal_code = 'Postal code is required';
      if (!formData.country_of_citizenship) newErrors.country_of_citizenship = 'Country of citizenship is required';
      if (!formData.country_of_birth) newErrors.country_of_birth = 'Country of birth is required';
    }

    if (step === 3) {
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      if (!formData.tax_id) newErrors.tax_id = 'Tax ID is required';
      if (!formData.contact_given) newErrors.contact_given = 'Contact first name is required';
      if (!formData.contact_family) newErrors.contact_family = 'Contact last name is required';
      if (!formData.contact_email) {
        newErrors.contact_email = 'Contact email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
        newErrors.contact_email = 'Contact email is invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      console.log('Registration submitted:', formData);
      
      // Simulate API call
      fetch('http://localhost:8000/api/v1/user', {
        method:'POST',
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
        console.log('Registration successful:', data);
        navigate('/login', { state: { registrationSuccess: true } });
      })
      .catch(error => {
        console.error('Registration failed:', error);
        setErrors({
          general: 'Registration failed. Please try again.'
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({
        general: 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-medium text-[#F3ECDC]">Personal Information</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="given_name" className="block text-sm text-[#F3ECDC]/90 mb-2">First Name</label>
                <input
                  type="text"
                  id="given_name"
                  name="given_name"
                  value={formData.given_name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.given_name ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                />
                {errors.given_name && <p className="mt-2 text-xs text-[#C84C44]">{errors.given_name}</p>}
              </div>
              
              <div>
                <label htmlFor="family_name" className="block text-sm text-[#F3ECDC]/90 mb-2">Last Name</label>
                <input
                  type="text"
                  id="family_name"
                  name="family_name"
                  value={formData.family_name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.family_name ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                />
                {errors.family_name && <p className="mt-2 text-xs text-[#C84C44]">{errors.family_name}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-[#F3ECDC]/90 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.email ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.email && <p className="mt-2 text-xs text-[#C84C44]">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm text-[#F3ECDC]/90 mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.phone ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.phone && <p className="mt-2 text-xs text-[#C84C44]">{errors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm text-[#F3ECDC]/90 mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.password ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.password && <p className="mt-2 text-xs text-[#C84C44]">{errors.password}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-medium text-[#F3ECDC]">Address Information</h3>
            
            <div>
              <label htmlFor="street_address" className="block text-sm text-[#F3ECDC]/90 mb-2">Street Address</label>
              <input
                type="text"
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.street_address ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.street_address && <p className="mt-2 text-xs text-[#C84C44]">{errors.street_address}</p>}
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm text-[#F3ECDC]/90 mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.city ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                />
                {errors.city && <p className="mt-2 text-xs text-[#C84C44]">{errors.city}</p>}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm text-[#F3ECDC]/90 mb-2">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.state ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                />
                {errors.state && <p className="mt-2 text-xs text-[#C84C44]">{errors.state}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="postal_code" className="block text-sm text-[#F3ECDC]/90 mb-2">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.postal_code ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.postal_code && <p className="mt-2 text-xs text-[#C84C44]">{errors.postal_code}</p>}
            </div>
            
            <div>
              <label htmlFor="country_of_citizenship" className="block text-sm text-[#F3ECDC]/90 mb-2">Country of Citizenship</label>
              <input
                type="text"
                id="country_of_citizenship"
                name="country_of_citizenship"
                value={formData.country_of_citizenship}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.country_of_citizenship ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.country_of_citizenship && <p className="mt-2 text-xs text-[#C84C44]">{errors.country_of_citizenship}</p>}
            </div>
            
            <div>
              <label htmlFor="country_of_birth" className="block text-sm text-[#F3ECDC]/90 mb-2">Country of Birth</label>
              <input
                type="text"
                id="country_of_birth"
                name="country_of_birth"
                value={formData.country_of_birth}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.country_of_birth ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.country_of_birth && <p className="mt-2 text-xs text-[#C84C44]">{errors.country_of_birth}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-medium text-[#F3ECDC]">Additional Information</h3>
            
            <div>
              <label htmlFor="date_of_birth" className="block text-sm text-[#F3ECDC]/90 mb-2">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.date_of_birth ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.date_of_birth && <p className="mt-2 text-xs text-[#C84C44]">{errors.date_of_birth}</p>}
            </div>
            
            <div>
              <label htmlFor="tax_id" className="block text-sm text-[#F3ECDC]/90 mb-2">Tax ID / SSN</label>
              <input
                type="text"
                id="tax_id"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.tax_id ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
              />
              {errors.tax_id && <p className="mt-2 text-xs text-[#C84C44]">{errors.tax_id}</p>}
            </div>
            
            <div className="border-t border-[#C87933]/20 pt-4 mt-4">
              <h4 className="text-md font-medium text-[#F3ECDC] mb-2">Emergency Contact</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact_given" className="block text-sm text-[#F3ECDC]/90 mb-2">Contact First Name</label>
                  <input
                    type="text"
                    id="contact_given"
                    name="contact_given"
                    value={formData.contact_given}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.contact_given ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                  />
                  {errors.contact_given && <p className="mt-2 text-xs text-[#C84C44]">{errors.contact_given}</p>}
                </div>
                
                <div>
                  <label htmlFor="contact_family" className="block text-sm text-[#F3ECDC]/90 mb-2">Contact Last Name</label>
                  <input
                    type="text"
                    id="contact_family"
                    name="contact_family"
                    value={formData.contact_family}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.contact_family ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                  />
                  {errors.contact_family && <p className="mt-2 text-xs text-[#C84C44]">{errors.contact_family}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="contact_email" className="block text-sm text-[#F3ECDC]/90 mb-2">Contact Email</label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-[11px] bg-[#0A0F1C] text-[#F3ECDC] border ${errors.contact_email ? 'border-[#C84C44]' : 'border-[#C87933]/50'} rounded-md placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:border-[#C87933] text-sm`}
                />
                {errors.contact_email && <p className="mt-2 text-xs text-[#C84C44]">{errors.contact_email}</p>}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BackgroundCandles>
    <div className="max-w-[600px] w-[90vw] space-y-8 z-10 p-6">
        <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-7 sm:p-7">
        
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-xl bg-[#0A0F1C] border border-[#C87933]/40 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="Neural Broker Logo" className="h-16 w-16 object-cover" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-[#F3ECDC] tracking-[2px]">Create Your Account</h2>
          <div className="mt-1 text-sm text-[#C87933]">
            Smarter Portfolios, Powered by AI
          </div>
          <div className="mt-2 text-xs text-[#9BA4B5]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C87933] hover:text-[#F3ECDC] hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </div>
        
        {errors.general && (
          <div className="mt-3 text-sm text-center text-red-400">
            {errors.general}
          </div>
        )}
        
        <div className="shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <nav className="mb-8">
              <ol className="flex items-center w-full text-sm font-medium text-center text-[#9BA4B5] sm:text-base">
                {[1, 2, 3].map((step) => (
                  <li key={step} className={`flex md:w-full items-center ${step < currentStep ? 'text-[#C87933]' : ''} ${step === currentStep ? 'active text-[#C87933]' : ''}`}>
                    <span className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full border ${step < currentStep ? 'border-[#C87933] bg-[#C87933] text-white' : ''} ${step === currentStep ? 'border-[#C87933] text-[#C87933]' : 'border-[#9BA4B5]/50'}`}>
                      {step < currentStep ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      ) : (
                        step
                      )}
                    </span>
                    <span className="text-[#F3ECDC]">
                      {step === 1 && "Personal"}
                      {step === 2 && "Address"}
                      {step === 3 && "Additional"}
                    </span>
                    {step !== totalSteps && (
                      <svg className="w-4 h-4 ml-2 sm:ml-4 hidden sm:block text-[#9BA4B5]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            
            <form onSubmit={currentStep === totalSteps ? handleSubmit : nextStep}>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="py-3 px-4 bg-[#0A0F1C] border border-[#C87933]/50 rounded-md shadow-sm text-sm font-medium text-[#F3ECDC] hover:bg-[#111726] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C87933] transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                <div className="flex-1"></div>
                
                <button
                  type={currentStep === totalSteps ? 'submit' : 'button'}
                  disabled={isSubmitting}
                  onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                  className={`py-3 px-4 bg-gradient-to-r from-[#C87933] to-[#D98324] text-[#F3ECDC] text-sm font-semibold rounded-md transition-all min-h-[44px] ${isSubmitting ? 'bg-[#6B4D36] text-[#F3ECDC]/60 cursor-not-allowed' : 'hover:bg-[#DA8F3B] hover:shadow-[0_0_2px_2px_rgba(203,121,51,0.35)]'} focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933]`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#F3ECDC]/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : currentStep === totalSteps ? 'Create Account' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </BackgroundCandles>
  );
};

export default Signup;