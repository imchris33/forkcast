-- =============================================
-- FORKCAST: Seed All Foods
-- Run this SECOND in Supabase SQL Editor
-- =============================================

-- We use fixed UUIDs so meal templates can reference foods by ID.
-- Format: 00000000-0000-0000-0000-XXXXXXXXXXXX

-- === ONBOARDING PROTEINS ===
INSERT INTO foods (id, name, category, emoji, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, default_serving_g, store_section, is_onboarding, onboarding_default) VALUES
('00000000-0000-0000-0000-000000000001', 'Chicken Breast', 'protein', '🍗', 165, 31, 0, 3.6, 220, 'meat_seafood', true, true),
('00000000-0000-0000-0000-000000000002', 'Rotisserie Chicken', 'protein', '🍗', 209, 25, 0, 12, 200, 'meat_seafood', true, true),
('00000000-0000-0000-0000-000000000003', 'NY Strip Steak', 'protein', '🥩', 214, 26, 0, 12, 260, 'meat_seafood', true, true),
('00000000-0000-0000-0000-000000000004', 'Ground Turkey 93/7', 'protein', '🦃', 150, 19.5, 0, 7.2, 250, 'meat_seafood', true, true),
('00000000-0000-0000-0000-000000000005', 'Ground Beef 80/20', 'protein', '🍖', 254, 17, 0, 20, 200, 'meat_seafood', true, true),
('00000000-0000-0000-0000-000000000006', 'Salmon Fillet', 'protein', '🐟', 208, 20, 0, 13, 250, 'meat_seafood', true, true),
('00000000-0000-0000-0000-000000000007', 'Tilapia Fillet', 'protein', '🐠', 128, 26, 0, 2.7, 300, 'meat_seafood', true, false),
('00000000-0000-0000-0000-000000000008', 'Eggs', 'protein', '🥚', 144, 12, 1, 10, 100, 'dairy_eggs', true, true),
('00000000-0000-0000-0000-000000000009', 'Shrimp', 'protein', '🦐', 99, 24, 0.2, 0.3, 200, 'meat_seafood', true, false),
('00000000-0000-0000-0000-00000000000a', 'Sausage Links', 'protein', '🌭', 320, 14, 2, 28, 100, 'meat_seafood', true, false),
('00000000-0000-0000-0000-00000000000b', 'Canned Tuna', 'protein', '🥫', 116, 26, 0, 1, 200, 'canned', true, false),
('00000000-0000-0000-0000-00000000000c', 'Canned Chicken', 'protein', '🥫', 130, 25, 0, 3, 200, 'canned', true, false),
('00000000-0000-0000-0000-00000000000d', 'Protein Powder', 'protein', '💪', 400, 83, 10, 3.3, 30, 'supplements', true, true);

-- === ONBOARDING CARBS ===
INSERT INTO foods (id, name, category, emoji, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, default_serving_g, store_section, is_onboarding, onboarding_default) VALUES
('00000000-0000-0000-0000-000000000010', 'Jasmine Rice (cooked)', 'carb', '🍚', 130, 2.7, 28, 0.3, 130, 'pantry', true, true),
('00000000-0000-0000-0000-000000000011', 'Sweet Potato', 'carb', '🍠', 90, 1.6, 20, 0.1, 200, 'produce', true, true),
('00000000-0000-0000-0000-000000000012', 'Pasta (dry)', 'carb', '🍝', 354, 13, 74, 1.5, 70, 'pantry', true, true),
('00000000-0000-0000-0000-000000000013', 'Ezekiel Bread', 'carb', '🍞', 235, 15, 44, 1.5, 68, 'bakery', true, false),
('00000000-0000-0000-0000-000000000014', 'Low Carb Tortilla', 'carb', '🫓', 125, 8, 23, 4.7, 64, 'bakery', true, true),
('00000000-0000-0000-0000-000000000015', 'Cauliflower Rice', 'carb', '🥦', 25, 2, 5, 0.3, 200, 'frozen', true, true),
('00000000-0000-0000-0000-000000000016', 'Oats', 'carb', '🥣', 389, 17, 66, 7, 40, 'pantry', true, false),
('00000000-0000-0000-0000-000000000017', 'Quinoa', 'carb', '🌾', 120, 4.4, 21, 1.9, 130, 'pantry', true, false),
('00000000-0000-0000-0000-000000000018', 'Potatoes', 'carb', '🥔', 77, 2, 17, 0.1, 200, 'produce', true, false);

-- === ONBOARDING VEGGIES ===
INSERT INTO foods (id, name, category, emoji, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, default_serving_g, store_section, is_onboarding, onboarding_default) VALUES
('00000000-0000-0000-0000-000000000020', 'Broccoli', 'veggie', '🥦', 34, 2.8, 7, 0.4, 150, 'produce', true, true),
('00000000-0000-0000-0000-000000000021', 'Spinach', 'veggie', '🥬', 23, 2.9, 3.6, 0.4, 80, 'produce', true, true),
('00000000-0000-0000-0000-000000000022', 'Bell Peppers', 'veggie', '🫑', 26, 1, 6, 0.2, 100, 'produce', true, true),
('00000000-0000-0000-0000-000000000023', 'Mushrooms', 'veggie', '🍄', 22, 3.1, 3.3, 0.3, 100, 'produce', true, true),
('00000000-0000-0000-0000-000000000024', 'Zucchini', 'veggie', '🥒', 17, 1.2, 3.1, 0.3, 150, 'produce', true, true),
('00000000-0000-0000-0000-000000000025', 'Asparagus', 'veggie', '🌿', 20, 2.2, 3.9, 0.1, 150, 'produce', true, true),
('00000000-0000-0000-0000-000000000026', 'Onions', 'veggie', '🧅', 40, 1.1, 9.3, 0.1, 60, 'produce', true, true),
('00000000-0000-0000-0000-000000000027', 'Tomatoes', 'veggie', '🍅', 18, 0.9, 3.9, 0.2, 100, 'produce', true, true),
('00000000-0000-0000-0000-000000000028', 'Cucumber', 'veggie', '🥒', 15, 0.7, 3.6, 0.1, 100, 'produce', true, false),
('00000000-0000-0000-0000-000000000029', 'Garlic', 'veggie', '🧄', 149, 6.4, 33, 0.5, 6, 'produce', true, true),
('00000000-0000-0000-0000-00000000002a', 'Green Beans', 'veggie', '🫘', 31, 1.8, 7, 0.1, 100, 'produce', true, false),
('00000000-0000-0000-0000-00000000002b', 'Carrots', 'veggie', '🥕', 41, 0.9, 10, 0.2, 80, 'produce', true, false);

-- === ONBOARDING EXTRAS (fruits, sauces, snacks) ===
INSERT INTO foods (id, name, category, emoji, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, default_serving_g, store_section, is_onboarding, onboarding_default) VALUES
('00000000-0000-0000-0000-000000000030', 'Banana', 'fruit', '🍌', 89, 1.1, 23, 0.3, 100, 'produce', true, true),
('00000000-0000-0000-0000-000000000031', 'Strawberries', 'fruit', '🍓', 32, 0.7, 7.7, 0.3, 80, 'produce', true, true),
('00000000-0000-0000-0000-000000000032', 'Blueberries', 'fruit', '🫐', 57, 0.7, 14, 0.3, 60, 'produce', true, true),
('00000000-0000-0000-0000-000000000033', 'Frozen Mango', 'fruit', '🥭', 65, 0.5, 17, 0.3, 100, 'frozen', true, false),
('00000000-0000-0000-0000-000000000034', 'Apples', 'fruit', '🍎', 52, 0.3, 14, 0.2, 180, 'produce', true, false),
('00000000-0000-0000-0000-000000000035', 'Avocado', 'fat', '🥑', 160, 2, 8.5, 15, 70, 'produce', true, true),
('00000000-0000-0000-0000-000000000036', 'Olive Oil', 'fat', '🫒', 884, 0, 0, 100, 10, 'pantry', true, true),
('00000000-0000-0000-0000-000000000037', 'Soy Sauce', 'sauce', '🍶', 60, 8, 6, 0, 15, 'sauces', true, true),
('00000000-0000-0000-0000-000000000038', 'Hot Sauce', 'sauce', '🌶️', 30, 0.5, 6, 0.3, 10, 'sauces', true, true),
('00000000-0000-0000-0000-000000000039', 'Sriracha', 'sauce', '🔥', 80, 1.7, 17, 0.8, 10, 'sauces', true, false),
('00000000-0000-0000-0000-00000000003a', 'Salsa', 'sauce', '🫙', 30, 1, 7, 0, 40, 'sauces', true, true),
('00000000-0000-0000-0000-00000000003b', 'Pesto', 'sauce', '🌿', 510, 8.3, 6.4, 51, 20, 'sauces', true, false),
('00000000-0000-0000-0000-00000000003c', 'Sugar-Free Marinara', 'sauce', '🍅', 50, 1.7, 8, 1.5, 120, 'sauces', true, true),
('00000000-0000-0000-0000-00000000003d', 'Hummus', 'sauce', '🫘', 166, 8, 14, 9.6, 30, 'produce', true, false),
('00000000-0000-0000-0000-00000000003e', 'BBQ Sauce', 'sauce', '🍖', 172, 0.8, 40, 0.6, 20, 'sauces', true, false),
('00000000-0000-0000-0000-00000000003f', 'Greek Yogurt (nonfat)', 'protein', '🥛', 59, 10, 3.6, 0.4, 200, 'dairy_eggs', true, true),
('00000000-0000-0000-0000-000000000040', 'Dark Chocolate 70%', 'snack', '🍫', 598, 8, 46, 43, 20, 'snacks', true, false),
('00000000-0000-0000-0000-000000000041', 'Nut Butter', 'fat', '🥜', 588, 25, 20, 50, 20, 'pantry', true, false),
('00000000-0000-0000-0000-000000000042', 'Rice Cakes', 'carb', '🍘', 375, 3.6, 79, 2.7, 28, 'pantry', true, false),
('00000000-0000-0000-0000-000000000043', 'Halo Top', 'snack', '🍦', 140, 6.2, 25, 3, 130, 'frozen', true, false),
('00000000-0000-0000-0000-000000000044', 'Everything Bagel Seasoning', 'sauce', '✨', 125, 6, 6, 8, 4, 'sauces', true, false);

-- === EXPANDED LIBRARY (not shown in onboarding) ===
INSERT INTO foods (id, name, category, emoji, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, default_serving_g, store_section, is_onboarding, onboarding_default) VALUES
('00000000-0000-0000-0000-000000000050', 'Turkey Deli Meat', 'protein', '🦃', 104, 18, 4, 1, 60, 'meat_seafood', false, false),
('00000000-0000-0000-0000-000000000051', 'Cottage Cheese', 'protein', '🧀', 98, 11, 3.4, 4.3, 150, 'dairy_eggs', false, false),
('00000000-0000-0000-0000-000000000052', 'Pork Tenderloin', 'protein', '🐷', 143, 26, 0, 3.5, 200, 'meat_seafood', false, false),
('00000000-0000-0000-0000-000000000053', 'Cod Fillet', 'protein', '🐟', 82, 18, 0, 0.7, 200, 'meat_seafood', false, false),
('00000000-0000-0000-0000-000000000054', 'Brown Rice (cooked)', 'carb', '🍚', 123, 2.7, 26, 1, 130, 'pantry', false, false),
('00000000-0000-0000-0000-000000000055', 'Chickpeas (canned)', 'carb', '🫘', 139, 7, 23, 2.5, 130, 'canned', false, false),
('00000000-0000-0000-0000-000000000056', 'Black Beans (canned)', 'carb', '🫘', 132, 8.9, 24, 0.5, 130, 'canned', false, false),
('00000000-0000-0000-0000-000000000057', 'Lentils (cooked)', 'carb', '🫘', 116, 9, 20, 0.4, 130, 'pantry', false, false),
('00000000-0000-0000-0000-000000000058', 'Kale', 'veggie', '🥬', 49, 4.3, 9, 0.9, 80, 'produce', false, false),
('00000000-0000-0000-0000-000000000059', 'Brussels Sprouts', 'veggie', '🥬', 43, 3.4, 9, 0.3, 100, 'produce', false, false),
('00000000-0000-0000-0000-00000000005a', 'Edamame', 'veggie', '🫛', 121, 12, 9, 5, 100, 'frozen', false, false),
('00000000-0000-0000-0000-00000000005b', 'Bok Choy', 'veggie', '🥬', 13, 1.5, 2.2, 0.2, 100, 'produce', false, false),
('00000000-0000-0000-0000-00000000005c', 'Grapes', 'fruit', '🍇', 69, 0.7, 18, 0.2, 100, 'produce', false, false),
('00000000-0000-0000-0000-00000000005d', 'Pineapple', 'fruit', '🍍', 50, 0.5, 13, 0.1, 100, 'produce', false, false),
('00000000-0000-0000-0000-00000000005e', 'Watermelon', 'fruit', '🍉', 30, 0.6, 7.6, 0.2, 200, 'produce', false, false),
('00000000-0000-0000-0000-00000000005f', 'Raspberries', 'fruit', '🫐', 52, 1.2, 12, 0.7, 60, 'produce', false, false),
('00000000-0000-0000-0000-000000000060', 'Butter', 'fat', '🧈', 717, 0.9, 0.1, 81, 10, 'dairy_eggs', false, false),
('00000000-0000-0000-0000-000000000061', 'Tahini', 'sauce', '🫘', 595, 17, 21, 54, 15, 'sauces', false, false),
('00000000-0000-0000-0000-000000000062', 'Coconut Aminos', 'sauce', '🍶', 100, 0, 20, 0, 15, 'sauces', false, false),
('00000000-0000-0000-0000-000000000063', 'Mustard', 'sauce', '🟡', 60, 4, 6, 3, 10, 'sauces', false, false),
('00000000-0000-0000-0000-000000000064', 'Balsamic Vinegar', 'sauce', '🍷', 88, 0.5, 17, 0, 15, 'sauces', false, false),
('00000000-0000-0000-0000-000000000065', 'String Cheese', 'snack', '🧀', 280, 25, 2, 18, 28, 'dairy_eggs', false, false),
('00000000-0000-0000-0000-000000000066', 'Beef Jerky', 'snack', '🥩', 320, 52, 11, 8, 30, 'snacks', false, false),
('00000000-0000-0000-0000-000000000067', 'Popcorn (air popped)', 'snack', '🍿', 387, 13, 78, 4.5, 28, 'snacks', false, false);
