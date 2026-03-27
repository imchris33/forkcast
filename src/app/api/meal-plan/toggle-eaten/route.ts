import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { dayId, mealType } = await request.json();

    if (!dayId || !mealType) {
      return NextResponse.json({ error: 'dayId and mealType are required' }, { status: 400 });
    }

    if (!['lunch', 'dinner', 'dessert'].includes(mealType)) {
      return NextResponse.json({ error: 'mealType must be lunch, dinner, or dessert' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const eatenCol = `${mealType}_eaten` as const;

    // Get current state
    const { data: day } = await supabase
      .from('meal_plan_days')
      .select('*')
      .eq('id', dayId)
      .single();

    if (!day) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const newValue = !day[eatenCol];

    // Toggle the eaten value
    await supabase
      .from('meal_plan_days')
      .update({ [eatenCol]: newValue })
      .eq('id', dayId);

    // Check streak logic: are all 3 meals now eaten?
    const updatedDay = { ...day, [eatenCol]: newValue };
    const allEaten = updatedDay.lunch_eaten && updatedDay.dinner_eaten && updatedDay.dessert_eaten;

    if (allEaten) {
      const { data: profile } = await supabase
        .from('profile')
        .select('streak, longest_streak, last_completed_date')
        .eq('id', 1)
        .single();

      if (profile) {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = profile.last_completed_date;

        let newStreak = profile.streak || 0;

        if (lastDate === today) {
          // Already counted today, no change
        } else if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate === yesterdayStr) {
            newStreak = (profile.streak || 0) + 1;
          } else {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        const longestStreak = Math.max(newStreak, profile.longest_streak || 0);

        await supabase
          .from('profile')
          .update({
            streak: newStreak,
            longest_streak: longestStreak,
            last_completed_date: today,
          })
          .eq('id', 1);
      }
    }

    return NextResponse.json({ success: true, eaten: newValue });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Toggle failed' },
      { status: 500 }
    );
  }
}
