import Route from '../models/Route.js';

// Get all active routes
export async function getActiveRoutes(req, res) {
  try {
    const routes = await Route.find({ isActive: true }).select('_id routeNumber name');
    
    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    console.error('Get active routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get route details by ID
export async function getRouteById(req, res) {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Get route by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}