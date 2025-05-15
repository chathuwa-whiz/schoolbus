import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HiChevronDown, HiChevronUp, HiPhone } from 'react-icons/hi2';
import { HiMail, HiOutlineSearch } from 'react-icons/hi';

export default function Routes() {
  const [activeTab, setActiveTab] = useState('morning');
  const [expandedRoute, setExpandedRoute] = useState('route1');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for routes
  const routesData = {
    morning: [
      {
        id: 'route1',
        name: 'Northeast District Route',
        startTime: '7:00 AM',
        endTime: '8:30 AM',
        stops: [
          { id: 'stop1', name: '52 Oak Street', time: '7:15 AM', students: 3 },
          { id: 'stop2', name: '108 Maple Avenue', time: '7:22 AM', students: 1 },
          { id: 'stop3', name: '221 Pine Road', time: '7:35 AM', students: 2 },
          { id: 'stop4', name: '15 Elm Drive', time: '7:42 AM', students: 1 },
          { id: 'stop5', name: 'Lincoln Elementary School', time: '8:15 AM', students: 0, isSchool: true }
        ],
        students: 7,
        distance: '12.5 miles',
        status: 'active'
      },
      {
        id: 'route2',
        name: 'Northwest District Route',
        startTime: '7:15 AM',
        endTime: '8:45 AM',
        stops: [
          { id: 'stop6', name: '33 Cedar Lane', time: '7:25 AM', students: 2 },
          { id: 'stop7', name: '45 Birch Street', time: '7:35 AM', students: 2 },
          { id: 'stop8', name: '78 Walnut Avenue', time: '7:45 AM', students: 3 },
          { id: 'stop9', name: 'Washington Middle School', time: '8:30 AM', students: 0, isSchool: true }
        ],
        students: 7,
        distance: '10.8 miles',
        status: 'active'
      }
    ],
    afternoon: [
      {
        id: 'route3',
        name: 'Northeast District Return',
        startTime: '3:00 PM',
        endTime: '4:30 PM',
        stops: [
          { id: 'stop10', name: 'Lincoln Elementary School', time: '3:15 PM', students: 7, isSchool: true },
          { id: 'stop11', name: '15 Elm Drive', time: '3:42 PM', students: 1 },
          { id: 'stop12', name: '221 Pine Road', time: '3:50 PM', students: 2 },
          { id: 'stop13', name: '108 Maple Avenue', time: '4:05 PM', students: 1 },
          { id: 'stop14', name: '52 Oak Street', time: '4:15 PM', students: 3 }
        ],
        students: 7,
        distance: '12.5 miles',
        status: 'active'
      },
      {
        id: 'route4',
        name: 'Northwest District Return',
        startTime: '3:30 PM',
        endTime: '5:00 PM',
        stops: [
          { id: 'stop15', name: 'Washington Middle School', time: '3:45 PM', students: 7, isSchool: true },
          { id: 'stop16', name: '78 Walnut Avenue', time: '4:10 PM', students: 3 },
          { id: 'stop17', name: '45 Birch Street', time: '4:20 PM', students: 2 },
          { id: 'stop18', name: '33 Cedar Lane', time: '4:35 PM', students: 2 }
        ],
        students: 7,
        distance: '10.8 miles',
        status: 'active'
      }
    ]
  };

  // Mock data for students
  const studentsData = [
    { id: 1, name: 'Alex Johnson', grade: '3rd', address: '52 Oak Street', parent: 'Sarah Johnson', parentPhone: '(555) 123-4567', parentEmail: 'sarah@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/boys/1.jpg' },
    { id: 2, name: 'Emma Wilson', grade: '5th', address: '108 Maple Avenue', parent: 'Robert Wilson', parentPhone: '(555) 234-5678', parentEmail: 'robert@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: 'Mild peanut allergy', photo: 'https://randomuser.me/api/portraits/girls/2.jpg' },
    { id: 3, name: 'Jacob Smith', grade: '2nd', address: '221 Pine Road', parent: 'Jennifer Smith', parentPhone: '(555) 345-6789', parentEmail: 'jennifer@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/boys/3.jpg' },
    { id: 4, name: 'Sophia Garcia', grade: '4th', address: '221 Pine Road', parent: 'Miguel Garcia', parentPhone: '(555) 456-7890', parentEmail: 'miguel@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/girls/4.jpg' },
    { id: 5, name: 'Michael Brown', grade: '1st', address: '15 Elm Drive', parent: 'Jessica Brown', parentPhone: '(555) 567-8901', parentEmail: 'jessica@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: 'Asthma, carries inhaler', photo: 'https://randomuser.me/api/portraits/boys/5.jpg' },
    { id: 6, name: 'Olivia Davis', grade: 'KG', address: '52 Oak Street', parent: 'William Davis', parentPhone: '(555) 678-9012', parentEmail: 'william@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/girls/6.jpg' },
    { id: 7, name: 'Ethan Martinez', grade: '3rd', address: '52 Oak Street', parent: 'Ana Martinez', parentPhone: '(555) 789-0123', parentEmail: 'ana@example.com', route: 'route1', routeName: 'Northeast District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/boys/7.jpg' },
    // More students for second route
    { id: 8, name: 'Ava Taylor', grade: '4th', address: '33 Cedar Lane', parent: 'James Taylor', parentPhone: '(555) 890-1234', parentEmail: 'james@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/girls/8.jpg' },
    { id: 9, name: 'Noah Anderson', grade: '2nd', address: '33 Cedar Lane', parent: 'Emily Anderson', parentPhone: '(555) 901-2345', parentEmail: 'emily@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: 'Food allergies - see details in health record', photo: 'https://randomuser.me/api/portraits/boys/9.jpg' },
    { id: 10, name: 'Isabella Thomas', grade: '5th', address: '45 Birch Street', parent: 'David Thomas', parentPhone: '(555) 012-3456', parentEmail: 'david@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/girls/10.jpg' },
    { id: 11, name: 'Liam Rodriguez', grade: '3rd', address: '45 Birch Street', parent: 'Maria Rodriguez', parentPhone: '(555) 123-4567', parentEmail: 'maria@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/boys/11.jpg' },
    { id: 12, name: 'Charlotte Lee', grade: 'KG', address: '78 Walnut Avenue', parent: 'Kevin Lee', parentPhone: '(555) 234-5678', parentEmail: 'kevin@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/girls/12.jpg' },
    { id: 13, name: 'Mason White', grade: '1st', address: '78 Walnut Avenue', parent: 'Nicole White', parentPhone: '(555) 345-6789', parentEmail: 'nicole@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: '', photo: 'https://randomuser.me/api/portraits/boys/13.jpg' },
    { id: 14, name: 'Amelia Clark', grade: '2nd', address: '78 Walnut Avenue', parent: 'Steven Clark', parentPhone: '(555) 456-7890', parentEmail: 'steven@example.com', route: 'route2', routeName: 'Northwest District Route', medicalNotes: 'Wears glasses, spare pair in backpack', photo: 'https://randomuser.me/api/portraits/girls/14.jpg' },
  ];

  // Filter students based on which route is expanded and search term
  const filteredStudents = studentsData.filter(student => 
    (student.route === expandedRoute) && 
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     student.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.grade.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get routes for current tab
  const currentRoutes = routesData[activeTab] || [];

  const toggleRouteExpansion = (routeId) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Routes & Students</h1>
      </div>

      {/* Routes Tab Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('morning')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'morning'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Morning Routes
          </button>
          <button
            onClick={() => setActiveTab('afternoon')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'afternoon'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Afternoon Routes
          </button>
        </div>

        <div className="p-5">
          {/* Route Cards */}
          <div className="space-y-4">
            {currentRoutes.map(route => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Route Header */}
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${
                    expandedRoute === route.id ? 'bg-amber-50' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => toggleRouteExpansion(route.id)}
                >
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <h3 className="font-semibold text-gray-800">{route.name}</h3>
                    </div>
                    <div className="flex mt-1 text-xs text-gray-500">
                      <span className="mr-3">{route.startTime} - {route.endTime}</span>
                      <span className="mr-3">|</span>
                      <span className="mr-3">{route.students} students</span>
                      <span className="mr-3">|</span>
                      <span>{route.distance}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-3">
                      {route.status}
                    </span>
                    {expandedRoute === route.id ? (
                      <HiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <HiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Route Details */}
                {expandedRoute === route.id && (
                  <div className="p-4 border-t border-gray-200">
                    {/* Map View Placeholder */}
                    <div className="bg-gray-100 h-80 rounded-lg mb-4 relative overflow-hidden">
                      {/* In a real app, this would be a map component */}
                      <img 
                        src="https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=13&size=800x600&maptype=roadmap&path=color:0x0000ff|weight:5|37.785,-122.435|37.780,-122.420|37.775,-122.415|37.770,-122.410|37.765,-122.405&key=YOUR_API_KEY_HERE" 
                        alt="Route map" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 right-4">
                        <button className="px-4 py-2 bg-white shadow-md rounded-lg text-sm font-medium hover:bg-gray-50">
                          Open Navigation
                        </button>
                      </div>
                    </div>

                    {/* Stops and Students Tabs */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Stops</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Students</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {route.stops.map(stop => (
                              <tr key={stop.id} className={stop.isSchool ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <span className={stop.isSchool ? 'font-medium text-blue-700' : ''}>
                                    {stop.name}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">{stop.time}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">{stop.students}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Students List */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800">Students</h4>
                        
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search students..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(student => (
                            <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center mb-3">
                                <img 
                                  src={student.photo} 
                                  alt={student.name} 
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                                <div>
                                  <h5 className="font-medium text-gray-800">{student.name}</h5>
                                  <p className="text-xs text-gray-500">Grade: {student.grade}</p>
                                </div>
                              </div>
                              
                              <div className="text-sm">
                                <p className="mb-1"><span className="text-gray-500">Address:</span> {student.address}</p>
                                <p className="mb-1"><span className="text-gray-500">Parent:</span> {student.parent}</p>
                                
                                <div className="flex mt-2 pt-2 border-t border-gray-100">
                                  <a href={`tel:${student.parentPhone}`} className="flex items-center text-blue-600 text-xs mr-3">
                                    <HiPhone className="mr-1" /> Call
                                  </a>
                                  <a href={`mailto:${student.parentEmail}`} className="flex items-center text-blue-600 text-xs">
                                    <HiMail className="mr-1" /> Email
                                  </a>
                                </div>
                                
                                {student.medicalNotes && (
                                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded">
                                    <strong>Medical:</strong> {student.medicalNotes}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-8 text-gray-500">
                            No students found matching your search criteria.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
