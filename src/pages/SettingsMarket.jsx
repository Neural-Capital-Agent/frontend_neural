import React, { useState } from 'react';

const InfoTooltip = ({ text }) => (
  <span className="relative group inline-block ml-1 align-middle">
    <span className="text-slate-400 cursor-pointer">ℹ️</span>
    <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:block bg-[#181E2C] text-xs text-slate-200 rounded shadow-lg px-3 py-2 w-56">
      {text}
    </span>
  </span>
);

const AccordionSection = ({ icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-[#101624] rounded-xl border border-white/10 shadow-md">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-lg font-semibold text-slate-100">{icon} {title}</span>
        <span className="text-slate-400">{open ? '−' : '+'}</span>
      </button>
      <div className={`px-6 pb-6 transition-all duration-300 ${open ? 'block' : 'hidden'}`}>{children}</div>
    </section>
  );
};

const SettingsMarket = () => {
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-8 space-y-6">
      {/* Toast Banner */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-semibold">
          ✅ Settings updated successfully.
        </div>
      )}
      {/* ⚡ Preview Impact Panel */}
      <div className="mb-4">
        <div className="bg-[#181E2C] border border-[#C87933]/30 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-semibold text-[#C87933]">Preview Impact</p>
            <ul className="text-xs text-slate-300 list-disc ml-4 space-y-1">
              <li>You selected <span className="text-[#EFB570] font-semibold">Aggressive</span> risk: expected volatility ~15%.</li>
              <li>Drift threshold = <span className="text-[#EFB570] font-semibold">5%</span>: rebalancing may happen weekly.</li>
              <li>Crypto enabled: portfolio may include digital assets.</li>
              <li>ESG filter <span className="text-[#EFB570] font-semibold">off</span>: all asset classes included.</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Accordions for each section */}
      <AccordionSection icon="📊" title="Market Preferences">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Default Exchange / Asset Universe</label>
            <select className="w-full rounded-lg border border-slate-700 bg-[#181E2C] text-slate-100 px-3 py-2">
              <option>NYSE</option>
              <option>NASDAQ</option>
              <option>Binance</option>
              <option>Coinbase</option>
              <option>London Stock Exchange</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Display Currency</label>
            <select className="w-full rounded-lg border border-slate-700 bg-[#181E2C] text-slate-100 px-3 py-2">
              <option>USD</option>
              <option>EUR</option>
              <option>SOL</option>
              <option>BTC</option>
              <option>ETH</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" defaultChecked />
            <span className="text-slate-300 text-sm">Equities</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" defaultChecked />
            <span className="text-slate-300 text-sm">Bonds</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
            <span className="text-slate-300 text-sm">Crypto</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
            <span className="text-slate-300 text-sm">Alternatives</span>
          </div>
        </div>
      </AccordionSection>
      <AccordionSection icon="🛡️" title="Portfolio & Risk Settings">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">Risk Level</label>
          <input type="range" min="1" max="5" className="w-full accent-[#C87933]" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Max equity % cap
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Min bonds %
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Exclude crypto
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> ESG filter
            <InfoTooltip text="ESG filter restricts portfolio to assets meeting environmental, social, and governance criteria." />
          </label>
        </div>
      </AccordionSection>
      <AccordionSection icon="⚡" title="Rebalancing Behavior">
        <div className="mb-6 flex flex-wrap gap-6 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Frequency</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="radio" name="freq" className="form-radio text-[#C87933]" defaultChecked /> Daily
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="radio" name="freq" className="form-radio text-[#C87933]" /> Weekly
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="radio" name="freq" className="form-radio text-[#C87933]" /> Monthly
              </label>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">Drift Threshold <InfoTooltip text="Drift threshold is the % deviation from target allocation that triggers a rebalance." /></label>
            <input type="range" min="1" max="20" className="w-full accent-[#C87933]" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mt-6">Macro Override <InfoTooltip text="Allow macro signals to trigger instant rebalancing, regardless of drift." /></label>
            <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
          </div>
        </div>
      </AccordionSection>
      <AccordionSection icon="📈" title="Macro-Signal Triggers">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Yield curve inversion','Inflation shock','Volatility spike','Credit stress','PMI contraction','Market momentum'].map((label) => (
            <label key={label} className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> {label}
            </label>
          ))}
        </div>
        <div className="mt-6">
          <span className="text-xs text-slate-400">Advanced mode: sensitivity sliders</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {['Yield curve','Inflation','Volatility','Credit','PMI','Momentum'].map((label) => (
              <div key={label}>
                <label className="block text-xs text-slate-400 mb-1">{label} sensitivity</label>
                <input type="range" min="1" max="10" className="w-full accent-[#C87933]" />
              </div>
            ))}
          </div>
        </div>
      </AccordionSection>
      <AccordionSection icon="🔔" title="Security & Alerts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> 2FA for trades
            </label>
            <label className="block text-sm font-medium text-slate-400 mb-1">Max trade size (per order / per day)</label>
            <input type="number" className="w-full rounded-lg border border-slate-700 bg-[#181E2C] text-slate-100 px-3 py-2" placeholder="$10,000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Notifications</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Price alerts
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Risk alerts
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Portfolio changes
              </label>
            </div>
          </div>
        </div>
      </AccordionSection>
      {/* Save / Reset Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-[#C87933] text-white font-semibold shadow hover:bg-[#D98324] transition">Save Changes</button>
        <button className="px-5 py-2 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-[#181E2C] transition">Reset</button>
      </div>
    </div>
  );
};

export default SettingsMarket;