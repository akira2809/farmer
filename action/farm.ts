'use server';

import { TFarm, TCreateFarm, TCreateFarmRequest } from '@/models/farm';
import farmApi from '@/services/farm';

interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
}

export async function getFarmsAction(): Promise<{ success: boolean; data?: TFarm[]; error?: string }> {
  try {
    console.log('🌾 getFarmsAction: Starting...');
    const response = await farmApi.getFarms();
    console.log('🌾 getFarmsAction: Response:', response);
    
    const apiResponse = response as ApiResponse<TFarm[]>;

    if (apiResponse?.success && apiResponse?.data) {
      console.log('🌾 getFarmsAction: Success with data');
      return { success: true, data: apiResponse.data };
    }

    // Handle different response formats
    const farms = (apiResponse?.data || apiResponse) as TFarm[] | null;

    if (Array.isArray(farms)) {
      console.log('🌾 getFarmsAction: Success with array');
      return { success: true, data: farms };
    }

    console.log('🌾 getFarmsAction: Failed - no valid data');
    return { 
      success: false, 
      error: apiResponse?.message || 'Không thể lấy danh sách ruộng' 
    };
  } catch (error) {
    console.error('❌ Get farms error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Lỗi không xác định' 
    };
  }
}

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
      area: fieldData.area ? parseFloat(fieldData.area) : undefined,
      crop_status: 'preparing', // Backend expects 'preparing' for new farms
      planting_date: new Date(fieldData.planting_date).toISOString(),
      expected_harvest_date: new Date(fieldData.expected_harvest_date).toISOString()
    };

    const response = await farmApi.createFarm(farmPayload as unknown as TFarm);
    const apiResponse = response as ApiResponse<TFarm>;
    let farm = null;

    if (apiResponse?.success && apiResponse?.data) {
      farm = apiResponse.data;
    } else {
      const responseData = apiResponse?.data as Record<string, unknown> | undefined;
      farm = (responseData?.data ||
        responseData?.farm ||
        apiResponse?.data ||
        apiResponse) as TFarm | null;
    }

    return farm;
  } catch (error) {
    console.error('Create farm error:', error);
    return null;
  }
}

export async function updateFarmAction(id: string, fieldData: Partial<TCreateFarm>): Promise<TFarm | null> {
  try {
    console.log('updateFarmAction called with:', { id, fieldData });

    // Transform form data to match backend API requirements
    const farmPayload: Record<string, string | number | undefined> = {
      name: fieldData.name,
      crop_type: fieldData.crop_type,
      area: fieldData.area ? parseFloat(fieldData.area) : undefined,
      planting_date: fieldData.planting_date ? new Date(fieldData.planting_date).toISOString() : undefined,
      expected_harvest_date: fieldData.expected_harvest_date ? new Date(fieldData.expected_harvest_date).toISOString() : undefined
    };

    // Remove undefined keys
    Object.keys(farmPayload).forEach(key => farmPayload[key] === undefined && delete farmPayload[key]);

    console.log('Sending payload to backend:', farmPayload);

    const response = await farmApi.updateFarm(id, farmPayload as unknown as TFarm);
    console.log('Backend response:', response);

    const apiResponse = response as ApiResponse<TFarm>;
    let farm = null;

    if (apiResponse?.success && apiResponse?.data) {
      farm = apiResponse.data;
    } else {
      const responseData = apiResponse?.data as Record<string, unknown> | undefined;
      farm = (responseData?.data ||
        responseData?.farm ||
        apiResponse?.data ||
        apiResponse) as TFarm | null;
    }

    return farm;
  } catch (error) {
    console.error('Update farm error:', error);
    return null;
  }
}

export async function deleteFarmAction(id: string): Promise<boolean> {
  try {
    await farmApi.deleteFarm(id);
    return true;
  } catch (error) {
    console.error('Delete farm error:', error);
    return false;
  }
}

export async function updateCropStatusAction(
  farmId: string, 
  cropStatus: string
): Promise<{ success: boolean; error?: string; data?: TFarm }> {
  try {
    console.log('updateCropStatusAction called with:', { farmId, cropStatus });

    // Backend expects crop_status as query parameter
    const response = await farmApi.updateCropStatus(farmId, cropStatus);
    console.log('Backend response:', JSON.stringify(response));

    const apiResponse = response as ApiResponse<TFarm>;

    if (apiResponse?.success && apiResponse?.data) {
      return { success: true, data: apiResponse.data };
    }

    // Handle different response formats
    const responseData = apiResponse?.data as Record<string, unknown> | undefined;
    const farm = (responseData?.data ||
      responseData?.farm ||
      apiResponse?.data ||
      apiResponse) as TFarm | null;

    if (farm && farm.id) {
      return { success: true, data: farm };
    }

    return { 
      success: false, 
      error: apiResponse?.message || 'Không thể cập nhật trạng thái cây trồng' 
    };
  } catch (error) {
    console.error('Update crop status error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Lỗi không xác định' 
    };
  }
}