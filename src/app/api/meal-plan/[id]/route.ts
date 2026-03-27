import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServerSupabase();

    // Get the template
    const { data: template } = await supabase
      .from('meal_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (!template) {
      return NextResponse.json({ error: 'Meal template not found' }, { status: 404 });
    }

    // Get items with food details
    const { data: items } = await supabase
      .from('meal_template_items')
      .select('*, foods(id, name, emoji, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)')
      .eq('meal_template_id', id)
      .order('sort_order');

    // Parse instructions
    let instructions: string[] = [];
    if (template.instructions) {
      try {
        instructions = typeof template.instructions === 'string'
          ? JSON.parse(template.instructions)
          : template.instructions;
      } catch {
        instructions = [];
      }
    }

    // Calculate total macros and build items list
    const totalMacros = { cal: 0, protein: 0, carbs: 0, fat: 0 };
    const foodItems = (items || []).map(item => {
      const food = item.foods as unknown as {
        id: string;
        name: string;
        emoji: string;
        cal_per_100g: number;
        protein_per_100g: number;
        carbs_per_100g: number;
        fat_per_100g: number;
      };

      const grams = item.default_grams;
      const macros = food
        ? {
            cal: (grams * food.cal_per_100g) / 100,
            protein: (grams * food.protein_per_100g) / 100,
            carbs: (grams * food.carbs_per_100g) / 100,
            fat: (grams * food.fat_per_100g) / 100,
          }
        : { cal: 0, protein: 0, carbs: 0, fat: 0 };

      totalMacros.cal += macros.cal;
      totalMacros.protein += macros.protein;
      totalMacros.carbs += macros.carbs;
      totalMacros.fat += macros.fat;

      return {
        id: item.id,
        food_id: food?.id,
        name: food?.name || '',
        emoji: food?.emoji || '',
        grams,
        macros,
        is_optional: item.is_optional ?? false,
      };
    });

    // Check if favorited
    const { data: fav } = await supabase
      .from('favorite_meals')
      .select('id')
      .eq('meal_template_id', id)
      .single();

    return NextResponse.json({
      id: template.id,
      name: template.name,
      meal_type: template.meal_type,
      instructions,
      items: foodItems,
      macros: totalMacros,
      favorite: !!fav,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal' },
      { status: 500 }
    );
  }
}
