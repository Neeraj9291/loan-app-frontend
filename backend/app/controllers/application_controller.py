from sqlalchemy.orm import Session
from app.models.application import Application

def save_application(db: Session, data: dict) -> Application:
    app = Application(
        loan_type         = data.get("loanType"),
        amount            = str(data.get("amount")),
        co_applicant      = data.get("coApplicantRequired", False),
        name              = data.get("name"),
        dob               = data.get("dob"),
        gender            = data.get("gender"),
        marital_status    = data.get("maritalStatus"),
        father_name       = data.get("fatherName"),
        mother_name       = data.get("motherName"),
        email             = data.get("email"),
        mobile            = data.get("mobile"),
        alt_mobile        = data.get("altMobile"),
        pan               = data.get("pan"),
        aadhaar           = data.get("aadhaar"),
        address           = data.get("address"),
        pincode           = data.get("pincode"),
        state             = data.get("state"),
        permanent_address = data.get("permanentAddress"),
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

def get_all_applications(db: Session):
    return db.query(Application).order_by(Application.created_at.desc()).all()

def get_application_by_id(db: Session, app_id: int):
    return db.query(Application).filter(Application.id == app_id).first()
