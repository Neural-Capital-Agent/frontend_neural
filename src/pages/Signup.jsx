import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="given_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="given_name"
                  name="given_name"
                  value={formData.given_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.given_name ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.given_name && <p className="mt-1 text-sm text-red-600">{errors.given_name}</p>}
              </div>
              
              <div>
                <label htmlFor="family_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="family_name"
                  name="family_name"
                  value={formData.family_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.family_name ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.family_name && <p className="mt-1 text-sm text-red-600">{errors.family_name}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="mail" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            
            <div>
              <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.street_address ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.street_address && <p className="mt-1 text-sm text-red-600">{errors.street_address}</p>}
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.city ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.state ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.postal_code ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
            </div>
            
            <div>
              <label htmlFor="country_of_citizenship" className="block text-sm font-medium text-gray-700">Country of Citizenship</label>
              <input
                type="text"
                id="country_of_citizenship"
                name="country_of_citizenship"
                value={formData.country_of_citizenship}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.country_of_citizenship ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.country_of_citizenship && <p className="mt-1 text-sm text-red-600">{errors.country_of_citizenship}</p>}
            </div>
            
            <div>
              <label htmlFor="country_of_birth" className="block text-sm font-medium text-gray-700">Country of Birth</label>
              <input
                type="text"
                id="country_of_birth"
                name="country_of_birth"
                value={formData.country_of_birth}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.country_of_birth ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.country_of_birth && <p className="mt-1 text-sm text-red-600">{errors.country_of_birth}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.date_of_birth ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
            </div>
            
            <div>
              <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">Tax ID / SSN</label>
              <input
                type="text"
                id="tax_id"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.tax_id ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.tax_id && <p className="mt-1 text-sm text-red-600">{errors.tax_id}</p>}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Emergency Contact</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact_given" className="block text-sm font-medium text-gray-700">Contact First Name</label>
                  <input
                    type="text"
                    id="contact_given"
                    name="contact_given"
                    value={formData.contact_given}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contact_given ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.contact_given && <p className="mt-1 text-sm text-red-600">{errors.contact_given}</p>}
                </div>
                
                <div>
                  <label htmlFor="contact_family" className="block text-sm font-medium text-gray-700">Contact Last Name</label>
                  <input
                    type="text"
                    id="contact_family"
                    name="contact_family"
                    value={formData.contact_family}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contact_family ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.contact_family && <p className="mt-1 text-sm text-red-600">{errors.contact_family}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contact_email ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <nav className="mb-8">
              <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
                {[1, 2, 3].map((step) => (
                  <li key={step} className={`flex md:w-full items-center ${step < currentStep ? 'text-blue-600' : ''} ${step === currentStep ? 'active text-blue-600' : ''}`}>
                    <span className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full border ${step < currentStep ? 'border-blue-600 bg-blue-600 text-white' : ''} ${step === currentStep ? 'border-blue-600 text-blue-600' : 'border-gray-300'}`}>
                      {step < currentStep ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      ) : (
                        step
                      )}
                    </span>
                    {step === 1 && "Personal"}
                    {step === 2 && "Address"}
                    {step === 3 && "Additional"}
                    {step !== totalSteps && (
                      <svg className="w-4 h-4 ml-2 sm:ml-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                )}
                
                <div className="flex-1"></div>
                
                <button
                  type={currentStep === totalSteps ? 'submit' : 'button'}
                  disabled={isSubmitting}
                  onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
};

export default Signup;