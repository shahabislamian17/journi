'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../../../../../../../lib/api';

export default function Form() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    accountType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Convert accountType (Traveller/Host) to role (TRAVELLER/HOST) for API
      const role = formData.accountType && formData.accountType.toUpperCase() === 'HOST' 
        ? 'HOST' 
        : 'TRAVELLER'; // Default to TRAVELLER
      
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: role, // Send as role
        accountType: formData.accountType, // Keep for backward compatibility if needed
      });

      // Store token in localStorage and cookies
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Also set cookie for server-side access
        document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        // Redirect to profile page
        router.push('/account/profile');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  // Update select label position when value changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectElement = document.querySelector('select[name="accountType"]');
      if (selectElement) {
        const container = selectElement.closest('.select');
        if (container && formData.accountType && formData.accountType.trim() !== '') {
          container.setAttribute('data-input', 'focus');
          // Don't add inline styles - CSS handles padding automatically
        } else if (container && (!formData.accountType || formData.accountType.trim() === '')) {
          container.removeAttribute('data-input');
          // Don't manipulate inline styles - CSS handles everything
        }
      }
    }
  }, [formData.accountType]);

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
                      <h1 className="three">Register</h1>
                    </div>
                  </div>
                  <div className="block" data-block="1B">
                    <div className="text">
                      <p className="small three">Create your account.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block" data-block="2">
                <div className="text">
                  <p className="small five">
                    <span>Got an account?</span>
                    <span>Click <Link className="link" href="/account/log-in">here</Link>.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form className="form" data-form="register" onSubmit={handleSubmit}>
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

                        <div className="block" data-block="1A" data-inputs="1">
                          <div className="select">
                            <label>Account Type</label>
                            <select 
                              name="accountType" 
                              value={formData.accountType}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select account type</option>
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
                                <div className="text">{isLoading ? 'Registering...' : 'Register'}</div>
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
