export type AuthMode = 'login' | 'signup' | 'verify';

export interface User {
  id: string;
  name: string;
  email: string;
  has2FAEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyData {
  email: string;
  code: string;
  mode: '2fa-setup' | '2fa-verify';
}