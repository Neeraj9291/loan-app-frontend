from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.application_controller import (
    save_application,
    get_all_applications,
    get_application_by_id,
)

router = APIRouter(prefix="/api/application", tags=["Application"])

@router.post("/submit")
def submit_application(data: dict, db: Session = Depends(get_db)):
    app = save_application(db, data)
    return {"success": True, "message": "Application submitted successfully", "id": app.id}

@router.get("/all")
def all_applications(db: Session = Depends(get_db)):
    apps = get_all_applications(db)
    return {"success": True, "data": apps}

@router.get("/{app_id}")
def get_application(app_id: int, db: Session = Depends(get_db)):
    app = get_application_by_id(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"success": True, "data": app}
