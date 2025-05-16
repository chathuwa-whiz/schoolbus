import Bus from '../models/Bus.js';
import Route from '../models/Route.js';

// Get all buses
export async function getAllBuses(req, res) {
  try {
    const buses = await Bus.find().sort({ busNumber: 1 });
    
    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    console.error('Get all buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get available buses (not assigned to routes)
export async function getAvailableBuses(req, res) {
  try {
    // Find buses that are active and not already assigned to a route
    const assignedBusIds = await Route.find({ isActive: true }).distinct('bus');
    const availableBuses = await Bus.find({
      _id: { $nin: assignedBusIds },
      status: 'active'
    }).sort({ busNumber: 1 });
    
    res.status(200).json({
      success: true,
      count: availableBuses.length,
      data: availableBuses
    });
  } catch (error) {
    console.error('Get available buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}