import React, { useState } from 'react'
import { motion } from 'motion/react'

export default function AttendanceHistory() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('August 2023');
  
  // Mock children data
  const children = [
    { id: 1, name: "Emma Parent" },
    { id: 2, name: "Jacob Parent" }
  ];

  // Mock attendance data - would come from API in a real app
  const attendanceData = [
    { 
      date: "2023-08-01", 
      day: "Tuesday",
      status: "Present", 
      pickupTime: "7:15 AM", 
      pickupLocation: "Home",
      dropoffTime: "3:35 PM", 
      dropoffLocation: "Home",
      notes: ""
    },
    { 
      date: "2023-08-02", 
      day: "Wednesday",
      status: "Present", 
      pickupTime: "7:13 AM", 
      pickupLocation: "Home",
      dropoffTime: "3:32 PM", 
      dropoffLocation: "Home",
      notes: ""
    },
    { 
      date: "2023-08-03", 
      day: "Thursday",
      status: "Absent", 
      pickupTime: "-", 
      pickupLocation: "-",
      dropoffTime: "-", 
      dropoffLocation: "-",
      notes: "Sick day"
    },
    { 
      date: "2023-08-04", 
      day: "Friday",
      status: "Present", 
      pickupTime: "7:18 AM", 
      pickupLocation: "Home",
      dropoffTime: "3:37 PM", 
      dropoffLocation: "Home",
      notes: ""
    },
    { 
      date: "2023-08-07", 
      day: "Monday",
      status: "Present", 
      pickupTime: "7:12 AM", 
      pickupLocation: "Home",
      dropoffTime: "3:31 PM", 
      dropoffLocation: "Home",
      notes: ""
    },
    { 
      date: "2023-08-08", 
      day: "Tuesday",
      status: "Late", 
      pickupTime: "7:25 AM", 
      pickupLocation: "Home",
      dropoffTime: "3:33 PM", 
      dropoffLocation: "Home",
      notes: "Bus arrived late"
    },
  ];
  
  // Calculate attendance statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(day => day.status === "Present").length;
  const absentDays = attendanceData.filter(day => day.status === "Absent").length;
  const lateDays = attendanceData.filter(day => day.status === "Late").length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);
  
  // Available months for selection (would be dynamic in a real app)
  const months = ["August 2023", "July 2023", "June 2023", "May 2023"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance History</h1>
        
        <div className="flex space-x-4">
          <div>
            <select
              value={selectedChild?.id || ''}
              onChange={(e) => {
                const childId = parseInt(e.target.value);
                const child = children.find(c => c.id === childId);
                setSelectedChild(child);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-sm"
            >
              <option value="">Select a child</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-sm"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
        >
          <div className="text-indigo-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Total School Days</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalDays}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
        >
          <div className="text-green-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Present Days</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{presentDays}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
        >
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Absent Days</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{absentDays}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
        >
          <div className="text-amber-600 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Attendance Rate</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{attendanceRate}%</p>
        </motion.div>
      </div>
      
      {/* Attendance Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">Detailed Attendance Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Day</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Pickup Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Dropoff Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{record.day}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' : 
                        record.status === 'Absent' ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{record.pickupTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{record.dropoffTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Download Report Button */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Attendance Report
        </button>
      </div>
    </div>
  )
}