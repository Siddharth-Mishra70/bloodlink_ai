"""
Supabase client integration for BloodLink AI backend.
Manages database operations for blood requests, inventory levels, and donor tracking.
"""

import os
from typing import Optional, Dict, Any, List
from supabase import create_client, Client

supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_KEY", "")

# Initialize Supabase client if credentials are provided
supabase: Optional[Client] = None

if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✓ Supabase client initialized successfully.")
    except Exception as e:
        print(f"⚠ Warning: Failed to initialize Supabase client: {e}")
else:
    print("ℹ Notice: SUPABASE_URL and SUPABASE_KEY not configured. Running in local/mock database mode.")


def get_supabase_client() -> Optional[Client]:
    """Returns the initialized Supabase client instance or None."""
    return supabase


# ---------------------------------------------------------
# Database Operations
# ---------------------------------------------------------

async def save_blood_request(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves an emergency blood requisition to Supabase or returns in-memory record.
    """
    if supabase:
        try:
            response = supabase.table("blood_requests").insert(data).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception as e:
            print(f"Supabase insert error: {e}")

    # Fallback return with simulated ID
    return {
        "id": f"REQ-{os.urandom(4).hex().upper()}",
        **data,
        "status": "pending"
    }


async def fetch_active_requests() -> List[Dict[str, Any]]:
    """
    Fetches active unfulfilled blood requests.
    """
    if supabase:
        try:
            response = (
                supabase.table("blood_requests")
                .select("*")
                .neq("status", "fulfilled")
                .order("created_at", desc=True)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Supabase query error: {e}")

    # Default fallback data matching frontend mock
    return [
        {
            "id": "REQ-2025-001",
            "blood_group": "O-",
            "quantity": 3,
            "urgency": "critical",
            "patient_name": "Rajesh Kumar",
            "hospital_name": "Apollo Hospital",
            "status": "pending",
            "created_at": "15 minutes ago"
        },
        {
            "id": "REQ-2025-002",
            "blood_group": "A+",
            "quantity": 2,
            "urgency": "urgent",
            "patient_name": "Priya Sharma",
            "hospital_name": "Max Healthcare",
            "status": "approved",
            "created_at": "30 minutes ago"
        }
    ]


async def fetch_blood_inventory() -> List[Dict[str, Any]]:
    """
    Fetches regional blood inventory counts.
    """
    if supabase:
        try:
            response = supabase.table("blood_inventory").select("*").execute()
            return response.data or []
        except Exception as e:
            print(f"Supabase inventory query error: {e}")

    return [
        {"blood_group": "A+", "current_stock": 45, "minimum_required": 50, "days_until_expiry": 10},
        {"blood_group": "O-", "current_stock": 12, "minimum_required": 40, "days_until_expiry": 3},
        {"blood_group": "B+", "current_stock": 78, "minimum_required": 35, "days_until_expiry": 15},
        {"blood_group": "AB+", "current_stock": 23, "minimum_required": 25, "days_until_expiry": 7},
        {"blood_group": "A-", "current_stock": 8, "minimum_required": 30, "days_until_expiry": 2},
        {"blood_group": "O+", "current_stock": 92, "minimum_required": 60, "days_until_expiry": 20}
    ]

