// Disease detection from AI API
export interface DiseasePrediction {
  disease: string;
  confidence: number;
}

export interface Detection {
  disease_name: string;
  confidence: number;
  top_predictions: DiseasePrediction[];
}

export interface AiAdvice {
  disease_name: string;
  advice: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatment: string[];
  notes: string[];
}

export interface DiseaseDetectionResponse {
  detection: Detection;
  ai_advice: string;
}

// For form data when uploading image
export interface DiseaseDetectionRequest {
  image: File;
  farm_id?: string;
  crop_type?: string;
  additional_context?: string;
}

// Accept FormData for server action
export type DiseaseDetectionFormData = FormData;
