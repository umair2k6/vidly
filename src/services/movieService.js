import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/movies";
export function getMovies() {
  return http.get(apiEndpoint);
}
function movieId(id) {
  return `${apiEndpoint}/${id}`;
}
export function getMovie(id) {
  return http.get(movieId(id));
}

export function saveMovie(movie) {
  if (movie._id) {
    const body = { ...movie };
    delete body["_id"];
    return http.put(movieId(movie._id), body);
  }

  return http.post(apiEndpoint, movie);
}

export function deleteMovie(id) {
  return http.delete(movieId(id));
}
