import React, { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'react-hot-toast'

export default function Children() {
  const [isAddingChild, setIsAddingChild] = useState(false);
  
  // Mock data - in a real app this would come from an API
  const [children, setChildren] = useState([
    {
      id: 1, 
      name: "Emma Parent", 
      age: 8,
      grade: "3rd Grade",
      school: "Lincoln Elementary",
      busId: "Bus #12",
      busRoute: "Route A",
      pickupTime: "7:15 AM",
      dropoffTime: "3:30 PM",
      avatar: "https://randomuser.me/api/portraits/girls/12.jpg"
    },
    {
      id: 2, 
      name: "Jacob Parent", 
      age: 10,
      grade: "5th Grade",
      school: "Washington Middle School",
      busId: "Bus #15",
      busRoute: "Route C",
      pickupTime: "7:30 AM",
      dropoffTime: "3:45 PM",
      avatar: "https://randomuser.me/api/portraits/boys/15.jpg"
    }
  ]);
  
  const [newChild, setNewChild] = useState({
    name: '',
    age: '',
    grade: '',
    school: '',
    busId: '',
    busRoute: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChild(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newChild.name || !newChild.age || !newChild.grade || !newChild.school || !newChild.busId || !newChild.busRoute) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Create new child with mock data
    const child = {
      ...newChild,
      id: Date.now(),
      pickupTime: "7:15 AM",
      dropoffTime: "3:30 PM",
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 50)}.jpg`
    };
    
    // Add to children array
    setChildren(prev => [...prev, child]);
    
    // Reset form
    setNewChild({
      name: '',
      age: '',
      grade: '',
      school: '',
      busId: '',
      busRoute: '',
    });
    
    // Close form
    setIsAddingChild(false);
    
    // Show success message
    toast.success("Child added successfully!");
  };
  
  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this child?")) {
      setChildren(prev => prev.filter(child => child.id !== id));
      toast.success("Child removed successfully");
    }
  };

  return (
    <div className="space-y-6 md:pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Children</h1>
        <button
          onClick={() => setIsAddingChild(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Child
        </button>
      </div>
      
      {isAddingChild && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Child</h2>
            <button 
              onClick={() => setIsAddingChild(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Child's Full Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newChild.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-1">Age*</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={newChild.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="grade" className="block text-gray-700 text-sm font-medium mb-1">Grade*</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={newChild.grade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="school" className="block text-gray-700 text-sm font-medium mb-1">School*</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={newChild.school}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="busId" className="block text-gray-700 text-sm font-medium mb-1">Bus ID*</label>
                <select
                  id="busId"
                  name="busId"
                  value={newChild.busId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                >
                  <option value="">Select a bus</option>
                  <option value="Bus #12">Bus #12</option>
                  <option value="Bus #15">Bus #15</option>
                  <option value="Bus #23">Bus #23</option>
                </select>
              </div>
              <div>
                <label htmlFor="busRoute" className="block text-gray-700 text-sm font-medium mb-1">Bus Route*</label>
                <select
                  id="busRoute"
                  name="busRoute"
                  value={newChild.busRoute}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                >
                  <option value="">Select a route</option>
                  <option value="Route A">Route A</option>
                  <option value="Route B">Route B</option>
                  <option value="Route C">Route C</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingChild(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Child
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <img 
                  src={child.avatar} 
                  alt={child.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{child.name}</h3>
                  <div className="text-sm text-gray-500">{child.age} years old • {child.grade}</div>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 mr-2">{child.busId}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{child.busRoute}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">School</p>
                  <p className="font-medium text-gray-800">{child.school}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Pickup Time</p>
                  <p className="font-medium text-gray-800">{child.pickupTime}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Drop-off Time</p>
                  <p className="font-medium text-gray-800">{child.dropoffTime}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Actions</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleRemove(child.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Remove child"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button 
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      title="Edit child"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {children.length === 0 && (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No children added yet</h3>
          <p className="text-gray-500 mb-4">Add your children to track their school bus transportation</p>
          <button
            onClick={() => setIsAddingChild(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Child
          </button>
        </div>
      )}
    </div>
  )
}