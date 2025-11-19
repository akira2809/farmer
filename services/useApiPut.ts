import { getTokenUser } from '@/action/utils';
import funcUtils from '@/utils/funcUtils';

const useApiPut = async (url: string, payload: any) => {
  const isServer = typeof window === 'undefined';
  const res = await fetch(funcUtils.combineURL(url), {
    method: 'PUT',
    body: JSON.stringify(payload),
    ...funcUtils.FetchHeaders(isServer ? await getTokenUser() : undefined),
  });
  return await res.json();
};

export default useApiPut;
