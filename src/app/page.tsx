'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import MacroRings from '@/components/MacroRings';
import DaySelector from '@/components/DaySelector';
import MealCard from '@/components/MealCard';

interface Macros {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  template_id: string;
  name: string;
  macros: Macros;
  eaten: boolean;
  favorite: boolean;
}

interface DayPlan {
  id: number;
  day: number;
  lunch: Meal;
  dinner: Meal;
  dessert: Meal;
}

interface Profile {
  setup_completed: boolean;
  targets: Macros;
  streak: number;
}

function getTodayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // Mon=0 ... Sun=6
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [activeDay, setActiveDay] = useState(getTodayIndex());
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/meal-plan'),
      ]);
      const p = await pRes.json();
      if (!p.setup_completed) {
        router.replace('/setup');
        return;
      }
      setProfile(p);
      const m = await mRes.json();
      setPlan(Array.isArray(m) ? m : m.days ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted">
        Loading...
      </div>
    );
  }

  const day = plan[activeDay];
  const meals: { type: 'lunch' | 'dinner' | 'dessert'; meal: Meal | undefined }[] = day
    ? [
        { type: 'lunch', meal: day.lunch },
        { type: 'dinner', meal: day.dinner },
        { type: 'dessert', meal: day.dessert },
      ]
    : [];

  const eaten: Macros = { cal: 0, protein: 0, carbs: 0, fat: 0 };
  meals.forEach(({ meal }) => {
    if (meal?.eaten) {
      eaten.cal += meal.macros.cal;
      eaten.protein += meal.macros.protein;
      eaten.carbs += meal.macros.carbs;
      eaten.fat += meal.macros.fat;
    }
  });

  const allEaten = meals.length > 0 && meals.every(({ meal }) => meal?.eaten);

  const toggleEaten = async (mealType: string) => {
    if (!day) return;
    await fetch('/api/meal-plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_id: day.id, meal_type: mealType, toggle: 'eaten' }),
    });
    loadData();
  };

  const toggleFavorite = async (mealType: string) => {
    if (!day) return;
    const meal = day[mealType as keyof DayPlan] as Meal;
    await fetch('/api/meal-plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: meal.template_id,
        toggle: 'favorite',
      }),
    });
    loadData();
  };

  return (
    <div className="flex flex-col min-h-screen bg-page-bg">
      <div className="flex-1 px-4 pt-6 pb-24 space-y-4">
        <h1 className="text-xl font-bold text-text-primary">Today</h1>

        <DaySelector activeDay={activeDay} onChange={setActiveDay} />

        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <MacroRings eaten={eaten} targets={profile.targets} />
        </div>

        {allEaten && (
          <div className="text-center py-3">
            <span className="inline-flex items-center gap-1.5 text-success font-semibold text-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Perfect day!
            </span>
          </div>
        )}

        <div className="space-y-3">
          {meals.map(
            ({ type, meal }) =>
              meal && (
                <MealCard
                  key={type}
                  dayId={day.id}
                  mealType={type}
                  templateId={meal.template_id}
                  name={meal.name}
                  macros={meal.macros}
                  eaten={meal.eaten}
                  favorite={meal.favorite}
                  onToggleEaten={() => toggleEaten(type)}
                  onToggleFavorite={() => toggleFavorite(type)}
                />
              ),
          )}
        </div>

        {profile.streak > 0 && (
          <div className="flex items-center justify-center gap-2 py-2">
            <span className="text-2xl">&#128293;</span>
            <span className="text-sm font-semibold text-text-secondary">
              {profile.streak} day streak
            </span>
          </div>
        )}
      </div>
      <Nav />
    </div>
  );
}
