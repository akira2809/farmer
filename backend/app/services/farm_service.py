from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.farm import (
    FarmInDB,
    FarmCreate,
    FarmUpdate,
    FarmResponse,
    FarmFilters,
    CropStatus
)


class FarmService:
    """Service for managing farm operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.farms
    
    async def create_farm(self, user_id: str, farm_data: FarmCreate) -> FarmResponse:
        """
        Create a new farm with user_id association and crop information
        
        Args:
            user_id: ID of the user creating the farm (as string)
            farm_data: Farm creation data
            
        Returns:
            FarmResponse: Created farm data
        """
        farm_dict = farm_data.model_dump()
        farm_dict["user_id"] = ObjectId(user_id)
        farm_dict["created_at"] = datetime.utcnow()
        farm_dict["updated_at"] = datetime.utcnow()
        
        # Convert location to proper GeoJSON format for MongoDB
        farm_dict["location"] = {
            "type": "Point",
            "coordinates": farm_data.location.coordinates
        }
        
        result = await self.collection.insert_one(farm_dict)
        
        # Retrieve the created farm
        created_farm = await self.collection.find_one({"_id": result.inserted_id})
        
        return self._farm_to_response(created_farm)
    
    async def get_user_farms(
        self, 
        user_id: str, 
        filters: Optional[FarmFilters] = None
    ) -> List[FarmResponse]:
        """
        Get all farms for a user with optional filtering by crop_status
        
        Args:
            user_id: ID of the user (as string)
            filters: Optional filters to apply
            
        Returns:
            List[FarmResponse]: List of user's farms
        """
        query = {"user_id": ObjectId(user_id)}
        
        # Apply crop_status filter if provided
        if filters and filters.crop_status:
            query["crop_status"] = filters.crop_status.value
        
        cursor = self.collection.find(query).sort("created_at", -1)
        farms = await cursor.to_list(length=None)
        
        return [self._farm_to_response(farm) for farm in farms]
    
    async def get_farm_by_id(self, farm_id: str) -> FarmResponse:
        """
        Get a farm by its ID
        
        Args:
            farm_id: ID of the farm
            
        Returns:
            FarmResponse: Farm data
            
        Raises:
            HTTPException: If farm not found
        """
        if not ObjectId.is_valid(farm_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        farm = await self.collection.find_one({"_id": ObjectId(farm_id)})
        
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        return self._farm_to_response(farm)
    
    async def update_farm(self, farm_id: str, farm_data: FarmUpdate) -> FarmResponse:
        """
        Update farm details including crop information
        
        Args:
            farm_id: ID of the farm to update
            farm_data: Updated farm data
            
        Returns:
            FarmResponse: Updated farm data
            
        Raises:
            HTTPException: If farm not found
        """
        if not ObjectId.is_valid(farm_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Build update dict with only provided fields
        update_dict = {}
        for field, value in farm_data.model_dump(exclude_unset=True).items():
            if value is not None:
                update_dict[field] = value
        
        if not update_dict:
            # No fields to update, return current farm
            return await self.get_farm_by_id(farm_id)
        
        # Always update the updated_at timestamp
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(farm_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Retrieve and return updated farm
        updated_farm = await self.collection.find_one({"_id": ObjectId(farm_id)})
        return self._farm_to_response(updated_farm)
    
    async def update_crop_status(self, farm_id: str, status: CropStatus) -> FarmResponse:
        """
        Quick update for crop status only
        
        Args:
            farm_id: ID of the farm
            status: New crop status
            
        Returns:
            FarmResponse: Updated farm data
            
        Raises:
            HTTPException: If farm not found
        """
        if not ObjectId.is_valid(farm_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        result = await self.collection.update_one(
            {"_id": ObjectId(farm_id)},
            {
                "$set": {
                    "crop_status": status.value,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Retrieve and return updated farm
        updated_farm = await self.collection.find_one({"_id": ObjectId(farm_id)})
        return self._farm_to_response(updated_farm)
    
    async def verify_farm_ownership(self, user_id: str, farm_id: str) -> bool:
        """
        Verify that a farm belongs to a specific user
        
        Args:
            user_id: ID of the user (as string)
            farm_id: ID of the farm (as string)
            
        Returns:
            bool: True if user owns the farm, False otherwise
        """
        if not ObjectId.is_valid(farm_id):
            return False
        
        farm = await self.collection.find_one({
            "_id": ObjectId(farm_id),
            "user_id": ObjectId(user_id)
        })
        
        return farm is not None
    
    async def get_all_farms(self) -> List[FarmResponse]:
        """
        Get all farms from the database.
        
        Returns:
            List[FarmResponse]: A list of all farms.
        """
        cursor = self.collection.find({}).sort("created_at", -1)
        farms = await cursor.to_list(length=None)
        return [self._farm_to_response(farm) for farm in farms]

    async def delete_farm(self, farm_id: str) -> bool:
        """
        Delete a farm by its ID
        
        Args:
            farm_id: ID of the farm to delete
            
        Returns:
            bool: True if deleted successfully
            
        Raises:
            HTTPException: If farm not found
        """
        if not ObjectId.is_valid(farm_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        result = await self.collection.delete_one({"_id": ObjectId(farm_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
            
        return True

    def _farm_to_response(self, farm: dict) -> FarmResponse:
        """
        Convert MongoDB farm document to FarmResponse
        
        Args:
            farm: Farm document from MongoDB
            
        Returns:
            FarmResponse: Formatted farm response
        """
        return FarmResponse(
            id=str(farm["_id"]),
            user_id=str(farm["user_id"]),
            name=farm["name"],
            location={
                "type": "Point",
                "coordinates": farm["location"]["coordinates"]
            },
            crop_type=farm.get("crop_type"),
            variety=farm.get("variety"),
            area=farm.get("area"),
            crop_status=CropStatus(farm["crop_status"]),
            planting_date=farm.get("planting_date"),
            expected_harvest_date=farm.get("expected_harvest_date"),
            created_at=farm["created_at"],
            updated_at=farm["updated_at"]
        )
