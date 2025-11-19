import { getTokenUser } from '@/action/utils';
import funcUtils from '@/utils/funcUtils';
import { fetchJsonWithAuth } from './fetchWithAuth';

const useApiPut = async (url: string, payload: any) => {
  const isServer = typeof window === 'undefined';
  
  return await fetchJsonWithAuth(funcUtils.combineURL(url), {
    method: 'PUT',
    body: JSON.stringify(payload),
    ...funcUtils.FetchHeaders(isServer ? await getTokenUser() : undefined),
  });
};

export default useApiPut;
