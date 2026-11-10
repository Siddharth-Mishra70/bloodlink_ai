-- ====================================================================
-- BloodLink AI - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize all tables,
-- foreign keys, indexes, and Row Level Security (RLS) policies.
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 2. Table: Donors
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 65),
    email VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    last_donated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast blood group and location queries
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON public.donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_location ON public.donors(location);

-- --------------------------------------------------------------------
-- 3. Table: Blood Requests
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blood_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blood_group VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    urgency VARCHAR(50) NOT NULL DEFAULT 'critical',
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER,
    hospital_name VARCHAR(255) NOT NULL,
    hospital_address TEXT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255),
    medical_condition TEXT,
    additional_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    fulfilled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON public.blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_group ON public.blood_requests(blood_group);

-- --------------------------------------------------------------------
-- 4. Table: Blood Inventory
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blood_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blood_group VARCHAR(10) NOT NULL UNIQUE,
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    minimum_required INTEGER NOT NULL DEFAULT 30,
    days_until_expiry INTEGER DEFAULT 14,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Inventory Records
INSERT INTO public.blood_inventory (blood_group, current_stock, minimum_required, days_until_expiry)
VALUES 
    ('A+', 45, 50, 10),
    ('A-', 8, 30, 2),
    ('B+', 78, 35, 15),
    ('B-', 14, 25, 8),
    ('AB+', 23, 25, 7),
    ('AB-', 6, 20, 4),
    ('O+', 92, 60, 20),
    ('O-', 12, 40, 3)
ON CONFLICT (blood_group) DO UPDATE 
SET current_stock = EXCLUDED.current_stock,
    minimum_required = EXCLUDED.minimum_required,
    days_until_expiry = EXCLUDED.days_until_expiry;

-- --------------------------------------------------------------------
-- 5. Row Level Security (RLS) Setup
-- --------------------------------------------------------------------
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access to inventory
CREATE POLICY "Allow public read access to blood inventory" 
ON public.blood_inventory FOR SELECT USING (true);

-- Allow authenticated and anon inserts for blood requests and donor signups
CREATE POLICY "Allow inserts on blood requests" 
ON public.blood_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on blood requests" 
ON public.blood_requests FOR SELECT USING (true);

CREATE POLICY "Allow inserts on donors" 
ON public.donors FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on donors" 
ON public.donors FOR SELECT USING (true);
