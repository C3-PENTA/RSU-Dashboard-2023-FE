export interface LoginForm {
  username: string;
  password: string;
}
export interface RegisterForm {
  name: string;
  username: string;
  email: string;
  role: number;
  password: string;
}
export interface userInfo {
  username: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  iat: number;
  exp: number;
}
