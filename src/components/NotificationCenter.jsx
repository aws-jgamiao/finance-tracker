import React, { useState, useEffect } from 'react';
import notificationService from '../services/NotificationService';

const NotificationCenter = ({ darkMode }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const removeNotification = (id) => {
    notificationService.removeNotification(id);
  };

  const getNotificationStyles = (type) => {
    const baseStyles = "border-l-4 p-4 mb-3 rounded-r-lg shadow-md transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} ${darkMode ? 'bg-green-900 border-green-500 text-green-100' : 'bg-green-50 border-green-500 text-green-800'}`;
      case 'error':
        return `${baseStyles} ${darkMode ? 'bg-red-900 border-red-500 text-red-100' : 'bg-red-50 border-red-500 text-red-800'}`;
      case 'warning':
        return `${baseStyles} ${darkMode ? 'bg-yellow-900 border-yellow-500 text-yellow-100' : 'bg-yellow-50 border-yellow-500 text-yellow-800'}`;
      case 'info':
        return `${baseStyles} ${darkMode ? 'bg-blue-900 border-blue-500 text-blue-100' : 'bg-blue-50 border-blue-500 text-blue-800'}`;
      default:
        return `${baseStyles} ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-400 text-gray-800'}`;
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
      <div className="space-y-2">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={getNotificationStyles(notification.type)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {notification.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-sm mt-1 opacity-90">
                    {notification.message}
                  </p>
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 ml-2 text-lg opacity-70 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        {notifications.length > 5 && (
          <div className={`text-center p-2 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <span className="text-sm">
              +{notifications.length - 5} more notifications
            </span>
            <button
              onClick={() => notificationService.clearAll()}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;