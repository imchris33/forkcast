import { NextResponse } from 'next/server';
import { generateMealPlan } from '@/lib/generate';

export async function POST() {
  try {
    const planId = await generateMealPlan();
    return NextResponse.json({ success: true, planId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Regeneration failed' },
      { status: 400 }
    );
  }
}
