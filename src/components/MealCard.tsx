'use client';

import { useRouter } from 'next/navigation';

interface MealCardProps {
  dayId: number;
  mealType: 'lunch' | 'dinner' | 'dessert';
  templateId: string;
  name: string;
  macros: { cal: number; protein: number; carbs: number; fat: number };
  eaten: boolean;
  favorite: boolean;
  onToggleEaten: () => void;
  onToggleFavorite: () => void;
}

const gradients: Record<string, string> = {
  lunch: 'from-[#fffbeb] to-[#fef3c7]',
  dinner: 'from-[#f0fdfa] to-[#ccfbf1]',
  dessert: 'from-[#fdf2f8] to-[#fce7f3]',
};

const badgeColors: Record<string, string> = {
  lunch: 'bg-lunch-accent/10 text-lunch-accent',
  dinner: 'bg-dinner-accent/10 text-dinner-accent',
  dessert: 'bg-dessert-accent/10 text-dessert-accent',
};

const labels: Record<string, string> = {
  lunch: 'Lunch',
  dinner: 'Dinner',
  dessert: 'Dessert',
};

export default function MealCard({
  mealType,
  templateId,
  name,
  macros,
  eaten,
  favorite,
  onToggleEaten,
  onToggleFavorite,
}: MealCardProps) {
  const router = useRouter();

  return (
    <div
      className={`bg-gradient-to-r ${gradients[mealType]} rounded-2xl p-4 transition-all ${
        eaten ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => router.push(`/meal/${templateId}`)}
        >
          <span
            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${badgeColors[mealType]}`}
          >
            {labels[mealType]}
          </span>
          <h3 className="font-semibold text-text-primary text-sm leading-snug truncate">
            {name}
          </h3>
          <div className="flex gap-2 mt-1 text-[11px] text-text-secondary">
            <span>{macros.cal} cal</span>
            <span>{macros.protein}g P</span>
            <span>{macros.carbs}g C</span>
            <span>{macros.fat}g F</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="text-lg"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? (
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
            onClick={(e) => {
              e.stopPropagation();
              onToggleEaten();
            }}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
              eaten
                ? 'bg-success border-success text-white'
                : 'border-gray-300 text-transparent hover:border-gray-400'
            }`}
            aria-label={eaten ? 'Mark as not eaten' : 'Mark as eaten'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
