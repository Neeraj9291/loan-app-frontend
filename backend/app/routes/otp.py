from fastapi import APIRouter
from pydantic import BaseModel
from app.controllers.otp_controller import send_otp, verify_otp

router = APIRouter(prefix="/api/otp", tags=["OTP"])

class SendOtpRequest(BaseModel):
    mobile: str

class VerifyOtpRequest(BaseModel):
    mobile: str
    otp: str

@router.post("/send")
def send_otp_route(body: SendOtpRequest):
    return send_otp(body.mobile)

@router.post("/verify")
def verify_otp_route(body: VerifyOtpRequest):
    return verify_otp(body.mobile, body.otp)
