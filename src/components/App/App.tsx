import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { keepPreviousData } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import type { MovieResponse } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, data?.results?.length]);

  const handlerSearchForm = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

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

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data?.results?.length ? (
        <MovieGrid movies={data.results} onSelect={openModal} />
      ) : null}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster position="top-left" />
    </>
  );
}
