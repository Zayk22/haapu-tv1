import { sql } from '@/lib/db';
import HeroManagerClient from './HeroManagerClient';

export default async function HeroPage() {
  const movies = await sql`
    SELECT
      id::text, title, slug, poster_url as "posterUrl",
      is_featured, hero_order
    FROM movies
    ORDER BY
      is_featured DESC,
      COALESCE(hero_order, 999) ASC,
      title ASC
  `;
  return <HeroManagerClient movies={movies as any[]} />;
}