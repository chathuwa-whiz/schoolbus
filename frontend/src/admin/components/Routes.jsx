import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HiSearch, HiPlusCircle, HiPencil, HiTrash, HiUserCircle, HiChevronDown, HiChevronRight } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function Routes() {
  const [routes, setRoutes] = useState([
    { 
      id: 1, 
      name: "Morning Route A", 
      type: "morning", 
      school: "Lincoln Elementary",
      stops: 8,
      students: 12,
      driver: { id: 101, name: "John Smith" },
      status: "active" 
    },
    { 
      id: 2, 
      name: "Afternoon Route A", 
      type: "afternoon", 
      school: "Lincoln Elementary",
      stops: 8,
      students: 12,
      driver: { id: 101, name: "John Smith" },
      status: "active" 
    },
    { 
      id: 3, 
      name: "Morning Route B", 
      type: "morning", 
      school: "Washington Middle School",
      stops: 6,
      students: 9,
      driver: { id: 102, name: "Maria Rodriguez" },
      status: "active" 
    },
    { 
      id: 4, 
      name: "Afternoon Route B", 
      type: "afternoon", 
      school: "Washington Middle School",
      stops: 6,
      students: 9,
      driver: { id: 102, name: "Maria Rodriguez" },
      status: "active" 
    },
    { 
      id: 5, 
      name: "Morning Route C", 
      type: "morning", 
      school: "Jefferson High School",
      stops: 5,
      students: 15,
      driver: null,
      status: "inactive" 
    },
    { 
      id: 6, 
      name: "Afternoon Route C", 
      type: "afternoon", 
      school: "Jefferson High School",
      stops: 5,
      students: 15,
      driver: null,
      status: "inactive" 
    }
  ]);

  const [drivers, setDrivers] = useState([
    { id: 101, name: "John Smith", available: true },
    { id: 102, name: "Maria Rodriguez", available: true },
    { id: 103, name: "David Chen", available: true },
    { id: 104, name: "Sarah Johnson", available: true },
    { id: 105, name: "Michael Brown", available: true }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Filter routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          route.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || route.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteRoute = (routeId) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      setRoutes(routes.filter(route => route.id !== routeId));
      toast.success("Route deleted successfully");
    }
  };

  const handleRouteExpand = (routeId) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  const handleAssignDriver = (route) => {
    setSelectedRoute(route);
    setShowAssignModal(true);
  };

  const confirmAssignDriver = () => {
    if (selectedDriver) {
      setRoutes(routes.map(route => 
        route.id === selectedRoute.id 
          ? { 
              ...route, 
              driver: { id: selectedDriver.id, name: selectedDriver.name },
              status: "active"
            } 
          : route
      ));
      toast.success(`Driver ${selectedDriver.name} assigned to route ${selectedRoute.name}`);
      setShowAssignModal(false);
      setSelectedRoute(null);
      setSelectedDriver(null);
    } else {
      toast.error("Please select a driver");
    }
  };

  const handleUnassignDriver = (routeId) => {
    if (window.confirm("Are you sure you want to unassign the driver from this route?")) {
      setRoutes(routes.map(route => 
        route.id === routeId 
          ? { 
              ...route, 
              driver: null,
              status: "inactive"
            } 
          : route
      ));
      toast.success("Driver unassigned successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Route Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <HiPlusCircle className="-ml-1 mr-2 h-5 w-5" />
          Add New Route
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilterType('all')} 
              className={`px-4 py-2 rounded ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Routes
            </button>
            <button 
              onClick={() => setFilterType('morning')} 
              className={`px-4 py-2 rounded ${filterType === 'morning' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Morning
            </button>
            <button 
              onClick={() => setFilterType('afternoon')} 
              className={`px-4 py-2 rounded ${filterType === 'afternoon' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Afternoon
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search routes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Routes
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredRoutes.length} routes, {filteredRoutes.filter(r => r.driver).length} assigned)
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <React.Fragment key={route.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center cursor-pointer" onClick={() => handleRouteExpand(route.id)}>
                          {expandedRoute === route.id ? (
                            <HiChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                          ) : (
                            <HiChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{route.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{route.type} Route</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{route.school}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{route.stops} stops</div>
                        <div className="text-sm text-gray-500">{route.students} students</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {route.driver ? (
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {route.driver.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{route.driver.name}</div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAssignDriver(route)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            + Assign Driver
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {route.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <HiPencil className="h-5 w-5" />
                          </button>
                          {route.driver && (
                            <button 
                              onClick={() => handleUnassignDriver(route.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <HiUserCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteRoute(route.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <HiTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRoute === route.id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-500">
                            <h3 className="font-medium text-gray-700 mb-2">Route Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="font-medium">Stops:</p>
                                <ul className="list-disc list-inside mt-1">
                                  <li>Stop 1 - 8:00 AM</li>
                                  <li>Stop 2 - 8:15 AM</li>
                                  <li>Stop 3 - 8:30 AM</li>
                                  <li>School - 8:45 AM</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium">Students:</p>
                                <ul className="list-disc list-inside mt-1">
                                  <li>John D. - Grade 3</li>
                                  <li>Sarah M. - Grade 4</li>
                                  <li>Michael K. - Grade 3</li>
                                  <li>+ {route.students - 3} more</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium">Actions:</p>
                                <div className="mt-2 space-y-2">
                                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 w-full text-left">
                                    View on Map
                                  </button>
                                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 w-full text-left">
                                    Edit Route Details
                                  </button>
                                  <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 w-full text-left">
                                    Print Route Sheet
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No routes found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Driver Modal */}
      {showAssignModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Driver to Route</h3>
            <p className="text-sm text-gray-500 mb-6">
              Select a driver to assign to <span className="font-medium">{selectedRoute.name}</span>
            </p>

            <div className="max-h-60 overflow-y-auto mb-6">
              <div className="space-y-2">
                {drivers.map(driver => (
                  <div 
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                      selectedDriver?.id === driver.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-gray-500">ID: {driver.id}</p>
                    </div>
                    {selectedDriver?.id === driver.id && (
                      <div className="ml-auto">
                        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRoute(null);
                  setSelectedDriver(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  selectedDriver 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
                onClick={confirmAssignDriver}
                disabled={!selectedDriver}
              >
                Assign Driver
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}