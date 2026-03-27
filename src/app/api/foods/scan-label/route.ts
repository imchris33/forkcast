import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'image (base64) is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            {
              type: 'text',
              text: `Read this nutrition label and extract the following information. Convert all values to per 100g.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "name": "product name if visible, otherwise 'Unknown'",
  "serving_size_g": <serving size in grams>,
  "cal_per_100g": <calories per 100g>,
  "protein_per_100g": <protein grams per 100g>,
  "carbs_per_100g": <carbs grams per 100g>,
  "fat_per_100g": <fat grams per 100g>
}

If the serving size is not in grams (e.g., ml, oz, cups), convert to grams using reasonable estimates. Calculate per-100g values by: (nutrient_per_serving / serving_size_g) * 100.`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from vision model' }, { status: 500 });
    }

    // Extract JSON from the response
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse nutrition data from label' }, { status: 422 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      name: parsed.name || 'Unknown',
      cal_per_100g: Math.round(parsed.cal_per_100g || 0),
      protein_per_100g: Math.round((parsed.protein_per_100g || 0) * 10) / 10,
      carbs_per_100g: Math.round((parsed.carbs_per_100g || 0) * 10) / 10,
      fat_per_100g: Math.round((parsed.fat_per_100g || 0) * 10) / 10,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scan nutrition label' },
      { status: 500 }
    );
  }
}
