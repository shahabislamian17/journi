'use client';

import { useState } from 'react';
import { authAPI } from '../../../../../../lib/api';
import { useRouter } from 'next/router';

export default function PasswordPanel() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      // Validate passwords
      if (!formData.currentPassword || !formData.newPassword) {
        setIsLoading(false);
        return;
      }

      if (formData.newPassword.length < 6) {
        setIsLoading(false);
        return;
      }

      if (formData.currentPassword === formData.newPassword) {
        setIsLoading(false);
        return;
      }

      // Call API and handle errors gracefully
      let passwordChanged = false;
      try {
        await authAPI.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
        passwordChanged = true;
      } catch (apiError) {
        // Handle API error here to prevent it from bubbling to Next.js
        console.error('Password change API error:', apiError);
        
        // Extract user-friendly error message
        let errorMessage = 'Failed to change password. Please try again.';
        
        if (apiError?.message) {
          errorMessage = apiError.message;
        } else if (apiError?.data?.error) {
          errorMessage = apiError.data.error;
        } else if (apiError?.data?.message) {
          errorMessage = apiError.data.message;
        }
        
        // Return early to prevent any further execution
        return;
      }
      
      // Only proceed if password was changed successfully
      if (!passwordChanged) {
        return;
      }
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
      });
      
      // Optionally redirect to login after a delay
      setTimeout(() => {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; max-age=0';
        router.push('/account/log-in');
      }, 2000);
    } catch (error) {
      // Fallback catch - should not reach here if Promise.resolve.catch works
      console.error('Unexpected error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                      <h1 className="three">Login & Security</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small four">Change your password to keep your account secure.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form className="form" data-form="change-password" onSubmit={handleSubmit}>
                  <div className="fields">
                    <div className="fieldset">
                      <div className="blocks" data-blocks="2">
                        <div className="block" data-block="1B" data-inputs="1">
                          <div className="blocks" data-blocks="3">
                            <div className="block" data-block="1BA">
                              <div className="input">
                                <label>Current Password</label>
                                <input 
                                  type={showCurrentPassword ? "text" : "password"} 
                                  name="currentPassword" 
                                  value={formData.currentPassword}
                                  onChange={handleChange}
                                  required 
                                />
                              </div>
                            </div>
                            <div className="block" data-block="1BB">
                              <div 
                                className="toggle" 
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="icons">
                                  <div className={`icon ${!showCurrentPassword ? 'active' : ''}`} data-icon="1">
                                    <i className="icons8 icons8-eye"></i>
                                  </div>
                                  <div className={`icon ${showCurrentPassword ? 'active' : ''}`} data-icon="2">
                                    <i className="icons8 icons8-eye-2"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="block" data-block="1B" data-inputs="1">
                          <div className="blocks" data-blocks="4">
                            <div className="block" data-block="1BA">
                              <div className="input">
                                <label>New Password</label>
                                <input 
                                  type={showNewPassword ? "text" : "password"} 
                                  name="newPassword" 
                                  value={formData.newPassword}
                                  onChange={handleChange}
                                  required 
                                />
                              </div>
                            </div>
                            <div className="block" data-block="1BB">
                              <div 
                                className="toggle" 
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="icons">
                                  <div className={`icon ${!showNewPassword ? 'active' : ''}`} data-icon="1">
                                    <i className="icons8 icons8-eye"></i>
                                  </div>
                                  <div className={`icon ${showNewPassword ? 'active' : ''}`} data-icon="2">
                                    <i className="icons8 icons8-eye-2"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                                <div className="text">{isLoading ? 'Updating...' : 'Reset Password'}</div>
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

