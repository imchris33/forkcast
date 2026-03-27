import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
  if (error) return NextResponse.json({ setup_completed: false });

  // Return shape the dashboard expects
  return NextResponse.json({
    ...data,
    targets: {
      cal: data.calorie_target || 0,
      protein: data.protein_target || 0,
      carbs: data.carb_target || 0,
      fat: data.fat_target || 0,
    },
    streak: data.current_streak || 0,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from('profile')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
