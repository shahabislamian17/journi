'use client';

import { useState } from 'react';
import { messagesAPI } from '../../../../../../lib/api';

export default function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (submitting) return;

    const fd = new FormData(e.currentTarget);
    const firstName = (fd.get('first-name') || '').toString().trim();
    const surname = (fd.get('surname') || '').toString().trim();
    const emailAddress = (fd.get('email-address') || '').toString().trim();
    const subject = (fd.get('subject') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!firstName || !surname || !emailAddress || !subject || !message) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    try {
      // Backend /api/messages requires authentication; messagesAPI will attach token if logged in.
      const payloadMessage = `From: ${firstName} ${surname}\nEmail: ${emailAddress}\n\n${message}`;
      const res = await messagesAPI.create({ subject, message: payloadMessage });

      if (res?.message?.id) {
        setStatus({ type: 'success', message: 'Message sent successfully.' });
        e.currentTarget.reset();
      } else {
        setStatus({ type: 'error', message: res?.error || 'Failed to send message. Please log in and try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Failed to send message. Please try again.' });
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
    
                                        <div className="blocks" data-blocks="3">
    
                                            <div className="block" data-block="1AA">
    
                                                <div className="title">
    
                                                    <h1 className="one">Contact</h1>
    
                                                </div>
    
                                            </div>
    
                                            <div className="block" data-block="1AB">
    
                                                <div className="text">
    
                                                    <p>Duis aute irure dolor in officia reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sinte.</p>
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                            <div className="block" data-block="2">
    
                                <div className="blocks" data-blocks="4">
    
                                    <div className="block" data-block="2A">
    
                                        <div className="blocks" data-blocks="5">
    
                                            <div className="block" data-block="2AA">
    
                                                <div className="title">
    
                                                    <h2 className="three">Email</h2>
    
                                                </div>
    
                                            </div>
    
                                            <div className="block" data-block="2AB">
    
                                                <div className="text">
    
                                                    <p><a className="link" href="mailto:contact@journi.to">contact@journi.to</a></p>
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                    </div>
    
                                    <div className="block" data-block="2A">
    
                                        <div className="blocks" data-blocks="6">
    
                                            <div className="block" data-block="2AA">
    
                                                <div className="title">
    
                                                    <h2 className="three">Address</h2>
    
                                                </div>
    
                                            </div>
    
                                            <div className="block" data-block="2AB">
    
                                                <div className="text">
    
                                                    <p>
    
                                                        <span>Carrer de Carles III, 4</span>
                                                        <span>07800 Eivissa</span>
                                                        <span>Illes Balears</span>
                                                        <span>Spain</span>
    
                                                    </p>
    
                                                </div>
    
                                            </div>
    
                                        </div>
    
                                    </div>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <div className="section two">
    
                        <div className="blocks" data-blocks="1">
    
                            <div className="block" data-block="1">
    
                                <form className="form" onSubmit={handleSubmit} noValidate>
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
    
                                                <div className="block" data-block="1A" data-inputs="2">
    
                                                    <div className="input">
    
                                                        <label><span>First Name</span></label>
    
                                                        <input type="text" name="first-name" required />
    
                                                    </div>
    
                                                    <div className="input">
    
                                                        <label><span>Surname</span></label>
    
                                                        <input type="text" name="surname" required />
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1B" data-inputs="1">
    
                                                    <div className="input">
    
                                                        <label><span>Email Address</span></label>
    
                                                        <input type="text" name="email-address" autocapitalize="none" required />
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1C" data-inputs="1">
    
                                                    <div className="input">
    
                                                        <label><span>Subject</span></label>
    
                                                        <input type="text" name="subject" required />
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1D" data-inputs="1">
    
                                                    <div className="input">
    
                                                        <label><span>Message</span></label>
    
                                                        <textarea rows="4" name="message" required></textarea>
    
                                                    </div>
    
                                                </div>
    
                                                <div className="block" data-block="1E">
    
                                                    <div className="buttons">
    
                                                        <div className="button medium" data-button="1A">
    
                                                            <button className="action" type="submit" disabled={submitting} style={{ border: 'none', width: '100%', cursor: submitting ? 'wait' : 'pointer' }}>
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
