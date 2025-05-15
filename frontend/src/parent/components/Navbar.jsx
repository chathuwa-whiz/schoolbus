import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Navbar({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    { id: 1, text: "Your child was picked up at 7:15 AM", time: "1h ago", isNew: true },
    { id: 2, text: "Your child was dropped off at school at 7:45 AM", time: "45m ago", isNew: true },
    { id: 3, text: "Payment for March is due in 3 days", time: "2h ago", isNew: false },
  ];
  
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    // Redirect to home page happens in App.jsx with protected routes
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
      <div className="px-4 md:px-6 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-3 text-gray-600 hover:text-indigo-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link to="/parent/dashboard" className="flex items-center">
            <img src="/logo.png" alt="BusTracker" className="h-8 w-auto mr-2" />
            <span className="text-xl font-bold text-indigo-900 hidden md:inline-block">BusTracker</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 focus:outline-none relative"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-30">
                <h3 className="px-4 py-2 font-medium border-b border-gray-200">Notifications</h3>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.isNew ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{notification.text}</p>
                        {notification.isNew && (
                          <span className="bg-blue-500 h-2 w-2 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/parent/dashboard/notifications" 
                  className="block text-center text-sm text-indigo-600 font-medium py-2 hover:bg-gray-50"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-2">
                JP
              </div>
              <span className="hidden md:inline-block font-medium">John Parent</span>
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-30">
                <Link 
                  to="/parent/dashboard/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile Settings
                </Link>
                <Link 
                  to="/parent/dashboard/children" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Manage Children
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}