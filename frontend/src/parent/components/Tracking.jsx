import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export default function Tracking() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock children data
  const children = [
    {
      id: 1, 
      name: "Emma Parent", 
      busId: "Bus #12",
      status: "At school",
      lastSeen: "8:15 AM",
    },
    {
      id: 2, 
      name: "Jacob Parent", 
      busId: "Bus #15",
      status: "On bus (going home)",
      lastSeen: "3:05 PM",
    }
  ];
  
  // Mock bus location data (would come from an API in a real app)
  const [busLocation, setBusLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    speed: "25 mph",
    lastUpdated: new Date().toLocaleTimeString(),
    estimatedArrival: "3:45 PM",
    nextStop: "Oak Street & Pine Avenue",
    distanceToStop: "0.8 miles",
    delayMinutes: 0
  });
  
  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!selectedChild) {
      setSelectedChild(children[0]);
    }
    
    const interval = setInterval(() => {
      // Update mock location with small random changes
      setBusLocation(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() * 0.002 - 0.001),
        longitude: prev.longitude + (Math.random() * 0.002 - 0.001),
        lastUpdated: new Date().toLocaleTimeString(),
        delayMinutes: Math.floor(Math.random() * 5)
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [selectedChild]);

  return (
    <div className="space-y-6  md:pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Bus Tracking</h1>
        <div className="flex items-center">
          <span className="flex h-3 w-3 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-600">Live updates every 10 seconds</span>
        </div>
      </div>
      
      {/* Child selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select a child to track their bus:
        </label>
        <select
          id="childSelect"
          value={selectedChild?.id || ''}
          onChange={(e) => {
            const childId = parseInt(e.target.value);
            const child = children.find(c => c.id === childId);
            setSelectedChild(child);
          }}
          className="w-full md:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
        >
          {children.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} ({child.busId})
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-[500px] relative">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          ) : (
            <>
              {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
              <div className="w-full h-full bg-blue-50 relative overflow-hidden">
                <img 
                  src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f00(-122.4194,37.7749)/-122.4194,37.7749,13,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw" 
                  alt="Map showing bus location" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-sm">Current location:</span>
                      <h3 className="font-medium">San Francisco, CA</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 text-sm">Last updated:</span>
                      <h3 className="font-medium">{busLocation.lastUpdated}</h3>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <span className={`flex h-3 w-3 mr-2 ${selectedChild?.status === 'At school' ? 'bg-green-500' : 'bg-blue-500'} rounded-full`}></span>
                    <span className="font-medium text-sm">{selectedChild?.busId}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Bus details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-4">Bus Details</h2>
            
            {selectedChild && (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mr-3 text-xl">
                    🚌
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{selectedChild.busId}</h3>
                    <div className="flex items-center text-sm">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        selectedChild.status === 'At school' ? 'bg-green-500' : 'bg-blue-500'
                      } mr-2`}></span>
                      <span className="text-gray-600">{selectedChild.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-medium text-gray-800">
                      {selectedChild.status}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">Current Speed</p>
                    <p className="font-medium text-gray-800">{busLocation.speed}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">Next Stop</p>
                    <p className="font-medium text-gray-800">{busLocation.nextStop}</p>
                    <p className="text-xs text-gray-500">{busLocation.distanceToStop} away</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">Estimated Arrival</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{busLocation.estimatedArrival}</p>
                      {busLocation.delayMinutes > 0 && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          {busLocation.delayMinutes} min delay
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-200 pt-4 mt-2">
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Contact Driver
                    </button>
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Travel history */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">Today's Travel History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Event</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">7:15 AM</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Picked up from home</td>
                  <td className="px-4 py-3 text-sm text-gray-800">123 Main St</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">On time</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">7:45 AM</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Arrived at school</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Lincoln Elementary</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">On time</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">3:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Picked up from school</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Lincoln Elementary</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">5 min late</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">3:45 PM</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Expected home arrival</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">123 Main St</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">In progress</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}