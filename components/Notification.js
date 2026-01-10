'use client';

import { useEffect, useState } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Global notification queue
let notificationQueue = [];
let listeners = [];

// Notify function that can be called from anywhere
export const notify = (message, type = NOTIFICATION_TYPES.INFO, duration = 4000) => {
  const id = Date.now() + Math.random();
  const notification = { id, message, type, duration };
  notificationQueue.push(notification);
  listeners.forEach(listener => listener([...notificationQueue]));
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
  
  return id;
};

export const removeNotification = (id) => {
  notificationQueue = notificationQueue.filter(n => n.id !== id);
  listeners.forEach(listener => listener([...notificationQueue]));
};

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Subscribe to notification updates
    const listener = (newNotifications) => {
      setNotifications(newNotifications);
    };
    listeners.push(listener);
    setNotifications([...notificationQueue]);

    // Make notify function available globally for vanilla JS
    if (typeof window !== 'undefined') {
      window.notify = notify;
      // Process any queued notifications
      if (window.__notificationQueue && window.__notificationQueue.length > 0) {
        window.__notificationQueue.forEach(({ message, type, duration }) => {
          notify(message, type, duration);
        });
        window.__notificationQueue = [];
      }
    }

    return () => {
      listeners = listeners.filter(l => l !== listener);
      if (typeof window !== 'undefined') {
        delete window.notify;
      }
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container" style={styles.container}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          style={{
            ...styles.notification,
            ...styles[notification.type],
          }}
        >
          <div style={styles.content}>
            <span style={styles.icon}>{getIcon(notification.type)}</span>
            <span style={styles.message}>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              style={styles.closeButton}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <style jsx>{`
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          pointer-events: none;
        }
        .notification {
          pointer-events: auto;
          animation: slideIn 0.3s ease-out;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function getIcon(type) {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return '✓';
    case NOTIFICATION_TYPES.ERROR:
      return '✕';
    case NOTIFICATION_TYPES.WARNING:
      return '⚠';
    case NOTIFICATION_TYPES.INFO:
      return 'ℹ';
    default:
      return '•';
  }
}

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 10000,
    maxWidth: '400px',
    pointerEvents: 'none',
  },
  notification: {
    pointerEvents: 'auto',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease-out',
  },
  success: {
    backgroundColor: '#10b981',
    color: '#ffffff',
  },
  error: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  warning: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  },
  info: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '12px',
  },
  icon: {
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  message: {
    flex: 1,
    fontSize: '14px',
    lineHeight: '1.5',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    opacity: 0.8,
    transition: 'opacity 0.2s',
  },
};

