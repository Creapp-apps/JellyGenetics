-- Create site_settings table (singleton pattern)
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    brand_name TEXT NOT NULL DEFAULT 'JELLY GENETICS',
    logo_url TEXT NOT NULL DEFAULT '/coronajelly.png',
    instagram_url TEXT DEFAULT 'https://instagram.com/jellygenetics',
    telegram_url TEXT DEFAULT 'https://t.me/jellygenetics',
    whatsapp_url TEXT DEFAULT 'https://wa.me/jellygenetics',
    spotify_url TEXT DEFAULT 'https://spotify.com/jellygenetics',
    hero_label TEXT DEFAULT 'PREMIUM CANNABIS GENETICS',
    hero_title_line1 TEXT DEFAULT 'JELLY',
    hero_title_line2 TEXT DEFAULT 'GENETICS',
    hero_subtitle TEXT DEFAULT 'Genéticas de precisión para el cultivador moderno. Cada semilla, una obra maestra genética.',
    hero_btn_text TEXT DEFAULT 'Explorar Genéticas',
    hero_btn_merch_text TEXT DEFAULT 'VER MERCH',
    stats JSONB DEFAULT '[{"value": "3+", "label": "Genéticas Exclusivas"}, {"value": "99%", "label": "Tasa de Germinación"}, {"value": "100%", "label": "Feminizadas"}, {"value": "∞", "label": "Pasión Genética"}]'::jsonb,
    cta_label TEXT DEFAULT '¿LISTO?',
    cta_title TEXT DEFAULT 'Elevá tu cultivo',
    cta_text TEXT DEFAULT 'Descubrí genéticas premium desarrolladas con la más alta tecnología y pasión por la planta.',
    cta_btn_text TEXT DEFAULT 'Explorar Catálogo',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings (read-only for public, write for admin/authenticated)
CREATE POLICY "Permitir lectura publica de configuracion" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Permitir actualizacion a usuarios autenticados" ON site_settings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir insercion a usuarios autenticados" ON site_settings
    FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create genetics table
CREATE TABLE genetics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Indica', 'Sativa', 'Hybrid')),
    thc TEXT,
    cbd TEXT,
    terpene TEXT,
    terpene_color TEXT,
    terpenes JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    effects TEXT[] DEFAULT '{}'::text[],
    flowering_time TEXT,
    yield TEXT,
    difficulty TEXT,
    seed_type TEXT DEFAULT 'fem',
    lineage JSONB DEFAULT '{"mother": "", "father": ""}'::jsonb,
    packs JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT false,
    soldout BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for genetics
ALTER TABLE genetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de geneticas" ON genetics
    FOR SELECT USING (true);

CREATE POLICY "Permitir modificacion de geneticas a autenticados" ON genetics
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create merch table
CREATE TABLE merch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sizes TEXT[] DEFAULT '{}'::text[],
    stock INTEGER DEFAULT 0,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for merch
ALTER TABLE merch ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de merch" ON merch
    FOR SELECT USING (true);

CREATE POLICY "Permitir modificacion de merch a autenticados" ON merch
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    date DATE DEFAULT CURRENT_DATE,
    read_time TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de posts publicados" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Permitir lectura completa de posts a autenticados" ON blog_posts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir modificacion de posts a autenticados" ON blog_posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create faqs table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de faqs" ON faqs
    FOR SELECT USING (true);

CREATE POLICY "Permitir modificacion de faqs a autenticados" ON faqs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    items JSONB NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Reading orders requires authentication or customer email check, but let's lock it to authenticated users for administration
CREATE POLICY "Permitir acceso completo a orders a autenticados" ON orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow inserting orders publicly (checkout process)
CREATE POLICY "Permitir crear pedidos a cualquiera" ON orders
    FOR INSERT WITH CHECK (true);

-- Create coupons table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL,
    min_purchase NUMERIC(10, 2) DEFAULT 0,
    max_uses INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public can select coupons to validate codes
CREATE POLICY "Permitir validar cupones" ON coupons
    FOR SELECT USING (active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Permitir acceso completo a cupones a autenticados" ON coupons
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert Sample Data for Genetics
INSERT INTO genetics (slug, name, type, thc, cbd, terpene, terpene_color, terpenes, description, effects, flowering_time, yield, difficulty, seed_type, lineage, packs, featured, soldout)
VALUES 
('jupiter-jelly', 'Jupiter Jelly', 'Hybrid', '28%', '0.5%', 'Myrcene', '#00FF88', 
 '[{"name": "Myrcene", "color": "#00FF88", "percentage": 35}, {"name": "Limonene", "color": "#FFD700", "percentage": 25}, {"name": "Caryophyllene", "color": "#FF6B35", "percentage": 20}]'::jsonb,
 'Un híbrido potente con aromas frutales y un perfil de terpenos complejo que lleva la experiencia a otro nivel.',
 ARRAY['Relaxing', 'Creative', 'Euphoric', 'Happy'], '56-63d', '500-600 g/m²', 'Medium', 'fem',
 '{"mother": "Jelly Cake", "father": "Jupiter OG"}'::jsonb,
 '[{"size": "3-Pack", "price": 1149, "stock": 50}, {"size": "6-Pack", "price": 1999, "stock": 30}]'::jsonb,
 true, false),

('p-o-p', 'P.O.P', 'Indica', '25%', '1.2%', 'Limonene', '#FFD700', 
 '[{"name": "Limonene", "color": "#FFD700", "percentage": 40}, {"name": "Humulene", "color": "#00FF88", "percentage": 20}, {"name": "Linalool", "color": "#8B5CF6", "percentage": 15}]'::jsonb,
 'Una indica pura con sabores dulces y efecto corporal profundo. Perfecta para relajación nocturna.',
 ARRAY['Relaxing', 'Sleepy', 'Pain Relief', 'Appetite'], '49-56d', '500-600 g/m²', 'Easy', 'fem',
 '{"mother": "Purple Punch", "father": "OG Kush"}'::jsonb,
 '[{"size": "3-Pack", "price": 1149, "stock": 45}, {"size": "6-Pack", "price": 1999, "stock": 25}]'::jsonb,
 true, false),

('karoz1', 'KaroZ1', 'Sativa', '26%', '0.3%', 'Caryophyllene', '#FF6B35', 
 '[{"name": "Caryophyllene", "color": "#FF6B35", "percentage": 30}, {"name": "Terpinolene", "color": "#00BFFF", "percentage": 25}, {"name": "Pinene", "color": "#00FF88", "percentage": 20}]'::jsonb,
 'Sativa premium con efecto energético y cerebral. Ideal para uso diurno y actividades creativas.',
 ARRAY['Energetic', 'Creative', 'Focused', 'Uplifting'], '63-70d', '400-500 g/m²', 'Advanced', 'fem',
 '{"mother": "Karo OG", "father": "Z1 Haze"}'::jsonb,
 '[{"size": "3-Pack", "price": 1149, "stock": 0}]'::jsonb,
 false, true);

-- Insert Sample Data for Orders
INSERT INTO orders (order_number, customer_name, customer_email, items, total, status, shipping_address, created_at)
VALUES
('JG-001', 'Carlos M.', 'carlos@email.com', '[{"name": "Jupiter Jelly 3-Pack", "qty": 1, "price": 1149}]'::jsonb, 1149.00, 'entregado', 'CDMX, México', '2025-03-01 12:00:00+00'),
('JG-002', 'María L.', 'maria@email.com', '[{"name": "P.O.P 6-Pack", "qty": 1, "price": 1999}, {"name": "Jupiter Jelly 3-Pack", "qty": 1, "price": 1149}]'::jsonb, 3148.00, 'enviado', 'Guadalajara, México', '2025-03-10 15:30:00+00'),
('JG-003', 'Diego R.', 'diego@email.com', '[{"name": "KaroZ1 3-Pack", "qty": 2, "price": 2298}]'::jsonb, 2298.00, 'pagado', 'Monterrey, México', '2025-03-18 09:15:00+00'),
('JG-004', 'Ana P.', 'ana@email.com', '[{"name": "P.O.P 3-Pack", "qty": 1, "price": 1149}]'::jsonb, 1149.00, 'pendiente', 'Puebla, México', '2025-03-20 18:45:00+00');
