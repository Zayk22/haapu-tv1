import { getContent } from "@/lib/contentData";
import MovieTableClient from "./MovieTableClient";

export default async function AdminMoviesPage() {
  const movies = await getContent("movie");

  return <MovieTableClient movies={movies} />;
}