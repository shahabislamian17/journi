'use client';

import { useState } from 'react';
import { authAPI } from '../../../../../../../lib/api';

export default function Form() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'error' | 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus({ type: '', message: '' });

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await authAPI.forgotPassword(trimmed);
      setStatus({ type: 'success', message: res?.message || 'If email exists, reset link has been sent' });
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Failed to process request. Please try again.' });
    } finally {
      setSubmitting(false);
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
    
                                            <h1 className="three">Forgot Password</h1>
    
                                        </div>
    
                                    </div>
    
                                    <div className="block" data-block="1B">
    
                                        <div className="text">
    
                                            <p className="small three">Reset your password.</p>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2">
    
                                <div className="text">
    
                                    <p className="small five">
    
                                        <span>Remembered your password?</span>
                                        <span>Click <a className="link" href="/account/log-in">here</a>.</span>
    
                                    </p>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="section two">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <form className="form" data-form="forgot-password" onSubmit={handleSubmit} noValidate>
                                    {status.message && (
                                      <div style={{
                                        color: status.type === 'success' ? '#1b5e20' : 'red',
                                        marginBottom: '1rem',
                                        padding: '0.75rem',
                                        backgroundColor: status.type === 'success' ? '#e8f5e9' : '#ffebee',
                                        borderRadius: '4px',
                                        border: `1px solid ${status.type === 'success' ? '#2e7d32' : '#f44336'}`
                                      }}>
                                        {status.message}
                                      </div>
                                    )}
    
                                    <div className="fields">
    
                                        <div className="fieldset">
    
                                            <div className="blocks" data-blocks="2">
    
                                                <div className="block" data-block="1A" data-inputs="1">
    
                                                    <div className="input">
    
                                                        <label><span>Email Address</span></label>
    
                                                        <input
                                                          type="text"
                                                          name="email-address"
                                                          autoCapitalize="none"
                                                          value={email}
                                                          onChange={(e) => setEmail(e.target.value)}
                                                          required
                                                        />
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1C">
    
                                                    <div className="buttons">
    
                                                        <div className="button medium" data-button="1A">
    
                                                            <button
                                                              type="submit"
                                                              className="action"
                                                              disabled={submitting}
                                                              style={{ border: 'none', width: '100%', cursor: submitting ? 'wait' : 'pointer' }}
                                                            >
                                                                <div className="text">{submitting ? 'Sending...' : 'Submit'}</div>
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
