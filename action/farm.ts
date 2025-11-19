'use server';

import { TFarm, TCreateFarm, TCreateFarmRequest } from '@/models/farm';
import farmApi from '@/services/farm';

export async function createFarmAction(fieldData: TCreateFarm): Promise<TFarm | null> {
  try {
    // Transform form data to match backend API requirements
    const farmPayload: TCreateFarmRequest = {
      name: fieldData.name,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(fieldData.longitude || '0'), 
          parseFloat(fieldData.latitude || '0')
        ]
      },
      crop_type: fieldData.crop_type,
      crop_status: 'preparing', // Backend expects 'preparing' for new farms
      planting_date: new Date(fieldData.planting_date).toISOString(),
      expected_harvest_date: new Date(fieldData.expected_harvest_date).toISOString()
    };

    const response = await farmApi.createFarm(farmPayload as any);
    const apiResponse = response as any;
    let farm = null;
    
    if (apiResponse?.success && apiResponse?.data) {
      farm = apiResponse.data;
    } else {
      farm = apiResponse?.data?.data || 
             apiResponse?.data?.farm || 
             apiResponse?.data || 
             apiResponse;
    }
    
    return farm;
  } catch (error) {
    console.error('Create farm error:', error);
    return null;
  }
}