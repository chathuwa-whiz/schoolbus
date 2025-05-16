import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const busApi = createApi({
    reducerPath: 'busApi',
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
    tagTypes: ['Bus'],
    endpoints: (builder) => ({
        // Get all buses
        getAllBuses: builder.query({
            query: () => '/buses',
            providesTags: ['Bus']
        }),
        
        // Get available buses (active ones not assigned to routes)
        getAvailableBuses: builder.query({
            query: () => '/buses/available',
            providesTags: ['Bus']
        })
    })
});

export const { 
    useGetAllBusesQuery,
    useGetAvailableBusesQuery
} = busApi;