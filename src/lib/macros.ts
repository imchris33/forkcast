export const MEAL_SPLITS = {
  big_dinner: { lunch: 0.35, dinner: 0.50, dessert: 0.15 },
} as const;

export function calculateMacros(input: {
  height_inches: number;
  weight_lbs: number;
  age: number;
  sex: string;
  training_days: number;
  goal: string;
}) {
  const weight_kg = input.weight_lbs * 0.453592;
  const height_cm = input.height_inches * 2.54;

  let bmr: number;
  if (input.sex === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * input.age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * input.age - 161;
  }

  let multiplier: number;
  if (input.training_days <= 1) multiplier = 1.2;
  else if (input.training_days <= 3) multiplier = 1.375;
  else if (input.training_days <= 5) multiplier = 1.55;
  else multiplier = 1.725;

  const tdee = bmr * multiplier;

  let calories: number, protein_per_lb: number, fat_per_lb: number;
  switch (input.goal) {
    case 'lose_fat': calories = tdee - 500; protein_per_lb = 1; fat_per_lb = 0.3; break;
    case 'build_muscle': calories = tdee + 300; protein_per_lb = 0.8; fat_per_lb = 0.35; break;
    case 'recomp': calories = tdee - 400; protein_per_lb = 1; fat_per_lb = 0.3; break;
    default: calories = tdee; protein_per_lb = 0.8; fat_per_lb = 0.35;
  }

  const protein = Math.round(protein_per_lb * input.weight_lbs);
  const fat = Math.round(fat_per_lb * input.weight_lbs);
  const carbs = Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), 0);

  return {
    calorie_target: Math.round(calories),
    protein_target: protein,
    carb_target: carbs,
    fat_target: fat,
  };
}
