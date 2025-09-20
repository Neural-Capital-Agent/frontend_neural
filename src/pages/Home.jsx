import {React,useState,useEffect} from 'react';
import Chat from '../components/Chat';
import OnboardingForm from '../components/OnboardingForm';
import {checkUserSetup} from '../utils/auth';
import AnalisisRespond from '../components/AnalisisRespond';
import TierStatus from '../components/TierStatus';

const Home = () => {
  const [isSetupCompleted, setIsSetupCompleted] = useState(null);
  const [memberShipData, setMembershipData] = useState(null);
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    // Check if user has completed setup
    const checkSetup = async () => {
      const setupStatus = await checkUserSetup();
      setIsSetupCompleted(setupStatus);
    };
    // Fetch membership data
    const fetchMembershipData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/llm/usage/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMembershipData(data);
        } else {
          console.error('Failed to fetch membership data');
        }
      } catch (error) {
        console.error('Error fetching membership data:', error);
      }
    };
    checkSetup();
    fetchMembershipData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-[2px] text-[#F3ECDC] mb-2">Welcome to Neural Broker</h1>
        <p className="text-lg text-[#9BA4B5]">
          Your AI-powered trading assistant. Ask anything about markets, stocks, or get investment advice.
        </p>
      </div>
     {isSetupCompleted === null ? (
        <p>Loading...</p>
      ) : (
        isSetupCompleted ? <TierStatus memberShipData={memberShipData} /> : <OnboardingForm />
      )} </div>
  );
};

export default Home;