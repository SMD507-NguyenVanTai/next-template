import apiService from '../redux/redux/rtk-query';
import { ILoginRequest, ILoginResponse } from '../types/auth';

const authService = apiService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (data) => ({ url: `/auth/login`, method: 'post', data }),
    }),
  }),
});

export const { useLoginMutation } = authService;

export default authService;
