from scripts.db import apps_collection
from bson import ObjectId

async def create_app(app_data):
    result = await apps_collection.insert_one(app_data)
    return str(result.inserted_id)

async def get_app(app_id):
    app = await apps_collection.find_one({
        "_id": ObjectId(app_id)
    })
    if app:
        app["_id"] = str(app["_id"])
    return app

async def get_all_apps():
    apps = []
    async for app in apps_collection.find():
        app["_id"] = str(app["_id"])
        apps.append(app)
    return apps

async def update_app(app_id, app_data):
    result = await apps_collection.update_one({
        "_id": ObjectId(app_id)}, {"$set": app_data})
    return app_id

async def delete_app(app_id):
    await apps_collection.delete_one({
        "_id": ObjectId(app_id)
        })
    return app_id