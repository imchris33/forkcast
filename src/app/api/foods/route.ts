import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = getServerSupabase();
  const { searchParams } = new URL(request.url);
  const onboarding = searchParams.get('onboarding');
  const inBank = searchParams.get('in_bank');

  if (onboarding === '1') {
    const { data } = await supabase
      .from('foods')
      .select('*')
      .eq('is_onboarding', true)
      .order('name');
    return NextResponse.json(data || []);
  }

  if (inBank === '0') {
    // Foods NOT in the food bank
    const { data: bankFoods } = await supabase.from('food_bank').select('food_id');
    const bankIds = (bankFoods || []).map(f => f.food_id);

    let query = supabase.from('foods').select('*').order('name');
    if (bankIds.length > 0) {
      query = query.not('id', 'in', `(${bankIds.join(',')})`);
    }
    const { data } = await query;
    return NextResponse.json(data || []);
  }

  const { data } = await supabase.from('foods').select('*').order('name');
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getServerSupabase();

  const { data, error } = await supabase.from('foods').insert({
    name: body.name,
    category: body.category || 'snack',
    emoji: body.emoji || '🍽️',
    cal_per_100g: body.cal_per_100g,
    protein_per_100g: body.protein_per_100g,
    carbs_per_100g: body.carbs_per_100g,
    fat_per_100g: body.fat_per_100g,
    fiber_per_100g: body.fiber_per_100g || null,
    default_serving_g: body.default_serving_g || 100,
    store_section: body.store_section || 'other',
    source: body.source || 'manual',
    is_system: false,
    is_onboarding: false,
    onboarding_default: false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Also add to food bank
  await supabase.from('food_bank').insert({ food_id: data.id });

  return NextResponse.json(data);
}
