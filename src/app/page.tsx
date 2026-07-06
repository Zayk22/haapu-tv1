import { sql } from "@/lib/db";
import Hero from "@/components/home/Hero";
import MovieRow from "@/components/home/MovieRow";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SECTIONS = [
  { id: "trending",     title: "Trending Now",        source: "is_trending",    enabled: true,  order: 1 },
  { id: "new_to_haapu", title: "New to Haapu",        source: "is_new",         enabled: true,  order: 2 },
  { id: "recommended",  title: "Recommended for You", source: "is_recommended", enabled: false, order: 3 },
];

function toMovie(movie: any) {
  return {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.poster_url,
    backdropUrl: movie.backdrop_url,
    rating: movie.rating,
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 0,
    duration: movie.duration,
    genres: movie.genres,
    description: movie.description,
    quality: "HD" as const,
    type: "movie" as const,
  };
}

export default async function Home() {
  // Load sections config + featured movies in parallel
  const [settingsResult, featuredMovies] = await Promise.all([
    sql`SELECT value FROM site_settings WHERE key = 'homepage_sections'`,
    sql`SELECT * FROM movies WHERE is_featured = true ORDER BY COALESCE(hero_order, 999) ASC`,
  ]);

  // Fall back to defaults if settings haven't been saved yet
  const sections: typeof DEFAULT_SECTIONS =
    settingsResult[0]?.value || DEFAULT_SECTIONS;

  const enabledSections = sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  // Fetch movies for each enabled section
  const sectionMovies = await Promise.all(
    enabledSections.map(async (section) => {
      const rows = await sql`
        SELECT * FROM movies
        WHERE ${sql.unsafe(section.source)} = true
        ORDER BY id DESC
      `;
      return { section, movies: rows.map(toMovie) };
    })
  );

  return (
    <main>
      <Hero movies={featuredMovies.map(toMovie)} />

      <div className="relative z-20 -mt-16">
        <ContinueWatchingRow />

        {sectionMovies.map(({ section, movies }) =>
          // Skip rows with no movies — no point showing an empty row
          movies.length === 0 ? null : (
            <MovieRow
              key={section.id}
              title={section.title}
              movies={movies}
              viewAllLink="/movies"
            />
          )
        )}
      </div>
    </main>
  );
}