import { getServerSupabase } from './supabase';
import { MEAL_SPLITS } from './macros';

interface TemplateWithMacros {
  id: string;
  name: string;
  meal_type: string;
  total_cal: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  score: number;
}

async function getTemplatesWithMacros(supabase: ReturnType<typeof getServerSupabase>) {
  const { data: templates } = await supabase.from('meal_templates').select('id, name, meal_type');
  if (!templates) return [];

  const { data: items } = await supabase
    .from('meal_template_items')
    .select('meal_template_id, default_grams, food_id, foods(cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)');

  const macroMap = new Map<string, { cal: number; protein: number; carbs: number; fat: number }>();
  for (const item of items || []) {
    const food = item.foods as unknown as { cal_per_100g: number; protein_per_100g: number; carbs_per_100g: number; fat_per_100g: number };
    if (!food) continue;
    const existing = macroMap.get(item.meal_template_id) || { cal: 0, protein: 0, carbs: 0, fat: 0 };
    existing.cal += (item.default_grams * food.cal_per_100g) / 100;
    existing.protein += (item.default_grams * food.protein_per_100g) / 100;
    existing.carbs += (item.default_grams * food.carbs_per_100g) / 100;
    existing.fat += (item.default_grams * food.fat_per_100g) / 100;
    macroMap.set(item.meal_template_id, existing);
  }

  return templates.map(t => {
    const m = macroMap.get(t.id) || { cal: 0, protein: 0, carbs: 0, fat: 0 };
    return { ...t, total_cal: m.cal, total_protein: m.protein, total_carbs: m.carbs, total_fat: m.fat, score: 0 } as TemplateWithMacros;
  });
}

async function filterByFoodBank(templates: TemplateWithMacros[], supabase: ReturnType<typeof getServerSupabase>) {
  const { data: bankFoods } = await supabase.from('food_bank').select('food_id');
  const bankSet = new Set((bankFoods || []).map(f => f.food_id));

  const { data: allItems } = await supabase
    .from('meal_template_items')
    .select('meal_template_id, food_id, is_optional');

  const templateItemsMap = new Map<string, { food_id: string; is_optional: boolean }[]>();
  for (const item of allItems || []) {
    const list = templateItemsMap.get(item.meal_template_id) || [];
    list.push(item);
    templateItemsMap.set(item.meal_template_id, list);
  }

  return templates.filter(t => {
    const items = templateItemsMap.get(t.id) || [];
    return items.every(item => item.is_optional || bankSet.has(item.food_id));
  });
}

function pickN(templates: TemplateWithMacros[], n: number, targetCal: number, favoriteIds: Set<string>): TemplateWithMacros[] {
  const scored = templates.map(t => ({
    ...t,
    score: (1 / (1 + Math.abs(t.total_cal - targetCal) / Math.max(targetCal, 1))) * (favoriteIds.has(t.id) ? 1.5 : 1),
  }));
  scored.sort((a, b) => b.score - a.score);

  const picked: TemplateWithMacros[] = [];
  const usedIds = new Set<string>();

  for (const t of scored) {
    if (picked.length >= n) break;
    if (!usedIds.has(t.id)) { picked.push(t); usedIds.add(t.id); }
  }
  let idx = 0;
  while (picked.length < n && scored.length > 0) {
    picked.push(scored[idx % scored.length]);
    idx++;
  }

  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked;
}

export async function generateMealPlan(): Promise<string> {
  const supabase = getServerSupabase();

  const { data: profile } = await supabase.from('profile').select('*').eq('id', 1).single();
  if (!profile?.calorie_target) throw new Error('Profile not set up');

  const split = MEAL_SPLITS[profile.meal_split as keyof typeof MEAL_SPLITS] || MEAL_SPLITS.big_dinner;

  const allTemplates = await getTemplatesWithMacros(supabase);
  const validTemplates = await filterByFoodBank(allTemplates, supabase);

  const lunches = validTemplates.filter(t => t.meal_type === 'lunch');
  const dinners = validTemplates.filter(t => t.meal_type === 'dinner');
  const desserts = validTemplates.filter(t => t.meal_type === 'dessert');

  if (lunches.length === 0 || dinners.length === 0 || desserts.length === 0) {
    throw new Error('Not enough valid meal templates. Add more foods to your food bank.');
  }

  const { data: favRows } = await supabase.from('favorite_meals').select('meal_template_id');
  const favoriteIds = new Set((favRows || []).map(f => f.meal_template_id));

  const pickedLunches = pickN(lunches, 7, profile.calorie_target * split.lunch, favoriteIds);
  const pickedDinners = pickN(dinners, 7, profile.calorie_target * split.dinner, favoriteIds);
  const pickedDesserts = pickN(desserts, 7, profile.calorie_target * split.dessert, favoriteIds);

  await supabase.from('meal_plans').update({ is_active: false }).eq('is_active', true);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const weekStart = monday.toISOString().split('T')[0];

  const { data: plan } = await supabase.from('meal_plans').insert({ week_start: weekStart, is_active: true }).select().single();
  if (!plan) throw new Error('Failed to create meal plan');

  const days = Array.from({ length: 7 }, (_, i) => ({
    meal_plan_id: plan.id,
    day_of_week: i,
    lunch_template_id: pickedLunches[i].id,
    dinner_template_id: pickedDinners[i].id,
    dessert_template_id: pickedDesserts[i].id,
  }));

  await supabase.from('meal_plan_days').insert(days);
  return plan.id;
}

export async function shuffleMeal(dayId: string, mealType: 'lunch' | 'dinner' | 'dessert') {
  const supabase = getServerSupabase();

  const { data: day } = await supabase.from('meal_plan_days').select('*').eq('id', dayId).single();
  if (!day) throw new Error('Day not found');

  const currentTemplateId = day[`${mealType}_template_id`];

  const allTemplates = await getTemplatesWithMacros(supabase);
  const validTemplates = (await filterByFoodBank(allTemplates, supabase))
    .filter(t => t.meal_type === mealType && t.id !== currentTemplateId);

  if (validTemplates.length === 0) return;
  const newTemplate = validTemplates[Math.floor(Math.random() * validTemplates.length)];

  await supabase.from('meal_plan_days').update({ [`${mealType}_template_id`]: newTemplate.id }).eq('id', dayId);
}
