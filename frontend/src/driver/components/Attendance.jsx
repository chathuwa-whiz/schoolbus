import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function Attendance() {
  const [viewMode, setViewMode] = useState('today');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock student data
  const studentsData = [
    { id: 1, name: "Alex Johnson", grade: "3rd", status: "present", pickupTime: "7:15 AM", pickupLocation: "52 Oak Street", dropoffTime: "3:30 PM", dropoffLocation: "52 Oak Street", notes: "" },
    { id: 2, name: "Emma Wilson", grade: "5th", status: "present", pickupTime: "7:22 AM", pickupLocation: "108 Maple Avenue", dropoffTime: "3:35 PM", dropoffLocation: "108 Maple Avenue", notes: "" },
    { id: 3, name: "Jacob Smith", grade: "2nd", status: "absent", pickupTime: "-", pickupLocation: "-", dropoffTime: "-", dropoffLocation: "-", notes: "Parent notified absence" },
    { id: 4, name: "Sophia Garcia", grade: "4th", status: "present", pickupTime: "7:35 AM", pickupLocation: "221 Pine Road", dropoffTime: "3:40 PM", dropoffLocation: "221 Pine Road", notes: "" },
    { id: 5, name: "Michael Brown", grade: "1st", status: "present", pickupTime: "7:42 AM", pickupLocation: "15 Elm Drive", dropoffTime: "3:25 PM", dropoffLocation: "15 Elm Drive", notes: "" },
    { id: 6, name: "Olivia Davis", grade: "KG", status: "absent", pickupTime: "-", pickupLocation: "-", dropoffTime: "-", dropoffLocation: "-", notes: "Sick day" }
  ];

  // Filter students based on search and selected route
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateAttendanceStatus = (id, status) => {
    // In a real application, this would update the status in your state and API
    console.log(`Updating student ${id} status to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        <div className="text-sm text-gray-500">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              className={`px-4 py-2 rounded-lg ${viewMode === 'today' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setViewMode('today')}
            >
              Today
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${viewMode === 'history' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setViewMode('history')}
            >
              History
            </button>
          </div>
          
          <div className="w-full sm:w-auto flex gap-3">
            <div>
              <input 
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={currentDate.toISOString().split('T')[0]}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                <option value="all">All Routes</option>
                <option value="morning">Morning Route</option>
                <option value="afternoon">Afternoon Route</option>
              </select>
            </div>
          </div>
          
          <div className="w-full sm:w-64">
            <input 
              type="text"
              placeholder="Search students..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{filteredStudents.length}</span> students | 
              <span className="text-green-600 font-medium"> {filteredStudents.filter(s => s.status === 'present').length}</span> present | 
              <span className="text-red-600 font-medium"> {filteredStudents.filter(s => s.status === 'absent').length}</span> absent
            </p>
          </div>
          <button className="px-4 py-2 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition-colors">
            Create Report
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-lg">Student Attendance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className={student.status === 'absent' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.pickupTime}</div>
                    <div className="text-xs text-gray-500">{student.pickupLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.dropoffTime}</div>
                    <div className="text-xs text-gray-500">{student.dropoffLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.notes || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {student.status === 'absent' ? (
                        <button 
                          onClick={() => updateAttendanceStatus(student.id, 'present')}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                        >
                          Mark Present
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateAttendanceStatus(student.id, 'absent')}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                        >
                          Mark Absent
                        </button>
                      )}
                      <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                        Add Note
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination or empty state */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found matching your search.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}