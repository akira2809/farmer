import { getTokenUser } from '@/action/utils';
import { TResponseData } from '@/models/global';
import funcUtils, { TParams } from '@/utils/funcUtils';

/**
 * Custom hook for making GET API requests
 * @template Response - Expected response data type
 * @param {string} url - API endpoint URL
 * @param {TParams} [query] - Query parameters (optional)
 * @param {boolean} [isCache=false] - Enable caching (default: false)
 * @param {string} [tag] - Cache tag for revalidation (optional)
 * @returns {Promise<TResponseData<Response> | undefined>} - API response or undefined if error occurs
 */
const useApiGet = async <Response = unknown>(
  url: string,
  query?: TParams,
  isCache = false,
  tag?: string,
): Promise<TResponseData<Response> | undefined> => {
  try {
    const isServer = typeof window === 'undefined';
    const token = isServer ? await getTokenUser() : undefined;
    const endpoint = funcUtils.combineURL(url, query);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      ...funcUtils.FetchHeaders(token, isCache, tag),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API GET request failed:', error);
    return undefined;
  }
};

export default useApiGet;
