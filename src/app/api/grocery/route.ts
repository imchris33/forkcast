import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getServerSupabase();

    // Get active plan
    const { data: plan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('is_active', true)
      .single();

    if (!plan) {
      return NextResponse.json({ items: [] });
    }

    // Get all days for this plan
    const { data: days } = await supabase
      .from('meal_plan_days')
      .select('lunch_template_id, dinner_template_id, dessert_template_id')
      .eq('meal_plan_id', plan.id);

    // Count how many times each template is used
    const templateCounts = new Map<string, number>();
    for (const day of days || []) {
      for (const key of ['lunch_template_id', 'dinner_template_id', 'dessert_template_id'] as const) {
        const tid = day[key];
        if (tid) {
          templateCounts.set(tid, (templateCounts.get(tid) || 0) + 1);
        }
      }
    }

    const templateIds = Array.from(templateCounts.keys());
    if (templateIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Get all items for those templates, joined with foods
    const { data: templateItems } = await supabase
      .from('meal_template_items')
      .select('meal_template_id, default_grams, is_optional, foods(id, name, emoji, store_section)')
      .in('meal_template_id', templateIds);

    // Aggregate grams per food, multiplied by template occurrence count
    const foodAgg = new Map<string, {
      name: string;
      emoji: string;
      store_section: string;
      total_grams: number;
    }>();

    for (const item of templateItems || []) {
      if (item.is_optional) continue;

      const food = item.foods as unknown as {
        id: string;
        name: string;
        emoji: string;
        store_section: string;
      };
      if (!food) continue;

      const count = templateCounts.get(item.meal_template_id) || 1;
      const existing = foodAgg.get(food.id);

      if (existing) {
        existing.total_grams += item.default_grams * count;
      } else {
        foodAgg.set(food.id, {
          name: food.name,
          emoji: food.emoji,
          store_section: food.store_section || 'other',
          total_grams: item.default_grams * count,
        });
      }
    }

    // Group by store section
    const grouped: Record<string, { name: string; emoji: string; total_grams: number }[]> = {};
    for (const item of foodAgg.values()) {
      const section = item.store_section;
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push({
        name: item.name,
        emoji: item.emoji,
        total_grams: Math.round(item.total_grams),
      });
    }

    // Sort items within each section
    for (const section of Object.keys(grouped)) {
      grouped[section].sort((a, b) => a.name.localeCompare(b.name));
    }

    return NextResponse.json({ items: grouped });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate grocery list' },
      { status: 500 }
    );
  }
}
