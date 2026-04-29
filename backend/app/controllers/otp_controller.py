import random
import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# In-memory store: { mobile: { otp, expires_at } }
otp_store: dict = {}

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

def send_otp(mobile: str) -> dict:
    if not mobile or len(mobile) != 10 or not mobile.isdigit():
        return {"success": False, "message": "Invalid mobile number"}

    otp = generate_otp()
    otp_store[mobile] = {
        "otp": otp,
        "expires_at": time.time() + 300  # 5 minutes
    }

    auth_key    = os.getenv("MSG91_AUTH_KEY")
    sender_id   = os.getenv("MSG91_SENDER_ID", "LNAPP")
    template_id = os.getenv("MSG91_TEMPLATE_ID")

    try:
        response = requests.get(
            "https://api.msg91.com/api/v5/otp",
            params={
                "authkey":     auth_key,
                "mobile":      f"91{mobile}",
                "message":     f"Your Loan App OTP is {otp}. Valid for 5 minutes. Do not share with anyone.",
                "sender":      sender_id,
                "otp":         otp,
                "template_id": template_id,
            },
            timeout=10
        )
        data = response.json()

        if data.get("type") == "success":
            return {"success": True, "message": "OTP sent successfully"}
        else:
            return {"success": False, "message": data.get("message", "Failed to send OTP")}

    except Exception as e:
        return {"success": False, "message": f"SMS service error: {str(e)}"}

def verify_otp(mobile: str, otp: str) -> dict:
    record = otp_store.get(mobile)

    if not record:
        return {"success": False, "message": "OTP not sent or already used"}

    if time.time() > record["expires_at"]:
        del otp_store[mobile]
        return {"success": False, "message": "OTP expired. Please resend."}

    if record["otp"] != otp:
        return {"success": False, "message": "Invalid OTP ❌"}

    del otp_store[mobile]
    return {"success": True, "message": "OTP Verified ✅"}
