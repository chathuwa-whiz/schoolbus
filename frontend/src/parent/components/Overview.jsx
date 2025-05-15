import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

export default function Overview() {
  // Mock data - in a real app this would come from an API
  const childrenData = [
    {
      id: 1, 
      name: "Emma Parent", 
      age: 8,
      grade: "3rd Grade",
      school: "Lincoln Elementary",
      busNo: "Bus #12",
      status: "At school",
      lastSeen: "8:15 AM",
      pickupTime: "7:15 AM",
      dropoffTime: "3:30 PM",
      avatar: "https://randomuser.me/api/portraits/girls/12.jpg"
    },
    {
      id: 2, 
      name: "Jacob Parent", 
      age: 10,
      grade: "5th Grade",
      school: "Washington Middle School",
      busNo: "Bus #15",
      status: "On bus (going home)",
      lastSeen: "3:05 PM",
      pickupTime: "7:30 AM",
      dropoffTime: "3:45 PM",
      avatar: "https://randomuser.me/api/portraits/boys/15.jpg"
    }
  ];

  // Mock attendance data
  const attendanceData = [
    { date: "Mon, Jul 15", status: "Present", pickupTime: "7:15 AM", dropoffTime: "3:35 PM" },
    { date: "Tue, Jul 16", status: "Present", pickupTime: "7:13 AM", dropoffTime: "3:32 PM" },
    { date: "Wed, Jul 17", status: "Absent", pickupTime: "-", dropoffTime: "-" },
    { date: "Thu, Jul 18", status: "Present", pickupTime: "7:18 AM", dropoffTime: "3:37 PM" },
    { date: "Fri, Jul 19", status: "Present", pickupTime: "7:16 AM", dropoffTime: "3:33 PM" },
  ];

  // Mock payment data
  const paymentData = {
    nextPayment: {
      amount: "$85.00",
      dueDate: "August 1, 2023",
      status: "Pending"
    },
    recentPayments: [
      { id: "INV-2023-07", date: "July 1, 2023", amount: "$85.00", status: "Paid" },
      { id: "INV-2023-06", date: "June 1, 2023", amount: "$85.00", status: "Paid" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Children Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {childrenData.map((child) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <img 
                  src={child.avatar} 
                  alt={child.name} 
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{child.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">{child.grade}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">{child.busNo}</span>
                  </div>
                </div>
                <div className="ml-auto">
                  {child.status === "At school" ? (
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {child.status}
                    </span>
                  ) : child.status === "On bus (going home)" ? (
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {child.status}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                      {child.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Pickup</p>
                  <p className="font-medium text-gray-800">{child.pickupTime}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Drop-off</p>
                  <p className="font-medium text-gray-800">{child.dropoffTime}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-gray-500">Last seen</p>
                  <p className="font-medium text-gray-800">{child.lastSeen} ({child.status})</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Link to={`/parent/dashboard/tracking?child=${child.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Track on map
                </Link>
                <Link to={`/parent/dashboard/children/${child.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Recent Attendance</h3>
              <Link to="/parent/dashboard/attendance" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Date</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Status</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Pickup</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Drop-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.date}</td>
                      <td className="px-4 py-3 text-sm">
                        {item.status === "Present" ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {item.status}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.pickupTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.dropoffTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Payment Summary</h3>
              <Link to="/parent/dashboard/payments" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View all
              </Link>
            </div>
            <div className="mb-4 p-4 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Next Payment</span>
                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  {paymentData.nextPayment.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-semibold">{paymentData.nextPayment.amount}</p>
                  <p className="text-xs text-gray-500">Due {paymentData.nextPayment.dueDate}</p>
                </div>
                <Link 
                  to="/parent/dashboard/payments" 
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Pay Now
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Payments</h4>
              {paymentData.recentPayments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{payment.id}</p>
                    <p className="text-xs text-gray-500">{payment.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{payment.amount}</p>
                    <p className="text-right">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}