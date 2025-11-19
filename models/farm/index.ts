export interface TFarm {
  id: string;
  name: string;
  location: {
    type: string;
    coordinates: number[];
  };
  crop_type: string;
  area?: number;
  crop_status: string;
  planting_date: string;
  expected_harvest_date: string;
  created_at: string;
  updated_at: string;
}

export interface TCreateFarm {
  crop_type: string;
  name: string;
  area?: string;
  planting_date: string;
  expected_harvest_date: string;
  latitude?: string;
  longitude?: string;
}

export interface TCreateFarmRequest {
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  crop_type: string;
  area?: number;
  crop_status: 'preparing';
  planting_date: string; // ISO format
  expected_harvest_date: string; // ISO format
}

export interface TUpdateCropStatusRequest {
  crop_status: string;
}

export type CropStatus = 
  | 'preparing'      // Chuẩn bị
  | 'planted'        // Đã trồng
  | 'growing'        // Đang phát triển
  | 'flowering'      // Ra hoa
  | 'harvested'      // Đã thu hoạch
  | 'fallow';        // Bỏ hoang

export const CROP_STATUS_LABELS: Record<CropStatus, string> = {
  preparing: 'Chuẩn bị',
  planted: 'Đã trồng',
  growing: 'Đang phát triển',
  flowering: 'Ra hoa',
  harvested: 'Đã thu hoạch',
  fallow: 'Bỏ hoang'
};
