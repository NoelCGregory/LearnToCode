import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark  navColor">
      <a className="navbar-brand" href="#">
        Navbar
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent-333"
        aria-controls="navbarSupportedContent-333"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse "
        id="navbarSupportedContent-333"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Home
              <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <Link to="/questions" className="nav-link">
              Questions
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Contact
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto nav-flex-icons">
          <li className="nav-item">
            <Link
              to="/addquestion"
              className="nav-link waves-effect waves-light"
            >
              <i className="fas fa-plus"></i>
            </Link>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdownMenuLink-333"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-user"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
