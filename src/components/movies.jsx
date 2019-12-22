import React, { Component } from "react";
import { Link } from "react-router-dom";
import MoviesTable from "./common/moviesTable";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import SearchBox from "./common/searchBox";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import { toast } from "react-toastify";

class Movie extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }
  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      genres,
      searchQuery,
      sortColumn
    } = this.state;
    if (count === 0) return <p>There are no movies in the database.</p>;

    const { totalCount, data } = this.getFilteredData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={this.state.selectedGenre}
            onItemChange={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <Link className="btn btn-primary mb-2" to="/movies/new">
            New Movie
          </Link>
          <p>Showing {totalCount} movies in the database.</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <MoviesTable
            movies={data}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }

  getClasses = movie => {
    let classes = "fa fa-heart";
    if (movie.isLiked) classes += "-o";
    return classes;
  };
  getFilteredData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      searchQuery,
      sortColumn
    } = this.state;
    let filteredMovies = allMovies;
    if (searchQuery)
      filteredMovies = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filteredMovies = allMovies.filter(m => m.genre._id === selectedGenre._id);
    const sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );
    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filteredMovies.length, data: movies };
  };
  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };
  handlePageChange = page => {
    this.setState({ currentPage: page });
  };
  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };
  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = this.state.movies.filter(c => c._id !== movie._id);
    this.setState({ movies });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");
      this.setState({ movies: originalMovies });
    }
  };
  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };
  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  // handleSearch = ({ currentTarget: input }) => {
  //   const movies = this.state.movies.filter(c => c.title.match(input.value));
  //   this.setState({ movies });
  //   console.log(input.value);
  // };
}

export default Movie;
