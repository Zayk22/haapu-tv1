import { supabase } from '@/lib/supabase';
import AuthGate from "@/components/home/AuthGate";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import Hero from "@/components/home/Hero";
import MovieRow from "@/components/home/MovieRow";

// Helper to convert database movie to frontend format
function toMovie(movie: any) {
  return {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.poster_url,
    backdropUrl: movie.backdrop_url,
    rating: movie.rating,
    year: new Date().getFullYear(),
    duration: movie.duration,
    genres: movie.genres,
    description: movie.description,
    type: 'movie' as const,
  };
}

export default async function Home() {
  // Fetch featured movies for hero (ordered by hero_order)
  const { data: featuredMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('is_featured', true)
    .order('hero_order', { ascending: true })
    .limit(5);
  
  // Fetch trending movies
  const { data: trendingMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('is_trending', true)
    .limit(10);
  
  // Fetch recommended movies
  const { data: recommendedMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('is_recommended', true)
    .limit(10);
  
  // Fallback to all movies if no featured/trending/recommended are set
  const { data: allMovies } = await supabase
    .from('movies')
    .select('*')
    .limit(10);
  
  const heroList = featuredMovies?.length ? featuredMovies : allMovies?.slice(0, 3) || [];
  const trendingList = trendingMovies?.length ? trendingMovies : allMovies?.slice(0, 10) || [];
  const recommendedList = recommendedMovies?.length ? recommendedMovies : allMovies?.slice(0, 10) || [];

  return (
    <main>
      <AuthGate />
      <Hero movies={heroList.map(toMovie)} />
      <div className="relative z-20 -mt-16">
        <ContinueWatchingRow />
        <MovieRow title="Trending Now" movies={trendingList.map(toMovie)} viewAllLink="/movies" />
        <MovieRow title="Recommended for You" movies={recommendedList.map(toMovie)} viewAllLink="/movies" />
      </div>
    </main>
  );
}