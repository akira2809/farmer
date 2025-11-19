import { DiseaseDetectionFormData } from '@/models/ai';
import { useApiPostFormData } from '../useApiPost';
import { API_ROUTE } from '@/common/config';

export default {
  detectDisease: async (payload: DiseaseDetectionFormData) => {
    console.log('=== AI SERVICE START ===');
    console.log('Payload type:', typeof payload);
    console.log('Payload instanceof FormData:', payload instanceof FormData);
    
    if (payload instanceof FormData) {
      console.log('FormData entries in service:');
      for (let [key, value] of payload.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name}, ${value.size} bytes, ${value.type}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    }
    
    console.log('Calling API:', API_ROUTE.AI.detectDisease);
    
    try {
      const result = await useApiPostFormData(API_ROUTE.AI.detectDisease, payload);
      console.log('=== AI SERVICE SUCCESS ===');
      console.log('Result:', result);
      return result;
    } catch (error) {
      console.log('=== AI SERVICE ERROR ===');
      console.error('AI Service Error:', error);
      throw error;
    }
  },
}
