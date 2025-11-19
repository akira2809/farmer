export interface TFarm {
  id: string;
  name: string;
  location: {
    type: string;
    coordinates: number[];
  };
  crop_type: string;
  crop_status: string;
  planting_date: string;
  expected_harvest_date: string;
  created_at: string;
  updated_at: string;
}

export interface TCreateFarm {
  crop_type: string;
  name: string;
  area: string;
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
  crop_status: 'preparing';
  planting_date: string; // ISO format
  expected_harvest_date: string; // ISO format
}
