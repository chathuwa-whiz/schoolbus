import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
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
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/users/register',
                method: 'POST',
                body: userData,
            }),
        }),
        fetchUserProfile: builder.query({
            query: () => '/users/profile',
        }),
        updateUserProfile: builder.mutation({
            query: (userData) => ({
                url: '/users/profile',
                method: 'PUT',
                body: userData,
            }),
        }),
    }),
});

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useFetchUserProfileQuery,
    useUpdateUserProfileMutation
} = userApi;