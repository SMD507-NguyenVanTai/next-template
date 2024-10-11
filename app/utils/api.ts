import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/localstorage';

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

export interface ErrorDetails {
  [key: string]: string;
}

export interface ErrorResponseData {
  message?: string;
  errors?: ErrorDetails;
}

interface ErrorResponse {
  status?: number;
  message?: string;
  data?: unknown;
}

const apiConfig: ApiConfig = {
  baseURL: process.env.API_ENDPOINT || '',
  timeout: Number(process.env.API_TIMEOUT) || 10000,
};

export const axiosInstance: AxiosInstance = axios.create(apiConfig);

axiosInstance.interceptors.request.use(
  async function (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const lang = localStorage.getItem(LOCAL_STORAGE_KEY.LANG) || 'en';
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN) || '';

    config.headers['Accept-Language'] = lang;
    config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Refresh token function
const refreshAccessToken = async (
  originalRequest: AxiosRequestConfig,
): Promise<AxiosResponse | void> => {
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN) || '';
  if (!refreshToken) return;

  try {
    const response = await axios.post<{ accessToken: string }>(
      `${apiConfig.baseURL}/auth/refresh-token`,
      { refreshToken },
    );

    const newToken = response.data.accessToken;
    localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, newToken);

    if (originalRequest.headers) {
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
    }

    return axiosInstance(originalRequest);
  } catch (refreshError) {
    localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    return Promise.reject(refreshError);
  }
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return refreshAccessToken(originalRequest);
    }

    const errorResponse: ErrorResponse = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data?.errors || error.response?.data,
    };

    return Promise.reject(errorResponse);
  },
);

// API methods
const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    axiosInstance.get<T>(url, config),

  post: <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data, config),

  put: <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    axiosInstance.delete<T>(url, config),
};

export default api;
