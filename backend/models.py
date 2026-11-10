"""
Pydantic data models and schemas for BloodLink AI backend.
Defines request and response payload structures with strict validation.
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class BloodGroup(str, Enum):
    """ABO and Rh factor blood group classifications."""
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


class UrgencyLevel(str, Enum):
    """Clinical urgency level."""
    CRITICAL = "critical"
    URGENT = "urgent"
    NORMAL = "normal"


class BloodRequestCreate(BaseModel):
    """Payload submitted when requesting emergency blood units."""
    blood_group: BloodGroup = Field(..., description="Target blood group needed")
    quantity: int = Field(..., ge=1, le=20, description="Number of units requested")
    urgency: UrgencyLevel = Field(default=UrgencyLevel.CRITICAL)
    patient_name: str = Field(..., min_length=2)
    patient_age: int = Field(..., ge=0, le=120)
    hospital_name: str = Field(..., min_length=2)
    hospital_address: str = Field(...)
    contact_name: str = Field(...)
    contact_phone: str = Field(...)
    medical_condition: Optional[str] = None
    additional_notes: Optional[str] = None


class BloodRequestResponse(BaseModel):
    """Response returned upon request creation."""
    request_id: str
    status: str
    blood_group: BloodGroup
    quantity: int
    urgency: UrgencyLevel
    hospital_name: str
    created_at: str
    message: str


class InventoryItem(BaseModel):
    """Blood unit inventory tracking model."""
    blood_group: BloodGroup
    current_stock: int
    minimum_required: int
    next_expiry: Optional[str] = None
    days_until_expiry: Optional[int] = None


class AIChatRequest(BaseModel):
    """User input message for Gemini AI chat assistance."""
    message: str = Field(..., min_length=1)
    context: Optional[str] = Field(default="general", description="general, emergency, donor, medical")


class AIChatResponse(BaseModel):
    """Gemini AI assistant response payload."""
    response: str
    context: str


class EmergencyTriageRequest(BaseModel):
    """Payload to trigger AI emergency compatibility & triage analysis."""
    blood_group: BloodGroup
    units: int
    urgency: UrgencyLevel
    patient_condition: Optional[str] = None


class CompatibleBloodGroup(BaseModel):
    blood_type: str
    compatibility: str
    is_universal: bool = False


class EmergencyTriageResponse(BaseModel):
    urgency_level: str
    primary_recommendation: str
    compatible_alternatives: List[CompatibleBloodGroup]
    immediate_actions: List[str]

