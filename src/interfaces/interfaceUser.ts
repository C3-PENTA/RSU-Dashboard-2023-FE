export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
export interface IUserUpdate {
  id?: string;
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  role?: number;
  created_at?: string;
  updated_at?: string;
}
