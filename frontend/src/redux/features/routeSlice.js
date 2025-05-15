import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const routeApi = createApi({
    reducerPath: 'routeApi',
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
    tagTypes: ['Route'],
    endpoints: (builder) => ({
        // Get all active routes
        getActiveRoutes: builder.query({
            query: () => '/routes/active',
            providesTags: ['Route']
        }),
        
        // Get route by ID
        getRouteById: builder.query({
            query: (id) => `/routes/${id}`,
            providesTags: (result, error, id) => [{ type: 'Route', id }]
        })
    })
});

export const { 
    useGetActiveRoutesQuery, 
    useGetRouteByIdQuery
} = routeApi;