import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { templateId } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    const supabase = getServerSupabase();

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorite_meals')
      .select('id')
      .eq('meal_template_id', templateId)
      .single();

    if (existing) {
      // Remove favorite
      await supabase
        .from('favorite_meals')
        .delete()
        .eq('meal_template_id', templateId);

      return NextResponse.json({ favorite: false });
    } else {
      // Add favorite
      await supabase
        .from('favorite_meals')
        .insert({ meal_template_id: templateId });

      return NextResponse.json({ favorite: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Toggle favorite failed' },
      { status: 500 }
    );
  }
}
