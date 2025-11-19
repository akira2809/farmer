import { getTokenUser } from '@/action/utils';
import funcUtils from '@/utils/funcUtils';

const useApiPost = async <T extends unknown = unknown>(url: string, payload: T) => {
  const isServer = typeof window === 'undefined';
  const res = await fetch(funcUtils.combineURL(url), {
    method: 'POST',
    body: JSON.stringify(payload),
    ...funcUtils.FetchHeaders(isServer ? await getTokenUser() : undefined),
  });
  return await res.json();
};

export default useApiPost;
