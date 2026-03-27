'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { calculateMacros } from '@/lib/macros';

interface Food {
  id: string;
  name: string;
  category: string;
  emoji: string;
  onboarding_default: boolean;
}

const GOALS = [
  { id: 'lose_fat', label: 'Lose Fat', emoji: '🔥', desc: 'Cut calories, keep protein high' },
  { id: 'build_muscle', label: 'Build Muscle', emoji: '💪', desc: 'Caloric surplus for growth' },
  { id: 'recomp', label: 'Body Recomp', emoji: '⚡', desc: 'Lose fat & build muscle' },
  { id: 'maintain', label: 'Maintain', emoji: '⚖️', desc: 'Keep current physique' },
];

const CATEGORY_TABS = [
  { id: 'protein', label: 'Proteins' },
  { id: 'carb', label: 'Carbs' },
  { id: 'veggie', label: 'Veggies' },
  { id: 'extras', label: 'Extras' },
];

// "Extras" maps to multiple categories in the DB
const EXTRAS_CATEGORIES = ['fruit', 'fat', 'sauce', 'snack'];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [goal, setGoal] = useState('recomp');
  const [sex, setSex] = useState('male');
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [weight, setWeight] = useState(180);
  const [age, setAge] = useState(30);
  const [trainingDays, setTrainingDays] = useState(4);

  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('protein');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(p => {
      if (p.setup_completed) router.replace('/');
    });
  }, [router]);

  const loadFoods = useCallback(async () => {
    const res = await fetch('/api/foods?onboarding=1');
    const data: Food[] = await res.json();
    setFoods(data);
    const defaults = new Set(data.filter(f => f.onboarding_default).map(f => f.id));
    setSelectedFoods(defaults);
  }, []);

  useEffect(() => {
    if (step === 2 && foods.length === 0) loadFoods();
  }, [step, foods.length, loadFoods]);

  const handleStep1Submit = async () => {
    setLoading(true);
    const height_inches = heightFt * 12 + heightIn;
    const macros = calculateMacros({ height_inches, weight_lbs: weight, age, sex, training_days: trainingDays, goal });

    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ height_inches, weight_lbs: weight, age, sex, training_days: trainingDays, goal, ...macros }),
    });

    setStep(2);
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    await fetch('/api/food-bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_ids: Array.from(selectedFoods) }),
    });
    await fetch('/api/meal-plan/generate', { method: 'POST' });
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setup_completed: true }),
    });
    router.replace('/');
  };

  const toggleFood = (id: string) => {
    setSelectedFoods(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const categoryFoods = foods.filter(f =>
    activeCategory === 'extras'
      ? EXTRAS_CATEGORIES.includes(f.category)
      : f.category === activeCategory
  );
  const selectedCount = categoryFoods.filter(f => selectedFoods.has(f.id)).length;

  if (step === 1) {
    return (
      <div className="flex-1 px-4 py-6 pb-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Welcome to Forkcast</h1>
          <p className="text-text-secondary mt-1">Let&apos;s set up your nutrition targets</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-text-primary mb-2">Your Goal</label>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${goal === g.id ? 'border-teal-primary bg-teal-bg' : 'border-gray-100 bg-white'}`}>
                <div className="text-2xl mb-1">{g.emoji}</div>
                <div className="font-semibold text-sm">{g.label}</div>
                <div className="text-xs text-text-muted">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text-primary mb-2">Sex</label>
          <div className="flex gap-2">
            {['male', 'female'].map(s => (
              <button key={s} onClick={() => setSex(s)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${sex === s ? 'bg-teal-primary text-white' : 'bg-gray-100 text-text-secondary'}`}>
                {s === 'male' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text-primary mb-2">Height</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="number" value={heightFt} onChange={e => setHeightFt(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-center font-semibold" min={4} max={7} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">ft</span>
            </div>
            <div className="flex-1 relative">
              <input type="number" value={heightIn} onChange={e => setHeightIn(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-center font-semibold" min={0} max={11} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">in</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text-primary mb-2">Weight (lbs)</label>
          <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-center font-semibold" min={80} max={400} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text-primary mb-2">Age</label>
          <input type="number" value={age} onChange={e => setAge(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-center font-semibold" min={16} max={80} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-text-primary mb-2">Training Days per Week</label>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(d => (
              <button key={d} onClick={() => setTrainingDays(d)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${trainingDays === d ? 'bg-teal-primary text-white' : 'bg-gray-100 text-text-secondary'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleStep1Submit} disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-primary to-teal-light text-white font-bold text-base disabled:opacity-50 active:scale-[0.98] transition-all">
          {loading ? 'Calculating...' : 'Next →'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold text-text-primary">Your Food Bank</h1>
        <p className="text-text-secondary text-sm mt-1">Select foods you buy and eat</p>
      </div>

      <div className="flex gap-1 px-4 mb-3">
        {CATEGORY_TABS.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeCategory === cat.id ? 'bg-teal-primary text-white' : 'bg-gray-100 text-text-secondary'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {activeCategory === 'protein' && (
        <div className="mx-4 mb-3 p-3 bg-teal-bg rounded-xl border border-teal-primary/10">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-teal-primary">Quick-start your food bank.</span> We pre-selected common foods — just remove what you don&apos;t eat. You can add tons more foods anytime, including scanning nutrition labels.
          </p>
        </div>
      )}

      <div className="px-4 mb-2">
        <span className="text-xs text-text-muted">{selectedCount} of {categoryFoods.length} selected</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {categoryFoods.map(food => (
            <button key={food.id} onClick={() => toggleFood(food.id)}
              className={`p-3 rounded-2xl border-2 text-center transition-all min-h-[80px] flex flex-col items-center justify-center ${
                selectedFoods.has(food.id) ? 'border-teal-primary bg-teal-bg' : 'border-gray-100 bg-white opacity-60'
              }`}>
              <span className="text-2xl">{food.emoji}</span>
              <span className="text-xs font-medium mt-1 leading-tight">{food.name}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-text-muted mt-4 mb-2">
          Don&apos;t see something? You can add any food later by scanning its label.
        </p>
      </div>

      <div className="px-4 py-4 border-t border-gray-100 bg-white">
        <button onClick={handleComplete} disabled={loading || selectedFoods.size === 0}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-primary to-teal-light text-white font-bold text-base disabled:opacity-50 active:scale-[0.98] transition-all">
          {loading ? 'Building your plan...' : `Done — ${selectedFoods.size} foods selected`}
        </button>
      </div>
    </div>
  );
}
