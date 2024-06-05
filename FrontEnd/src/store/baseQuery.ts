// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';


export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.7:3000/',
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).persistedReducer.authSlice.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});