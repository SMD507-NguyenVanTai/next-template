export interface IAuth {
  token: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  expiredTime: number;
  refreshToken: string;
}
