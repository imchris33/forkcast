import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code || code.trim().length === 0) {
    return NextResponse.json({ error: 'code parameter is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`);

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Open Food Facts' }, { status: 502 });
    }

    const data = await res.json();

    if (data.status !== 1 || !data.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    return NextResponse.json({
      name: product.product_name || 'Unknown',
      brand: product.brands || undefined,
      barcode: code,
      cal_per_100g: Math.round(nutriments['energy-kcal_100g'] || 0),
      protein_per_100g: Math.round((nutriments['proteins_100g'] || 0) * 10) / 10,
      carbs_per_100g: Math.round((nutriments['carbohydrates_100g'] || 0) * 10) / 10,
      fat_per_100g: Math.round((nutriments['fat_100g'] || 0) * 10) / 10,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Barcode lookup failed' },
      { status: 500 }
    );
  }
}
