'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';

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
  targets: Macros;
  streak: number;
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getTodayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function WeeklyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const todayIdx = getTodayIndex();

  const loadData = useCallback(async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/meal-plan'),
      ]);
      setProfile(await pRes.json());
      const m = await mRes.json();
      setPlan(Array.isArray(m) ? m : m.days ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const regenerate = async () => {
    setLoading(true);
    await fetch('/api/meal-plan', { method: 'POST' });
    loadData();
  };

  const shuffleMeal = async (dayId: number, mealType: string) => {
    await fetch('/api/meal-plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_id: dayId, meal_type: mealType, action: 'shuffle' }),
    });
    loadData();
  };

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted min-h-screen">
        Loading...
      </div>
    );
  }

  // Stats
  const completedDays = plan.filter(
    (d) => d.lunch?.eaten && d.dinner?.eaten && d.dessert?.eaten,
  ).length;
  const totalCals = plan.reduce(
    (s, d) =>
      s +
      (d.lunch?.macros.cal ?? 0) +
      (d.dinner?.macros.cal ?? 0) +
      (d.dessert?.macros.cal ?? 0),
    0,
  );
  const totalProtein = plan.reduce(
    (s, d) =>
      s +
      (d.lunch?.macros.protein ?? 0) +
      (d.dinner?.macros.protein ?? 0) +
      (d.dessert?.macros.protein ?? 0),
    0,
  );
  const daysWithData = plan.length || 1;

  return (
    <div className="flex flex-col min-h-screen bg-page-bg">
      <div className="flex-1 px-4 pt-6 pb-24 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Weekly Plan</h1>
          <button
            onClick={regenerate}
            className="text-sm font-semibold text-teal-primary bg-teal-primary/10 px-3 py-1.5 rounded-lg"
          >
            Regenerate
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Days', value: completedDays },
            { label: 'Streak', value: profile.streak },
            { label: 'Avg Cal', value: Math.round(totalCals / daysWithData) },
            { label: 'Avg Protein', value: `${Math.round(totalProtein / daysWithData)}g` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-2.5 text-center shadow-sm">
              <div className="text-base font-bold text-text-primary">{s.value}</div>
              <div className="text-[10px] text-text-secondary">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Day cards */}
        <div className="space-y-3">
          {plan.map((day, i) => {
            const isToday = i === todayIdx;
            const totalCal =
              (day.lunch?.macros.cal ?? 0) +
              (day.dinner?.macros.cal ?? 0) +
              (day.dessert?.macros.cal ?? 0);

            return (
              <div
                key={i}
                onClick={() => router.push(`/?day=${i}`)}
                className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer transition-all ${
                  isToday ? 'ring-2 ring-teal-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-text-primary">
                      {dayNames[i]}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-semibold text-teal-primary bg-teal-primary/10 px-1.5 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-muted">{totalCal} cal</span>
                </div>

                <div className="space-y-1.5">
                  {(['lunch', 'dinner', 'dessert'] as const).map((type) => {
                    const meal = day[type] as Meal | undefined;
                    if (!meal) return null;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-semibold text-text-muted uppercase w-10 flex-shrink-0">
                            {type.slice(0, 3)}
                          </span>
                          <span className="text-sm text-text-secondary truncate">
                            {meal.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shuffleMeal(day.id, type);
                          }}
                          className="text-text-muted hover:text-teal-primary text-sm ml-2 flex-shrink-0"
                          aria-label={`Shuffle ${type}`}
                        >
                          &#10227;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Nav />
    </div>
  );
}
