'use client';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DaySelectorProps {
  activeDay: number;
  onChange: (day: number) => void;
}

export default function DaySelector({ activeDay, onChange }: DaySelectorProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto py-2 px-1 no-scrollbar">
      {days.map((name, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeDay === i
              ? 'bg-teal-primary text-white'
              : 'bg-white text-text-secondary hover:bg-gray-50'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
