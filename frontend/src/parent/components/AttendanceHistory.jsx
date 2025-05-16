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
import { 
  useGetAttendanceHistoryQuery,
  useGetAttendanceStatsQuery,
  useGetTodayAttendanceQuery,
  useReportAbsenceMutation,
  useUpdateDailyAttendanceMutation,
  useSendDriverNoteMutation
} from '../../redux/features/attendanceSlice';
import { useGetChildrenQuery } from '../../redux/features/childSlice';
import Spinner from './Spinner';

export default function AttendanceHistory() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [showReportModal, setShowReportModal] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState({
    morningPickup: true,
    afternoonDropoff: true
  });
  const [reportData, setReportData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'absent',
    reason: '',
    returnDate: '',
    morningOnly: false,
    afternoonOnly: false
  });
  const [driverNote, setDriverNote] = useState('');
  
  // Extract month/year for API queries
  const getMonthYearParams = () => {
    const [month, year] = selectedMonth.split(' ');
    const monthNumber = new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1;
    return { month: monthNumber, year: parseInt(year) };
  };
  
  // API Queries - use our slices
  const { data: childrenData, isLoading: isLoadingChildren } = useGetChildrenQuery();
  
  const { 
    data: attendanceHistoryData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory
  } = useGetAttendanceHistoryQuery(
    { childId: selectedChild?._id, ...getMonthYearParams() },
    { skip: !selectedChild }
  );
  
  const {
    data: statsData,
    isLoading: isLoadingStats
  } = useGetAttendanceStatsQuery(
    { childId: selectedChild?._id, ...getMonthYearParams() },
    { skip: !selectedChild }
  );
  
  const {
    data: todayData,
    isLoading: isLoadingToday
  } = useGetTodayAttendanceQuery(selectedChild?._id, { skip: !selectedChild });
  
  // API Mutations
  const [reportAbsence, { isLoading: isReporting }] = useReportAbsenceMutation();
  const [updateDailyAttendance, { isLoading: isUpdatingDaily }] = useUpdateDailyAttendanceMutation();
  const [sendDriverNote, { isLoading: isSendingNote }] = useSendDriverNoteMutation();

  // Initialize selected child when data loads
  useEffect(() => {
    if (childrenData?.data?.length > 0 && !selectedChild) {
      setSelectedChild(childrenData.data[0]);
    }
  }, [childrenData, selectedChild]);
  
  // Update attendance data when todayData changes
  useEffect(() => {
    if (todayData?.data) {
      setTodayAttendance({
        morningPickup: todayData.data.morningPickup,
        afternoonDropoff: todayData.data.afternoonDropoff
      });
    }
  }, [todayData]);
  
  // Generate list of months for dropdown
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Include current month and past 11 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      options.push(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    
    return options;
  };
  
  const months = generateMonthOptions();
  
  // Calculate attendance statistics from API data or use dummy data if loading
  const totalDays = statsData?.data?.totalDays || 0;
  const presentDays = statsData?.data?.presentDays || 0;
  const absentDays = statsData?.data?.absentDays || 0;
  const lateDays = statsData?.data?.lateDays || 0;
  const attendanceRate = statsData?.data?.attendanceRate || 0;
  
  // Handle daily attendance toggle
  const handleAttendanceToggle = async (type) => {
    if (!selectedChild?._id) return;
    
    try {
      const newValue = !todayAttendance[type];
      
      // Optimistically update UI
      setTodayAttendance(prev => ({
        ...prev,
        [type]: newValue
      }));
      
      const updateData = { 
        [type]: newValue 
      };
      
      // API call to update attendance
      const response = await updateDailyAttendance({
        childId: selectedChild._id,
        data: type === 'morningPickup' 
          ? { morningPickup: newValue } 
          : { afternoonDropoff: newValue }
      }).unwrap();
      
      // Show toast notification
      const childName = selectedChild?.firstName || "your child";
      const message = `${childName} ${newValue ? 'will be available' : 'will not be available'} for ${type === 'morningPickup' ? 'morning pickup' : 'afternoon dropoff'} today`;
      
      toast.success(message);
    } catch (error) {
      // Revert optimistic update
      setTodayAttendance(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
      
      toast.error('Failed to update attendance status');
      console.error('Update attendance error:', error);
    }
  };

  // Handle reporting absence or late arrival
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedChild?._id) {
      toast.error('Please select a child first');
      return;
    }
    
    try {
      const response = await reportAbsence({
        childId: selectedChild._id,
        data: reportData
      }).unwrap();
      
      // Show success message from API
      toast.success(response.message || `Successfully reported ${reportData.status} for ${selectedChild.firstName}`);
      
      // Close modal and reset form
      setShowReportModal(false);
      setReportData({
        date: new Date().toISOString().split('T')[0],
        status: 'absent',
        reason: '',
        returnDate: '',
        morningOnly: false,
        afternoonOnly: false
      });
      
      // Refetch attendance data
      refetchHistory();
    } catch (error) {
      toast.error('Failed to report absence');
      console.error('Report absence error:', error);
    }
  };
  
  // Handle downloading attendance report
  const handleDownloadReport = () => {
    if (!attendanceHistoryData?.data?.length) {
      toast.error('No attendance data to download');
      return;
    }
    
    // Simple CSV generation
    const headers = ['Date', 'Day', 'Status', 'Pickup Time', 'Dropoff Time', 'Notes'];
    const rows = attendanceHistoryData.data.map(record => [
      record.date,
      record.day,
      record.status,
      record.pickupTime,
      record.dropoffTime,
      record.notes
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChild.firstName}-attendance-${selectedMonth.replace(' ', '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Report downloaded successfully');
  };

  // Handle sending note to driver
  const handleSendNote = async () => {
    if (!selectedChild?._id) {
      toast.error('Please select a child first');
      return;
    }
    
    if (!driverNote.trim()) {
      toast.error('Please enter a note');
      return;
    }
    
    try {
      await sendDriverNote({
        childId: selectedChild._id,
        note: driverNote
      }).unwrap();
      
      toast.success('Note sent to driver');
      setDriverNote('');
    } catch (error) {
      toast.error('Failed to send note to driver');
      console.error('Send note error:', error);
    }
  };

  return (
    <div className="space-y-6 md:pt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        
        <div className="flex items-center gap-4">
          <div>
            <select
              value={selectedChild?._id || ''}
              onChange={(e) => {
                const childId = e.target.value;
                const child = childrenData?.data?.find(c => c._id === childId);
                setSelectedChild(child);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-sm"
            >
              <option value="">Select a child</option>
              {!isLoadingChildren && childrenData?.data?.map(child => (
                <option key={child._id} value={child._id}>{child.firstName} {child.lastName}</option>
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
                studentId: selectedChild._id
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
      
      {/* Today's Attendance Section */}
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
          
          {isLoadingToday ? (
            <div className="p-20 flex justify-center">
              <Spinner />
            </div>
          ) : (
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
                    <span className="text-sm text-gray-500">{todayData?.data?.pickupTime || "7:15 AM (expected)"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Is {selectedChild.firstName} available for pickup today?</span>
                    <div className="relative">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={todayAttendance.morningPickup}
                          onChange={() => handleAttendanceToggle('morningPickup')}
                          disabled={isUpdatingDaily}
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
                    <span className="text-sm text-gray-500">{todayData?.data?.dropoffTime || "3:30 PM (expected)"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Is {selectedChild.firstName} available for dropoff today?</span>
                    <div className="relative">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={todayAttendance.afternoonDropoff}
                          onChange={() => handleAttendanceToggle('afternoonDropoff')}
                          disabled={isUpdatingDaily}
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
                    value={driverNote}
                    onChange={(e) => setDriverNote(e.target.value)}
                  ></textarea>
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors self-end"
                    onClick={handleSendNote}
                    disabled={isSendingNote || !driverNote.trim()}
                  >
                    {isSendingNote ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Attendance Overview */}
      {selectedChild && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isLoadingStats ? (
            <div className="col-span-4 p-10 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
      
      {/* Upcoming Absences Alert (if any) */}
      {selectedChild && attendanceHistoryData?.data?.some(day => 
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
          {isLoadingHistory ? (
            <div className="p-10 flex justify-center">
              <Spinner />
            </div>
          ) : attendanceHistoryData?.data?.length > 0 ? (
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
                  {attendanceHistoryData.data.map((record, index) => (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for the selected month.
            </div>
          )}
        </div>
      </div>
      
      {/* Download Report Button */}
      {selectedChild && attendanceHistoryData?.data?.length > 0 && (
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
            onClick={handleDownloadReport}
          >
            <HiArrowDown className="w-5 h-5 mr-2" />
            Download Attendance Report
          </button>
        </div>
      )}
      
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
                    value={selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''}
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
                  disabled={isReporting}
                >
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}