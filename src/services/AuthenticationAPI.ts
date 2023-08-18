import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { LoginForm, RegisterForm } from '@/interfaces/interfaceAuthentication';

import { from } from 'rxjs';
export const login = (payload: LoginForm) => from(http.post<LoginForm>(APIs.LOGIN, payload));
export const refresh = () => from(http.get<any>(APIs.REFRESH));
export const logout = () => from(http.post(APIs.LOG_OUT, {}));
export const register = (payload: RegisterForm) =>
  from(http.post<RegisterForm>(APIs.REGISTER, payload));
