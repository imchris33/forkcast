import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  name: string;
  cal_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  source: 'usda' | 'off';
  brand?: string;
  barcode?: string;
}

async function searchUSDA(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${apiKey}&pageSize=10`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const foods = data.foods || [];

    return foods.map((food: Record<string, unknown>) => {
      const nutrients = (food.foodNutrients || []) as { nutrientId: number; value: number }[];

      const getNutrient = (id: number): number => {
        const n = nutrients.find(n => n.nutrientId === id);
        return n?.value || 0;
      };

      return {
        name: food.description as string || '',
        cal_per_100g: Math.round(getNutrient(1008)),
        protein_per_100g: Math.round(getNutrient(1003) * 10) / 10,
        carbs_per_100g: Math.round(getNutrient(1005) * 10) / 10,
        fat_per_100g: Math.round(getNutrient(1004) * 10) / 10,
        source: 'usda' as const,
        brand: (food.brandOwner as string) || undefined,
      };
    });
  } catch {
    return [];
  }
}

async function searchOpenFoodFacts(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=10`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const products = data.products || [];

    return products
      .filter((p: Record<string, unknown>) => p.product_name)
      .map((p: Record<string, unknown>) => {
        const nutriments = (p.nutriments || {}) as Record<string, number>;
        return {
          name: p.product_name as string,
          cal_per_100g: Math.round(nutriments['energy-kcal_100g'] || 0),
          protein_per_100g: Math.round((nutriments['proteins_100g'] || 0) * 10) / 10,
          carbs_per_100g: Math.round((nutriments['carbohydrates_100g'] || 0) * 10) / 10,
          fat_per_100g: Math.round((nutriments['fat_100g'] || 0) * 10) / 10,
          source: 'off' as const,
          brand: (p.brands as string) || undefined,
          barcode: (p.code as string) || undefined,
        };
      });
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  const [usdaResults, offResults] = await Promise.all([
    searchUSDA(q),
    searchOpenFoodFacts(q),
  ]);

  const results = [...usdaResults, ...offResults];

  return NextResponse.json({ results });
}
