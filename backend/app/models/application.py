from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id              = Column(Integer, primary_key=True, index=True)

    # Step 1 - Loan
    loan_type       = Column(String)
    amount          = Column(String)
    co_applicant    = Column(Boolean, default=False)

    # Step 2 - Personal
    name            = Column(String)
    dob             = Column(String)
    gender          = Column(String)
    marital_status  = Column(String)
    father_name     = Column(String)
    mother_name     = Column(String)
    email           = Column(String)
    mobile          = Column(String)
    alt_mobile      = Column(String, nullable=True)

    # Step 3 - KYC
    pan             = Column(String)
    aadhaar         = Column(String)

    # Step 4 - Address
    address         = Column(String)
    pincode         = Column(String)
    state           = Column(String)
    permanent_address = Column(String, nullable=True)

    status          = Column(String, default="pending")
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
