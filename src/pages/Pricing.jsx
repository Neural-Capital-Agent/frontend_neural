import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrossmintProvider, CrossmintHostedCheckout } from "@crossmint/client-sdk-react-ui";

const userId = localStorage.getItem('userId');
const features = [
	[
		{ label: 'Basic dashboard & portfolio', icon: '✓', type: 'enabled' },
		{ label: 'Quick Analysis', icon: '✓', type: 'enabled' },
		{ label: 'Macroeconomic indicators', icon: '—', type: 'locked' },
		{ label: '100 credit/month', icon: '—', type: 'locked' },
	],
	[
		{ label: 'Real-time data feeds', icon: '✓', type: 'enabled' },
		{ label: 'Macro-signal automation', icon: '✓', type: 'enabled' },
		{ label: 'Quick Analysis', icon: '✓', type: 'enabled' },
		{ label: 'Create a Personalized Investment Strategy', icon: '✓', type: 'enabled' },
		{ label: '500 credits/month', icon: '✓', type: 'enabled' },
	],
	[
		{ label: 'Unlimited assets + API access', icon: '✓', type: 'enabled' },
		{ label: 'Daily/real-time rebalancing', icon: '✓', type: 'enabled' },
		{ label: 'Multi-user accounts', icon: '✓', type: 'enabled' },
		{ label: 'Dedicated support', icon: '✓', type: 'enabled' },
		{ label: '2000 credits/month', icon: '✓', type: 'enabled' },
	],
];

const iconColor = {
	enabled: 'text-[#F59E0B]',
	locked: 'text-slate-500',
};

const Pricing = () => {
	const navigate = useNavigate();
	const [billing, setBilling] = useState('monthly');
	const [showContactModal, setShowContactModal] = useState(false);
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const clientApiKey = import.meta.env.VITE_CLIENT_API_KEY || "";
    const collectionId = import.meta.env.VITE_COLLECTION_ID || "";
	const collectionIdBasic = import.meta.env.VITE_COLLECTION_ID_BASIC || "";

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Send contact form data to backend (you can implement this endpoint)
			console.log('Enterprise contact request:', { email, message });

			// For now, automatically set enterprise tier
			await setEnterpriseMembership();

			// Show success message
			setSubmitted(true);

			// Reset form after 3 seconds and close modal
			setTimeout(() => {
				setEmail('');
				setMessage('');
				setSubmitted(false);
				setShowContactModal(false);
			}, 3000);
		} catch (error) {
			console.error('Error submitting enterprise request:', error);
			setSubmitted(true); // Still show success to user
		}
	};
	
	const setMembership = async (tier, credits) => {
		if (!userId) {
			console.error('No user ID found');
			return;
		}

		try {
			const response = await fetch('http://localhost:8000/api/v1/llm/set-tier', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user_id: userId,
					new_tier: tier,
					additional_credits: credits
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(`${tier} membership tier set successfully:`, data);

			// Navigate to dashboard
			navigate('/dashboard');
		} catch (error) {
			console.error('Error setting membership tier:', error);
			// Still navigate to dashboard as fallback
			navigate('/dashboard');
		}
	};

	const setBasicMembership = () => setMembership('basic', 100);
	const setPremiumMembership = () => setMembership('premium', 500);
	const setEnterpriseMembership = () => setMembership('enterprise', 2000);

	return (
		<div className="flex flex-col items-center justify-start bg-[#0B0E1A] p-4">
			<h1 className="text-3xl font-bold text-slate-100 mb-6">Choose the plan that more fit with you</h1>
			
			{/* Main content container - fixed columns regardless of screen size */}
			<div className="w-full max-w-7xl flex flex-row gap-4">
				{/* Left column - Pricing plans */}
				<div className="w-2/3">
					{/* Monthly / Yearly toggle */}
					<div className="mb-4 flex items-center gap-2 justify-start">
						<span
							className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition text-xs ${
								billing === 'monthly'
									? 'bg-[#F59E0B] text-white scale-105 shadow'
									: 'bg-transparent text-[#F59E0B] border border-[#F59E0B]'
							} duration-150`}
							onClick={() => setBilling('monthly')}
						>
							Monthly
						</span>
						<span
							className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition text-xs ${
								billing === 'yearly'
									? 'bg-[#F59E0B] text-white scale-105 shadow'
									: 'bg-transparent text-[#F59E0B] border border-[#F59E0B]'
							} duration-150`}
							onClick={() => setBilling('yearly')}
						>
							Yearly{' '}
							<span className="font-bold text-[#F59E0B]">Save 20%</span>
						</span>
					</div>
					
					{/* Pricing cards - always in grid */}
					<div className="grid grid-cols-3 gap-3 w-full">
						{/* Starter */}
						<div className="bg-[#1A1D29] rounded-2xl shadow-lg overflow-hidden flex flex-col px-2 pt-4 pb-3 transition-shadow duration-200 hover:shadow-[0_0_32px_0_#F59E0B]">
							<div className="px-2 py-3 mb-1">
								<h2 className="text-lg font-bold text-slate-300">Starter</h2>
								<div className="flex items-baseline gap-1 mt-1">
									<span className="text-2xl font-bold text-[#F59E0B]">Free</span>
								</div>
							</div>
							<ul className="mb-2 mt-1 divide-y divide-white/5 text-sm">
								{features[0].map((f, i) => (
									<li key={i} className="flex items-center gap-1 py-1">
										<span
											className={`inline-block w-4 text-center font-bold ${iconColor[f.type]}`}
										>
											{f.icon}
										</span>
										<span className={f.type === 'locked' ? 'text-slate-500' : ''}>
											{f.label}
										</span>
									</li>
								))}
							</ul>
							<button onClick={() => setBasicMembership()} className="w-full py-1 px-3 border-2 border-[#F59E0B] text-[#F59E0B] font-bold rounded-xl transition duration-200 mt-1 bg-transparent hover:bg-[#F59E0B]/10 text-sm">
								Get Started
							</button>
							<p className="text-xs text-slate-400 text-center mt-1">
								No credit card required.
							</p>
						</div>
						
						{/* Pro (Most Popular) */}
						<div className="bg-[#202433] rounded-2xl shadow-lg overflow-hidden flex flex-col border-2 border-[#F59E0B] relative px-2 pt-6 pb-3 scale-105 hover:scale-[1.08] transition-transform duration-200 hover:shadow-[0_0_0_1px_rgba(255,153,0,.25)]">
							<div className="px-2 py-3 mb-1 relative">
								<div className="flex justify-center absolute -top-5 left-1/2 -translate-x-1/2">
									<span className="bg-[#F59E0B] text-black text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-sm">
										Popular
									</span>
								</div>
								<h2 className="text-lg font-bold text-white mt-2">Pro</h2>
								<div className="flex items-baseline gap-1 mt-1">
									<span className="text-2xl font-bold text-[#F59E0B]">
										${billing === 'yearly' ? '15' : '19'}
									</span>
									<span className="text-xs text-[#F59E0B] align-baseline">
										/month
									</span>
								</div>
							</div>
							<ul className="mb-2 mt-1 divide-y divide-white/5 text-sm">
								{features[1].map((f, i) => (
									<li key={i} className="flex items-center gap-1 py-1">
										<span className="inline-block w-4 text-center font-bold text-[#F59E0B]">
											✓
										</span>
										<span>{f.label}</span>
									</li>
								))}
							</ul>
							{clientApiKey && collectionIdBasic ? (
								<CrossmintProvider apiKey={clientApiKey}>
									<CrossmintHostedCheckout
										lineItems={{
											collectionLocator: `crossmint:${collectionIdBasic}`,
											callData: {
												totalPrice: billing === 'yearly' ? "180" : "19",
												quantity: 1,
												metadata: {
													userId: userId,
													tier: "premium"
												}
											},
										}}
										payment={{
											crypto: { enabled: true },
											fiat: { enabled: true },
										}}
										onEvent={(event) => {
											if (event.type === "payment:process.succeeded") {
												setPremiumMembership();
											}
										}}
									/>
								</CrossmintProvider>
							) : (
								<button
									onClick={setPremiumMembership}
									className="w-full py-1 px-3 bg-[#F59E0B] text-black font-bold rounded-xl transition duration-200 mt-1 hover:bg-[#F59E0B]/90 text-sm"
								>
									Subscribe Now
								</button>
							)}
							<p className="text-xs text-slate-400 text-center mt-1">
							</p>
						</div>
						
						{/* Enterprise */}
						<div className="bg-[#1A1D29] rounded-2xl shadow-lg overflow-hidden flex flex-col px-2 pt-4 pb-3 transition-shadow duration-200 hover:shadow-[0_0_32px_0_#F59E0B]">
							<div className="px-2 py-3 mb-1">
								<h2 className="text-lg font-bold text-slate-300">Enterprise</h2>
								<div className="flex items-baseline gap-1 mt-1">
									<span className="text-xl font-bold text-[#F59E0B]">Contact Sales</span>
								</div>
							</div>
							<ul className="mb-2 mt-1 divide-y divide-white/5 text-sm">
								{features[2].map((f, i) => (
									<li key={i} className="flex items-center gap-1 py-1">
										<span className={`inline-block w-4 text-center font-bold text-[#F59E0B]`}>
											{f.icon}
										</span>
										<span>{f.label}</span>
									</li>
								))}
							</ul>
							<button 
								className="w-full py-1 px-3 border-2 border-[#F59E0B] text-[#F59E0B] font-bold rounded-xl transition duration-200 mt-1 bg-transparent hover:bg-[#F59E0B]/10 text-sm"
								onClick={() => setShowContactModal(true)}
							>
								Contact Sales
							</button>
							<p className="text-xs text-slate-400 text-center mt-1">
								Custom onboarding.
							</p>
						</div>
					</div>
				</div>
				
				{/* Right column - Comparison table */}
				<div className="w-1/3">
					<div className="bg-[#10131C] rounded-2xl shadow border border-[#202433] overflow-hidden h-full">
						<div className="text-center text-base font-semibold bg-[#181E2C] text-slate-200 py-2">
							Feature Comparison
						</div>
						
						<div className="grid grid-cols-3 text-center text-xs font-semibold bg-[#181E2C] text-slate-300">
							<div className="py-2">Assets</div>
							<div className="py-2">Rebalancing</div>
							<div className="py-2">Signals</div>
						</div>
						<div className="grid grid-cols-3 text-center text-xs text-slate-200">
							<div className="py-1 border-t border-white/5">Limited</div>
							<div className="py-1 border-t border-white/5">Monthly</div>
							<div className="py-1 border-t border-white/5">—</div>
						</div>
						<div className="grid grid-cols-3 text-center text-xs text-slate-200">
							<div className="py-1 border-t border-white/5">All</div>
							<div className="py-1 border-t border-white/5">Weekly</div>
							<div className="py-1 border-t border-white/5">✓</div>
						</div>
						<div className="grid grid-cols-3 text-center text-xs text-slate-200">
							<div className="py-1 border-t border-white/5">API</div>
							<div className="py-1 border-t border-white/5">Real-time</div>
							<div className="py-1 border-t border-white/5">✓+</div>
						</div>
						
						<div className="grid grid-cols-3 text-center text-xs font-semibold bg-[#181E2C] text-slate-300 mt-2">
							<div className="py-2">Data</div>
							<div className="py-2">Support</div>
							<div className="py-2">Trust</div>
						</div>
						<div className="grid grid-cols-3 text-center text-xs text-slate-200">
							<div className="py-1 border-t border-white/5">Delayed</div>
							<div className="py-1 border-t border-white/5">Community</div>
							<div className="py-1 border-t border-white/5">Basic</div>
						</div>
						<div className="grid grid-cols-3 text-center text-xs text-slate-200">
							<div className="py-1 border-t border-white/5">Real-time</div>
							<div className="py-1 border-t border-white/5">Standard</div>
							<div className="py-1 border-t border-white/5">Advanced</div>
						</div>
						<div className="grid grid-cols-3 text-center text-xs text-slate-200">
							<div className="py-1 border-t border-white/5">Priority</div>
							<div className="py-1 border-t border-white/5">Dedicated</div>
							<div className="py-1 border-t border-white/5">Premium</div>
						</div>
						
						{/* Trust Hints */}
						<div className="mt-2 text-center text-xs text-slate-400 p-2">
							Backtested • Explainable • Risk controls
						</div>
					</div>
				</div>
			</div>

			{/* Contact Sales Modal */}
			{showContactModal && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
					<div className="bg-[#1A1D29] rounded-2xl shadow-xl max-w-md w-full p-6 relative">
						<button 
							className="absolute top-3 right-3 text-slate-400 hover:text-white"
							onClick={() => setShowContactModal(false)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						
						<h3 className="text-xl font-bold text-white mb-4">Contact Our Sales Team</h3>
						
						{submitted ? (
							<div className="text-center py-8">
								<div className="text-[#F59E0B] text-4xl mb-4">✓</div>
								<p className="text-white text-lg">Thank you for your message!</p>
								<p className="text-slate-300 mt-2">We'll get back to you soon.</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
										Your Email
									</label>
									<input
										type="email"
										id="email"
										required
										className="w-full p-2 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="your.email@example.com"
									/>
								</div>
								
								<div>
									<label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
										Message
									</label>
									<textarea
										id="message"
										required
										className="w-full p-2 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] min-h-[100px]"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										placeholder="Tell us about your company and requirements..."
									/>
								</div>
								
								<button
									type="submit"
									className="w-full py-2 px-4 bg-[#F59E0B] text-black font-bold rounded-xl transition duration-200 hover:bg-[#F59E0B]/90"
								>
									Send Message
								</button>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Pricing;