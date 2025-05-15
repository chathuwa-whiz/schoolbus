import React, { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'react-hot-toast'
import { 
  HiCheck, 
  HiArrowDown, 
  HiCurrencyDollar, 
  HiClock, 
  HiCog, 
  HiInformationCircle,
  HiBell,
  HiTrash,
  HiCheckCircle
} from 'react-icons/hi2'

export default function Notifications() {
  // In a real application, these would come from an API
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'pickup', 
      title: 'Morning Pickup',
      message: 'Sarah was picked up at 7:15 AM',  
      time: '2023-03-15T07:15:00',
      isRead: false,
      date: 'Today'
    },
    { 
      id: 2, 
      type: 'dropoff', 
      title: 'School Drop-off',
      message: 'Sarah was dropped off at school at 7:45 AM', 
      time: '2023-03-15T07:45:00',
      isRead: false,
      date: 'Today'
    },
    { 
      id: 3, 
      type: 'payment', 
      title: 'Payment Reminder',
      message: 'Monthly transportation fee ($75) is due in 3 days', 
      time: '2023-03-15T08:00:00',
      isRead: true,
      date: 'Today'
    },
    { 
      id: 4, 
      type: 'delay', 
      title: 'Bus Delay Alert',
      message: 'Afternoon bus is running 10 minutes late due to traffic', 
      time: '2023-03-15T14:30:00',
      isRead: false,
      date: 'Today'
    },
    { 
      id: 5, 
      type: 'pickup', 
      title: 'Afternoon Pickup',
      message: 'Sarah was picked up from school at 3:15 PM', 
      time: '2023-03-14T15:15:00',
      isRead: true,
      date: 'Yesterday'
    },
    { 
      id: 6, 
      type: 'dropoff', 
      title: 'Home Drop-off',
      message: 'Sarah was dropped off at home at 3:45 PM', 
      time: '2023-03-14T15:45:00',
      isRead: true,
      date: 'Yesterday'
    },
    { 
      id: 7, 
      type: 'system', 
      title: 'System Update',
      message: 'We\'ve updated the tracking system with improved accuracy', 
      time: '2023-03-13T09:00:00',
      isRead: true,
      date: 'Mar 13, 2023'
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notificationFilters = [
    { id: 'all', label: 'All' },
    { id: 'pickup', label: 'Pickups' },
    { id: 'dropoff', label: 'Drop-offs' },
    { id: 'payment', label: 'Payments' },
    { id: 'delay', label: 'Delays' },
    { id: 'system', label: 'System' },
  ];

  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
    toast.success('Notification deleted');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.isRead) return false;
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'pickup':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <HiCheck className="w-5 h-5 text-green-600" />
          </div>
        );
      case 'dropoff':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <HiArrowDown className="w-5 h-5 text-blue-600" />
          </div>
        );
      case 'payment':
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <HiCurrencyDollar className="w-5 h-5 text-yellow-600" />
          </div>
        );
      case 'delay':
        return (
          <div className="bg-orange-100 p-2 rounded-full">
            <HiClock className="w-5 h-5 text-orange-600" />
          </div>
        );
      case 'system':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <HiCog className="w-5 h-5 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <HiInformationCircle className="w-5 h-5 text-gray-600" />
          </div>
        );
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 md:pt-20"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
        <p className="text-gray-600">
          Stay updated with pickup, drop-off, and payment notifications for your children
        </p>
      </div>

      {/* Notification actions and filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          {notificationFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeFilter === filter.id 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="unreadOnly"
              checked={showUnreadOnly}
              onChange={() => setShowUnreadOnly(!showUnreadOnly)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="unreadOnly" className="ml-2 text-sm text-gray-700">
              Unread only ({getUnreadCount()})
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              disabled={notifications.length === 0}
              className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 font-medium rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50 flex items-center"
            >
              <HiCheckCircle className="w-4 h-4 mr-1" /> Mark all read
            </button>
            <button
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 font-medium rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center"
            >
              <HiTrash className="w-4 h-4 mr-1" /> Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Notification list */}
      {Object.keys(groupedNotifications).length > 0 ? (
        Object.entries(groupedNotifications).map(([date, notificationsForDate]) => (
          <div key={date} className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4">{date}</h2>
            <div className="space-y-4">
              {notificationsForDate.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl border ${notification.isRead ? 'border-gray-200' : 'border-indigo-300'} p-4 shadow-sm relative overflow-hidden`}
                >
                  {/* Unread indicator dot */}
                  {!notification.isRead && (
                    <div className="absolute top-0 right-0 h-2 w-2 bg-indigo-600 rounded-full m-2"></div>
                  )}
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{notification.title}</h3>
                          <p className="text-gray-600">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">{formatTime(notification.time)}</span>
                      </div>
                      <div className="mt-3 flex items-center space-x-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <HiCheck className="w-4 h-4 mr-1" />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-gray-500 hover:text-red-600 flex items-center"
                        >
                          <HiTrash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <HiBell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No notifications</h3>
          <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
        </div>
      )}

      {/* Notification settings */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { id: 'pickup_dropoff', label: 'Pickup & Drop-off alerts', description: 'Get notified when your child boards or exits the bus' },
            { id: 'delays', label: 'Delay notifications', description: 'Receive alerts about bus delays or schedule changes' },
            { id: 'payment', label: 'Payment reminders', description: 'Get reminded before monthly payments are due' },
            { id: 'system', label: 'System updates', description: 'Stay informed about app updates and improvements' },
          ].map((preference) => (
            <div key={preference.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{preference.label}</h3>
                <p className="text-sm text-gray-500">{preference.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}