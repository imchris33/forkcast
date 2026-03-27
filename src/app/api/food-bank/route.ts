import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getServerSupabase();
  const { data } = await supabase
    .from('food_bank')
    .select('*, foods(*)')
    .order('created_at');

  // Flatten: return food data with is_favorite
  const foods = (data || []).map(fb => ({
    ...fb.foods,
    is_favorite: fb.is_favorite,
    bank_id: fb.id,
  }));

  return NextResponse.json(foods);
}

export async function POST(request: Request) {
  const { food_ids } = await request.json();
  const supabase = getServerSupabase();

  // Clear existing and insert new
  await supabase.from('food_bank').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  if (food_ids.length > 0) {
    const rows = food_ids.map((food_id: string) => ({ food_id }));
    await supabase.from('food_bank').insert(rows);
  }

  return NextResponse.json({ success: true, count: food_ids.length });
}

export async function DELETE(request: Request) {
  const { food_id } = await request.json();
  const supabase = getServerSupabase();
  await supabase.from('food_bank').delete().eq('food_id', food_id);
  return NextResponse.json({ success: true });
}
