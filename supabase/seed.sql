-- Supabase Seed Data for La Terrasse
-- Generate dummy UUIDs for stable seed if needed, but here we just use functions or standard UUIDs

INSERT INTO suppliers (id, name, contact_name, email, phone) VALUES
('b0000000-0000-0000-0000-000000000001', 'Diani Fresh Produce', 'John Doe', 'john@dianifresh.com', '0712345678'),
('b0000000-0000-0000-0000-000000000002', 'Coast Meats Ltd', 'Jane Smith', 'jane@coastmeats.ke', '0723456789');

INSERT INTO ingredients (id, name, category, base_unit, min_stock, max_stock, initial_stock) VALUES
('a0000000-0000-0000-0000-000000000001', 'Flour Type 45', 'Dry Goods', 'g', 5000, 20000, 10000),
('a0000000-0000-0000-0000-000000000002', 'Olive Oil', 'Liquids', 'ml', 2000, 10000, 5000),
('a0000000-0000-0000-0000-000000000003', 'Beef Tenderloin', 'Meat', 'g', 3000, 15000, 8000),
('a0000000-0000-0000-0000-000000000004', 'Butter', 'Dairy', 'g', 1000, 5000, 2000),
('a0000000-0000-0000-0000-000000000005', 'Dark Chocolate', 'Dry Goods', 'g', 2000, 10000, 3000);

-- Menu Items
INSERT INTO menu_items (id, pos_id, name, category, price) VALUES
('c0000000-0000-0000-0000-000000000001', 'POS-1001', 'Beef Wellington', 'Main Course', 3500),
('c0000000-0000-0000-0000-000000000002', 'Pasta Primavera', 'Main Course', 1800),
('c0000000-0000-0000-0000-000000000003', 'Chocolate Lava Cake', 'Dessert', 1200);

-- Recipes linking menu items to ingredients consumed (per portion)
INSERT INTO recipes (menu_item_id, ingredient_id, quantity_base_unit) VALUES
-- Beef Wellington uses 200g Tenderloin, 20g Butter, 50g Flour
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 200),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 20),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 50),

-- Pasta Primavera uses 100g Flour, 30ml Olive Oil
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 100),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 30),

-- Chocolate Lava Cake uses 50g Flour, 80g Chocolate, 40g Butter
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 50),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 80),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 40);

-- Initial Stock Movement
INSERT INTO stock_movements (ingredient_id, movement_type, quantity, reference_type)
SELECT id, 'IN', initial_stock, 'INITIAL' FROM ingredients;
