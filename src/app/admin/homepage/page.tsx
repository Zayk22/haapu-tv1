import { sql } from '@/lib/db';
import HomepageManagerClient from './HomepageManagerClient';

const DEFAULT_SECTIONS = [
  { id: 'trending',     title: 'Trending Now',        source: 'is_trending',    enabled: true,  order: 1 },
  { id: 'new_to_haapu', title: 'New to Haapu',        source: 'is_new',         enabled: true,  order: 2 },
  { id: 'recommended',  title: 'Recommended for You', source: 'is_recommended', enabled: false, order: 3 },
];

export default async function HomepagePage() {
  const [settingsResult, movieCounts] = await Promise.all([
    sql`SELECT value FROM site_settings WHERE key = 'homepage_sections'`,
    sql`
      SELECT
        SUM(CASE WHEN is_trending    THEN 1 ELSE 0 END) as trending_count,
        SUM(CASE WHEN is_new         THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN is_recommended THEN 1 ELSE 0 END) as recommended_count
      FROM movies
    `,
  ]);

  const sections = settingsResult[0]?.value || DEFAULT_SECTIONS;
  const counts = {
    is_trending:    Number(movieCounts[0]?.trending_count    || 0),
    is_new:         Number(movieCounts[0]?.new_count         || 0),
    is_recommended: Number(movieCounts[0]?.recommended_count || 0),
  };

  return <HomepageManagerClient initialSections={sections} counts={counts} />;
}