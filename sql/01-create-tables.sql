-- =============================================
-- FORKCAST: Create All Tables
-- Run this FIRST in Supabase SQL Editor
-- =============================================

-- Profile (single row, always id=1)
CREATE TABLE profile (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  height_inches INTEGER,
  weight_lbs DECIMAL,
  age INTEGER,
  sex TEXT DEFAULT 'male',
  training_days INTEGER DEFAULT 4,
  goal TEXT DEFAULT 'recomp',
  calorie_target INTEGER,
  protein_target INTEGER,
  carb_target INTEGER,
  fat_target INTEGER,
  meal_split TEXT DEFAULT 'big_dinner',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  setup_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO profile (id) VALUES (1);

-- Foods (master database)
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('protein','carb','veggie','fruit','fat','sauce','snack')),
  emoji TEXT,
  cal_per_100g DECIMAL NOT NULL,
  protein_per_100g DECIMAL NOT NULL,
  carbs_per_100g DECIMAL NOT NULL,
  fat_per_100g DECIMAL NOT NULL,
  fiber_per_100g DECIMAL,
  default_serving_g INTEGER NOT NULL DEFAULT 100,
  store_section TEXT DEFAULT 'other' CHECK (store_section IN ('meat_seafood','produce','dairy_eggs','pantry','canned','sauces','frozen','bakery','supplements','snacks','other')),
  source TEXT DEFAULT 'system' CHECK (source IN ('system','usda','openfoodfacts','label_scan','barcode','manual')),
  brand TEXT,
  barcode TEXT,
  is_system BOOLEAN DEFAULT true,
  is_onboarding BOOLEAN DEFAULT false,
  onboarding_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_foods_barcode ON foods(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_foods_category ON foods(category);

-- User's selected foods
CREATE TABLE food_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(food_id)
);

-- Meal templates
CREATE TABLE meal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('lunch','dinner','dessert')),
  instructions TEXT,
  prep_time_min INTEGER,
  cook_time_min INTEGER,
  is_system BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredients per template
CREATE TABLE meal_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_template_id UUID NOT NULL REFERENCES meal_templates(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id),
  default_grams INTEGER NOT NULL,
  is_optional BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Weekly meal plans
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Days within a plan
CREATE TABLE meal_plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  lunch_template_id UUID REFERENCES meal_templates(id),
  dinner_template_id UUID REFERENCES meal_templates(id),
  dessert_template_id UUID REFERENCES meal_templates(id),
  lunch_eaten BOOLEAN DEFAULT false,
  dinner_eaten BOOLEAN DEFAULT false,
  dessert_eaten BOOLEAN DEFAULT false,
  UNIQUE(meal_plan_id, day_of_week)
);

-- Favorite meals
CREATE TABLE favorite_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_template_id UUID NOT NULL REFERENCES meal_templates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meal_template_id)
);

-- Disable RLS on all tables (single user, using service role key)
ALTER TABLE profile DISABLE ROW LEVEL SECURITY;
ALTER TABLE foods DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_bank DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_template_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_days DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_meals DISABLE ROW LEVEL SECURITY;
