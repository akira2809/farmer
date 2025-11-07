from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings


class Database:
    """MongoDB database connection manager"""
    
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None


db = Database()


async def connect_to_mongo():
    """Establish connection to MongoDB"""
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db.db = db.client[settings.MONGODB_DB_NAME]
    
    # Create geospatial index for farms collection
    await db.db.farms.create_index([("location", "2dsphere")])
    
    # Create compound index on user_id and crop_status for efficient filtering
    await db.db.farms.create_index([("user_id", 1), ("crop_status", 1)])
    
    # Create indexes for efficient queries
    await db.db.users.create_index("phone", unique=True)
    await db.db.notifications.create_index([("user_id", 1), ("created_at", -1)])
    
    # Create TTL index for refresh_tokens collection (auto-delete expired tokens)
    await db.db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.db.refresh_tokens.create_index("user_id")
    
    print(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db.db
