import React, { Component } from "react";
import MoviesTable from "./common/moviesTable";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { getMovies } from "../services/fakeMovieService";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/fakeGenreService";
import _ from 'lodash';

class Movie extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: {path: 'title', order: 'asc'}
  };

  componentDidMount() {
    const genres = [{ _id:'', name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }
  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      genres,
      sortColumn
    } = this.state;
    if (count === 0) return <p>There are no movies in the database.</p>;
    
    const {totalCount, data} = this.getFilteredData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={this.state.selectedGenre}
            onItemChange={this.handleItemChange}
          />
        </div>
        <div className="col">
          <p>
            Showing {totalCount} movies in the database.
          </p>
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
      sortColumn
    } = this.state;
    const filteredMovies =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;
    const sorted = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, currentPage, pageSize);
    
    return {totalCount: filteredMovies.length, data: movies};
  }
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
  handleItemChange = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };
  handleDelete = movie => {
    const movies = this.state.movies.filter(c => c._id !== movie._id);
    this.setState({ movies });
  };
  handleSort = sortColumn => {
    this.setState({ sortColumn });
  }
}

export default Movie;
