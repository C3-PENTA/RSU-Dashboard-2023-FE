export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserUpdate {
  id?: string;
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  role?: number;
  createdAt?: string;
  updatedAt?: string;
}
