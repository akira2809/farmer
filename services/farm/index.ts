import { TFarm } from '@/models/farm';
import useApiPost from '../useApiPost';
import useApiGet from '../useApiGet';
import useApiPut from '../useApiPut';
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
  updateCropStatus: (id: string, payload: TFarm) => {
    return useApiPut(API_ROUTE.Farm.updateCropStatus.replace(':farmId', id), payload);
  },
};