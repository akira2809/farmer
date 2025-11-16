from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Dict, Any, Optional

from app.models.ai_chat import (
    DiseaseAnalysisResponse,
    DiseaseDetectionResult,
    ChatRequest,
    ChatResponse,
    AIAdviceResponse,
    DiseasePrediction
)
from app.models.user import UserInDB
from app.models.api_response import APIResponse, success_response, error_response
from app.services.disease_detection_service import DiseaseDetectionService
from app.services.clova_service import ClovaStudioService
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

# Initialize services
disease_service = DiseaseDetectionService()
clova_service = ClovaStudioService()


@router.post(
    "/detect-disease",
    response_model=APIResponse[DiseaseAnalysisResponse],
    status_code=status.HTTP_200_OK
)
async def detect_disease(
    image: UploadFile = File(..., description="Plant image for disease detection"),
    additional_context: Optional[str] = Form(None, description="Additional context or question"),
    current_user: UserInDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Detect plant disease from uploaded image and get AI advice.
    
    Workflow:
    1. Upload plant image
    2. AI detects disease from image
    3. Disease name is sent to Clova Studio
    4. Clova Studio returns advice and treatment information
    
    - **image**: Plant image file (JPG, PNG)
    - **additional_context**: Optional additional questions or context
    """
    try:
        # Validate file type
        if not image.content_type or not image.content_type.startswith("image/"):
            return error_response(
                message="File must be an image (JPG, PNG, etc.)",
                code="INVALID_FILE_TYPE"
            )
        
        # Read image bytes
        image_bytes = await image.read()
        
        # Check file size (max 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            return error_response(
                message="Image file too large. Maximum size is 10MB",
                code="FILE_TOO_LARGE"
            )
        
        # Step 1: Detect disease from image
        try:
            detection_result = disease_service.predict_disease(image_bytes)
        except Exception as e:
            return error_response(
                message=f"Disease detection failed: {str(e)}",
                code="DETECTION_FAILED"
            )
        
        # Step 2: Get AI advice from Clova Studio
        ai_advice = None
        clova_error = None
        
        try:
            clova_response = await clova_service.get_disease_advice(
                disease_name=detection_result["disease_name"],
                confidence=detection_result["confidence"],
                additional_context=additional_context
            )
            
            if clova_response.get("success"):
                ai_advice = clova_response.get("advice", "")
            else:
                clova_error = clova_response.get("error", "Unknown error")
                
        except Exception as e:
            clova_error = str(e)
        
        # Build response
        response_data = DiseaseAnalysisResponse(
            detection=DiseaseDetectionResult(
                disease_name=detection_result["disease_name"],
                confidence=detection_result["confidence"],
                top_predictions=[
                    DiseasePrediction(**pred) 
                    for pred in detection_result.get("top_predictions", [])
                ]
            ),
            ai_advice=ai_advice,
            success=ai_advice is not None,
            error=clova_error
        )
        
        return success_response(
            data=response_data.model_dump(),
            message="Disease analysis completed successfully" if ai_advice else "Disease detected but AI advice unavailable"
        )
        
    except Exception as e:
        return error_response(
            message=f"Error processing request: {str(e)}",
            code="PROCESSING_ERROR"
        )


@router.post(
    "/chat",
    response_model=APIResponse[ChatResponse],
    status_code=status.HTTP_200_OK
)
async def chat_with_ai(
    chat_request: ChatRequest,
    current_user: UserInDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    General chat with AI assistant about agriculture and plant diseases.
    
    - **message**: User's question or message
    - **conversation_history**: Optional previous conversation for context
    """
    try:
        # Convert conversation history to proper format
        history = None
        if chat_request.conversation_history:
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in chat_request.conversation_history
            ]
        
        # Get response from Clova Studio
        response = await clova_service.chat(
            message=chat_request.message,
            conversation_history=history
        )
        
        if response.get("success"):
            chat_response = ChatResponse(
                message=response.get("content", ""),
                success=True,
                error=None
            )
            
            return success_response(
                data=chat_response.model_dump(),
                message="Chat response generated successfully"
            )
        else:
            return error_response(
                message=response.get("error", "Failed to get AI response"),
                code="CHAT_FAILED"
            )
            
    except Exception as e:
        return error_response(
            message=f"Error in chat: {str(e)}",
            code="CHAT_ERROR"
        )


@router.get(
    "/health",
    response_model=APIResponse[Dict[str, bool]],
    status_code=status.HTTP_200_OK
)
async def check_ai_health(
    current_user: UserInDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Check if AI services are available and healthy.
    
    Returns status of:
    - Disease detection model
    - Clova Studio API connection
    """
    health_status = {
        "disease_detection_model": disease_service.model is not None,
        "clova_studio_configured": bool(clova_service.api_key)
    }
    
    all_healthy = all(health_status.values())
    
    return success_response(
        data=health_status,
        message="All AI services are healthy" if all_healthy else "Some AI services are unavailable"
    )
