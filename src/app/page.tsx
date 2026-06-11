import AuthGate from "@/components/home/AuthGate";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import Hero from "@/components/home/Hero";
import MovieRow from "@/components/home/MovieRow";  // ← Add this import
import { getContent } from "@/lib/contentData";
import type { ContentItem } from "@/types/content";

function toMovie(item: ContentItem) {
  return {
    id: Number(item.id),
    title: item.title,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
    rating: item.rating ?? 0,
    year: 2026,
    duration: item.duration,
    genres: item.genres,
    description: item.description,
    quality: "HD" as const,
    type: "movie" as const,
    slug: item.slug,
  };
}

export default async function Home() {
  const movies = await getContent("movie");
  const movieList = movies.map(toMovie);

  const featuredMovies = movies.slice(0, 3);

  return (
    <main>
      <AuthGate />
      <Hero movies={featuredMovies.map(m => m ? toMovie(m) : null)} />

      <div className="relative z-20 -mt-16">
        <ContinueWatchingRow />
        
        {/* Use MovieRow for horizontal scroll instead of grid */}
        <MovieRow title="Trending Now" movies={movieList} />
        <MovieRow title="Popular on Haapu" movies={[...movieList].reverse()} />
        <MovieRow title="Recommended for You" movies={movieList} />
      </div>
    </main>
  );
}