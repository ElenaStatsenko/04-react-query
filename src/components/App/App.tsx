import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<Movie[]>({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.nbPages ?? 0;
  const handlerSearchForm = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1)
  };
  useEffect(() => {
    if (data) {
      setMovies(data);
      if (data.length === 0) {
        toast("No movies found for your request.");
      }
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
        {isSuccess && totalPages > 1 && (<ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />)}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster position="top-left" />
    </>
  );
}
