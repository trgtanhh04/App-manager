import asyncio
import pymongo
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "mongodb+srv://trhgtanhh04:0TGWiQSNhR7jSaT6@cluster0.a0vmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = AsyncIOMotorClient(DATABASE_URL)
db = client.app_management
apps_collection = db.apps

async def migrate_apps():
    try:
        result = await apps_collection.update_many(
            {"is_locked": {"$exists": False}},
            {"$set": {"is_locked": False}}
        )
        
        print(f"Migration completed! Updated {result.modified_count} apps with is_locked field.")
        
        apps = await apps_collection.find({}, {"name": 1, "is_locked": 1}).to_list(length=None)
        print("\nCurrent apps lock status:")
        for app in apps:
            lock_status = "🔒" if app.get("is_locked", False) else "🔓"
            print(f"  {lock_status} {app.get('name', 'Unknown')}")
            
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(migrate_apps())
