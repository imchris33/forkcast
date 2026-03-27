'use client';

import { useEffect, useState, useCallback } from 'react';
import Nav from '@/components/Nav';

interface GroceryItem {
  id: string;
  emoji: string;
  name: string;
  grams: number;
  section: string;
  checked: boolean;
}

interface GroceryData {
  items: GroceryItem[];
}

const sectionLabels: Record<string, string> = {
  meat_seafood: 'Meat & Seafood',
  produce: 'Produce',
  dairy_eggs: 'Dairy & Eggs',
  pantry: 'Pantry',
  canned: 'Canned Goods',
  sauces: 'Sauces & Condiments',
  frozen: 'Frozen',
  bakery: 'Bakery',
  supplements: 'Supplements',
  snacks: 'Snacks',
  other: 'Other',
};

const sectionOrder = Object.keys(sectionLabels);

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/grocery');
      const data: GroceryData = await res.json();
      setItems(data.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleItem = async (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
    );
    await fetch('/api/grocery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, toggle: 'checked' }),
    });
  };

  const copyList = () => {
    const lines = items
      .filter((it) => !it.checked)
      .map(
        (it) =>
          `${it.emoji} ${it.name} - ${Math.round(it.grams * multiplier)}g`,
      );
    navigator.clipboard.writeText(lines.join('\n'));
  };

  const grouped = items.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    const key = item.section || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const checkedCount = items.filter((it) => it.checked).length;
  const progressPct = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

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
          <h1 className="text-xl font-bold text-text-primary">Grocery List</h1>
          <button
            onClick={copyList}
            className="text-sm font-semibold text-teal-primary bg-teal-primary/10 px-3 py-1.5 rounded-lg"
          >
            Copy
          </button>
        </div>

        {/* Multiplier pills */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setMultiplier(n)}
              className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                multiplier === n
                  ? 'bg-teal-primary text-white'
                  : 'bg-white text-text-secondary border border-gray-200'
              }`}
            >
              {n}x
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>
              {checkedCount} of {items.length} items
            </span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-full bg-teal-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Grouped items */}
        <div className="space-y-5">
          {sectionOrder
            .filter((s) => grouped[s]?.length)
            .map((section) => (
              <div key={section}>
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  {sectionLabels[section]}
                </h2>
                <div className="space-y-1.5">
                  {grouped[section].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm text-left transition-opacity ${
                        item.checked ? 'opacity-40' : ''
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                          item.checked
                            ? 'bg-teal-primary border-teal-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.checked && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="text-base">{item.emoji}</span>
                      <span
                        className={`flex-1 text-sm font-medium ${
                          item.checked
                            ? 'line-through text-text-muted'
                            : 'text-text-primary'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        {Math.round(item.grams * multiplier)}g
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <Nav />
    </div>
  );
}
