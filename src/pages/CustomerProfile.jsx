import React, { useState, useEffect } from 'react';
import BackgroundCandles from '../components/layouts/BackgroundCandles';

const CustomerProfile = () => {
  const [compact, setCompact] = React.useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user ID from local storage
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await fetch(`http://localhost:8000/api/v1/user/${userId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (err) {
      return 'Invalid Date';
    }
  };

  return (
    <BackgroundCandles>
      <div className={`w-full flex-col items-stretch px-4 sm:px-6 lg:px-8 bg-[#10131C]${compact ? ' compact' : ''}`}>
        <div className={`w-full max-w-7xl mx-auto px-0 sm:px-4 py-6${compact ? ' p-2' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Left column (2/3) */}
            <div className="md:col-span-2">
              <div className={`space-y-4${compact ? ' text-xs' : ''}`}> 
                {/* Profile section */}
                <section className={`rounded-2xl bg-[#171b25] ring-1 ring-white/5${compact ? ' p-3' : ' p-4'} shadow-md w-full`}>
                  <h1 className="text-lg font-semibold text-[#F3ECDC] mb-2 w-full">Account</h1>
                  
                  {loading ? (
                    <div className="py-4 text-center text-white/70">
                      <div className="animate-pulse rounded-full h-12 w-12 bg-white/10 mx-auto mb-2"></div>
                      <p>Loading user profile...</p>
                    </div>
                  ) : error ? (
                    <div className="py-4 text-center text-red-400">
                      <p>Error loading profile: {error}</p>
                      <button className="mt-2 px-4 py-2 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/30">
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <img src="/logo.jpg" alt="Profile" className="h-9 w-9 rounded-xl" />
                      <div className="leading-tight">
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-[#F3ECDC] break-all sm:break-normal">
                            {userData?.given_name || ''} {userData?.family_name || ''}
                          </h2>
                          <span className="px-3 py-1 rounded-full text-base font-bold bg-[#F59E0B] text-black">Verified</span>
                        </div>
                        <div className="text-lg font-semibold text-white/80 break-all sm:break-normal">
                          @{userData?.given_name?.toLowerCase() || 'user'} • {userData?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  )}
                  {!compact && userData && (
                    <p className="mt-3 text-xs text-white/60">
                      Timezone: UTC-5 (New York) • Language: English • Joined: <span className="font-mono">{formatDate(userData.created_at)}</span>
                    </p>
                  )}
                  <div className="mt-3 text-xs text-white/60">Your email is used for login and security alerts.</div>
                  
                  {/* User details section - with full width for proper justification */}
                  {userData && (
                    <div className="mt-4 pt-4 border-t border-white/10 w-full">
                      <h3 className="text-sm font-semibold text-[#F3ECDC] mb-2 w-full">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm w-full">
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Email:</span>
                          <span className="text-white text-right">{userData.email || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Contact Email:</span>
                          <span className="text-white text-right">{userData.contact_email || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Phone:</span>
                          <span className="text-white text-right">{userData.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Date of Birth:</span>
                          <span className="text-white text-right">{formatDate(userData.date_of_birth) || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Tax ID:</span>
                          <span className="text-white text-right">{userData.tax_id || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Alpaca ID:</span>
                          <span className="text-white text-right">{userData.id_alpaca || 'Not connected'}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-[#F3ECDC] mt-4 mb-2 w-full">Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm w-full">
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Street:</span>
                          <span className="text-white text-right">{userData.street_address || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">City:</span>
                          <span className="text-white text-right">{userData.city || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">State:</span>
                          <span className="text-white text-right">{userData.state || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Postal Code:</span>
                          <span className="text-white text-right">{userData.postal_code || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Country of Birth:</span>
                          <span className="text-white text-right">{userData.country_of_birth || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-white/60">Country of Citizenship:</span>
                          <span className="text-white text-right">{userData.country_of_citizenship || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Move Compact mode toggle to footer */}
                  <div className="mt-3 flex items-center gap-2 justify-end w-full">
                    <label className="flex items-center gap-2 text-xs text-white/60">
                      <input type="checkbox" className="accent-[#F59E0B]" checked={compact} onChange={e => setCompact(e.target.checked)} />
                      Compact mode
                    </label>
                  </div>
                </section>

                {/* Security section */}
                 {userData && (
                <section className={`rounded-2xl bg-[#171b25] ring-1 ring-white/5${compact ? ' p-3' : ' p-4'} shadow-md w-full`}>
                  <h3 className={`text-base font-semibold text-[#F3ECDC] mb-2 w-full${compact ? ' text-xs' : ''}`}>Security</h3>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5 first:border-t-0">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 2v2m0 16v2m8-10h2m-18 0H2m16.24 7.76l1.42 1.42M4.34 4.34l1.42 1.42"/></svg>
                      <span className="text-sm">2FA Status</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F59E0B] text-black">Enabled</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.37V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.63a2 2 0 0 1 .76-1.57l7-5.25a2 2 0 0 1 2.48 0l7 5.25a2 2 0 0 1 .76 1.57z"/></svg>
                      <span className="text-sm">Recovery Email</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="text-sm text-white/90 break-all sm:break-normal">{userData.contact_email || "No Recovery Email Set"}</span> 
                    </div>
                  </div>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v-6m0 0V7m0 4l-4-4m4 4l4-4"/></svg>
                      <span className="text-sm">Password</span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className="font-mono text-sm text-white/70">2024-04-01</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-center justify-between border-t border-white/5">
                  </div>
                </section>
                 )}
              </div>
            </div>
           
            
            {/* Right column (1/3) */}
            <div className="space-y-4 w-full">
              
              
            </div>
          </div>
        </div>
      </div>
    </BackgroundCandles>
  );
};

export default CustomerProfile;