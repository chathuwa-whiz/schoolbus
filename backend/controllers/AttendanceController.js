import Child from '../models/Child.js';
import User from '../models/User.js';

// Get attendance history for a specific child
export async function getAttendanceHistory(req, res) {
  try {
    const { childId } = req.params;
    const { month, year } = req.query;
    const parentId = req.user._id;
    
    // Verify child belongs to parent
    const child = await Child.findOne({ 
      _id: childId,
      parent: parentId
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not authorized'
      });
    }
    
    // Filter attendance by month if specified
    const attendanceData = [];
    if (child.attendance && child.attendance.length > 0) {
      // Filter by month/year if provided
      child.attendance.forEach(record => {
        const recordDate = new Date(record.date);
        
        if ((!month || recordDate.getMonth() + 1 === parseInt(month)) && 
            (!year || recordDate.getFullYear() === parseInt(year))) {
          
          // Format data for frontend
          attendanceData.push({
            date: record.date,
            day: recordDate.toLocaleDateString('en-US', { weekday: 'long' }),
            status: record.absent ? "Absent" : (record.late ? "Late" : "Present"),
            pickupTime: record.morningPickup?.status === 'picked_up' ? 
              record.morningPickup.time : (record.morningPickup?.status === 'expected' ? "Expected" : "-"),
            pickupLocation: record.morningPickup?.location || "Home",
            dropoffTime: record.afternoonDropoff?.status === 'dropped_off' ? 
              record.afternoonDropoff.time : (record.afternoonDropoff?.status === 'expected' ? "Expected" : "-"),
            dropoffLocation: record.afternoonDropoff?.location || "Home",
            notes: record.notes || ""
          });
        }
      });
    }
    
    // Sort by date (newest first)
    attendanceData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.status(200).json({
      success: true,
      data: attendanceData,
      child: {
        id: child._id,
        name: `${child.firstName} ${child.lastName}`
      }
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Report absence or late arrival
export async function reportAbsence(req, res) {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;
    const { date, status, reason, returnDate, morningOnly, afternoonOnly } = req.body;
    
    // Verify child belongs to parent
    const child = await Child.findOne({ 
      _id: childId,
      parent: parentId
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not authorized'
      });
    }
    
    // Check if attendance record exists for this date
    const targetDate = new Date(date);
    let attendanceRecord = child.attendance.find(a => 
      new Date(a.date).toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]
    );
    
    // Create new record if doesn't exist
    if (!attendanceRecord) {
      child.attendance.push({
        date: targetDate,
        absent: status === 'absent',
        late: status === 'late',
        notes: reason,
        returnDate: returnDate ? new Date(returnDate) : undefined,
        morningPickup: {
          status: morningOnly ? 'unavailable' : (status === 'absent' ? 'unavailable' : 'expected')
        },
        afternoonDropoff: {
          status: afternoonOnly ? 'unavailable' : (status === 'absent' ? 'unavailable' : 'expected') 
        }
      });
    } else {
      // Update existing record
      const index = child.attendance.findIndex(a => 
        new Date(a.date).toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]
      );
      
      child.attendance[index].absent = status === 'absent';
      child.attendance[index].late = status === 'late';
      child.attendance[index].notes = reason;
      
      if (returnDate) {
        child.attendance[index].returnDate = new Date(returnDate);
      }
      
      if (morningOnly) {
        child.attendance[index].morningPickup = { status: 'unavailable' };
      }
      
      if (afternoonOnly) {
        child.attendance[index].afternoonDropoff = { status: 'unavailable' };
      }
    }
    
    await child.save();
    
    // Get formatted attendance data to return to frontend
    const recordDate = new Date(date);
    const formattedRecord = {
      date: recordDate.toISOString().split('T')[0],
      day: recordDate.toLocaleDateString('en-US', { weekday: 'long' }),
      status: status === 'absent' ? "Absent" : "Late",
      pickupTime: morningOnly ? "-" : "Expected",
      pickupLocation: "Home",
      dropoffTime: afternoonOnly ? "-" : "Expected", 
      dropoffLocation: "Home",
      notes: reason
    };
    
    res.status(200).json({
      success: true,
      message: `Successfully reported ${status} for ${child.firstName}`,
      data: formattedRecord
    });
  } catch (error) {
    console.error('Report absence error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Update daily attendance status (morning pickup/afternoon dropoff)
export async function updateDailyAttendance(req, res) {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;
    const { morningPickup, afternoonDropoff } = req.body;
    
    // Verify child belongs to parent
    const child = await Child.findOne({ 
      _id: childId,
      parent: parentId
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not authorized'
      });
    }
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if attendance record exists for today
    let todayRecord = child.attendance.find(a => 
      new Date(a.date).toISOString().split('T')[0] === today.toISOString().split('T')[0]
    );
    
    // Create new record if doesn't exist
    if (!todayRecord) {
      child.attendance.push({
        date: today,
        morningPickup: morningPickup !== undefined ? {
          status: morningPickup ? 'expected' : 'unavailable'
        } : undefined,
        afternoonDropoff: afternoonDropoff !== undefined ? {
          status: afternoonDropoff ? 'expected' : 'unavailable'
        } : undefined
      });
    } else {
      // Update existing record
      const index = child.attendance.findIndex(a => 
        new Date(a.date).toISOString().split('T')[0] === today.toISOString().split('T')[0]
      );
      
      if (morningPickup !== undefined) {
        child.attendance[index].morningPickup = {
          ...child.attendance[index].morningPickup,
          status: morningPickup ? 'expected' : 'unavailable'
        };
      }
      
      if (afternoonDropoff !== undefined) {
        child.attendance[index].afternoonDropoff = {
          ...child.attendance[index].afternoonDropoff,
          status: afternoonDropoff ? 'expected' : 'unavailable'
        };
      }
    }
    
    await child.save();
    
    res.status(200).json({
      success: true,
      message: `Attendance preferences updated for ${child.firstName}`,
      data: {
        morningPickup: morningPickup,
        afternoonDropoff: afternoonDropoff
      }
    });
  } catch (error) {
    console.error('Update daily attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get attendance statistics
export async function getAttendanceStats(req, res) {
  try {
    const { childId } = req.params;
    const { month, year } = req.query;
    const parentId = req.user._id;
    
    // Verify child belongs to parent
    const child = await Child.findOne({ 
      _id: childId,
      parent: parentId
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not authorized'
      });
    }
    
    // Filter attendance by month if specified
    const filteredAttendance = [];
    if (child.attendance && child.attendance.length > 0) {
      child.attendance.forEach(record => {
        const recordDate = new Date(record.date);
        
        if ((!month || recordDate.getMonth() + 1 === parseInt(month)) && 
            (!year || recordDate.getFullYear() === parseInt(year))) {
          filteredAttendance.push(record);
        }
      });
    }
    
    // Calculate statistics
    const totalDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter(record => !record.absent && !record.late).length;
    const absentDays = filteredAttendance.filter(record => record.absent).length;
    const lateDays = filteredAttendance.filter(record => record.late).length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendanceRate
      }
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get today's attendance status
export async function getTodayAttendance(req, res) {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;
    
    // Verify child belongs to parent
    const child = await Child.findOne({ 
      _id: childId,
      parent: parentId
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not authorized'
      });
    }
    
    // Check if today's record exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecord = child.attendance.find(a => 
      new Date(a.date).toISOString().split('T')[0] === today.toISOString().split('T')[0]
    );
    
    const defaultStatus = {
      morningPickup: true, // Default to available
      afternoonDropoff: true, // Default to available
      status: 'Present',
      pickupTime: 'Expected',
      dropoffTime: 'Expected'
    };
    
    if (!todayRecord) {
      return res.status(200).json({
        success: true,
        data: defaultStatus
      });
    }
    
    // Format data for frontend
    const todayStatus = {
      morningPickup: todayRecord.morningPickup?.status !== 'unavailable',
      afternoonDropoff: todayRecord.afternoonDropoff?.status !== 'unavailable',
      status: todayRecord.absent ? "Absent" : (todayRecord.late ? "Late" : "Present"),
      pickupTime: todayRecord.morningPickup?.time || 'Expected',
      dropoffTime: todayRecord.afternoonDropoff?.time || 'Expected',
      notes: todayRecord.notes || ""
    };
    
    res.status(200).json({
      success: true,
      data: todayStatus
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Add this function to the existing controller
export async function sendDriverNote(req, res) {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;
    const { note } = req.body;
    
    // Verify child belongs to parent
    const child = await Child.findOne({ 
      _id: childId,
      parent: parentId
    });
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not authorized'
      });
    }
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if attendance record exists for today
    let todayRecord = child.attendance.find(a => 
      new Date(a.date).toISOString().split('T')[0] === today.toISOString().split('T')[0]
    );
    
    // Create new record if doesn't exist
    if (!todayRecord) {
      child.attendance.push({
        date: today,
        notes: note
      });
    } else {
      // Update existing record
      const index = child.attendance.findIndex(a => 
        new Date(a.date).toISOString().split('T')[0] === today.toISOString().split('T')[0]
      );
      
      // Append to existing notes or create new notes
      const existingNotes = child.attendance[index].notes || '';
      child.attendance[index].notes = existingNotes ? 
        `${existingNotes}\n[Parent note]: ${note}` : 
        `[Parent note]: ${note}`;
    }
    
    await child.save();
    
    res.status(200).json({
      success: true,
      message: `Note sent to driver for ${child.firstName}`,
    });
  } catch (error) {
    console.error('Send driver note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}