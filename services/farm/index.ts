import { TFarm } from '@/models/farm';
import useApiPost from '../useApiPost';
import useApiGet from '../useApiGet';
import useApiPut from '../useApiPut';
import useApiDelete from '../useApiDelete';
import { API_ROUTE } from '@/common/config';

export default {
  createFarm: (payload: TFarm) => {
    return useApiPost(API_ROUTE.Farm.createFarm, payload);
  },
  getFarms: () => {
    return useApiGet(API_ROUTE.Farm.getFarms);
  },
  getFarmById: (id: string) => {
    return useApiGet(API_ROUTE.Farm.getFarmById.replace(':farmId', id));
  },
  updateFarm: (id: string, payload: TFarm) => {
    return useApiPut(API_ROUTE.Farm.updateFarm.replace(':farmId', id), payload);
  },
  updateCropStatus: (id: string, cropStatus: string) => {
    // Backend expects crop_status as query parameter, not in body
    const url = `${API_ROUTE.Farm.updateCropStatus.replace(':farmId', id)}?crop_status=${encodeURIComponent(cropStatus)}`;
    return useApiPut(url, {});
  },
  deleteFarm: (id: string) => {
    return useApiDelete(API_ROUTE.Farm.deleteFarm.replace(':farmId', id));
  },
};