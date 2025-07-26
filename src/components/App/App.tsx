// import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";


import { fetchMovies } from "../../services/movieService";
export default function App() {
 
  const handlerSearchForm = async (data: string) => {
    const moviesRequestResult = await fetchMovies(data);
    console.log(moviesRequestResult);
  };

  return <SearchBar onSubmit={handlerSearchForm} />;
}
