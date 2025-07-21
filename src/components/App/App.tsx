// import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

import { fetchMovies } from "../../services/movieService";
export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const handlerSearchForm = async (data: string) => {
    const moviesRequestResult = await fetchMovies(data);
    setMovies(moviesRequestResult);
  };

  return <SearchBar onSubmit={handlerSearchForm} />;
}
