import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { 
  useGetChildrenQuery, 
  useCreateChildMutation, 
  useDeleteChildMutation,
  useUpdateChildMutation 
} from '../../redux/features/childSlice';
import { useGetActiveRoutesQuery } from '../../redux/features/routeSlice';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

export default function Children() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentChildId, setCurrentChildId] = useState(null);
  
  // API queries
  const { data: childrenData, isLoading, isError } = useGetChildrenQuery();
  const { data: routesData, isLoading: isLoadingRoutes } = useGetActiveRoutesQuery();
  const [createChild, { isLoading: isCreating }] = useCreateChildMutation();
  const [updateChild, { isLoading: isUpdating }] = useUpdateChildMutation();
  const [deleteChild, { isLoading: isDeleting }] = useDeleteChildMutation();
  
  const [newChild, setNewChild] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    schoolName: '',
    grade: '',
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    dropoffAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    route: '', 
    specialNeeds: {
      has: false,
      details: ''
    }
  });
  
  // Reset form when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  const resetForm = () => {
    setNewChild({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      schoolName: '',
      grade: '',
      pickupAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      dropoffAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      route: '',
      specialNeeds: {
        has: false,
        details: ''
      }
    });
    setIsEditMode(false);
    setCurrentChildId(null);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested object properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewChild(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setNewChild(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleEdit = (child) => {
    // Fill the form with the selected child's data
    setNewChild({
      firstName: child.firstName,
      lastName: child.lastName,
      dateOfBirth: new Date(child.dateOfBirth).toISOString().split('T')[0],
      gender: child.gender,
      schoolName: child.schoolName,
      grade: child.grade,
      pickupAddress: {
        street: child.pickupAddress?.street || '',
        city: child.pickupAddress?.city || '',
        state: child.pickupAddress?.state || '',
        zipCode: child.pickupAddress?.zipCode || ''
      },
      dropoffAddress: {
        street: child.dropoffAddress?.street || '',
        city: child.dropoffAddress?.city || '',
        state: child.dropoffAddress?.state || '',
        zipCode: child.dropoffAddress?.zipCode || ''
      },
      route: child.route || '',
      specialNeeds: {
        has: child.specialNeeds?.has || false,
        details: child.specialNeeds?.details || ''
      }
    });
    
    setIsEditMode(true);
    setCurrentChildId(child._id);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create a copy of the child object to modify before submission
      const childToSubmit = { ...newChild };
      
      // If no route is selected, set it to null instead of empty string
      if (!childToSubmit.route) {
        childToSubmit.route = null;
      }
      
      if (isEditMode) {
        await updateChild({
          id: currentChildId,
          ...childToSubmit
        }).unwrap();
        
        // Show success message
        toast.success("Child updated successfully!");
      } else {
        await createChild(childToSubmit).unwrap();
        
        // Show success message
        toast.success("Child added successfully!");
      }
      
      // Close form
      setIsModalOpen(false);
      
    } catch (error) {
      console.error(isEditMode ? "Failed to update child:" : "Failed to add child:", error);
      toast.error(error.data?.message || (isEditMode ? "Failed to update child. Please try again." : "Failed to add child. Please try again."));
    }
  };
  
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this child?")) {
      try {
        await deleteChild(id).unwrap();
        toast.success("Child removed successfully");
      } catch (error) {
        console.error("Failed to remove child:", error);
        toast.error(error.data?.message || "Failed to remove child. Please try again.");
      }
    }
  };

  // Function to format date of birth for display
  const formatDateOfBirth = (dateOfBirth) => {
    const date = new Date(dateOfBirth);
    return date.toLocaleDateString();
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6 md:pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Children</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          disabled={isCreating}
        >
          <HiPlus className="w-4 h-4 mr-2" />
          Add Child
        </button>
      </div>
      
      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading children...</p>
        </div>
      )}
      
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>Failed to load children. Please try again later.</p>
        </div>
      )}
      
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditMode ? 'Edit Child' : 'Add New Child'}
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-1">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newChild.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-1">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newChild.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-medium mb-1">Date of Birth*</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={newChild.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-gray-700 text-sm font-medium mb-1">Gender*</label>
                <select
                  id="gender"
                  name="gender"
                  value={newChild.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* School Information */}
              <div>
                <label htmlFor="schoolName" className="block text-gray-700 text-sm font-medium mb-1">School*</label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={newChild.schoolName}
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
              
              {/* Pickup Address */}
              <div className="col-span-2">
                <h3 className="font-medium text-gray-700 mb-2">Pickup Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="pickupAddress.street"
                      value={newChild.pickupAddress.street}
                      onChange={handleChange}
                      placeholder="Street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="pickupAddress.city"
                      value={newChild.pickupAddress.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="pickupAddress.state"
                      value={newChild.pickupAddress.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="pickupAddress.zipCode"
                      value={newChild.pickupAddress.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    />
                  </div>
                </div>
              </div>
              
              {/* Route Selection */}
              <div>
                <label htmlFor="route" className="block text-gray-700 text-sm font-medium mb-1">Bus Route (Optional)</label>
                <select
                  id="route"
                  name="route"
                  value={newChild.route}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                >
                  <option value="">-- Select a bus route --</option>
                  {routesData?.data?.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.name} ({route.type === 'morning' ? 'Morning' : 'Afternoon'} - {route.school})
                    </option>
                  ))}
                </select>
                {isLoadingRoutes && <p className="text-xs text-gray-500 mt-1">Loading routes...</p>}
              </div>
              
              {/* Special Needs Checkbox */}
              <div className="col-span-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="specialNeeds.has"
                    name="specialNeeds.has"
                    checked={newChild.specialNeeds.has}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="specialNeeds.has" className="ml-2 block text-sm text-gray-700">
                    Child has special needs
                  </label>
                </div>
                
                {newChild.specialNeeds.has && (
                  <textarea
                    name="specialNeeds.details"
                    value={newChild.specialNeeds.details}
                    onChange={handleChange}
                    placeholder="Please provide details about special needs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    rows="3"
                  ></textarea>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isCreating || isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Child' : 'Add Child'}</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading && childrenData?.data && childrenData.data.map(child => (
          <motion.div
            key={child._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 mr-4">
                  {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{child.firstName} {child.lastName}</h3>
                  <div className="text-sm text-gray-500">{calculateAge(child.dateOfBirth)} years old • {child.grade}</div>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 mr-2">{child.schoolName}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-800">{formatDateOfBirth(child.dateOfBirth)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">{child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-gray-500">Pickup Address</p>
                  <p className="font-medium text-gray-800">
                    {child.pickupAddress?.street} {child.pickupAddress?.city}, {child.pickupAddress?.state} {child.pickupAddress?.zipCode}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Actions</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleRemove(child._id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Remove child"
                      disabled={isDeleting}
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(child)}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      title="Edit child"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {child.specialNeeds?.has && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Special Needs:</p>
                  <p className="text-sm text-yellow-700">{child.specialNeeds.details}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {!isLoading && (!childrenData?.data || childrenData.data.length === 0) && (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 mb-4">
            <HiPlus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No children added yet</h3>
          <p className="text-gray-500 mb-4">Add your children to track their school bus transportation</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <HiPlus className="w-4 h-4 mr-2" />
            Add Your First Child
          </button>
        </div>
      )}
    </div>
  );
}