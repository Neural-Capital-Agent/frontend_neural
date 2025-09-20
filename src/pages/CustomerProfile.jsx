import React from 'react';
import BackgroundCandles from '../components/layouts/BackgroundCandles';

const CustomerProfile = () => {
  const [compact, setCompact] = React.useState(false);

  return (
    <BackgroundCandles>
      <div className={`min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#10131C]${compact ? ' compact' : ''}`}>
        <div className={`mx-auto max-w-6xl px-4 lg:px-6 py-6${compact ? ' p-3' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column (2/3) */}
            <div className="md:col-span-2">
              <div className={`space-y-4${compact ? ' text-xs' : ''}`}> 
                {/* Profile (with header) */}
                <section className={`rounded-2xl bg-[#171b25] ring-1 ring-white/5${compact ? ' p-3' : ' p-4'} shadow-md`}>
                  {/* Optional inline title above name */}
                  <h1 className="text-lg font-semibold text-[#F3ECDC] mb-2">Account</h1>
                  <div className="flex items-center gap-4">
                    <img src="/logo.jpg" alt="Profile" className="h-9 w-9 rounded-xl" />
                    <div className="leading-tight">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-[#F3ECDC] break-all sm:break-normal">Jane Doe</h2>
                        <span className="px-3 py-1 rounded-full text-base font-bold bg-[#F59E0B] text-black">Verified</span>
                      </div>
                      <div className="text-lg font-semibold text-white/80 break-all sm:break-normal">@janedoe • jane.doe@email.com</div>
                    </div>
                  </div>
                  <div className={`mt-3 flex flex-wrap gap-2${compact ? ' text-xs' : ''}`}> 
                    <button className="px-3 py-1.5 rounded-lg border border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Edit Profile</button>
                    <button className="px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Change Password</button>
                  </div>
                  {!compact && (
                    <p className="mt-3 text-xs text-white/60">Timezone: UTC-5 (New York) • Language: English • Joined: <span className="font-mono">2023-01-15</span></p>
                  )}
                  <div className="mt-3 text-xs text-white/60">Your email is used for login and security alerts.</div>
                  {/* Move Compact mode toggle to footer */}
                  <div className="mt-3 flex items-center gap-2 justify-end">
                    <label className="flex items-center gap-2 text-xs text-white/60">
                      <input type="checkbox" className="accent-[#F59E0B]" checked={compact} onChange={e => setCompact(e.target.checked)} />
                      Compact mode
                    </label>
                  </div>
                </section>
                {/* Security (compact, grouped, merged with KYC) */}
                <section className={`rounded-2xl bg-[#171b25] ring-1 ring-white/5${compact ? ' p-3' : ' p-4'} shadow-md`}>
                  <h3 className={`text-base font-semibold text-[#F3ECDC] mb-2${compact ? ' text-xs' : ''}`}>Security</h3>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5 first:border-t-0">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 2v2m0 16v2m8-10h2m-18 0H2m16.24 7.76l1.42 1.42M4.34 4.34l1.42 1.42"/></svg>
                      <span className="text-sm">2FA Status</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F59E0B] text-black">Enabled</span>
                      <button className="text-sm text-[#F59E0B] hover:underline focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Manage 2FA</button>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.37V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.63a2 2 0 0 1 .76-1.57l7-5.25a2 2 0 0 1 2.48 0l7 5.25a2 2 0 0 1 .76 1.57z"/></svg>
                      <span className="text-sm">Recovery Email</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="text-sm text-white/90 break-all sm:break-normal">jane.backup@email.com</span>
                      <button className="px-3 py-1.5 rounded-lg border border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Edit</button>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v-6m0 0V7m0 4l-4-4m4 4l4-4"/></svg>
                      <span className="text-sm">Password</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="font-mono text-sm text-white/70">2024-04-01</span>
                      <button className="px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Change</button>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v-6m0 0V7m0 4l-4-4m4 4l4-4"/></svg>
                      <span className="text-sm">Verification / KYC</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B] text-black">Verified</span>
                      <button className="px-3 py-1 text-xs font-semibold text-[#C87933] border border-[#C87933] rounded hover:bg-[#C87933]/10 focus:ring-2 focus:ring-[#F59E0B]/60">Upload Documents</button>
                      <button className="px-3 py-1 text-xs font-semibold text-[#C87933] border border-[#C87933] rounded hover:bg-[#C87933]/10 focus:ring-2 focus:ring-[#F59E0B]/60">View Submissions</button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-white/60">Protect trades and withdrawals with an extra step.</div>
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-white/60 mb-2">Active Sessions</h4>
                    <table className="w-full text-sm">
                      <thead className="text-white/50">
                        <tr className="[&>th]:py-2 [&>th]:font-medium [&>th]:text-left">
                          <th>Device/Browser</th>
                          <th>Location</th>
                          <th>Last Active</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr className="[&>td]:py-2">
                          <td>Chrome</td>
                          <td>New York</td>
                          <td>Today</td>
                          <td className="text-right"><button className="text-[#F59E0B] hover:underline focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Logout</button></td>
                        </tr>
                        <tr className="[&>td]:py-2">
                          <td>Mobile iOS</td>
                          <td>London</td>
                          <td>Yesterday</td>
                          <td className="text-right"><button className="text-[#F59E0B] hover:underline focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Logout</button></td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-right">
                      <button className="text-xs text-[#C87933] underline focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Log out of all sessions</button>
                    </div>
                    <p className="mt-2 text-xs text-white/50">You’re signed in on these devices.</p>
                  </div>
                </section>
              </div>
            </div>
            {/* Right column (1/3) */}
            <div className="space-y-4">
              {/* Plan & Billing (sticky on desktop) */}
              <section className="rounded-2xl bg-[#171b25] ring-1 ring-white/5 p-4 shadow-md md:sticky md:top-8">
                <h3 className="text-base font-semibold text-[#F3ECDC] mb-4">Plan & Billing</h3>
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <span className="text-xs text-white/60">Current Plan:</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B] text-black">Pro</span>
                  <span className="text-xs text-[#F59E0B] font-bold">$15/mo</span>
                  <span className="text-xs text-white/60">Trial ends in 7 days</span>
                </div>
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 0 0-10 0v2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/></svg>
                  <span className="text-xs text-white/60">Billing: Visa **** 1234</span>
                  <button aria-label="Update Billing" className="text-xs text-[#C87933] underline focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Update</button>
                </div>
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4-4 4 4"/></svg>
                  <span className="text-xs text-white/60">Invoices</span>
                  <button aria-label="View Invoices" className="text-xs text-[#C87933] underline focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">View</button>
                </div>
                <button className="mt-4 h-9 w-full rounded-xl bg-[#F59E0B] text-black font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/60">Manage Plan</button>
                <p className="mt-2 text-sm text-white/60">Upgrade to enable macro automation and weekly rebalancing.</p>
              </section>
              {/* Notifications (height matched to Plan & Billing) */}
              <section className="rounded-2xl bg-[#171b25] ring-1 ring-white/5 p-4 shadow-md min-h-[260px] flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-[#F3ECDC] mb-6">Notifications</h3>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 0 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/></svg>
                    <input type="checkbox" className="form-checkbox rounded text-[#C87933]" defaultChecked />
                    <span className="text-sm text-white">Portfolio changes</span>
                  </label>
                  <label className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 0 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/></svg>
                    <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
                    <span className="text-sm text-white">Risk alerts</span>
                  </label>
                  <label className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 0 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/></svg>
                    <input type="checkbox" className="form-checkbox rounded text-[#C87933]" defaultChecked disabled />
                    <span className="text-sm text-white">Security alerts <span className="text-xs text-[#F59E0B]">(always on)</span></span>
                  </label>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Delivery</label>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-[#202433] text-[#F59E0B] text-xs font-semibold">Email</span>
                        <span className="px-2 py-1 rounded bg-[#202433] text-white/60 text-xs font-semibold">Push (coming soon)</span>
                        <span className="px-2 py-1 rounded bg-[#202433] text-white/60 text-xs font-semibold">Web</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Danger Zone (short card at bottom) */}
              <section className="rounded-2xl bg-[#171b25] ring-1 ring-white/5 p-4 shadow-md">
                <h3 className="text-lg font-semibold text-red-400 mb-6">Danger Zone</h3>
                <div className="flex flex-col gap-4">
                  <button aria-label="Delete Account" className="w-fit px-4 py-2 rounded border border-red-500 text-red-500 font-semibold hover:bg-red-500/10 focus:ring-2 focus:ring-[#F59E0B]/60">Delete Account</button>
                  <button aria-label="Export Data" className="w-fit px-4 py-2 rounded border border-[#C87933] text-[#C87933] font-semibold hover:bg-[#C87933]/10 focus:ring-2 focus:ring-[#F59E0B]/60">Export Data</button>
                  <p className="mt-2 text-xs text-red-400">This action is permanent.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </BackgroundCandles>
  );
};

export default CustomerProfile;