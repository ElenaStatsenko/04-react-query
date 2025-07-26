// import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["movie", query],
    queryFn: () => fetchMovies(query),
    enabled: query !== "",
  });
  const handlerSearchForm = async (newQuery: string) => {
    setQuery(newQuery);
  };
 useEffect(() => {
    if (data) {
      setMovies(data);
    }
  }, [data]);
  return (
    <>
      <SearchBar onSubmit={handlerSearchForm} />
      {movies.length > 0 && <MovieGrid movies={movies} />}
    </>
  );
}
