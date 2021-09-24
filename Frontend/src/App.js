import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import Home from './components/Home';
import Login from './components/UserManagement/Login';
import Register from './components/UserManagement/Register';

//department
import Department from './components/Department/Department';
import Employee from './components/Employee/Employee';

// Category
import Category from './components/Category';

// Product
import Product from './components/Product/Product';

// Gallery
import Gallery from './components/ImageGallery/Gallery';

// Customer
import Customer from './components/Customer';

// Order
import Order from './components/Order';

// Order detail
import OrderItems from './components/OrderItems';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />        
          <div className="container">
            <Route exact path="/" component={Home} />

            <Route exact path="/login" component={Login} />

            <Route exact path="/register" component={Register} />

            {/* Category */}

            <Route exact path="/category" component={Category} />

            {/* Product */}

            <Route exact path="/product" component={Product} />

            {/* Gallery */}

            <Route exact path="/gallery" component={Gallery} />

            {/* Department */}

            <Route exact path="/department" component={Department} />

            {/* Employee */}

            <Route exact path="/employee" component={Employee} />

            {/* Customer */}

            <Route exact path="/customer" component={Customer} />

            {/* Order */}

            <Route exact path="/order" component={Order} />

            {/* Order items */}

            <Route exact path="/OrderItems" component={OrderItems} />

          </div>
        </div>
        <Footer />
      </Router>
    )
  }
}

export default App