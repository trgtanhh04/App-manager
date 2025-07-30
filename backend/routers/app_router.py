from fastapi import APIRouter, HTTPException, Depends
from schemas.app_schema import AppSchema
from scripts.apps import create_app, update_app, get_app, get_all_apps, delete_app
from scripts.db import apps_collection
from bson import ObjectId
from routers.auth_router import verify_token

app_router = APIRouter()

@app_router.post("/") 
async def info_apps():
    apps = await get_all_apps()
    if not apps:
        return {"status": "no apps found"}
    return {"status": "apps found", "apps": apps}

@app_router.post("/create", dependencies=[Depends(verify_token)])
async def create_app_endpoint(app: AppSchema):
    if app.website:
        exit_app = await apps_collection.find_one({"website": app.website})
        if exit_app:
            raise HTTPException(status_code=400, detail="App with this website already exists")
    
    app_id = await create_app(app.dict())
    return {"status": "app created", "app_id": app_id}

@app_router.get("/detail/{app_id}", dependencies=[Depends(verify_token)])
async def app_detail(app_id: str):
    app = await get_app(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return {"status": "app found", "app": app}

@app_router.put("/update/{app_id}", dependencies=[Depends(verify_token)])
async def update_app_endpoint(app_id: str, app: AppSchema):
    existing_app = await get_app(app_id)
    if not existing_app:
        raise HTTPException(status_code=404, detail="App not found")
    
    updated_id = await update_app(app_id, app.dict())
    return {"status": "app updated", "app_id": updated_id}

@app_router.delete("/delete/{app_id}", dependencies=[Depends(verify_token)])
async def delete_app_endpoint(app_id: str):
    existing_app = await get_app(app_id)
    if not existing_app:
        raise HTTPException(status_code=404, detail="App not found")
    
    deleted_id = await delete_app(app_id)
    return {"status": "app deleted", "app_id": deleted_id}
