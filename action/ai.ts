'use server';

import { DiseaseDetectionFormData, DiseaseDetectionResponse } from '@/models/ai';
import aiApi from '@/services/ai';

export async function detectDiseaseAction(payload: DiseaseDetectionFormData): Promise<DiseaseDetectionResponse | null> {
  try {
    console.log('=== AI DETECTION ACTION START ===');
    console.log('Payload type:', typeof payload);
    console.log('Payload keys:', Object.keys(payload));
    
    // Log FormData if it's FormData
    if (payload instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of payload.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name}, ${value.size} bytes, ${value.type}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    } else {
      console.log('Payload is not FormData:', payload);
    }

    const response = await aiApi.detectDisease(payload);
    console.log('=== API RESPONSE ===');
    console.log('API Response:', response);
    
    const apiResponse = response;
    console.log('Parsed Response:', apiResponse);
    
    if (apiResponse?.success) {
      console.log('Success! Returning data:', apiResponse.data);
      return apiResponse.data;
    } else {
      console.error('API Error:', apiResponse?.message || 'Unknown error');
      console.error('Full error response:', apiResponse);
      
      // Log validation errors specifically
      if (apiResponse?.error?.errors) {
        console.error('Validation errors:', JSON.stringify(apiResponse.error.errors, null, 2));
      }
      
      return null;
    }
  } catch (error) {
    console.error('=== AI DETECTION ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Full error:', error);
    return null;
  }
}
