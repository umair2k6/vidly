import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <Link className="navbar-brand" to="/">
        Vidly
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <React.Fragment>
          <NavLink className="nav-link" to="/movies">
            Movies
          </NavLink>
          <NavLink className="nav-link" to="/customers">
            Customers
          </NavLink>
          <NavLink className="nav-link" to="/rentals">
            Rentals
          </NavLink>
        </React.Fragment>
        {user? (
          <React.Fragment>
            <NavLink className="nav-link" to="/profile">
              {user.name}
            </NavLink>
            <NavLink className="nav-link" to="/logout">
              Logout
            </NavLink>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>

            <NavLink className="nav-link" to="/register">
              Register
            </NavLink>
          </React.Fragment>
        )}
        <React.Fragment>
            <NavLink className="nav-link" to="/twilio">
              Twilio
            </NavLink>
          </React.Fragment>
      </div>
    </nav>
  );
};

export default NavBar;
