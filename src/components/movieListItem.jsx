import React, { Component } from "react";

class MovieListItem extends Component {
  render() {
    const { title, genre, numberInStock, dailyRentalRate} = this.props.movie;
    return (
      <div className="row align-items-center border-bottom">
        <div className="col-sm-3">{ title }</div>
        <div className="col-sm-2">{ genre.name }</div>
        <div className="col-sm-2">{ numberInStock }</div>
        <div className="col-sm-2">{ dailyRentalRate }</div>
        <div className="col-sm-1"><i className="fa fa-heart-o"></i></div>
        <div className="col-sm-2 my-2">
          <button
            onClick={() => this.props.onDelete(this.props.movie)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default MovieListItem;
