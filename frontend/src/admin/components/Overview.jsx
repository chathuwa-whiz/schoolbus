import React from 'react';
import { HiUsers, HiTruck, HiClipboardCheck, HiExclamation, HiCreditCard } from 'react-icons/hi';
import { HiMapPin } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Overview() {
  // Mock data for dashboard - would be replaced with API calls
  const stats = {
    totalUsers: 157,
    activeDrivers: 28,
    totalVehicles: 35,
    activeRoutes: 42,
    pendingApprovals: 5,
    pendingPayments: 12
  };

  const recentActivity = [
    { id: 1, user: 'John Smith', action: 'added a new route', time: '10 minutes ago' },
    { id: 2, user: 'Sarah Johnson', action: 'approved driver application', time: '25 minutes ago' },
    { id: 3, user: 'Mike Chen', action: 'updated vehicle maintenance', time: '1 hour ago' },
    { id: 4, user: 'Emma Wilson', action: 'sent payment reminder', time: '2 hours ago' },
    { id: 5, user: 'Robert Davis', action: 'modified school schedule', time: '3 hours ago' }
  ];

  const pendingRequests = [
    { id: 1, type: 'Driver Application', user: 'Thomas Anderson', date: '2023-08-12' },
    { id: 2, type: 'Route Change', user: 'Maria Rodriguez', date: '2023-08-13' },
    { id: 3, type: 'Vehicle Maintenance', user: 'David Lee', date: '2023-08-14' },
    { id: 4, type: 'Driver Application', user: 'Jennifer Miller', date: '2023-08-15' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <HiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">{stats.activeDrivers} active drivers</span>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800">View all</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <HiTruck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vehicles</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalVehicles}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">All buses operational</span>
            <Link to="/admin/vehicles" className="text-blue-600 hover:text-blue-800">Manage</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <HiMapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Routes</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.activeRoutes}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">20 morning, 22 afternoon</span>
            <Link to="/admin/routes" className="text-blue-600 hover:text-blue-800">View routes</Link>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {stats.pendingApprovals} new
              </span>
            </div>
          </div>
          <div className="p-6">
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{request.type}</p>
                      <p className="text-xs text-gray-500">{request.user} • {request.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No pending requests</p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-gray-800">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-100"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <HiUsers className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="ml-3 font-medium text-blue-800">User Management</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            Manage all users, approve new driver applications, and update permissions.
          </p>
          <Link
            to="/admin/users"
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            Manage Users
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-100"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 rounded-lg p-2">
              <HiMapPin className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="ml-3 font-medium text-purple-800">Route Assignment</h3>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Assign routes to drivers, update route details, and optimize bus schedules.
          </p>
          <Link
            to="/admin/routes"
            className="inline-flex items-center text-sm font-medium text-purple-700 hover:text-purple-800"
          >
            Manage Routes
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-100"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded-lg p-2">
              <HiClipboardCheck className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="ml-3 font-medium text-green-800">Reports & Analytics</h3>
          </div>
          <p className="text-sm text-green-700 mb-4">
            Generate system-wide reports, analyze attendance data, and track key metrics.
          </p>
          <Link
            to="/admin/reports"
            className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800"
          >
            View Reports
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}