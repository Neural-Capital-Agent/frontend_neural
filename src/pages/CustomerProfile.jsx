import React from 'react';
import OnboardingForm from '../components/OnboardingForm';
import BackgroundCandles from '../components/layouts/BackgroundCandles';

const CustomerProfile= () => {
  return (
    <BackgroundCandles>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-xl bg-[#0A0F1C] border border-[#C87933]/40 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="Neural Broker Logo" className="h-16 w-16 object-cover" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#F3ECDC]">Portfolio Setup</h2>
          <p className="mt-2 text-sm text-[#F3ECDC]/80">
            Let's configure your investment strategy. You can always change these settings later.
          </p>
        </div>
        
        <OnboardingForm />
      </div>
    </BackgroundCandles>
  );
};

export default CustomerProfile;