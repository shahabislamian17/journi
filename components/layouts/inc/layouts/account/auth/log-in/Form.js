'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../../../../../../../lib/api';

export default function Form() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Always set cookie so server-side can access it
        const maxAge = formData.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days
        document.cookie = `token=${response.token}; path=/; max-age=${maxAge}; SameSite=Lax`;

        // Redirect to bookings page
        router.push('/account/bookings');
        return; // Prevent any further execution
      }
    } catch (error) {
      // Prevent error from bubbling up in development
      if (error && error.message) {
        const errorMessage = error.message.includes('Invalid credentials') 
          ? 'Invalid email or password. Please check your credentials and try again.'
          : error.message;
        setError(errorMessage);
      } else {
        setError('An error occurred during login. Please try again.');
      }
      // Don't re-throw the error - we've handled it
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
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
                      <h1 className="three">Log In</h1>
                    </div>
                  </div>
                  <div className="block" data-block="1B">
                    <div className="text">
                      <p className="small three">Access your account.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small five">
                    <span>New to Journi?</span>
                    <span>Click <Link className="link" href="/account/register">here</Link>.</span>
                  </p>
                  <p className="small five">
                    <span>Forgot your password?</span>
                    <span>Click <Link className="link" href="/account/forgot-password">here</Link>.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form className="form" data-form="log-in" onSubmit={handleSubmit}>
                  {error && (
                    <div style={{ 
                      color: 'red', 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      backgroundColor: '#ffebee',
                      borderRadius: '4px',
                      border: '1px solid #f44336'
                    }}>
                      {error}
                    </div>
                  )}
                  <div className="fields">
                    <div className="fieldset">
                      <div className="blocks" data-blocks="2">
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

                        <div className="block" data-block="1B" data-inputs="1">
                          <div className="blocks" data-blocks="3">
                            <div className="block" data-block="1BA">
                              <div className="input">
                                <label>Password</label>
                                <input 
                                  type={showPassword ? "text" : "password"} 
                                  name="password" 
                                  value={formData.password}
                                  onChange={handleChange}
                                  required 
                                />
                              </div>
                            </div>
                            <div className="block" data-block="1BB">
                              <div className="toggle" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <div className={`icons ${showPassword ? 'active' : ''}`}>
                                  <div className="icon" data-icon="1">
                                    <i className="icons8 icons8-eye"></i>
                                  </div>
                                  <div className="icon" data-icon="2">
                                    <i className="icons8 icons8-eye-2"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="block" data-block="1C">
                          <div className="checkbox" onClick={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))} style={{ cursor: 'pointer' }}>
                            <div className="blocks" data-blocks="4">
                              <div className="block" data-block="1CA">
                                <div className="icons">
                                  <div className={`icon ${!formData.rememberMe ? 'active' : ''}`} data-icon="1">
                                    <i className="icons8 icons8-checkbox"></i>
                                  </div>
                                  <div className={`icon ${formData.rememberMe ? 'active' : ''}`} data-icon="2">
                                    <i className="icons8 icons8-checked-checkbox"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="block" data-block="1CB">
                                <div className="text">Remember Me</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="block" data-block="1D">
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
                                <div className="text">{isLoading ? 'Logging in...' : 'Log In'}</div>
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
