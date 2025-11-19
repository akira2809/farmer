import {
  TLoginPayload,
  TLoginResponse,
  TRegisterPayload,
} from '@/models/auth';
import useApiPost from "@/services/useApiPost";
import { API_ROUTE, APP_CONFIG } from "@/common/config";
import funcUtils from "@/utils/funcUtils";

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
    return useApiPost(`${API_ROUTE.auth.refreshToken}`, {
      refresh_token: funcUtils.getRefreshToken()
    });
  },
};
