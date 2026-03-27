'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Ingredient {
  emoji: string;
  name: string;
  grams: number;
}

interface MealDetail {
  template_id: string;
  meal_type: 'lunch' | 'dinner' | 'dessert';
  name: string;
  macros: { cal: number; protein: number; carbs: number; fat: number };
  prep_time: number;
  cook_time: number;
  ingredients: Ingredient[];
  steps: string[];
}

const badgeColors: Record<string, string> = {
  lunch: 'bg-lunch-accent/10 text-lunch-accent',
  dinner: 'bg-dinner-accent/10 text-dinner-accent',
  dessert: 'bg-dessert-accent/10 text-dessert-accent',
};

export default function MealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [kitchenMode, setKitchenMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    fetch(`/api/meal-plan/${id}`)
      .then((r) => r.json())
      .then((data) => setMeal(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const enterKitchenMode = useCallback(async () => {
    setKitchenMode(true);
    setCurrentStep(0);
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
      }
    } catch {
      // Wake Lock not supported or denied
    }
  }, []);

  const exitKitchenMode = useCallback(async () => {
    setKitchenMode(false);
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted min-h-screen">
        Loading...
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted min-h-screen">
        Meal not found
      </div>
    );
  }

  if (kitchenMode) {
    const step = meal.steps[currentStep];
    const progress = ((currentStep + 1) / meal.steps.length) * 100;

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={exitKitchenMode}
            className="text-text-secondary text-sm font-medium"
          >
            Exit
          </button>
          <span className="text-sm font-semibold text-text-primary">
            Step {currentStep + 1} of {meal.steps.length}
          </span>
          <div className="w-10" />
        </div>

        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="h-full bg-teal-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <p className="text-xl leading-relaxed text-text-primary text-center font-medium">
            {step}
          </p>
        </div>

        <div className="flex gap-3 p-6">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-text-secondary disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (currentStep < meal.steps.length - 1) {
                setCurrentStep((s) => s + 1);
              } else {
                exitKitchenMode();
              }
            }}
            className="flex-1 py-3 rounded-xl bg-teal-primary text-white font-semibold"
          >
            {currentStep < meal.steps.length - 1 ? 'Next Step' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg pb-8">
      <div className="px-4 pt-6 space-y-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-text-secondary text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <div>
          <span
            className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
              badgeColors[meal.meal_type]
            }`}
          >
            {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
          </span>
          <h1 className="text-2xl font-bold text-text-primary">{meal.name}</h1>
        </div>

        {/* Macro summary */}
        <div className="flex gap-3">
          {[
            { label: 'Cal', value: meal.macros.cal, unit: '' },
            { label: 'Protein', value: meal.macros.protein, unit: 'g' },
            { label: 'Carbs', value: meal.macros.carbs, unit: 'g' },
            { label: 'Fat', value: meal.macros.fat, unit: 'g' },
          ].map((m) => (
            <div
              key={m.label}
              className="flex-1 bg-white rounded-xl p-2.5 text-center shadow-sm"
            >
              <div className="text-lg font-bold text-text-primary">
                {m.value}
                <span className="text-xs font-normal text-text-muted">{m.unit}</span>
              </div>
              <div className="text-[10px] text-text-secondary">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Times */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-sm font-semibold text-text-primary">
              {meal.prep_time} min
            </div>
            <div className="text-[10px] text-text-secondary">Prep</div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-sm font-semibold text-text-primary">
              {meal.cook_time} min
            </div>
            <div className="text-[10px] text-text-secondary">Cook</div>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Ingredients</h2>
          <div className="space-y-2">
            {meal.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm"
              >
                <span className="text-lg">{ing.emoji}</span>
                <span className="flex-1 text-sm text-text-primary font-medium">
                  {ing.name}
                </span>
                <span className="text-xs font-semibold text-teal-primary bg-teal-primary/10 px-2 py-0.5 rounded-full">
                  {ing.grams}g
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Steps</h2>
          <div className="space-y-3">
            {meal.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kitchen Mode button */}
        <button
          onClick={enterKitchenMode}
          className="w-full py-3.5 rounded-xl bg-teal-primary text-white font-semibold text-sm shadow-sm"
        >
          Kitchen Mode
        </button>
      </div>
    </div>
  );
}
