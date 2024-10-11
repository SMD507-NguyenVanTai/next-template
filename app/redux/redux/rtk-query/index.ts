/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/app/utils/api';
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosError } from 'axios';

interface BaseQueryParams {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  params?: any;
  headers?: Record<string, any>;
}

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  status?: number;
  data: unknown;
}

const executeApi = async ({ url, method, data, params, headers }: BaseQueryParams) => {
  switch (method) {
    case 'get':
      return await axiosInstance.get(url, {
        params,
        headers,
      });
    case 'post':
      return await axiosInstance.post(url, data, {
        params,
        headers,
      });
    case 'put':
      return await axiosInstance.put(url, data, {
        params,
        headers,
      });
    case 'patch':
      return await axiosInstance.patch(url, data, {
        params,
        headers,
      });
    case 'delete':
      return await axiosInstance.delete(url, {
        params,
        headers,
      });

    default:
      return undefined;
  }
};

const axiosBaseQuery: BaseQueryFn<
  BaseQueryParams,
  ApiResponse<unknown>,
  ApiError
> = async (baseParams) => {
  try {
    const result = await executeApi(baseParams);

    return { data: result?.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError<ApiError>;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

const apiService = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
});

export default apiService;
