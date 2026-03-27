import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { food_id, is_favorite } = await request.json();

    if (!food_id || typeof is_favorite !== 'boolean') {
      return NextResponse.json({ error: 'food_id and is_favorite (boolean) are required' }, { status: 400 });
    }

    const supabase = getServerSupabase();

    const { error } = await supabase
      .from('food_bank')
      .update({ is_favorite })
      .eq('food_id', food_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, food_id, is_favorite });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update favorite' },
      { status: 500 }
    );
  }
}
