import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { IUserUpdate, User } from '@/interfaces/interfaceUser';
import { from } from 'rxjs';

export const getListUser = () => from(http.get<User[]>(APIs.GET_USER_LIST));
export const updateUserById = (userId: string, payload: IUserUpdate) =>
  from(http.patch<IUserUpdate[]>(APIs.UPDATE_USER + userId, payload));
export const deleteUserById = (userId: string) => from(http.delete(APIs.UPDATE_USER + userId));
