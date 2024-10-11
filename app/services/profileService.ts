import apiService from '../redux/redux/rtk-query';
import { IUser } from '../types/user';

const profileService = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, undefined>({
      query: () => ({ url: `/profile/me`, method: 'get' }),
    }),
  }),
});

export const { useGetProfileQuery } = profileService;

export default profileService;
