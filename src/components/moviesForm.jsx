import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getGenres } from "../services/fakeGenreService";
import { getMovie, saveMovie } from "../services/fakeMovieService";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: ""
    },
    genres: [],
    errors: {}
  };
  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    numberInStock: Joi.number()
      .required()
      .max(100)
      .min(1)
      .label("Number In Stock"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    dailyRentalRate: Joi.number()
      .required()
      .min(1)
      .max(10)
      .label("Rate")
  };
  doSubmit = () => {
    saveMovie(this.state.data);
    this.props.history.push("/movies");
  };

  componentDidMount() {
    const genres = getGenres();
    this.setState({ genres });
    const movieId = this.props.match.params.id;

    if (movieId === "new") return;

    const movie = getMovie(movieId);
    if (!movie) return this.props.history.replace("/not-found");
    this.setState({ data: this.mapToViewModel(movie) });
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  }
  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number In Stock")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
