"""
BloodLink AI - FastAPI Backend
Provides emergency blood requisition parsing, donor registration with Supabase integration,
and intelligent medical triage using Google Generative AI (Gemini).
"""

import os
import json
import re
from typing import Optional, List, Dict, Any
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai

# Local database operations and Supabase client
from database import (
    save_blood_request,
    fetch_active_requests,
    fetch_blood_inventory,
    fetch_prayagraj_blood_banks,
    supabase
)
from models import (
    BloodGroup,
    UrgencyLevel,
    BloodRequestCreate,
    BloodRequestResponse,
    AIChatRequest,
    AIChatResponse
)

# Load environment variables from .env file in the backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize FastAPI application
app = FastAPI(
    title="BloodLink AI Backend",
    description="Emergency Blood Management, Supabase Persistence & AI Triage API powered by Google Gemini",
    version="1.0.0"
)

# Enable CORS middleware for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google GenAI SDK using GEMINI_API_KEY
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

# Initialize the Gemini model
MODEL_NAME = "gemini-2.5-flash"
model = genai.GenerativeModel(MODEL_NAME)


# ---------------------------------------------------------
# Request & Response Schemas
# ---------------------------------------------------------

class ParseRequestPayload(BaseModel):
    """Input payload containing the raw emergency blood request text query."""
    query: str = Field(
        ...,
        min_length=3,
        description="Emergency text query describing the patient need, location, or blood type.",
        example="Need 2 units of O negative blood urgently at Swaroop Rani Nehru (SRN) Hospital, George Town, Prayagraj. Patient in critical state after an accident."
    )


class ParsedBloodRequestResponse(BaseModel):
    """Structured extraction output extracted by Gemini AI."""
    blood_group: Optional[str] = Field(None, description="Extracted blood group (e.g., O-, A+, B+, etc.)")
    location: Optional[str] = Field(None, description="Extracted hospital, landmark, city, or address")
    urgency_level: Optional[str] = Field(None, description="Calculated clinical urgency (critical, urgent, or normal)")
    patient_notes: Optional[str] = Field(None, description="Extracted patient condition, required units, or clinical context")
    raw_query: str = Field(..., description="Original input query submitted")


class DonorRegisterPayload(BaseModel):
    """Payload for volunteer blood donor registration."""
    name: str = Field(..., min_length=2, description="Donor full name", example="Siddharth Mishra")
    blood_group: str = Field(..., description="Blood group (e.g., O+, A-, B+, etc.)", example="O+")
    location: str = Field(..., min_length=2, description="City, region, or hospital district", example="Prayagraj, Uttar Pradesh")
    contact: str = Field(..., min_length=5, description="Mobile phone number or primary contact", example="+91 98765 43210")
    age: Optional[int] = Field(None, ge=18, le=65, description="Donor age (must be between 18 and 65)", example=24)
    email: Optional[str] = Field(None, description="Donor email address for notifications", example="donor@bloodlink.in")


class DonorRegisterResponse(BaseModel):
    """Response returned upon donor registration."""
    status: str
    donor_id: str
    name: str
    blood_group: str
    location: str
    contact: str
    registered_at: str
    message: str


# ---------------------------------------------------------
# Healthcheck & System Status
# ---------------------------------------------------------

@app.get("/")
def root():
    """Root healthcheck endpoint returning system configuration status."""
    return {
        "status": "online",
        "service": "BloodLink AI Backend",
        "model": MODEL_NAME,
        "gemini_configured": bool(gemini_api_key),
        "supabase_configured": bool(supabase is not None)
    }


# ---------------------------------------------------------
# AI Endpoints (Google Gemini)
# ---------------------------------------------------------

@app.post(
    "/api/ai/parse-request",
    response_model=ParsedBloodRequestResponse,
    summary="Parse Emergency Blood Request with Gemini AI",
    description="Extracts structured fields (blood_group, location, urgency_level, and patient_notes) from an unformatted emergency text query."
)
async def parse_emergency_request(payload: ParseRequestPayload):
    """
    Parses unstructured emergency query text into structured clinical parameters.
    Uses Google GenAI SDK with model 'gemini-2.5-flash'.
    """
    current_api_key = os.getenv("GEMINI_API_KEY")
    if not current_api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured in environment variables or .env file."
        )

    prompt = f"""
You are an expert emergency medical dispatch AI for BloodLink AI specifically serving Prayagraj (formerly Allahabad), Uttar Pradesh, India.
Analyze the following emergency blood request text query and extract structured information.

CRITICAL PRAYAGRAJ LOCATION RULES:
- You must strictly map and localize the extracted location to real Prayagraj zones, hospitals, or landmarks.
- Key Prayagraj Hospitals: "Swaroop Rani Nehru (SRN) Hospital, Prayagraj", "Jeevan Jyoti Hospital, Prayagraj", "Tej Bahadur Sapru (Beli) Hospital, Prayagraj", "Kamla Nehru Memorial Hospital (KNMH), Prayagraj", "Nazareth Hospital, Prayagraj", "Colvin Hospital, Prayagraj".
- Key Prayagraj Zones: "Civil Lines, Prayagraj", "George Town, Prayagraj", "Teliarganj / MNNIT, Prayagraj", "Chowk, Prayagraj", "Old Katra, Prayagraj", "Tagore Town, Prayagraj", "Naini, Prayagraj", "Jhunsi, Prayagraj", "Dhumanganj, Prayagraj".
- Normalize the extracted location to include ", Prayagraj, UP". If the query is ambiguous or mentions a location outside Prayagraj, default to the closest Prayagraj medical zone (e.g. "Civil Lines, Prayagraj, UP").

Query: "{payload.query}"

Return a valid JSON object with EXACTLY the following keys:
- "blood_group": The standardized ABO/Rh blood group (e.g., "O-", "O+", "A+", "A-", "B+", "B-", "AB+", "AB-") or null if not detected.
- "location": The formatted Prayagraj location or hospital string (e.g. "Civil Lines, Prayagraj, UP", "Swaroop Rani Nehru (SRN) Hospital, George Town, Prayagraj").
- "urgency_level": Must be one of ["critical", "urgent", "normal"] based on the clinical situation described.
- "patient_notes": Summary of patient condition, units required, or relevant clinical details.

Respond with ONLY the JSON object. Do not include markdown code block syntax, conversational filler, or commentary.
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )

        raw_text = response.text.strip() if response and response.text else "{}"
        cleaned_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
        cleaned_text = re.sub(r"\s*```$", "", cleaned_text, flags=re.MULTILINE).strip()

        parsed_data = json.loads(cleaned_text)

        parsed_location = normalize_to_prayagraj_zone(parsed_data.get("location") or payload.query)

        return ParsedBloodRequestResponse(
            blood_group=parsed_data.get("blood_group"),
            location=parsed_location,
            urgency_level=parsed_data.get("urgency_level"),
            patient_notes=parsed_data.get("patient_notes"),
            raw_query=payload.query
        )

    except json.JSONDecodeError as json_err:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to parse structured JSON from Gemini response: {str(json_err)}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API error during request parsing: {str(exc)}"
        )


def normalize_to_prayagraj_zone(text: str) -> str:
    """Strictly maps detected location text to canonical Prayagraj hospitals or medical zones."""
    lower = (text or "").lower()

    if any(k in lower for k in ("srn", "swaroop", "nehru", "motilal")):
        return "Swaroop Rani Nehru (SRN) Hospital, George Town, Prayagraj"
    if any(k in lower for k in ("jeevan", "jyoti", "lowther", "bai ka bagh")):
        return "Jeevan Jyoti Hospital, Lowther Road, Prayagraj"
    if any(k in lower for k in ("beli", "tej bahadur", "sapru", "stanley")):
        return "Tej Bahadur Sapru (Beli) Hospital, Stanley Road, Prayagraj"
    if any(k in lower for k in ("kamla", "knmh", "hashimpur")):
        return "Kamla Nehru Memorial Hospital (KNMH), Tagore Town, Prayagraj"
    if "nazareth" in lower:
        return "Nazareth Hospital, Civil Lines, Prayagraj"
    if any(k in lower for k in ("colvin", "divisional")):
        return "Colvin Divisional Hospital, Katra, Prayagraj"
    if any(k in lower for k in ("civil lines", "mg marg", "subhash")):
        return "Civil Lines, Prayagraj"
    if any(k in lower for k in ("teliarganj", "mnnit")):
        return "Teliarganj / MNNIT, Prayagraj"
    if "george town" in lower:
        return "George Town, Prayagraj"
    if "chowk" in lower:
        return "Chowk, Prayagraj"
    if "katra" in lower:
        return "Old Katra, Prayagraj"
    if "tagore town" in lower:
        return "Tagore Town, Prayagraj"
    if "naini" in lower:
        return "Naini Industrial Area, Prayagraj"
    if any(k in lower for k in ("jhunsi", "sangam")):
        return "Jhunsi / Sangam, Prayagraj"
    if any(k in lower for k in ("dhumanganj", "subedarganj")):
        return "Dhumanganj, Prayagraj"

    return "Civil Lines, Prayagraj, UP"


@app.post(
    "/api/ai/chat",
    response_model=AIChatResponse,
    summary="Interactive Blood Banking Medical Assistant",
    description="Conversational assistant powered by Gemini for blood donors, recipients, and medical staff."
)
async def ai_chat_assistant(payload: AIChatRequest):
    """Answers blood donation eligibility, compatibility, and emergency process inquiries."""
    current_api_key = os.getenv("GEMINI_API_KEY")
    if not current_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    system_instructions = {
        "emergency": "You are an emergency medical dispatch assistant for blood emergencies across Prayagraj, Uttar Pradesh (SRN Hospital, Jeevan Jyoti Hospital, Beli Hospital, Civil Lines, Teliarganj). Be direct, urgent, and concise.",
        "donor": "You are a donor care assistant for BloodLink AI Prayagraj. Explain donation eligibility, interval requirements, and preparation tips with empathy.",
        "medical": "You are a specialized transfusion medicine assistant for Prayagraj healthcare staff. Provide precise clinical answers.",
        "general": "You are a helpful assistant for BloodLink AI in Prayagraj, UP. Provide clear, accurate information regarding blood donation and local blood banks."
    }

    system_prompt = system_instructions.get(payload.context or "general", system_instructions["general"])
    prompt = f"{system_prompt}\n\nUser Question: {payload.message}\nAssistant:"

    try:
        response = model.generate_content(prompt)
        return AIChatResponse(
            response=response.text.strip() if response and response.text else "I am here to help with your blood banking needs.",
            context=payload.context or "general"
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini chat error: {str(exc)}")


# ---------------------------------------------------------
# Donor Registration (Supabase Integration)
# ---------------------------------------------------------

@app.post(
    "/api/donors/register",
    response_model=DonorRegisterResponse,
    summary="Register a Volunteer Blood Donor",
    description="Accepts donor registration details (name, blood group, location, contact) and saves the record into Supabase."
)
async def register_donor(payload: DonorRegisterPayload):
    """
    Registers a new volunteer blood donor and inserts the record into Supabase.
    If Supabase credentials are not configured, falls back to a simulated generated record.
    """
    now_iso = datetime.utcnow().isoformat()
    record = {
        "name": payload.name,
        "blood_group": payload.blood_group.upper(),
        "location": payload.location,
        "contact": payload.contact,
        "age": payload.age,
        "email": payload.email,
        "is_available": True,
        "created_at": now_iso
    }

    donor_id = f"DNR-{os.urandom(3).hex().upper()}"

    # Supabase integration logic
    if supabase:
        try:
            response = supabase.table("donors").insert(record).execute()
            if response.data and len(response.data) > 0:
                donor_id = str(response.data[0].get("id", donor_id))
        except Exception as exc:
            print(f"⚠ Supabase insert error on donors table: {exc}")
            # If the database table does not yet exist or insert fails, proceed with generated donor_id

    return DonorRegisterResponse(
        status="success",
        donor_id=donor_id,
        name=payload.name,
        blood_group=payload.blood_group.upper(),
        location=payload.location,
        contact=payload.contact,
        registered_at=now_iso,
        message=f"Thank you, {payload.name}! You have been registered as an active donor for blood group {payload.blood_group.upper()}."
    )


# ---------------------------------------------------------
# Blood Requests & Inventory Operations (Supabase Integration)
# ---------------------------------------------------------

@app.post("/api/requests", response_model=BloodRequestResponse, summary="Create Emergency Blood Request")
async def create_request(payload: BloodRequestCreate):
    """Dispatches a new emergency blood requisition to Supabase and matching centers."""
    record = {
        "blood_group": payload.blood_group.value,
        "quantity": payload.quantity,
        "urgency": payload.urgency.value,
        "patient_name": payload.patient_name,
        "patient_age": payload.patient_age,
        "hospital_name": payload.hospital_name,
        "hospital_address": payload.hospital_address,
        "contact_name": payload.contact_name,
        "contact_phone": payload.contact_phone,
        "medical_condition": payload.medical_condition,
        "additional_notes": payload.additional_notes,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }

    saved = await save_blood_request(record)

    return BloodRequestResponse(
        request_id=saved.get("id", f"REQ-{os.urandom(3).hex().upper()}"),
        status=saved.get("status", "pending"),
        blood_group=payload.blood_group,
        quantity=payload.quantity,
        urgency=payload.urgency,
        hospital_name=payload.hospital_name,
        created_at=saved.get("created_at", datetime.utcnow().isoformat()),
        message="Emergency blood request successfully logged and dispatched."
    )


@app.get("/api/requests", summary="List Active Requests")
async def list_requests():
    """Retrieves all active unfulfilled emergency blood requests."""
    return await fetch_active_requests()


@app.get("/api/inventory", summary="Get Regional Blood Inventory")
async def get_inventory():
    """Returns current blood unit availability by blood group."""
    return await fetch_blood_inventory()


@app.get("/api/blood-banks", summary="Get Prayagraj Verified Blood Banks")
async def get_blood_banks():
    """Returns verified blood banks and hospitals in Prayagraj, UP."""
    return await fetch_prayagraj_blood_banks()


# ---------------------------------------------------------
# Execution entrypoint (Runs server on port 8000)
# ---------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
