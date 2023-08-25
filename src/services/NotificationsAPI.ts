import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { INotifications } from '@/interfaces/interfaceNotification';
import { from } from 'rxjs';

export const pushNotification = (username: string) =>
  from(http.get<INotifications>(APIs.GET_NOTIFICATIONS + `?username=${username}`));

export const delNotification = (payload: any) => from(http.post(APIs.DEL_NOTIFICATIONS, payload));
