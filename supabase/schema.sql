-- Supabase Schema for La Terrasse Inventory App

-- ENUMS
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- INGREDIENTS
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    base_unit TEXT NOT NULL, -- g, ml, unit
    min_stock NUMERIC DEFAULT 0,
    max_stock NUMERIC DEFAULT 0,
    initial_stock NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SUPPLIERS
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SUPPLIER PRODUCTS
CREATE TABLE supplier_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    supplier_code TEXT,
    pack_size NUMERIC NOT NULL,
    pack_unit TEXT NOT NULL, -- kg, L
    conversion_factor NUMERIC NOT NULL, -- multiplied by pack_size gives base_unit (e.g. 1kg = 1000g, factor 1000)
    current_price NUMERIC,
    UNIQUE(supplier_id, ingredient_id)
);

-- PURCHASES (RECEIPTS)
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id),
    receipt_date DATE NOT NULL,
    total_amount NUMERIC,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, COMPLETED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- PURCHASE LINES
CREATE TABLE purchase_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id),
    quantity NUMERIC NOT NULL,
    pack_unit TEXT,
    unit_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- MENU ITEMS (POS)
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pos_id TEXT UNIQUE, -- ID from POS system
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RECIPES
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_base_unit NUMERIC NOT NULL, -- how much of the ingredient is consumed
    UNIQUE(menu_item_id, ingredient_id)
);

-- SALES (POS IMPORTS)
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_date DATE NOT NULL,
    status TEXT DEFAULT 'IMPORTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE sale_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- STOCK MOVEMENTS
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_id UUID REFERENCES ingredients(id),
    movement_type movement_type NOT NULL,
    quantity NUMERIC NOT NULL, -- stored in base_unit
    reference_id UUID, -- could be purchase_id, sale_id, or physical_count_id
    reference_type TEXT, -- 'PURCHASE', 'SALE', 'COUNT'
    movement_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- PHYSICAL COUNTS
CREATE TABLE physical_counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    count_date DATE NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE physical_count_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_count_id UUID REFERENCES physical_counts(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id),
    physical_quantity NUMERIC NOT NULL,
    theoretical_quantity NUMERIC,
    variance NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
