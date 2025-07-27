import axios from "axios";

import type { MovieResponse } from "../types/movie";

const myKey = import.meta.env.VITE_API_KEY;
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${myKey}`,
    accept: "application/json",
  },
});

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieResponse> => {
  const response = await tmdb.get<MovieResponse>("/search/movie", {
    params: { query, page },
  });
  return response.data;
};
