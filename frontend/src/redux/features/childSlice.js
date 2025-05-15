import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const childApi = createApi({
    reducerPath: 'childApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Child'],
    endpoints: (builder) => ({
        // Get all children for parent
        getChildren: builder.query({
            query: () => '/children',
            providesTags: ['Child']
        }),
        
        // Get a specific child
        getChildById: builder.query({
            query: (id) => `/children/${id}`,
            providesTags: (result, error, id) => [{ type: 'Child', id }]
        }),
        
        // Create a new child
        createChild: builder.mutation({
            query: (child) => ({
                url: '/children',
                method: 'POST',
                body: child
            }),
            invalidatesTags: ['Child']
        }),
        
        // Update a child
        updateChild: builder.mutation({
            query: ({ id, ...child }) => ({
                url: `/children/${id}`,
                method: 'PUT',
                body: child
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Child', id }, 
                'Child'
            ]
        }),
        
        // Delete a child
        deleteChild: builder.mutation({
            query: (id) => ({
                url: `/children/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Child']
        }),
        
        // Update attendance for a child
        updateChildAttendance: builder.mutation({
            query: ({ id, ...attendanceData }) => ({
                url: `/children/${id}/attendance`,
                method: 'PUT',
                body: attendanceData
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Child', id }, 
                'Child'
            ]
        })
    })
});

export const { 
    useGetChildrenQuery, 
    useGetChildByIdQuery, 
    useCreateChildMutation, 
    useUpdateChildMutation, 
    useDeleteChildMutation,
    useUpdateChildAttendanceMutation
} = childApi;