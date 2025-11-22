import { getTokenUser } from '@/action/utils';
import { clientAuthUtils } from '@/utils/clientAuth';
import funcUtils from '@/utils/funcUtils';
import { fetchJsonWithAuth } from './fetchWithAuth';

const useApiPost = async <T = any, R = any>(url: string, payload: T): Promise<R> => {
  const isServer = typeof window === 'undefined';
  // Get token from server-side (cookies) or client-side (cookies)
  const token = isServer ? await getTokenUser() : clientAuthUtils.getToken();
  
  const response = await fetchJsonWithAuth(funcUtils.combineURL(url), {
    method: 'POST',
    body: JSON.stringify(payload),
    ...funcUtils.FetchHeaders(token || undefined),
  });
  
  return response as R;
};

// For FormData (file uploads)
const useApiPostFormData = async (url: string, payload: FormData) => {
  const isServer = typeof window === 'undefined';
  const token = isServer ? await getTokenUser() : undefined;
  
  const headers = funcUtils.FetchHeaders(token || undefined);
  // Remove Content-Type to let browser set multipart/form-data boundary
  const { headers: { 'Content-Type': _, ...headersWithoutContentType } } = headers;
  
  return await fetchJsonWithAuth(funcUtils.combineURL(url), {
    method: 'POST',
    body: payload, // FormData - no JSON.stringify
    headers: headersWithoutContentType
  });
};

export default useApiPost;
export { useApiPostFormData };
