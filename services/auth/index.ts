import {
  TLoginPayload,
  TLoginResponse,
  TRegisterPayload,
} from '@/models/auth';
import { User, UserProfileUpdate, ChangePasswordRequest } from '@/models/user';
import useApiPost from "@/services/useApiPost";
import useApiGet from "@/services/useApiGet";
import useApiPut from "@/services/useApiPut";
import { API_ROUTE, APP_CONFIG } from "@/common/config";
import funcUtils from "@/utils/funcUtils";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

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
  refreshToken: (token?: string): Promise<TLoginResponse> => {
    // Ưu tiên sử dụng token truyền vào (từ Server Action),
    // nếu không có thì mới lấy từ funcUtils (trường hợp gọi từ Client)
    const tokenToUse = token || funcUtils.getRefreshToken();
    
    return useApiPost(`${API_ROUTE.auth.refreshToken}`, {
      refresh_token: tokenToUse
    });
  },
  getProfile: (): Promise<ApiResponse<User>> => {
    return useApiGet(`${API_ROUTE.auth.getProfile}`);
  },
  updateProfile: (payload: UserProfileUpdate): Promise<ApiResponse<User>> => {
    return useApiPut(`${API_ROUTE.auth.updateProfile}`, payload);
  },
  changePassword: (payload: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    return useApiPut(`${API_ROUTE.auth.changePassword}`, payload);
  },
};
