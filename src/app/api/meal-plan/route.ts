import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getServerSupabase();

    // Get active plan
    const { data: plan } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('is_active', true)
      .single();

    if (!plan) {
      return NextResponse.json({ plan: null, days: [] });
    }

    // Get plan days with joined template names
    const { data: rawDays } = await supabase
      .from('meal_plan_days')
      .select(`
        id,
        day_of_week,
        lunch_template_id,
        dinner_template_id,
        dessert_template_id,
        lunch_eaten,
        dinner_eaten,
        dessert_eaten,
        lunch_template:meal_templates!lunch_template_id(id, name),
        dinner_template:meal_templates!dinner_template_id(id, name),
        dessert_template:meal_templates!dessert_template_id(id, name)
      `)
      .eq('meal_plan_id', plan.id)
      .order('day_of_week');

    // Get all template IDs used
    const templateIds = new Set<string>();
    for (const day of rawDays || []) {
      if (day.lunch_template_id) templateIds.add(day.lunch_template_id);
      if (day.dinner_template_id) templateIds.add(day.dinner_template_id);
      if (day.dessert_template_id) templateIds.add(day.dessert_template_id);
    }

    // Calculate macros for each template
    const { data: items } = await supabase
      .from('meal_template_items')
      .select('meal_template_id, default_grams, foods(cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)')
      .in('meal_template_id', Array.from(templateIds));

    const macroMap = new Map<string, { cal: number; protein: number; carbs: number; fat: number }>();
    for (const item of items || []) {
      const food = item.foods as unknown as {
        cal_per_100g: number;
        protein_per_100g: number;
        carbs_per_100g: number;
        fat_per_100g: number;
      };
      if (!food) continue;
      const existing = macroMap.get(item.meal_template_id) || { cal: 0, protein: 0, carbs: 0, fat: 0 };
      existing.cal += (item.default_grams * food.cal_per_100g) / 100;
      existing.protein += (item.default_grams * food.protein_per_100g) / 100;
      existing.carbs += (item.default_grams * food.carbs_per_100g) / 100;
      existing.fat += (item.default_grams * food.fat_per_100g) / 100;
      macroMap.set(item.meal_template_id, existing);
    }

    // Get favorites
    const { data: favRows } = await supabase.from('favorite_meals').select('meal_template_id');
    const favoriteIds = new Set((favRows || []).map(f => f.meal_template_id));

    // Build response days
    const days = (rawDays || []).map(day => {
      const lunch = day.lunch_template as unknown as { id: string; name: string } | null;
      const dinner = day.dinner_template as unknown as { id: string; name: string } | null;
      const dessert = day.dessert_template as unknown as { id: string; name: string } | null;

      const lunchMacros = macroMap.get(day.lunch_template_id) || { cal: 0, protein: 0, carbs: 0, fat: 0 };
      const dinnerMacros = macroMap.get(day.dinner_template_id) || { cal: 0, protein: 0, carbs: 0, fat: 0 };
      const dessertMacros = macroMap.get(day.dessert_template_id) || { cal: 0, protein: 0, carbs: 0, fat: 0 };

      return {
        id: day.id,
        day: day.day_of_week,
        lunch: {
          template_id: day.lunch_template_id,
          name: lunch?.name || '',
          macros: lunchMacros,
          eaten: day.lunch_eaten ?? false,
          favorite: favoriteIds.has(day.lunch_template_id),
        },
        dinner: {
          template_id: day.dinner_template_id,
          name: dinner?.name || '',
          macros: dinnerMacros,
          eaten: day.dinner_eaten ?? false,
          favorite: favoriteIds.has(day.dinner_template_id),
        },
        dessert: {
          template_id: day.dessert_template_id,
          name: dessert?.name || '',
          macros: dessertMacros,
          eaten: day.dessert_eaten ?? false,
          favorite: favoriteIds.has(day.dessert_template_id),
        },
      };
    });

    return NextResponse.json({ plan, days });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal plan' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const supabase = getServerSupabase();

  if (body.toggle === 'eaten') {
    const { day_id, meal_type } = body;
    const field = `${meal_type}_eaten`;

    const { data: day } = await supabase.from('meal_plan_days').select('*').eq('id', day_id).single();
    if (!day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

    const newValue = !day[field];
    await supabase.from('meal_plan_days').update({ [field]: newValue }).eq('id', day_id);

    // Streak logic
    if (newValue) {
      const updatedDay = { ...day, [field]: newValue };
      const allEaten = updatedDay.lunch_eaten && updatedDay.dinner_eaten && updatedDay.dessert_eaten;

      if (allEaten) {
        const { data: profile } = await supabase.from('profile').select('*').eq('id', 1).single();
        if (profile) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const lastDate = profile.last_completed_date;

          let newStreak = profile.current_streak;
          if (lastDate === today) { /* no change */ }
          else if (lastDate === yesterday) { newStreak += 1; }
          else { newStreak = 1; }

          await supabase.from('profile').update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, profile.longest_streak),
            last_completed_date: today,
            updated_at: new Date().toISOString(),
          }).eq('id', 1);
        }
      }
    }

    return NextResponse.json({ success: true, eaten: newValue });
  }

  if (body.toggle === 'favorite') {
    const { template_id } = body;
    const { data: existing } = await supabase
      .from('favorite_meals')
      .select('id')
      .eq('meal_template_id', template_id)
      .maybeSingle();

    if (existing) {
      await supabase.from('favorite_meals').delete().eq('id', existing.id);
      return NextResponse.json({ favorite: false });
    } else {
      await supabase.from('favorite_meals').insert({ meal_template_id: template_id });
      return NextResponse.json({ favorite: true });
    }
  }

  return NextResponse.json({ error: 'Unknown toggle' }, { status: 400 });
}
