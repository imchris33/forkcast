'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'snap' | 'search' | 'barcode' | 'manual';

interface FoodResult {
  name: string;
  category: string;
  store_section: string;
  macros_per_100g: { cal: number; protein: number; carbs: number; fat: number };
  serving_size: number;
}

const categories = [
  { value: 'protein', label: 'Protein' },
  { value: 'carb', label: 'Carb' },
  { value: 'veggie', label: 'Veggie' },
  { value: 'fruit', label: 'Fruit' },
  { value: 'fat', label: 'Fat' },
  { value: 'sauce', label: 'Sauce' },
  { value: 'snack', label: 'Snack' },
];

const storeSections = [
  { value: 'meat_seafood', label: 'Meat & Seafood' },
  { value: 'produce', label: 'Produce' },
  { value: 'dairy_eggs', label: 'Dairy & Eggs' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'canned', label: 'Canned Goods' },
  { value: 'sauces', label: 'Sauces' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'other', label: 'Other' },
];

const modes: { key: Mode; label: string; icon: string }[] = [
  { key: 'snap', label: 'Snap Label', icon: '&#128247;' },
  { key: 'search', label: 'Search', icon: '&#128269;' },
  { key: 'barcode', label: 'Barcode', icon: '&#9783;' },
  { key: 'manual', label: 'Manual', icon: '&#9998;' },
];

export default function AddFoodPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodResult[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Confirmation form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FoodResult>({
    name: '',
    category: 'protein',
    store_section: 'meat_seafood',
    macros_per_100g: { cal: 0, protein: 0, carbs: 0, fat: 0 },
    serving_size: 100,
  });

  const prefillForm = (data: FoodResult) => {
    setForm(data);
    setShowForm(true);
  };

  // Snap label
  const handleSnap = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/foods/scan-label', { method: 'POST', body: fd });
      const data = await res.json();
      prefillForm(data);
    } catch {
      // ignore
    }
  };

  // Search with debounce
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/foods/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (mode !== 'search') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(searchQuery), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, mode, doSearch]);

  // Barcode lookup
  const handleBarcode = async () => {
    if (!barcodeInput.trim()) return;
    try {
      const res = await fetch(`/api/foods/barcode?code=${encodeURIComponent(barcodeInput)}`);
      const data = await res.json();
      prefillForm(data);
    } catch {
      // ignore
    }
  };

  // Submit
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      router.push('/bank');
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const updateMacro = (key: keyof FoodResult['macros_per_100g'], val: string) => {
    setForm((f) => ({
      ...f,
      macros_per_100g: { ...f.macros_per_100g, [key]: Number(val) || 0 },
    }));
  };

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="px-4 pt-6 pb-8 space-y-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-text-secondary text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <h1 className="text-xl font-bold text-text-primary">Add Food</h1>

        {/* Mode selector */}
        <div className="grid grid-cols-4 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                setMode(m.key);
                setShowForm(false);
              }}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-colors ${
                mode === m.key
                  ? 'bg-teal-primary text-white'
                  : 'bg-white text-text-secondary border border-gray-200'
              }`}
            >
              <span
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: m.icon }}
              />
              {m.label}
            </button>
          ))}
        </div>

        {/* Snap mode */}
        {mode === 'snap' && !showForm && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSnap}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-12 border-2 border-dashed border-gray-300 rounded-2xl text-text-secondary text-sm font-medium hover:border-teal-primary hover:text-teal-primary transition-colors"
            >
              Tap to snap a nutrition label
            </button>
          </div>
        )}

        {/* Search mode */}
        {mode === 'search' && !showForm && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
            />
            <div className="space-y-1.5">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => prefillForm(r)}
                  className="w-full text-left flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {r.macros_per_100g.cal} cal/100g &middot;{' '}
                      {r.macros_per_100g.protein}g P
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barcode mode */}
        {mode === 'barcode' && !showForm && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter barcode number..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
            />
            <button
              onClick={handleBarcode}
              className="w-full py-3 rounded-xl bg-teal-primary text-white font-semibold text-sm"
            >
              Look Up
            </button>
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl bg-teal-primary text-white font-semibold text-sm"
          >
            Enter Details
          </button>
        )}

        {/* Confirmation form */}
        {showForm && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Store Section
                  </label>
                  <select
                    value={form.store_section}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, store_section: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
                  >
                    {storeSections.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-2">
                  Macros per 100g
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { key: 'cal', label: 'Cal' },
                      { key: 'protein', label: 'Protein' },
                      { key: 'carbs', label: 'Carbs' },
                      { key: 'fat', label: 'Fat' },
                    ] as const
                  ).map((m) => (
                    <div key={m.key}>
                      <div className="text-[10px] text-text-muted text-center mb-1">
                        {m.label}
                      </div>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={form.macros_per_100g[m.key] || ''}
                        onChange={(e) => updateMacro(m.key, e.target.value)}
                        className="w-full px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Serving Size (g)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={form.serving_size || ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      serving_size: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/30"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name}
              className="w-full py-3.5 rounded-xl bg-teal-primary text-white font-semibold text-sm disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add to Food Bank'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
