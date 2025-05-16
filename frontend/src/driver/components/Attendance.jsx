import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { 
  HiUserCircle, HiChevronDown, HiOutlinePencil, 
  HiCheck, HiClock, HiHome, HiExclamationCircle, HiPlus
} from 'react-icons/hi2';
import { HiSearch, HiX } from 'react-icons/hi';
import { TbBusStop } from 'react-icons/tb';
import { 
  useGetDriverRouteStudentsQuery,
  useMarkAttendanceStatusMutation,
  useAddAttendanceNoteMutation
} from '../../redux/features/attendanceSlice';
import Spinner from '../components/Spinner';

export default function Attendance() {
  const [viewMode, setViewMode] = useState('today');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('morning'); // 'morning' or 'afternoon'
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Format date for API queries
  const formattedDate = currentDate.toISOString().split('T')[0];

  // RTK Query hooks
  const { 
    data: studentsData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetDriverRouteStudentsQuery({ 
    date: formattedDate, 
    route: selectedRoute === 'all' ? undefined : selectedRoute 
  });

  const [markAttendance, { isLoading: isMarkingAttendance }] = useMarkAttendanceStatusMutation();
  const [addNote, { isLoading: isAddingNote }] = useAddAttendanceNoteMutation();

  // Filter students based on search term
  const filteredStudents = studentsData?.data?.length > 0 
    ? studentsData.data.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const updateAttendanceStatus = async (childId, newStatus) => {
    try {
      const timeKey = selectedTimeOfDay;
      await markAttendance({
        childId,
        data: {
          date: formattedDate,
          timeOfDay: timeKey,
          status: newStatus
        }
      }).unwrap();
      
      const statusText = newStatus === "picked_up" ? "picked up" :
                         newStatus === "dropped_off" ? "dropped off" : 
                         newStatus === null ? "status reset" : "marked absent";
                         
      toast.success(`Student ${statusText} successfully`);
      refetch();
    } catch (err) {
      toast.error(`Failed to update attendance: ${err.data?.message || 'Unknown error'}`);
    }
  };

  const handleAddNote = (childId) => {
    const student = filteredStudents.find(s => s._id === childId);
    setSelectedStudent(student);
    setNoteText(student.notes || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!selectedStudent) return;
    
    try {
      await addNote({
        childId: selectedStudent._id,
        data: {
          date: formattedDate,
          note: noteText
        }
      }).unwrap();
      
      toast.success(`Note saved for ${selectedStudent.name}`);
      refetch();
      
      // Close modal
      setShowNoteModal(false);
      setSelectedStudent(null);
      setNoteText('');
    } catch (err) {
      toast.error(`Failed to save note: ${err.data?.message || 'Unknown error'}`);
    }
  };

  // Get counts for the current time of day
  const getTodayCounts = () => {
    if (!filteredStudents.length) {
      return {
        total: 0,
        expected: 0,
        notExpected: 0,
        pickedUp: 0,
        absent: 0,
        pending: 0
      };
    }

    const timeKey = selectedTimeOfDay;
    const totalCount = filteredStudents.length;
    const expectedCount = filteredStudents.filter(s => 
      s.parentReported && s.parentReported[timeKey]
    ).length;
    const notExpectedCount = filteredStudents.filter(s => 
      s.parentReported && !s.parentReported[timeKey]
    ).length;
    
    const pickedUpCount = filteredStudents.filter(s => 
      s.status && (s.status[timeKey] === "picked_up" || s.status[timeKey] === "dropped_off")
    ).length;
    
    const absentCount = filteredStudents.filter(s => 
      s.status && s.status[timeKey] === "absent"
    ).length;
    
    const pendingCount = expectedCount - pickedUpCount - absentCount;
    
    return {
      total: totalCount,
      expected: expectedCount,
      notExpected: notExpectedCount,
      pickedUp: pickedUpCount,
      absent: absentCount,
      pending: pendingCount
    };
  };
  
  const counts = getTodayCounts();

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
          
          {/* Time of Day Selection - Morning or Afternoon */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              className={`px-4 py-2 rounded-lg flex items-center ${selectedTimeOfDay === 'morning' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedTimeOfDay('morning')}
            >
              <TbBusStop className="mr-2" /> Morning Pickup
            </button>
            <button 
              className={`px-4 py-2 rounded-lg flex items-center ${selectedTimeOfDay === 'afternoon' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedTimeOfDay('afternoon')}
            >
              <HiHome className="mr-2" /> Afternoon Dropoff
            </button>
          </div>
          
          <div className="w-full sm:w-auto flex gap-3">
            <div>
              <input 
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={formattedDate}
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
          
          <div className="w-full sm:w-64 relative">
            <input 
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-lg font-semibold">{counts.total}</div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <div className="text-xs text-blue-500">Expected</div>
            <div className="text-lg font-semibold text-blue-600">{counts.expected}</div>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-center">
            <div className="text-xs text-red-500">Not Expected</div>
            <div className="text-lg font-semibold text-red-600">{counts.notExpected}</div>
          </div>
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <div className="text-xs text-green-500">{selectedTimeOfDay === 'morning' ? 'Picked Up' : 'Dropped Off'}</div>
            <div className="text-lg font-semibold text-green-600">{counts.pickedUp}</div>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg text-center">
            <div className="text-xs text-amber-500">Pending</div>
            <div className="text-lg font-semibold text-amber-600">{counts.pending}</div>
          </div>
          <div className="bg-gray-100 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-600">Confirmed Absent</div>
            <div className="text-lg font-semibold text-gray-700">{counts.absent}</div>
          </div>
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
          <h2 className="font-semibold text-gray-800 text-lg">
            {selectedTimeOfDay === 'morning' ? 'Morning Pickup Attendance' : 'Afternoon Dropoff Attendance'}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-20 flex justify-center">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            <HiExclamationCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Error loading attendance data: {error?.data?.message || 'Unknown error'}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Reported</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {selectedTimeOfDay === 'morning' ? 'Pickup Location' : 'Dropoff Location'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const timeKey = selectedTimeOfDay;
                    const isExpected = student.parentReported?.[timeKey];
                    const currentStatus = student.status?.[timeKey];
                    
                    // Determine row background color
                    let rowClass = 'hover:bg-gray-50';
                    if (!isExpected) rowClass = 'bg-red-50';
                    else if (currentStatus === 'absent') rowClass = 'bg-gray-50';
                    
                    return (
                      <tr key={student._id} className={rowClass}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                              {student.firstName && student.lastName ? 
                                `${student.firstName[0]}${student.lastName[0]}` : 
                                student.name?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName && student.lastName ? 
                                  `${student.firstName} ${student.lastName}` : 
                                  student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.parentReported?.[timeKey] ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Not Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {currentStatus === null || currentStatus === undefined ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Marked
                            </span>
                          ) : currentStatus === "picked_up" || currentStatus === "dropped_off" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                              <HiCheck className="mr-1" />
                              {currentStatus === "picked_up" ? "Picked Up" : "Dropped Off"}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                              <HiX className="mr-1" />
                              Absent
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {selectedTimeOfDay === 'morning' ? 
                              student.pickupAddress?.street || 'Not specified' : 
                              student.dropoffAddress?.street || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {student.notes || (student.parentNote ? <span className="italic text-blue-600">{student.parentNote}</span> : "-")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {/* Different action buttons based on status */}
                            {isExpected && !currentStatus && (
                              <>
                                <button 
                                  onClick={() => updateAttendanceStatus(student._id, selectedTimeOfDay === 'morning' ? 'picked_up' : 'dropped_off')}
                                  className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 flex items-center"
                                  disabled={isMarkingAttendance}
                                >
                                  <HiCheck className="mr-1" />
                                  {selectedTimeOfDay === 'morning' ? 'Pick Up' : 'Drop Off'}
                                </button>
                                <button 
                                  onClick={() => updateAttendanceStatus(student._id, 'absent')}
                                  className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 flex items-center"
                                  disabled={isMarkingAttendance}
                                >
                                  <HiX className="mr-1" />
                                  Absent
                                </button>
                              </>
                            )}
                            
                            {currentStatus && (
                              <button 
                                onClick={() => updateAttendanceStatus(student._id, null)}
                                className="px-3 py-1 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 flex items-center"
                                disabled={isMarkingAttendance}
                              >
                                <HiOutlinePencil className="mr-1" />
                                Update
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleAddNote(student._id)}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center"
                              disabled={isAddingNote}
                            >
                              <HiPlus className="mr-1" />
                              Note
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Empty state */}
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No students found matching your search.</p>
              </div>
            )}
          </>
        )}
      </motion.div>
      
      {/* Add Note Modal */}
      {showNoteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Note for {selectedStudent.firstName} {selectedStudent.lastName}
            </h3>
            
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows="4"
              placeholder="Enter attendance note..."
            ></textarea>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isAddingNote}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                disabled={isAddingNote}
              >
                {isAddingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}