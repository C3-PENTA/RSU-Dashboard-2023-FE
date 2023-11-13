import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { from } from 'rxjs';

export const getAutoRefresh = () => from(http.get<boolean>(APIs.HANDLE_SHARED_AUTO_REFRESH));

export const updateAutoRefresh = (state: boolean) =>
  from(http.post(APIs.HANDLE_SHARED_AUTO_REFRESH + '/' + state, {}));
