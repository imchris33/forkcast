-- =============================================
-- FORKCAST: Seed Meal Templates + Items
-- Run this THIRD in Supabase SQL Editor
-- =============================================

-- We use fixed UUIDs for templates so items can reference them.
-- Template IDs: 10000000-... for lunches, 20000000-... for dinners, 30000000-... for desserts

-- ===== 10 LUNCHES =====
INSERT INTO meal_templates (id, name, meal_type, instructions, prep_time_min, cook_time_min) VALUES
('10000000-0000-0000-0000-000000000001', 'Chicken Rice Bowl', 'lunch',
 '["Season chicken breast with salt, pepper, and garlic powder","Cook chicken in a skillet over medium-high heat, 6-7 min per side","Slice chicken and serve over cooked jasmine rice","Add broccoli and drizzle with soy sauce"]',
 5, 15),
('10000000-0000-0000-0000-000000000002', 'Turkey Tortilla Wrap', 'lunch',
 '["Warm the low carb tortilla in a dry skillet for 30 seconds each side","Cook ground turkey with onions until browned, season with salt and pepper","Add salsa to the turkey mixture and stir","Fill tortilla with turkey, bell peppers, and avocado"]',
 5, 12),
('10000000-0000-0000-0000-000000000003', 'Salmon & Sweet Potato', 'lunch',
 '["Preheat oven to 400°F","Cube sweet potato and toss with olive oil, roast for 20 min","Season salmon with salt, pepper, and lemon","Bake salmon alongside sweet potato for last 12-15 min","Serve with steamed asparagus"]',
 10, 25),
('10000000-0000-0000-0000-000000000004', 'Beef Stir Fry', 'lunch',
 '["Slice beef into thin strips","Heat olive oil in a wok or large skillet over high heat","Stir fry beef for 2-3 min, remove and set aside","Stir fry bell peppers, mushrooms, and zucchini for 3-4 min","Return beef, add soy sauce, toss and serve over rice"]',
 10, 10),
('10000000-0000-0000-0000-000000000005', 'Loaded Egg Scramble', 'lunch',
 '["Dice onions, bell peppers, and mushrooms","Sauté veggies in olive oil for 3-4 min","Beat eggs and pour over veggies","Scramble until just set, season with salt and hot sauce","Serve with a low carb tortilla on the side"]',
 5, 8),
('10000000-0000-0000-0000-000000000006', 'Tuna Rice Bowl', 'lunch',
 '["Drain canned tuna","Cook jasmine rice according to package","Steam broccoli until tender-crisp","Assemble bowl with rice, tuna, and broccoli","Top with soy sauce and sriracha"]',
 5, 15),
('10000000-0000-0000-0000-000000000007', 'Chicken Marinara Pasta', 'lunch',
 '["Cook pasta according to package directions","Season and cook chicken breast, then slice","Warm marinara sauce in a pan","Toss pasta with marinara and top with sliced chicken","Add spinach and let it wilt into the sauce"]',
 5, 20),
('10000000-0000-0000-0000-000000000008', 'Shrimp Cauliflower Rice', 'lunch',
 '["Heat olive oil in a large skillet","Cook shrimp with garlic for 2-3 min per side","Remove shrimp, add cauliflower rice to the pan","Cook cauliflower rice for 4-5 min with soy sauce","Return shrimp, add bell peppers, toss and serve"]',
 5, 12),
('10000000-0000-0000-0000-000000000009', 'Steak & Potato Plate', 'lunch',
 '["Season steak with salt and pepper, let come to room temp","Cube potatoes and roast at 425°F with olive oil for 20 min","Sear steak in a hot skillet: 4 min per side for medium","Let steak rest 5 min before slicing","Serve with roasted potatoes and steamed green beans"]',
 10, 25),
('10000000-0000-0000-0000-00000000000a', 'Chicken Salad Wrap', 'lunch',
 '["Shred rotisserie chicken","Mix chicken with diced cucumber, tomatoes, and Greek yogurt","Season with salt, pepper, and hot sauce","Warm tortilla and fill with chicken salad","Add spinach leaves and roll up"]',
 10, 0);

-- ===== 10 DINNERS =====
INSERT INTO meal_templates (id, name, meal_type, instructions, prep_time_min, cook_time_min) VALUES
('20000000-0000-0000-0000-000000000001', 'Steak, Rice & Veggies', 'dinner',
 '["Season steak generously with salt, pepper, garlic powder","Cook jasmine rice according to package","Sear steak in a ripping hot cast iron skillet, 4-5 min per side","Rest steak for 5 minutes, then slice against the grain","Steam broccoli and asparagus until tender-crisp","Plate rice, top with steak slices, serve veggies on the side"]',
 10, 20),
('20000000-0000-0000-0000-000000000002', 'Chicken & Sweet Potato', 'dinner',
 '["Preheat oven to 425°F","Cube sweet potato, toss with olive oil and season","Roast sweet potato for 15 min","Season chicken breast, add to sheet pan","Roast together for another 20 min until chicken hits 165°F","Serve with sautéed spinach and garlic"]',
 10, 35),
('20000000-0000-0000-0000-000000000003', 'Salmon Pesto Pasta', 'dinner',
 '["Cook pasta in salted boiling water until al dente","Season salmon with salt and pepper","Pan-sear salmon skin-side down 4 min, flip for 3 min","Toss drained pasta with pesto","Flake salmon over pasta, add tomatoes","Finish with a drizzle of olive oil"]',
 5, 18),
('20000000-0000-0000-0000-000000000004', 'Turkey Taco Bowl', 'dinner',
 '["Brown ground turkey in a large skillet with onions","Add taco seasoning (cumin, chili powder, garlic, paprika)","Cook jasmine rice according to package","Build bowl: rice, seasoned turkey, bell peppers","Top with salsa, avocado, and hot sauce"]',
 10, 15),
('20000000-0000-0000-0000-000000000005', 'Beef & Broccoli', 'dinner',
 '["Slice beef thin and marinate in soy sauce for 10 min","Heat olive oil in wok over high heat","Stir fry beef quickly, 2-3 min, set aside","Add broccoli and garlic, cook 3-4 min","Return beef, add extra soy sauce, toss together","Serve over jasmine rice"]',
 15, 12),
('20000000-0000-0000-0000-000000000006', 'Chicken Stir Fry', 'dinner',
 '["Cut chicken into bite-size pieces","Stir fry chicken in olive oil over high heat until golden","Add mushrooms, zucchini, and bell peppers","Cook veggies 3-4 min until tender-crisp","Add soy sauce and garlic, toss everything together","Serve over jasmine rice"]',
 10, 15),
('20000000-0000-0000-0000-000000000007', 'Turkey Bolognese', 'dinner',
 '["Cook pasta in salted boiling water","Brown ground turkey with diced onions","Add marinara sauce and garlic, simmer 10 min","Toss pasta with the sauce","Top with spinach and let it wilt","Season with salt and pepper to taste"]',
 5, 20),
('20000000-0000-0000-0000-000000000008', 'Tilapia & Cauliflower Rice', 'dinner',
 '["Season tilapia with salt and pepper","Pan-sear tilapia in olive oil, 3-4 min per side","Cook cauliflower rice in the same pan for 4-5 min","Steam asparagus until tender-crisp","Serve tilapia over cauliflower rice with asparagus","Squeeze lemon and drizzle hot sauce"]',
 5, 15),
('20000000-0000-0000-0000-000000000009', 'Garlic Shrimp Pasta', 'dinner',
 '["Cook pasta until al dente, reserve 1/2 cup pasta water","Sauté garlic in olive oil until fragrant","Add shrimp, cook 2-3 min per side until pink","Add tomatoes and spinach, cook until wilted","Toss in pasta with a splash of pasta water","Season with salt, pepper, and hot sauce"]',
 5, 15),
('20000000-0000-0000-0000-00000000000a', 'Rotisserie Power Bowl', 'dinner',
 '["Shred rotisserie chicken","Cook jasmine rice or use leftover rice","Sauté mushrooms and zucchini with garlic","Build bowl: rice, chicken, sautéed veggies","Top with avocado and salsa","Drizzle with hot sauce"]',
 5, 10);

-- ===== 8 DESSERTS =====
INSERT INTO meal_templates (id, name, meal_type, instructions, prep_time_min, cook_time_min) VALUES
('30000000-0000-0000-0000-000000000001', 'Protein Shake', 'dessert',
 '["Add protein powder and banana to a blender","Add Greek yogurt and a splash of water or milk","Blend until smooth","Pour into a glass and enjoy"]',
 3, 0),
('30000000-0000-0000-0000-000000000002', 'Berry Yogurt Bowl', 'dessert',
 '["Scoop Greek yogurt into a bowl","Top with strawberries and blueberries","Drizzle with a small amount of nut butter","Optional: sprinkle with oats for crunch"]',
 3, 0),
('30000000-0000-0000-0000-000000000003', 'Chocolate Banana Bites', 'dessert',
 '["Slice banana into rounds","Melt dark chocolate in microwave (30 sec intervals)","Dip banana slices halfway into chocolate","Place on parchment paper and freeze for 15 min"]',
 10, 0),
('30000000-0000-0000-0000-000000000004', 'Protein Oats', 'dessert',
 '["Cook oats with water according to package","Stir in protein powder while oats are still warm","Top with blueberries and a drizzle of nut butter","Mix well and enjoy warm"]',
 2, 5),
('30000000-0000-0000-0000-000000000005', 'Mango Protein Smoothie', 'dessert',
 '["Add frozen mango chunks to blender","Add protein powder and Greek yogurt","Add a splash of water","Blend until creamy and smooth"]',
 3, 0),
('30000000-0000-0000-0000-000000000006', 'Rice Cake & Nut Butter', 'dessert',
 '["Top rice cakes with nut butter","Slice strawberries and arrange on top","Optional: drizzle with a tiny bit of honey","Enjoy as a crunchy-creamy snack"]',
 3, 0),
('30000000-0000-0000-0000-000000000007', 'Halo Top Sundae', 'dessert',
 '["Scoop Halo Top into a bowl","Top with fresh strawberries or blueberries","Add a small square of dark chocolate, chopped","Enjoy immediately"]',
 3, 0),
('30000000-0000-0000-0000-000000000008', 'Yogurt Parfait', 'dessert',
 '["Layer Greek yogurt in a glass or bowl","Add a layer of oats for crunch","Add a layer of mixed berries","Repeat layers and top with a drizzle of nut butter"]',
 5, 0);

-- =============================================
-- MEAL TEMPLATE ITEMS (ingredients)
-- References food UUIDs from 02-seed-foods.sql
-- =============================================

-- Lunch 1: Chicken Rice Bowl
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 200, false, 0),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 150, false, 1),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000020', 120, false, 2),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000037', 15, true, 3);

-- Lunch 2: Turkey Tortilla Wrap
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 200, false, 0),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014', 64, false, 1),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000022', 80, false, 2),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000035', 50, false, 3),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000026', 40, true, 4),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000003a', 30, true, 5);

-- Lunch 3: Salmon & Sweet Potato
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 180, false, 0),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011', 200, false, 1),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000025', 120, false, 2),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000036', 10, true, 3);

-- Lunch 4: Beef Stir Fry
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 180, false, 0),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', 130, false, 1),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000022', 80, false, 2),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000023', 80, false, 3),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000024', 100, true, 4),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000037', 15, true, 5),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000036', 8, true, 6);

-- Lunch 5: Loaded Egg Scramble
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', 200, false, 0),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000022', 80, false, 1),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000023', 80, false, 2),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000026', 40, false, 3),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000014', 64, true, 4),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000036', 8, true, 5),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000038', 10, true, 6);

-- Lunch 6: Tuna Rice Bowl
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-00000000000b', 180, false, 0),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000010', 150, false, 1),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000020', 120, false, 2),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000037', 15, true, 3);

-- Lunch 7: Chicken Marinara Pasta
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 180, false, 0),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000012', 70, false, 1),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-00000000003c', 120, false, 2),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000021', 60, true, 3),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000036', 8, true, 4);

-- Lunch 8: Shrimp Cauliflower Rice
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000009', 200, false, 0),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000015', 200, false, 1),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000022', 80, false, 2),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000029', 6, true, 3),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000037', 15, true, 4),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000036', 8, true, 5);

-- Lunch 9: Steak & Potato Plate
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 200, false, 0),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000018', 200, false, 1),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-00000000002a', 100, false, 2),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000036', 10, true, 3);

-- Lunch 10: Chicken Salad Wrap
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000002', 180, false, 0),
('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000014', 64, false, 1),
('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000028', 60, false, 2),
('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000027', 60, false, 3),
('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000003f', 40, true, 4),
('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000021', 30, true, 5);

-- Dinner 1: Steak, Rice & Veggies
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 260, false, 0),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 180, false, 1),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000020', 150, false, 2),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000025', 100, false, 3),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000036', 10, true, 4),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000029', 6, true, 5);

-- Dinner 2: Chicken & Sweet Potato
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 250, false, 0),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011', 250, false, 1),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021', 100, false, 2),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000029', 6, true, 3),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000036', 12, true, 4);

-- Dinner 3: Salmon Pesto Pasta
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 250, false, 0),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012', 80, false, 1),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000003b', 25, false, 2),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000027', 80, false, 3),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000036', 8, true, 4);

-- Dinner 4: Turkey Taco Bowl
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 280, false, 0),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', 160, false, 1),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000022', 100, false, 2),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000026', 60, false, 3),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000035', 70, false, 4),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-00000000003a', 40, true, 5),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000038', 10, true, 6);

-- Dinner 5: Beef & Broccoli
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 230, false, 0),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000010', 180, false, 1),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000020', 200, false, 2),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000037', 20, false, 3),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000029', 6, true, 4),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000036', 10, true, 5);

-- Dinner 6: Chicken Stir Fry
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 250, false, 0),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000010', 160, false, 1),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000023', 100, false, 2),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000024', 120, false, 3),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000022', 80, false, 4),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000037', 15, true, 5),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000029', 6, true, 6),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000036', 10, true, 7);

-- Dinner 7: Turkey Bolognese
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 250, false, 0),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000012', 80, false, 1),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-00000000003c', 150, false, 2),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000026', 50, false, 3),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000021', 60, true, 4),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000029', 6, true, 5),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000036', 8, true, 6);

-- Dinner 8: Tilapia & Cauliflower Rice
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000007', 300, false, 0),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000015', 250, false, 1),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000025', 150, false, 2),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000036', 10, true, 3),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000038', 10, true, 4);

-- Dinner 9: Garlic Shrimp Pasta
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', 250, false, 0),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000012', 80, false, 1),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000027', 100, false, 2),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000021', 60, false, 3),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000029', 8, false, 4),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000036', 12, true, 5);

-- Dinner 10: Rotisserie Power Bowl
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000002', 250, false, 0),
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000010', 180, false, 1),
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000023', 100, false, 2),
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000024', 120, false, 3),
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000035', 70, false, 4),
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000003a', 40, true, 5),
('20000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000029', 6, true, 6);

-- Dessert 1: Protein Shake
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000d', 30, false, 0),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000030', 100, false, 1),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000003f', 100, true, 2);

-- Dessert 2: Berry Yogurt Bowl
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000003f', 200, false, 0),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000031', 80, false, 1),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000032', 60, false, 2),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000041', 15, true, 3);

-- Dessert 3: Chocolate Banana Bites
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000030', 100, false, 0),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000040', 25, false, 1);

-- Dessert 4: Protein Oats
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000016', 40, false, 0),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-00000000000d', 25, false, 1),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000032', 40, true, 2),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000041', 10, true, 3);

-- Dessert 5: Mango Protein Smoothie
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000033', 120, false, 0),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-00000000000d', 30, false, 1),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-00000000003f', 80, true, 2);

-- Dessert 6: Rice Cake & Nut Butter
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000042', 28, false, 0),
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000041', 20, false, 1),
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000031', 60, true, 2);

-- Dessert 7: Halo Top Sundae
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000043', 130, false, 0),
('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000031', 60, true, 1),
('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000040', 15, true, 2);

-- Dessert 8: Yogurt Parfait
INSERT INTO meal_template_items (meal_template_id, food_id, default_grams, is_optional, sort_order) VALUES
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-00000000003f', 180, false, 0),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000016', 20, false, 1),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000031', 60, false, 2),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000032', 40, false, 3),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000041', 10, true, 4);
