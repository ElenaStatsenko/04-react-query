import SearchBar from "../SearchBar/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading } = useQuery<Movie[]>({
    queryKey: ["movie", query],
    queryFn: () => fetchMovies(query),
    enabled: query !== "",
  });
  const handlerSearchForm = (newQuery: string) => {
    setQuery(newQuery);
  };
  useEffect(() => {
    if (data) {
      setMovies(data);
    }
  }, [data]);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <>
      <SearchBar onSubmit={handlerSearchForm} />

      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}

      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      {isLoading && (<Loader />)}
      
    </>
  );
}
