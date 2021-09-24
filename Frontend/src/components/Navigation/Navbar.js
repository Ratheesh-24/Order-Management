import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

class Landing extends Component {
  logOut(e) {
    e.preventDefault()
    localStorage.removeItem('usertoken')
    this.props.history.push(`/`)
  }

  render() {
    const loginRegLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    )

    const userLink = (
      <ul className="navbar-nav">

        <li className="nav-item">
          <Link to="/category" className="nav-link">
            Category
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/product" className="nav-link">
            Product
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/gallery" className="nav-link">
            Gallery
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/customer" className="nav-link">
            Customer
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/order" className="nav-link">
            Orders
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/department" className="nav-link">
            Department
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/employee" className="nav-link">
            Employee
          </Link>
        </li>

        <li className="nav-item">
          <Link to="" onClick={this.logOut.bind(this)} className="nav-link">
            Logout
          </Link>

        </li>

      </ul>
    )

    return (
      <div className="container">
        <br />

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarsExample10"
            aria-controls="navbarsExample10"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarsExample10"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
              </Link>
              </li>
            </ul>
            {localStorage.usertoken ? userLink : loginRegLink}
          </div>
        </nav>
      </div>



    )
  }
}

export default withRouter(Landing)