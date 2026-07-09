-- Create seller_credentials table to store OAuth keys
CREATE TABLE IF NOT EXISTS seller_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id VARCHAR(255) UNIQUE NOT NULL, -- Mercado Pago seller user ID
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    public_key VARCHAR(255) NOT NULL,
    expires_in BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE seller_credentials ENABLE ROW LEVEL SECURITY;

-- Allow reading, updating, inserting and deleting ONLY to authenticated admins
CREATE POLICY "Allow all access to authenticated admins" ON seller_credentials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
