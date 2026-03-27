'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';

interface Food {
  id: string;
  name: string;
  emoji: string;
  category: string;
  favorite: boolean;
  macros: { cal: number; protein: number; carbs: number; fat: number };
}

const categoryMap: Record<string, string> = {
  protein: 'Protein',
  carb: 'Carbs',
  veggie: 'Veggies',
  fruit: 'Extras',
  fat: 'Extras',
  sauce: 'Extras',
  snack: 'Extras',
};

const categoryOrder = ['Protein', 'Carbs', 'Veggies', 'Extras'];

export default function BankPage() {
  const router = useRouter();
  const [bankFoods, setBankFoods] = useState<Food[]>([]);
  const [exploreFoods, setExploreFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [bRes, eRes] = await Promise.all([
        fetch('/api/food-bank'),
        fetch('/api/foods?in_bank=0'),
      ]);
      const bank = await bRes.json();
      const explore = await eRes.json();
      setBankFoods(Array.isArray(bank) ? bank : bank.foods ?? []);
      setExploreFoods(Array.isArray(explore) ? explore : explore.foods ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleFavorite = async (foodId: string) => {
    await fetch('/api/food-bank', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_id: foodId, toggle: 'favorite' }),
    });
    loadData();
  };

  const removeFood = async (foodId: string) => {
    await fetch('/api/food-bank', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_id: foodId }),
    });
    loadData();
  };

  const addFood = async (foodId: string) => {
    await fetch('/api/food-bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_id: foodId }),
    });
    loadData();
  };

  const toggleCollapse = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredBank = bankFoods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredExplore = exploreFoods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filteredBank.reduce<Record<string, Food[]>>((acc, food) => {
    const cat = categoryMap[food.category] ?? 'Extras';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(food);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-page-bg">
      <div className="flex-1 px-4 pt-6 pb-24 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Food Bank</h1>
          <button
            onClick={() => router.push('/bank/add')}
            className="text-sm font-semibold text-white bg-teal-primary px-3 py-1.5 rounded-lg"
          >
            + Add Food
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
          />
        </div>

        {/* Stats */}
        <p className="text-xs text-text-secondary">
          {bankFoods.length} foods &middot;{' '}
          {bankFoods.filter((f) => f.favorite).length} favorites
        </p>

        {/* Bank foods by category */}
        <div className="space-y-4">
          {categoryOrder
            .filter((cat) => grouped[cat]?.length)
            .map((cat) => (
              <div key={cat}>
                <button
                  onClick={() => toggleCollapse(cat)}
                  className="flex items-center gap-2 w-full mb-2"
                >
                  <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    {cat}
                  </h2>
                  <span className="text-[10px] text-text-muted bg-gray-100 rounded-full px-1.5">
                    {grouped[cat].length}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`w-4 h-4 text-text-muted transition-transform ml-auto ${
                      collapsed[cat] ? '' : 'rotate-180'
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {!collapsed[cat] && (
                  <div className="space-y-1.5">
                    {grouped[cat].map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm"
                      >
                        <span className="text-lg">{food.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary truncate">
                            {food.name}
                          </div>
                          <div className="text-[10px] text-text-muted">
                            {food.macros.cal} cal &middot; {food.macros.protein}g P
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(food.id)}
                          className="flex-shrink-0"
                        >
                          {food.favorite ? (
                            <svg viewBox="0 0 24 24" fill="#ef4444" className="w-5 h-5">
                              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => removeFood(food.id)}
                          className="flex-shrink-0 text-text-muted hover:text-error"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Explore section */}
        {filteredExplore.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-text-primary mb-3">
              Explore More Foods
            </h2>
            <div className="space-y-1.5">
              {filteredExplore.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm"
                >
                  <span className="text-lg">{food.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {food.name}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {food.macros.cal} cal &middot; {food.macros.protein}g P
                    </div>
                  </div>
                  <button
                    onClick={() => addFood(food.id)}
                    className="flex-shrink-0 text-xs font-semibold text-teal-primary bg-teal-primary/10 px-2.5 py-1 rounded-lg"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Nav />
    </div>
  );
}
