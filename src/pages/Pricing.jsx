import React, { useState, useEffect } from 'react';

const Pricing = () => {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/llm/tiers', {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json'
                    },
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error('Rate limit exceeded. Please try again later.');
                    }
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                setTiers(data['tiers'] || []);
            } catch (err) {
                console.error('Error fetching pricing tiers:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTiers();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="text-2xl font-bold text-gray-700">Loading pricing information...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="text-2xl font-bold text-red-600">Error: {error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-12">Pricing Plans</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
                {tiers && tiers.length > 0 ? (
                    tiers.map((tier, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                        >
                            <div className="p-6 bg-blue-600 text-white">
                                <h2 className="text-2xl font-bold">{tier.name}</h2>
                                <p className="text-3xl font-bold mt-2">${tier.price_monthly}<span className="text-sm">/month</span></p>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{tier.requests_per_day} requests/day</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{tier.requests_per_hour} requests/hour</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{tier.requests_per_minute} requests/minute</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{tier.llm_credits} LLM credits</span>
                                    </li>
                                </ul>
                                <button 
                                    className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition duration-200"
                                >
                                    Choose Plan
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-600">
                        No pricing plans available at the moment. Please check back later.
                    </div>
                )}
            </div>

            {/* Default tiers if API fails */}
            {(!tiers || tiers.length === 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 bg-blue-600 text-white">
                            <h2 className="text-2xl font-bold">Basic</h2>
                            <p className="text-3xl font-bold mt-2">$9<span className="text-sm">/month</span></p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>50 requests/day</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>10 requests/hour</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>3 requests/minute</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>100 LLM credits</span>
                                </li>
                            </ul>
                            <button 
                                className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition duration-200"
                            >
                                Choose Plan
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform scale-105 border-2 border-blue-500">
                        <div className="p-6 bg-blue-700 text-white">
                            <div className="flex justify-center -mt-8 mb-2">
                                <span className="bg-yellow-400 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                            </div>
                            <h2 className="text-2xl font-bold">Premium</h2>
                            <p className="text-3xl font-bold mt-2">$29<span className="text-sm">/month</span></p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>200 requests/day</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>50 requests/hour</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>10 requests/minute</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>500 LLM credits</span>
                                </li>
                            </ul>
                            <button 
                                className="w-full mt-6 py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded transition duration-200"
                            >
                                Choose Plan
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 bg-gray-800 text-white">
                            <h2 className="text-2xl font-bold">Enterprise</h2>
                            <p className="text-3xl font-bold mt-2">$99<span className="text-sm">/month</span></p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>1000 requests/day</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>200 requests/hour</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>50 requests/minute</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>2000 LLM credits</span>
                                </li>
                            </ul>
                            <button 
                                className="w-full mt-6 py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded transition duration-200"
                            >
                                Choose Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="mt-12 text-center max-w-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Need a custom plan?</h3>
                <p className="text-gray-600 mb-6">
                    For larger organizations or specialized needs, we offer tailored pricing plans. 
                    Contact our sales team to discuss your requirements.
                </p>
                <button className="py-2 px-6 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded transition duration-200">
                    Contact Sales
                </button>
            </div>
        </div>
    );
};

export default Pricing;