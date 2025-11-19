// Goong API utilities for reverse geocoding
const GOONG_API_KEY = process.env.NEXT_PUBLIC_GOONG_API_KEY;

interface GoongResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry: {
      location: { lat: number; lng: number };
    };
  }>;
  status: string;
}

export const getAddressFromCoords = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  if (!GOONG_API_KEY) {
    console.warn('GOONG_API_KEY not configured');
    return `Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  try {
    const url = `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`;
    const res = await fetch(url);
    const data: GoongResponse = await res.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return `Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Lỗi lấy địa chỉ:', error);
    return `Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};
