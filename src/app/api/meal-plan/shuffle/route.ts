import { NextResponse } from 'next/server';
import { shuffleMeal } from '@/lib/generate';

export async function POST(request: Request) {
  try {
    const { dayId, mealType } = await request.json();

    if (!dayId || !mealType) {
      return NextResponse.json({ error: 'dayId and mealType are required' }, { status: 400 });
    }

    if (!['lunch', 'dinner', 'dessert'].includes(mealType)) {
      return NextResponse.json({ error: 'mealType must be lunch, dinner, or dessert' }, { status: 400 });
    }

    await shuffleMeal(dayId, mealType);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Shuffle failed' },
      { status: 500 }
    );
  }
}
