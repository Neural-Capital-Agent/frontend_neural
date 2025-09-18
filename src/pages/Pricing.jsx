import React, { useState } from 'react';

const features = [
	[
		{ label: 'Basic dashboard & portfolio', icon: '✓', type: 'enabled' },
		{ label: 'Limited assets (SPY, QQQ, BND, BTC)', icon: '✓', type: 'enabled' },
		{ label: 'Monthly rebalancing', icon: '✓', type: 'enabled' },
		{ label: 'Macro-signal triggers', icon: '—', type: 'locked' },
	],
	[
		{ label: 'All assets unlocked', icon: '✓', type: 'enabled' },
		{ label: 'Real-time data feeds', icon: '✓', type: 'enabled' },
		{ label: 'Weekly rebalancing', icon: '✓', type: 'enabled' },
		{ label: 'Macro-signal automation', icon: '✓', type: 'enabled' },
		{ label: 'Custom portfolio constraints', icon: '✓', type: 'enabled' },
	],
	[
		{ label: 'Unlimited assets + API access', icon: '✓', type: 'enabled' },
		{ label: 'Daily/real-time rebalancing', icon: '✓', type: 'enabled' },
		{ label: 'Multi-user accounts', icon: '✓', type: 'enabled' },
		{ label: 'Dedicated support', icon: '✓', type: 'enabled' },
	],
];

const iconColor = {
	enabled: 'text-[#F59E0B]',
	locked: 'text-slate-500',
};

const Pricing = () => {
	const [billing, setBilling] = useState('monthly');
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0E1A] p-6">
			<h1 className="text-4xl font-bold text-slate-100 mb-8">Pricing Plans</h1>
			{/* Monthly / Yearly toggle */}
			<div className="mb-8 flex items-center gap-4">
				<span
					className={`px-4 py-2 rounded-full font-semibold cursor-pointer transition text-sm ${
						billing === 'monthly'
							? 'bg-[#F59E0B] text-white scale-105 shadow'
							: 'bg-transparent text-[#F59E0B] border border-[#F59E0B]'
					} duration-150`}
					onClick={() => setBilling('monthly')}
				>
					Monthly
				</span>
				<span
					className={`px-4 py-2 rounded-full font-semibold cursor-pointer transition text-sm ${
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
			<div className="flex flex-col md:grid md:grid-cols-3 gap-6 max-w-6xl w-full">
				{/* Pro (Most Popular) - Centered on mobile */}
				<div className="order-1 md:order-2 bg-[#202433] rounded-2xl shadow-lg overflow-hidden flex flex-col border-2 border-[#F59E0B] relative px-4 pt-8 pb-6 md:pt-10 md:pb-8 md:scale-105 hover:scale-[1.02] transition-transform duration-200 hover:shadow-[0_0_0_1px_rgba(255,153,0,.25)] min-h-[480px]">
					<div className="px-4 py-6 mb-2 relative">
						<div className="flex justify-center absolute -top-5 left-1/2 -translate-x-1/2">
							<span className="bg-[#F59E0B] text-black text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase shadow-sm">
								Most Popular
							</span>
						</div>
						<h2 className="text-2xl font-bold text-white mt-4">Pro</h2>
						<div className="flex items-baseline gap-1 mt-1">
							<span className="text-3xl font-bold text-[#F59E0B]">
								${billing === 'yearly' ? '15' : '19'}
							</span>
							<span className="text-sm text-[#F59E0B] align-baseline">
								/month
							</span>
						</div>
					</div>
					<ul className="mb-3 mt-2 divide-y divide-white/5">
						{features[1].map((f, i) => (
							<li key={i} className="flex items-center gap-2 py-2">
								<span className="inline-block w-5 text-center font-bold text-[#F59E0B]">
									✓
								</span>
								<span>{f.label}</span>
							</li>
						))}
					</ul>
					<button className="w-full py-2 px-4 bg-[#F59E0B] hover:bg-[#C87933] text-white font-bold rounded-2xl transition duration-200 mt-2">
						Upgrade
					</button>
					<p className="text-xs text-slate-400 text-center mt-2">
						7-day free trial. Cancel anytime.
					</p>
				</div>
				{/* Starter */}
				<div className="order-2 md:order-1 bg-[#1A1D29] rounded-2xl shadow-lg overflow-hidden flex flex-col px-4 pt-6 pb-4 transition-shadow duration-200 hover:shadow-[0_0_32px_0_#F59E0B] min-h-[480px]">
					<div className="px-4 py-5 mb-2">
						<h2 className="text-2xl font-bold text-slate-300">Starter</h2>
						<div className="flex items-baseline gap-1 mt-1">
							<span className="text-3xl font-bold text-[#F59E0B]">Free</span>
						</div>
					</div>
					<ul className="mb-3 mt-2 divide-y divide-white/5">
						{features[0].map((f, i) => (
							<li key={i} className="flex items-center gap-2 py-2">
								<span
									className={`inline-block w-5 text-center font-bold ${iconColor[f.type]}`}
								>
									{f.icon}
								</span>
								<span className={f.type === 'locked' ? 'text-slate-500' : ''}>
									{f.label}
								</span>
							</li>
						))}
					</ul>
					<button className="w-full py-2 px-4 border-2 border-[#F59E0B] text-[#F59E0B] font-bold rounded-2xl transition duration-200 mt-2 bg-transparent hover:bg-[#F59E0B]/10">
						Get Started
					</button>
					<p className="text-xs text-slate-400 text-center mt-2">
						No credit card required.
					</p>
				</div>
				{/* Institutional / Enterprise */}
				<div className="order-3 md:order-3 bg-[#1A1D29] rounded-2xl shadow-lg overflow-hidden flex flex-col px-4 pt-6 pb-4 transition-shadow duration-200 hover:shadow-[0_0_32px_0_#F59E0B] min-h-[480px]">
					<div className="px-4 py-5 mb-2">
						<h2 className="text-2xl font-bold text-slate-300">Enterprise</h2>
						<div className="flex items-baseline gap-1 mt-1">
							<span className="text-3xl font-bold text-[#F59E0B]">Contact Sales</span>
						</div>
					</div>
					<ul className="mb-3 mt-2 divide-y divide-white/5">
						{features[2].map((f, i) => (
							<li key={i} className="flex items-center gap-2 py-2">
								<span className={`inline-block w-5 text-center font-bold text-[#F59E0B]`}>
									{f.icon}
								</span>
								<span>{f.label}</span>
							</li>
						))}
					</ul>
					<button className="w-full py-2 px-4 border-2 border-[#F59E0B] text-[#F59E0B] font-bold rounded-2xl transition duration-200 mt-2 bg-transparent hover:bg-[#F59E0B]/10">
						Contact Sales
					</button>
					<p className="text-xs text-slate-400 text-center mt-2">
						Custom onboarding.
					</p>
				</div>
			</div>
			{/* Comparison Row */}
			<div className="w-full max-w-6xl mt-8">
				<div className="bg-[#10131C] rounded-2xl shadow border border-[#202433] overflow-hidden">
					<div className="grid grid-cols-3 text-center text-sm font-semibold bg-[#181E2C] text-slate-300">
						<div className="py-3">Assets</div>
						<div className="py-3">Rebalancing</div>
						<div className="py-3">Macro Signals</div>
					</div>
					<div className="grid grid-cols-3 text-center text-[15px] text-slate-200">
						<div className="py-2 border-t border-white/5">Limited</div>
						<div className="py-2 border-t border-white/5">Monthly</div>
						<div className="py-2 border-t border-white/5">—</div>
					</div>
					<div className="grid grid-cols-3 text-center text-[15px] text-slate-200">
						<div className="py-2 border-t border-white/5">All</div>
						<div className="py-2 border-t border-white/5">Weekly</div>
						<div className="py-2 border-t border-white/5">✓</div>
					</div>
					<div className="grid grid-cols-3 text-center text-[15px] text-slate-200">
						<div className="py-2 border-t border-white/5">Unlimited + API</div>
						<div className="py-2 border-t border-white/5">Daily/Real-time</div>
						<div className="py-2 border-t border-white/5">✓ (advanced)</div>
					</div>
					<div className="grid grid-cols-3 text-center text-sm font-semibold bg-[#181E2C] text-slate-300">
						<div className="py-3">Data Feeds</div>
						<div className="py-3">Support</div>
						<div className="py-3">Trust</div>
					</div>
					<div className="grid grid-cols-3 text-center text-[15px] text-slate-200">
						<div className="py-2 border-t border-white/5">Delayed</div>
						<div className="py-2 border-t border-white/5">Community</div>
						<div className="py-2 border-t border-white/5">Backtested strategies</div>
					</div>
					<div className="grid grid-cols-3 text-center text-[15px] text-slate-200">
						<div className="py-2 border-t border-white/5">Real-time</div>
						<div className="py-2 border-t border-white/5">Standard</div>
						<div className="py-2 border-t border-white/5">Explainable decisions</div>
					</div>
					<div className="grid grid-cols-3 text-center text-[15px] text-slate-200">
						<div className="py-2 border-t border-white/5">Real-time + Priority</div>
						<div className="py-2 border-t border-white/5">Dedicated</div>
						<div className="py-2 border-t border-white/5">Risk controls</div>
					</div>
				</div>
			</div>
			{/* Trust Hints */}
			<div className="mt-4 text-center text-xs text-slate-400">
				Backtested strategies &bull; Explainable decisions &bull; Risk controls
			</div>
		</div>
	);
};

export default Pricing;