'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authAPI } from '../../../../../../lib/api';

export default function Navigation({ user: initialUser = null }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  
  // Fetch user if not provided and token exists
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || 
                    document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      if (token) {
        authAPI.getMe({ token }).then(data => {
          if (data?.user) setUser(data.user);
        }).catch(() => {
          // Ignore errors - user will be null
        });
      }
    }
  }, [user]);
  
  const isHost = user?.role === 'HOST';

  const handleLogout = (e) => {
    e.preventDefault();
    
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Clear token cookie
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
    
    // Redirect to login page
    setTimeout(() => {
      router.push('/account/log-in');
    }, 500);
  };

  return (
        <div className="container">
    
            <div className="content">
    
                <div className="blocks" data-blocks="1">
    
                    <div className="block" data-block="1A">
    
                        <div className="title">
    
                            <h4 className="two">Navigation</h4>
    
                        </div>
    
                    </div>
    
                    <div className="block" data-block="1B">
    
                        <div className="list">
    
                            <ul>
    
                                <li data-link="bookings">
    
                                    <a className="action" href="/account/bookings">Bookings</a>
    
                                </li>
    
                                {isHost && (
                                    <li data-link="experiences">
                                        <a className="action" href="/account/experiences">Experiences</a>
                                    </li>
                                )}
    
                                <li data-link="profile">
    
                                    <a className="action" href="/account/profile">Profile</a>
    
                                </li>
    
                                <li data-link="messages">
    
                                    <a className="action" href="/account/messages">Messages</a>
    
                                </li>
    
                                <li data-link="login-security">
    
                                    <a className="action" href="/account/login-security">Login & Security</a>
    
                                </li>
    
                                <li data-link="logout">
    
                                    <a className="action" href="#" onClick={handleLogout}>Logout</a>
    
                                </li>
    
                            </ul>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </div>
    
  );
}
