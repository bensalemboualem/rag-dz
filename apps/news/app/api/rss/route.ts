import { NextResponse } from 'next/server';
import { NEWS_SOURCES, getSourcesByCategory, getSourcesByLanguage } from '@/data/sources';
import { fetchMultipleRSS } from '@/lib/rss';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const language = searchParams.get('language');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  try {
    let sources = NEWS_SOURCES;

    // Filter by category
    if (category && category !== 'all') {
      sources = getSourcesByCategory(category as any);
    }

    // Filter by language
    if (language && language !== 'both') {
      sources = getSourcesByLanguage(language as any);
    }

    // Fetch articles from all sources
    const articles = await fetchMultipleRSS(sources);

    // Limit results
    const limitedArticles = articles.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: limitedArticles.length,
      articles: limitedArticles,
    });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch RSS feeds',
        articles: [],
      },
      { status: 500 }
    );
  }
}
