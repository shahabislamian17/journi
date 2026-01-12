'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '../../../../../../lib/api';
import { useRouter } from 'next/router';

export default function Panel({ user }) {
  const router = useRouter();
  
  // Convert role (TRAVELLER/HOST) to accountType (Traveller/Host) for display
  const getAccountTypeFromRole = (role) => {
    if (!role) return 'Traveller';
    const upperRole = role.toUpperCase();
    if (upperRole === 'HOST') return 'Host';
    return 'Traveller'; // Default to Traveller
  };
  
  // Convert accountType (Traveller/Host) to role (TRAVELLER/HOST) for API
  const getRoleFromAccountType = (accountType) => {
    if (!accountType) return 'TRAVELLER';
    return accountType.toUpperCase() === 'HOST' ? 'HOST' : 'TRAVELLER';
  };
  
  // Local state to hold user data when fetched client-side
  const [userData, setUserData] = useState(user);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    accountType: getAccountTypeFromRole(user?.role) || 'Traveller',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Update userData when user prop changes
  useEffect(() => {
    if (user && user.id) {
      setUserData(user);
    }
  }, [user]);
  
  // Fetch user data client-side if not provided server-side
  useEffect(() => {
    const fetchUserData = async () => {
      // If user data already provided (server-side or previously fetched), don't fetch
      if ((user && user.id) || (userData && userData.id)) {
        return;
      }

      // Check if user is authenticated (has token)
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      
      if (!token) {
        // No token, redirect to login
        router.push('/account/log-in');
        return;
      }

      // Try to fetch user data
      try {
        const userData = await authAPI.getMe();
        if (userData && userData.user) {
          // Set user in state to trigger re-render and form update
          setUserData(userData.user);
        }
      } catch (error) {
        console.error('Error fetching user profile client-side:', error);
        // If error, token might be invalid, redirect to login
        setTimeout(() => {
          router.push('/account/log-in');
        }, 2000);
      }
    };

    fetchUserData();
  }, [user, router]);

  // Update form data when user or userData changes
  useEffect(() => {
    const currentUser = userData || user;
    if (currentUser && currentUser.id) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        accountType: getAccountTypeFromRole(currentUser.role) || 'Traveller',
      });
    }
  }, [user, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert accountType to role for API
      const role = getRoleFromAccountType(formData.accountType);
      
      await authAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        accountType: formData.accountType, // Keep for backward compatibility
        role: role, // Send as role to API
      });
      
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use userData if available (client-side fetched), otherwise use user prop (server-side)
  const currentUser = userData || user;

  // Show loading or no user message
  if (!currentUser) {
    return (
      <div className="container">
        <div className="content">
          <div className="sections">
            <div className="section one">
              <div className="blocks" data-blocks="1">
                <div className="block" data-block="1">
                  <div className="text">
                    <p>Loading profile...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="blocks" data-blocks="2">
                  <div className="block" data-block="1A">
                    <div className="title">
                      <h1 className="three">Profile</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small four">Manage your profile information and account settings.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form className="form" data-form="register" onSubmit={handleSubmit}>
                  <div className="fields">
                    <div className="fieldset">
                      <div className="blocks" data-blocks="2">
                        <div className="block" data-block="1A" data-inputs="2">
                          <div className="input">
                            <label>First Name</label>
                            <input 
                              type="text" 
                              name="firstName" 
                              value={formData.firstName} 
                              onChange={handleChange}
                              required 
                            />
                          </div>
                          <div className="input">
                            <label>Surname</label>
                            <input 
                              type="text" 
                              name="lastName" 
                              value={formData.lastName} 
                              onChange={handleChange}
                              required 
                            />
                          </div>
                        </div>

                        <div className="block" data-block="1A" data-inputs="1">
                          <div className="input">
                            <label>Email Address</label>
                            <input 
                              type="text" 
                              name="email" 
                              value={formData.email} 
                              onChange={handleChange}
                              autoCapitalize="none" 
                              required 
                            />
                          </div>
                        </div>

                        <div className="block" data-block="1A" data-inputs="1">
                          <div className="select">
                            <label>Account Type</label>
                            <select 
                              name="accountType" 
                              value={formData.accountType}
                              onChange={handleChange}
                              required
                            >
                              <option value="Traveller">Traveller</option>
                              <option value="Host">Host</option>
                            </select>
                          </div>
                        </div>

                        <div className="block" data-block="1C">
                          <div className="buttons">
                            <div className="button medium" data-button="1A">
                              <button 
                                type="submit" 
                                className="action" 
                                disabled={isLoading}
                                style={{ 
                                  border: 'none', 
                                  cursor: isLoading ? 'wait' : 'pointer',
                                  width: '100%'
                                }}
                              >
                                <div className="text">{isLoading ? 'Updating...' : 'Update'}</div>
                                <div className="background"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
