import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Tracking() {
  const [isTracking, setIsTracking] = useState(true);
  const [locationUpdateFrequency, setLocationUpdateFrequency] = useState(30); // seconds
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    speed: 25,
    heading: 90,
    lastUpdated: new Date().toLocaleTimeString()
  });

  // Simulate location updates
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        // In a real app, this would get the actual GPS location from the device
        setCurrentLocation(prev => ({
          latitude: prev.latitude + (Math.random() * 0.001 - 0.0005),
          longitude: prev.longitude + (Math.random() * 0.001 - 0.0005),
          speed: Math.max(0, Math.min(65, prev.speed + (Math.random() * 10 - 5))),
          heading: (prev.heading + (Math.random() * 10 - 5)) % 360,
          lastUpdated: new Date().toLocaleTimeString()
        }));
      }, locationUpdateFrequency * 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTracking, locationUpdateFrequency]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Location Tracking</h1>
        <div className="flex items-center">
          <span className={`flex h-3 w-3 relative mr-2 ${isTracking ? 'animate-pulse' : ''}`}>
            <span className={`absolute inline-flex h-full w-full rounded-full ${isTracking ? 'bg-green-400 opacity-75' : 'bg-red-400 opacity-75'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="text-sm text-gray-600">{isTracking ? 'Tracking Active' : 'Tracking Paused'}</span>
        </div>
      </div>

      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2"
        >
          <div className="p-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 text-lg">Live Location</h2>
              <div className="text-sm text-gray-600">
                Last updated: {currentLocation.lastUpdated}
              </div>
            </div>
          </div>
          
          <div className="relative" style={{ height: '500px' }}>
            {/* In a real app, this would be a proper map component like Google Maps or Leaflet */}
            <img 
              src="https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=13&size=800x500&maptype=roadmap&markers=color:red%7C37.7749,-122.4194&key=YOUR_API_KEY_HERE" 
              alt="Map showing current location" 
              className="w-full h-full object-cover"
            />
            
            {/* Map overlay info */}
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-500 text-sm">Current coordinates:</span>
                  <h3 className="font-medium">
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 text-sm">Current speed:</span>
                  <h3 className="font-medium">{Math.round(currentLocation.speed)} mph</h3>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tracking controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800 text-lg">Tracking Controls</h2>
          </div>
          
          <div className="p-5 space-y-6">
            {/* Tracking toggle */}
            <div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isTracking}
                    onChange={() => setIsTracking(!isTracking)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isTracking ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {isTracking ? 'Live Tracking Enabled' : 'Tracking Disabled'}
                </div>
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {isTracking 
                  ? 'Your location is being shared with the school and parents in real-time.' 
                  : 'Location sharing is currently paused.'}
              </p>
            </div>
            
            {/* Update frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Update Frequency
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={locationUpdateFrequency}
                onChange={(e) => setLocationUpdateFrequency(Number(e.target.value))}
                disabled={!isTracking}
              >
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 1 minute</option>
                <option value="300">Every 5 minutes</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                More frequent updates provide better accuracy but use more data and battery.
              </p>
            </div>
            
            {/* Current status */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Current Status</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex justify-between">
                  <span>GPS Signal:</span>
                  <span className="font-medium">Strong</span>
                </li>
                <li className="flex justify-between">
                  <span>Data Connection:</span>
                  <span className="font-medium">4G LTE</span>
                </li>
                <li className="flex justify-between">
                  <span>Battery Level:</span>
                  <span className="font-medium">85%</span>
                </li>
                <li className="flex justify-between">
                  <span>Device:</span>
                  <span className="font-medium">Driver Mobile App</span>
                </li>
              </ul>
            </div>
            
            {/* Emergency button */}
            <div>
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Emergency
              </button>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Use only in case of accidents or emergencies
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tracking History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-lg">Today's Tracking History</h2>
        </div>
        
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">7:00 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Bus Depot</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">0 mph</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Route started</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">7:15 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">52 Oak Street</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">0 mph</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Student pickup (Alex Johnson)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">7:22 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">108 Maple Avenue</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">0 mph</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Student pickup (Emma Wilson)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">7:35 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">221 Pine Road</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">0 mph</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Student pickup (Sophia Garcia)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">7:42 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">15 Elm Drive</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">0 mph</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Student pickup (Michael Brown)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">8:15 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Lincoln Elementary School</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">0 mph</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">All students dropped off</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">
              Download Full History
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}