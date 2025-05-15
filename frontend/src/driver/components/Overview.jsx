import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Overview() {
  // Mock data for route information
  const routeData = {
    id: "RT-12345",
    name: "Morning Route - Northeast District",
    status: "In Progress",
    students: 24,
    stops: 15,
    nextStop: {
      name: "Lincoln Elementary School",
      estimatedArrival: "8:15 AM",
      address: "123 Education Ave",
      studentsToDropOff: 18
    }
  };

  // Mock data for today's attendance
  const attendanceData = {
    total: 24,
    present: 22,
    absent: 2,
    recentActivity: [
      { id: 1, student: "Alex Johnson", status: "Picked Up", time: "7:15 AM", location: "52 Oak Street" },
      { id: 2, student: "Emma Wilson", status: "Picked Up", time: "7:22 AM", location: "108 Maple Avenue" },
      { id: 3, student: "Jacob Smith", status: "Absent", time: "-", location: "-" },
      { id: 4, student: "Sophia Garcia", status: "Picked Up", time: "7:35 AM", location: "221 Pine Road" }
    ]
  };

  // Mock data for vehicle status
  const vehicleData = {
    number: "BUS-2023",
    model: "Blue Bird Vision",
    status: "Operational",
    fuel: 75,
    lastMaintenance: "July 15, 2023",
    nextMaintenance: "Oct 15, 2023",
    mileage: "12,450 mi"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-lg transition-colors">
          <span className="text-xl">✓</span>
          <span className="font-medium">Start Attendance Check</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors">
          <span className="text-xl">🔍</span>
          <span className="font-medium">View Full Route Map</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors">
          <span className="text-xl">📑</span>
          <span className="font-medium">Generate Daily Report</span>
        </button>
      </div>

      {/* Current route info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 text-lg">Current Route</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            routeData.status === "In Progress" 
              ? "bg-green-100 text-green-800" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {routeData.status}
          </span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Route ID</p>
              <p className="font-medium">{routeData.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Route Name</p>
              <p className="font-medium">{routeData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Students</p>
              <p className="font-medium">{routeData.students} students assigned</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Stops</p>
              <p className="font-medium">{routeData.stops} stops total</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <h3 className="font-medium text-amber-800 mb-2">Next Stop</h3>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-800">{routeData.nextStop.name}</p>
              <p className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                ETA: {routeData.nextStop.estimatedArrival}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-2">{routeData.nextStop.address}</p>
            <p className="text-sm text-gray-600">{routeData.nextStop.studentsToDropOff} students to drop off</p>
            
            <div className="mt-4 flex justify-end">
              <Link to="/driver/routes" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                View full route details →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-lg">Today's Attendance</h2>
            <Link to="/driver/attendance" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Full Details
            </Link>
          </div>
          <div className="p-5">
            <div className="flex justify-around mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{attendanceData.total}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{attendanceData.present}</p>
                <p className="text-sm text-gray-500">Present</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{attendanceData.absent}</p>
                <p className="text-sm text-gray-500">Absent</p>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-700 mb-3">Recent Activity</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {attendanceData.recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-800">{activity.student}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{activity.time}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.status === "Absent" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vehicle Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-lg">Vehicle Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              vehicleData.status === "Operational" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {vehicleData.status}
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Bus Number</p>
                <p className="font-medium">{vehicleData.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Model</p>
                <p className="font-medium">{vehicleData.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Mileage</p>
                <p className="font-medium">{vehicleData.mileage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Next Maintenance</p>
                <p className="font-medium">{vehicleData.nextMaintenance}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Fuel Level</span>
                <span className="text-sm font-medium">{vehicleData.fuel}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    vehicleData.fuel > 70 ? 'bg-green-600' : 
                    vehicleData.fuel > 30 ? 'bg-amber-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${vehicleData.fuel}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium">
                Report Issue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}