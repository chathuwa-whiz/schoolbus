import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { 
  HiDocumentText, 
  HiCheckCircle, 
  HiXCircle, 
  HiClock,
  HiArrowDown,
  HiHome,
  HiCalendar
} from 'react-icons/hi2';
import { TbBusStop } from 'react-icons/tb';

export default function AttendanceHistory() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('August 2023');
  const [showReportModal, setShowReportModal] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState({
    morningPickup: true,
    afternoonDropoff: true
  });
  const [reportData, setReportData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'absent',
    reason: '',
    returnDate: '',
    morningOnly: false,
    afternoonOnly: false
  });
  
  // Mock children data
  const children = [
    { id: 1, name: "Emma Parent" },
    { id: 2, name: "Jacob Parent" }
  ];

  // Mock attendance data - would come from API in a real app
  const [attendanceData, setAttendanceData] = useState([
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
    // other attendance records remain the same
  ]);
  
  // Calculate attendance statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(day => day.status === "Present").length;
  const absentDays = attendanceData.filter(day => day.status === "Absent").length;
  const lateDays = attendanceData.filter(day => day.status === "Late").length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);
  
  // Available months for selection
  const months = ["August 2023", "July 2023", "June 2023", "May 2023"];

  // Handle daily attendance toggle
  const handleAttendanceToggle = (type) => {
    setTodayAttendance(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    // Show toast notification
    const childName = selectedChild?.name || "your child";
    const isAvailable = !todayAttendance[type];
    const message = `${childName} ${isAvailable ? 'will be available' : 'will not be available'} for ${type === 'morningPickup' ? 'morning pickup' : 'afternoon dropoff'} today`;
    
    toast.success(message);
    
    // In a real app, you would send this to the backend
    console.log(`Updated ${type} status for ${selectedChild?.id}: ${!todayAttendance[type]}`);
  };

  // Handle reporting absence or late arrival
  const handleReportSubmit = (e) => {
    e.preventDefault();
    
    // Logic to submit report to API would go here
    
    // For demo, add to local state
    const newRecord = {
      date: reportData.date,
      day: new Date(reportData.date).toLocaleDateString('en-US', { weekday: 'long' }),
      status: reportData.status === 'absent' ? "Absent" : "Late",
      pickupTime: reportData.morningOnly ? "-" : "Expected",
      pickupLocation: "Home",
      dropoffTime: reportData.afternoonOnly ? "-" : "Expected",
      dropoffLocation: "Home",
      notes: reportData.reason
    };
    
    setAttendanceData([newRecord, ...attendanceData]);
    
    // Show success message
    toast.success(`Successfully reported ${reportData.status} for ${selectedChild?.name}`);
    
    // Close modal and reset form
    setShowReportModal(false);
    setReportData({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'absent',
      reason: '',
      returnDate: '',
      morningOnly: false,
      afternoonOnly: false
    });
  };

  // Check if today's date exists in attendance data
  const getTodayAttendanceStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendanceData.find(record => record.date === today);
    
    if (todayRecord) {
      return {
        status: todayRecord.status,
        pickupTime: todayRecord.pickupTime,
        dropoffTime: todayRecord.dropoffTime
      };
    }
    
    return null;
  };
  
  const todayStatus = getTodayAttendanceStatus();

  return (
    <div className="space-y-6 md:pt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        
        <div className="flex items-center gap-4">
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
          
          <button 
            onClick={() => {
              if (!selectedChild) {
                toast.error('Please select a child first');
                return;
              }
              setReportData(prev => ({
                ...prev,
                studentId: selectedChild.id
              }));
              setShowReportModal(true);
            }}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
          >
            <HiDocumentText className="w-5 h-5 mr-2" />
            Report Absence/Late
          </button>
        </div>
      </div>
      
      {/* Today's Attendance Section - NEW */}
      {selectedChild && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <HiCalendar className="text-indigo-600 w-5 h-5 mr-2" />
              <h2 className="font-semibold text-lg">Today's Attendance</h2>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Morning Pickup Card */}
              <div className="flex-1 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <TbBusStop className="text-amber-600 w-5 h-5" />
                    </div>
                    <h3 className="font-medium">Morning Pickup</h3>
                  </div>
                  <span className="text-sm text-gray-500">7:15 AM (expected)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Is {selectedChild.name} available for pickup today?</span>
                  <div className="relative">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={todayAttendance.morningPickup}
                        onChange={() => handleAttendanceToggle('morningPickup')}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-3 px-3 py-2 rounded-lg bg-gray-50 text-sm text-gray-600">
                  {todayAttendance.morningPickup ? 
                    "Driver will pick up the child as scheduled" : 
                    "Driver will be notified that child won't need pickup today"}
                </div>
              </div>
              
              {/* Afternoon Dropoff Card */}
              <div className="flex-1 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <HiHome className="text-blue-600 w-5 h-5" />
                    </div>
                    <h3 className="font-medium">Afternoon Dropoff</h3>
                  </div>
                  <span className="text-sm text-gray-500">3:30 PM (expected)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Is {selectedChild.name} available for dropoff today?</span>
                  <div className="relative">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={todayAttendance.afternoonDropoff}
                        onChange={() => handleAttendanceToggle('afternoonDropoff')}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-3 px-3 py-2 rounded-lg bg-gray-50 text-sm text-gray-600">
                  {todayAttendance.afternoonDropoff ? 
                    "Driver will drop off the child as scheduled" : 
                    "Driver will be notified that child won't need dropoff today"}
                </div>
              </div>
            </div>
            
            {/* Additional notes section */}
            <div className="mt-4">
              <label htmlFor="todayNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional notes for driver (optional)
              </label>
              <div className="flex gap-2">
                <textarea 
                  id="todayNotes" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Add any special instructions for today..."
                  rows="2"
                ></textarea>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors self-end">
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Attendance Overview - keep existing code */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
        >
          <div className="text-indigo-600 mb-2">
            <HiDocumentText className="w-8 h-8" />
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
            <HiCheckCircle className="w-8 h-8" />
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
            <HiXCircle className="w-8 h-8" />
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
            <HiClock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Attendance Rate</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{attendanceRate}%</p>
        </motion.div>
      </div>
      
      {/* Upcoming Absences Alert (if any) */}
      {attendanceData.some(day => 
        day.status === "Absent" && new Date(day.date) >= new Date().setHours(0,0,0,0)
      ) && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiClock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Upcoming Reported Absence</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>You've reported an upcoming absence for your child. The bus driver will be notified.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
          <HiArrowDown className="w-5 h-5 mr-2" />
          Download Attendance Report
        </button>
      </div>
      
      {/* Report Absence Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Report Absence or Late Arrival
            </h3>
            
            <form onSubmit={handleReportSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                    Child
                  </label>
                  <input
                    type="text"
                    id="childName"
                    value={selectedChild?.name || ''}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={reportData.date}
                    onChange={e => setReportData({...reportData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={reportData.status}
                    onChange={e => setReportData({...reportData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="absent">Absent</option>
                    <option value="late">Late Arrival</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    value={reportData.reason}
                    onChange={e => setReportData({...reportData, reason: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Please provide a reason for absence/late arrival"
                    required
                  ></textarea>
                </div>
                
                {reportData.status === 'absent' && (
                  <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Return Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="returnDate"
                      value={reportData.returnDate}
                      onChange={e => setReportData({...reportData, returnDate: e.target.value})}
                      min={reportData.date}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700">Specify Time (if applicable)</p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="morningOnly"
                      checked={reportData.morningOnly}
                      onChange={e => setReportData({...reportData, morningOnly: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="morningOnly" className="ml-2 text-sm text-gray-700">
                      Morning pickup only
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="afternoonOnly"
                      checked={reportData.afternoonOnly}
                      onChange={e => setReportData({...reportData, afternoonOnly: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="afternoonOnly" className="ml-2 text-sm text-gray-700">
                      Afternoon dropoff only
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}