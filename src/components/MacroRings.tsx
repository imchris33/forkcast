'use client';

interface Macros {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroRingsProps {
  eaten: Macros;
  targets: Macros;
}

const rings: { key: keyof Macros; label: string; color: string; unit: string }[] = [
  { key: 'cal', label: 'Cal', color: '#0d9488', unit: '' },
  { key: 'protein', label: 'Protein', color: '#0d9488', unit: 'g' },
  { key: 'carbs', label: 'Carbs', color: '#f59e0b', unit: 'g' },
  { key: 'fat', label: 'Fat', color: '#ec4899', unit: 'g' },
];

function Ring({
  value,
  target,
  color,
  label,
  unit,
}: {
  value: number;
  target: number;
  color: string;
  label: string;
  unit: string;
}) {
  const size = 64;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color, marginTop: size / 2 - 8 }}
      >
        {Math.round(value)}
        {unit}
      </span>
      <div className="text-center">
        <div className="text-[10px] text-text-secondary font-medium">{label}</div>
        <div className="text-[10px] text-text-muted">
          / {Math.round(target)}
          {unit}
        </div>
      </div>
    </div>
  );
}

export default function MacroRings({ eaten, targets }: MacroRingsProps) {
  return (
    <div className="flex justify-around items-start py-4">
      {rings.map((r) => (
        <div key={r.key} className="relative flex flex-col items-center">
          <Ring
            value={eaten[r.key]}
            target={targets[r.key]}
            color={r.color}
            label={r.label}
            unit={r.unit}
          />
        </div>
      ))}
    </div>
  );
}
