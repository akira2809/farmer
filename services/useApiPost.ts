import { getTokenUser } from '@/action/utils';
import { clientAuthUtils } from '@/utils/clientAuth';
import funcUtils from '@/utils/funcUtils';

const useApiPost = async <T extends unknown = unknown>(url: string, payload: T) => {
  const isServer = typeof window === 'undefined';
  // Get token from server-side (cookies) or client-side (cookies)
  const token = isServer ? await getTokenUser() : clientAuthUtils.getToken();
  
  const res = await fetch(funcUtils.combineURL(url), {
    method: 'POST',
    body: JSON.stringify(payload),
    ...funcUtils.FetchHeaders(token || undefined),
  });
  return await res.json();
};

export default useApiPost;
