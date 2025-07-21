import axios from "axios";

import type { Movie } from "../types/movie";
interface MovieSearchResponse {
  results: Movie[];
}
const myKey = import.meta.env.VITE_API_KEY;
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${myKey}`,
    accept: "application/json",
  },
});
export const fetchMovies = async (data: string): Promise<Movie[]> => {
  const response = await tmdb.get<MovieSearchResponse>("/search/movie", {
    params: { query: data },
  });
  return response.data.results;
};
