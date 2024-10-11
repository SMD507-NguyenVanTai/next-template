'use client';

import { LOCAL_STORAGE_KEY } from '@/app/constants/localstorage';
import { useLoginMutation } from '@/app/services/authService';
import { useGetProfileQuery } from '@/app/services/profileService';
import { ILoginRequest } from '@/app/types/auth';
import { IUser } from '@/app/types/user';
import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface AuthContextType {
  user?: IUser;
  isAuthenticated: boolean;
  login: (credential: ILoginRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authLocal] = useLocalStorage(LOCAL_STORAGE_KEY.AUTH, '');
  const [, setToken] = useLocalStorage(LOCAL_STORAGE_KEY.TOKEN, '');
  const [, setRefreshToken] = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN, '');

  const [loginMutation] = useLoginMutation();

  const { data: user } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !authLocal,
  });

  const login = async (credential: ILoginRequest) => {
    const result = await loginMutation(credential);

    if (result.data) {
      setToken(result.data.token);
      setRefreshToken(result.data.refreshToken);
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
