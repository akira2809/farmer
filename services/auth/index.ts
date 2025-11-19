import {
  TLoginPayload,
  TLoginResponse,
  TRegisterPayload,
} from '@/models/auth';
import useApiPost from '../useApiPost';
import { API_ROUTE } from '@/common/config';

export default {
  login: (payload: TLoginPayload): Promise<TLoginResponse> => {
    return useApiPost(`${API_ROUTE.auth.login}`, payload);
  },
  register: (payload: TRegisterPayload): Promise<TLoginResponse> => {
    return useApiPost(`${API_ROUTE.auth.register}`, payload);
  },
  logout: (): Promise<{ success: boolean }> => {
    return useApiPost(`${API_ROUTE.auth.logout}`, {});
  },
  refreshToken: (): Promise<TLoginResponse> => {
    return useApiPost(`${API_ROUTE.auth.refreshToken}`, {});
  },
};
